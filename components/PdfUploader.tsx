'use client';

import { useRef, useState, useCallback } from 'react';

interface Props {
  onTextExtracted: (text: string) => void;
}

export default function PdfUploader({ onTextExtracted }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const extractText = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setFileName(file.name);

    try {
      const pdfjsLib = await import('pdfjs-dist');
      // Use absolute URL so browser can fetch the worker correctly
      pdfjsLib.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item) => ('str' in item ? item.str : ''))
          .join(' ');
        fullText += pageText + '\n';
      }

      if (fullText.trim().length < 50) {
        setError('This appears to be a scanned PDF. Please paste the text instead.');
        setFileName(null);
        return;
      }

      onTextExtracted(fullText);
    } catch (err) {
      console.error('PDF extraction error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Failed to read PDF: ${msg.slice(0, 120)}. Try pasting the text instead.`);
      setFileName(null);
    } finally {
      setIsLoading(false);
    }
  }, [onTextExtracted]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) extractText(file);
  }, [extractText]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) extractText(file);
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center h-44 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-gold-500 bg-gold-900/20'
            : 'border-ink-600 bg-ink-800/40 hover:border-ink-500 hover:bg-ink-800/70'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleChange}
          className="hidden"
        />

        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-5 h-5 border-[1.5px] border-gold-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-cream-400 font-sans">Extracting text…</p>
          </div>
        ) : fileName ? (
          <div className="flex flex-col items-center gap-2 text-center px-6">
            <div className="w-8 h-8 rounded-full bg-sage-600/15 border border-sage-600/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-cream-100 truncate max-w-xs font-sans">{fileName}</p>
            <p className="text-xs text-cream-400">Text extracted. Click to replace.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2.5 text-center px-6">
            {/* Document icon */}
            <svg className="w-7 h-7 text-ink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm text-cream-300 font-sans">
              Drop your PDF here or{' '}
              <span className="text-gold-500 font-medium">browse</span>
            </p>
            <p className="text-xs text-cream-500">Text-based PDFs only</p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2.5 text-sm text-clay-400 bg-clay-900/50 border border-clay-600/20 rounded-lg px-3 py-2.5 font-sans">
          {error}
        </p>
      )}
    </div>
  );
}

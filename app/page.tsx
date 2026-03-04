'use client';

import { useState } from 'react';
import InputSection from '@/components/InputSection';
import ResultsPanel from '@/components/ResultsPanel';
import { AnalyzeResponse } from '@/lib/types';

type State = 'idle' | 'loading' | 'done' | 'error';

export default function Home() {
  const [text, setText] = useState('');
  const [assignmentType, setAssignmentType] = useState('auto');
  const [state, setState] = useState<State>('idle');
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const canAnalyze = text.trim().length >= 50 && state !== 'loading';

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setState('loading');
    setErrorMsg('');
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          assignmentType: assignmentType === 'auto' ? undefined : assignmentType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        setState('error');
        return;
      }

      setResult(data as AnalyzeResponse);
      setState('done');
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setState('error');
    }
  };

  const handleReset = () => {
    setText('');
    setResult(null);
    setState('idle');
    setErrorMsg('');
  };

  return (
    <main className="min-h-screen py-14 px-6">
      <div className="max-w-3xl mx-auto">

        {/* ── Header ── */}
        <header className="mb-10 anim-fade-up">
          <p className="text-[11px] tracking-[0.22em] uppercase text-gold-500 font-mono mb-3">
            IB Word Counter
          </p>
          <h1 className="font-display italic text-5xl text-cream-50 leading-tight">
            Count what counts.
          </h1>
          <p className="mt-3 text-sm text-cream-400 font-sans leading-relaxed max-w-lg">
            Paste or upload your assignment. AI identifies excluded content — bibliography,
            appendices, title pages, figure captions — then counts the rest.
          </p>
        </header>

        {/* ── Input / Results ── */}
        {state !== 'done' ? (
          <div className="anim-fade-up d-100">
            <div className="bg-ink-900 border border-ink-700 rounded-2xl p-6 space-y-5">
              <InputSection
                text={text}
                onTextChange={setText}
                assignmentType={assignmentType}
                onAssignmentTypeChange={setAssignmentType}
              />

              {state === 'error' && (
                <div className="flex items-start gap-3 bg-clay-900/60 border border-clay-600/25 rounded-xl px-4 py-3">
                  <span className="text-clay-400 text-base leading-none mt-0.5">!</span>
                  <p className="text-sm text-clay-300 leading-snug">{errorMsg}</p>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={!canAnalyze}
                className={`w-full py-3.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 ${
                  canAnalyze
                    ? 'bg-gold-500 hover:bg-gold-400 text-ink-950 shadow-lg shadow-gold-900/40 active:scale-[0.99]'
                    : 'bg-ink-800 text-ink-600 cursor-not-allowed'
                }`}
              >
                {state === 'loading' ? (
                  <span className="flex items-center justify-center gap-1 font-sans">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="inline-block w-1.5 h-1.5 rounded-full bg-ink-950"
                        style={{ animation: `pulseDot 1.2s ease ${i * 0.18}s infinite` }}
                      />
                    ))}
                    <span className="ml-2 text-ink-950">Analyzing</span>
                  </span>
                ) : (
                  'Analyze Assignment'
                )}
              </button>

              {text.trim().length > 0 && text.trim().length < 50 && (
                <p className="text-xs text-center text-cream-600">
                  Need at least 50 characters to analyze
                </p>
              )}
            </div>
          </div>
        ) : (
          result && <ResultsPanel data={result} originalText={text} onReset={handleReset} />
        )}
      </div>
    </main>
  );
}

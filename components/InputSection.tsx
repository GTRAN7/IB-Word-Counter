'use client';

import { useState } from 'react';
import PdfUploader from './PdfUploader';
import TextPasteArea from './TextPasteArea';

const ASSIGNMENT_TYPES = [
  'Extended Essay',
  'TOK Essay',
  'TOK Exhibition',
  'English IA',
  'History IA',
  'Science IA',
  'Economics IA',
  'Psychology IA',
  'Math IA',
  'Business Management IA',
  'Geography IA',
  'Global Politics IA',
  'Language B IA',
  'Visual Arts',
  'Computer Science IA',
  'Philosophy Essay',
];

interface Props {
  text: string;
  onTextChange: (text: string) => void;
  assignmentType: string;
  onAssignmentTypeChange: (type: string) => void;
}

type Tab = 'pdf' | 'text';

export default function InputSection({ text, onTextChange, assignmentType, onAssignmentTypeChange }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('pdf');

  return (
    <div className="space-y-4">
      {/* ── Assignment type selector ── */}
      <div className="flex items-center gap-3">
        <label className="text-[11px] font-mono uppercase tracking-widest text-cream-500 shrink-0">
          Type
        </label>
        <div className="relative flex-1">
          <select
            value={assignmentType}
            onChange={e => onAssignmentTypeChange(e.target.value)}
            className="w-full bg-ink-800 border border-ink-600 text-cream-200 text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-gold-600/70 focus:ring-1 focus:ring-gold-600/20 transition-colors font-sans cursor-pointer"
          >
            <option value="auto">Auto-detect</option>
            <option disabled>──────────────</option>
            {ASSIGNMENT_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {/* Custom chevron */}
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-cream-500 text-xs">
            ▾
          </span>
        </div>
      </div>

      {/* ── Input tab switcher ── */}
      <div>
        <div className="flex gap-5 border-b border-ink-700 mb-4">
          {(['pdf', 'text'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 text-sm font-medium transition-all duration-150 border-b-2 -mb-px ${
                activeTab === tab
                  ? 'text-gold-400 border-gold-500'
                  : 'text-cream-500 border-transparent hover:text-cream-200 hover:border-ink-600'
              }`}
            >
              {tab === 'pdf' ? 'Upload PDF' : 'Paste Text'}
            </button>
          ))}
        </div>

        {activeTab === 'pdf' ? (
          <PdfUploader onTextExtracted={onTextChange} />
        ) : (
          <TextPasteArea value={text} onChange={onTextChange} />
        )}
      </div>
    </div>
  );
}

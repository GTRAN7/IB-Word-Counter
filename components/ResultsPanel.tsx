'use client';

import { useState, useCallback } from 'react';
import { AnalyzeResponse, ExcludedItem } from '@/lib/types';
import { countWords } from '@/lib/wordCount';
import AssignmentBadge from './AssignmentBadge';
import WordCountMeter from './WordCountMeter';
import ExclusionsList from './ExclusionsList';
import AnnotatedDocument from './AnnotatedDocument';

interface Props {
  data: AnalyzeResponse;
  originalText: string;
  onReset: () => void;
}

export default function ResultsPanel({ data, originalText, onReset }: Props) {
  const { result, originalCount } = data;

  // Local exclusions state — users can restore or add new ones
  const [exclusions, setExclusions] = useState<ExcludedItem[]>(result.excludedItems);

  // Recompute word count locally whenever exclusions change
  const excludedCount = exclusions.reduce((sum, item) => sum + countWords(item.content ?? ''), 0);
  const wordCount = Math.max(0, originalCount - excludedCount);

  const handleRestore = useCallback((index: number) => {
    setExclusions(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddExclusion = useCallback((item: ExcludedItem) => {
    setExclusions(prev => [...prev, item]);
  }, []);

  return (
    <div>
      {/* ── Back link ── */}
      <div className="mb-8 anim-fade-up">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-cream-400 hover:text-cream-100 transition-colors duration-150 group font-sans"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform duration-150 text-base leading-none">
            ←
          </span>
          New document
        </button>
      </div>

      {/* ── Word count hero ── */}
      <div className="mb-8 anim-fade-up d-50">
        <WordCountMeter
          wordCount={wordCount}
          wordLimit={result.wordLimit}
          assignmentType={result.assignmentType}
          originalCount={originalCount}
          excludedCount={excludedCount}
        />
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-ink-700 mb-6 anim-fade-in d-150" />

      {/* ── Assignment badge ── */}
      <div className="mb-6 anim-fade-up d-200">
        <AssignmentBadge result={result} />
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-ink-700 mb-6 anim-fade-in d-250" />

      {/* ── Exclusions list ── */}
      <div className="mb-6 anim-fade-up d-300">
        <ExclusionsList items={exclusions} onRestore={handleRestore} />
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-ink-700 mb-6 anim-fade-in d-350" />

      {/* ── Annotated original text ── */}
      <div className="mb-8 anim-fade-up d-400">
        <AnnotatedDocument
          originalText={originalText}
          exclusions={exclusions}
          onRestore={handleRestore}
          onAddExclusion={handleAddExclusion}
        />
      </div>

      {/* ── Disclaimer ── */}
      <div className="pt-4 border-t border-ink-800 anim-fade-in d-400">
        <p className="text-xs text-cream-600 text-center font-sans">
          AI estimate. Verify with your IB coordinator before submission.
        </p>
      </div>
    </div>
  );
}

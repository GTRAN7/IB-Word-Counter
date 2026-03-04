'use client';

import { AnalysisResult } from '@/lib/types';

interface Props {
  result: AnalysisResult;
}

const confidenceDot: Record<string, string> = {
  HIGH:   'bg-sage-500',
  MEDIUM: 'bg-honey-500',
  LOW:    'bg-clay-500',
};

const confidenceText: Record<string, string> = {
  HIGH:   'text-sage-500',
  MEDIUM: 'text-honey-400',
  LOW:    'text-clay-400',
};

export default function AssignmentBadge({ result }: Props) {
  return (
    <div className="bg-ink-900 border border-ink-700 rounded-xl px-5 py-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-cream-100 font-sans tracking-wide">
              {result.assignmentType}
            </span>
            {result.subject && result.subject !== 'Unknown' && (
              <>
                <span className="text-ink-500 text-xs">·</span>
                <span className="text-sm text-cream-300 font-sans">{result.subject}</span>
              </>
            )}
          </div>
          <p className="mt-1.5 text-sm text-cream-400 leading-relaxed font-sans">
            {result.reasoning}
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${confidenceDot[result.confidence] ?? 'bg-ink-500'}`} />
          <span className={`text-[11px] font-mono uppercase tracking-widest ${confidenceText[result.confidence] ?? 'text-cream-600'}`}>
            {result.confidence}
          </span>
        </div>
      </div>
    </div>
  );
}

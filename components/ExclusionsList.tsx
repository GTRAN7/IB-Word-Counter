'use client';

import { ExcludedItem } from '@/lib/types';

interface Props {
  items: ExcludedItem[];
  onRestore: (index: number) => void;
}

export default function ExclusionsList({ items, onRestore }: Props) {
  return (
    <div>
      <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-cream-500 mb-4">
        What was excluded
      </h3>

      {!items || items.length === 0 ? (
        <p className="text-sm text-cream-400 font-sans">
          Nothing was excluded from your text.
        </p>
      ) : (
        <div className="divide-y divide-ink-800">
          {items.map((item, i) => (
            <div key={i} className="py-3 first:pt-0 last:pb-0 group">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-xs font-mono text-cream-300">{item.label}</span>
                    <span className="text-[10px] text-ink-500">·</span>
                    <span className="text-sm text-cream-400 font-sans leading-snug">{item.reason}</span>
                  </div>
                  {item.content && (
                    <p className="mt-1 text-xs font-mono text-cream-600 truncate">
                      &ldquo;{item.content.slice(0, 80)}&rdquo;
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onRestore(i)}
                  title="Add back to count"
                  className="shrink-0 text-[10px] font-mono text-cream-600 hover:text-sage-400 border border-ink-600 hover:border-sage-600/40 rounded px-1.5 py-0.5 transition-colors opacity-0 group-hover:opacity-100 duration-150"
                >
                  restore
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

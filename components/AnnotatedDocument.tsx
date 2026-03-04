'use client';

import { useState, useRef, useCallback } from 'react';
import { ExcludedItem } from '@/lib/types';

interface Props {
  originalText: string;
  exclusions: ExcludedItem[];
  onRestore: (index: number) => void;
  onAddExclusion: (item: ExcludedItem) => void;
}

interface Segment {
  text: string;
  isExcluded: boolean;
  itemIndex: number;
}

interface Popover {
  selectedText: string;
  x: number;
  y: number;
}

function buildSegments(text: string, exclusions: ExcludedItem[]): Segment[] {
  const spans: { start: number; end: number; itemIndex: number }[] = [];

  for (let i = 0; i < exclusions.length; i++) {
    const content = exclusions[i].content?.trim();
    if (!content || content.length < 3) continue;
    const idx = text.indexOf(content);
    if (idx !== -1) {
      spans.push({ start: idx, end: idx + content.length, itemIndex: i });
    }
  }

  // Sort and remove overlaps
  spans.sort((a, b) => a.start - b.start);
  const clean: typeof spans = [];
  let cursor = 0;
  for (const span of spans) {
    if (span.start >= cursor) {
      clean.push(span);
      cursor = span.end;
    }
  }

  const segments: Segment[] = [];
  let pos = 0;
  for (const span of clean) {
    if (span.start > pos) {
      segments.push({ text: text.slice(pos, span.start), isExcluded: false, itemIndex: -1 });
    }
    segments.push({ text: text.slice(span.start, span.end), isExcluded: true, itemIndex: span.itemIndex });
    pos = span.end;
  }
  if (pos < text.length) {
    segments.push({ text: text.slice(pos), isExcluded: false, itemIndex: -1 });
  }
  return segments;
}

export default function AnnotatedDocument({ originalText, exclusions, onRestore, onAddExclusion }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [popover, setPopover] = useState<Popover | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const segments = buildSegments(originalText, exclusions);
  const annotatedCount = segments.filter(s => s.isExcluded).length;
  const unannotated = exclusions.length - annotatedCount;

  const handleMouseUp = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      setPopover(null);
      return;
    }
    const selected = sel.toString().trim();
    if (selected.length < 2) {
      setPopover(null);
      return;
    }
    const range = sel.getRangeAt(0);
    const rangeRect = range.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    setPopover({
      selectedText: selected,
      x: rangeRect.left + rangeRect.width / 2 - containerRect.left,
      y: rangeRect.top - containerRect.top,
    });
  }, []);

  const handleAddExclusion = useCallback(() => {
    if (!popover) return;
    onAddExclusion({
      label: 'Manual',
      reason: 'Manually excluded',
      content: popover.selectedText,
    });
    setPopover(null);
    window.getSelection()?.removeAllRanges();
  }, [popover, onAddExclusion]);

  const dismissPopover = useCallback(() => {
    setPopover(null);
    window.getSelection()?.removeAllRanges();
  }, []);

  return (
    <div>
      <button
        onClick={() => setIsExpanded(v => !v)}
        className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-cream-500 hover:text-cream-200 transition-colors duration-150"
      >
        <span
          className="inline-block transition-transform duration-200"
          style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          ›
        </span>
        Original text
        {unannotated > 0 && (
          <span className="text-cream-500 normal-case tracking-normal">
            ({unannotated} exclusion{unannotated !== 1 ? 's' : ''} not found in text)
          </span>
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          <p className="text-xs text-cream-500 font-sans leading-relaxed">
            <span className="inline-block bg-clay-900/60 border border-clay-500/30 text-clay-400 rounded px-1 text-[10px] mr-1">
              strikethrough
            </span>
            = excluded. Click to restore.{' '}
            Select any text to mark it for exclusion.
          </p>

          <div ref={containerRef} className="relative">
            {/* Selection popover */}
            {popover && (
              <div
                className="absolute z-20 -translate-x-1/2 pointer-events-auto"
                style={{ left: popover.x, top: popover.y - 44 }}
              >
                <div className="bg-ink-800 border border-ink-600 rounded-lg shadow-2xl shadow-black/60 px-3 py-2 flex items-center gap-2 whitespace-nowrap">
                  <span className="text-xs text-cream-300 font-sans max-w-[120px] truncate">
                    &ldquo;{popover.selectedText.slice(0, 30)}{popover.selectedText.length > 30 ? '…' : ''}&rdquo;
                  </span>
                  <button
                    onClick={handleAddExclusion}
                    className="text-xs bg-clay-600/25 hover:bg-clay-600/45 text-clay-400 border border-clay-500/30 rounded px-2 py-0.5 transition-colors font-sans"
                  >
                    Exclude
                  </button>
                  <button
                    onClick={dismissPopover}
                    className="text-xs text-cream-500 hover:text-cream-200 transition-colors leading-none"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            <div
              className="bg-ink-900/40 border border-ink-700 rounded-xl px-5 py-4 max-h-72 overflow-y-auto"
              onMouseUp={handleMouseUp}
            >
              <p className="text-sm text-cream-200 font-sans leading-relaxed whitespace-pre-wrap select-text">
                {segments.map((seg, i) =>
                  seg.isExcluded ? (
                    <mark
                      key={i}
                      onClick={() => onRestore(seg.itemIndex)}
                      title={`${exclusions[seg.itemIndex]?.label ?? 'Excluded'} — click to restore`}
                      className="bg-clay-900/50 text-clay-500 line-through decoration-clay-600/50 cursor-pointer hover:bg-clay-900/80 hover:text-clay-400 transition-colors rounded-sm not-italic"
                      style={{ textDecorationLine: 'line-through' }}
                    >
                      {seg.text}
                    </mark>
                  ) : (
                    <span key={i}>{seg.text}</span>
                  )
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

interface Props {
  wordCount: number;
  wordLimit: number | null;
  assignmentType: string;
  originalCount: number;
  excludedCount: number;
}

function Breakdown({ originalCount, excludedCount, wordCount }: { originalCount: number; excludedCount: number; wordCount: number }) {
  if (excludedCount === 0) return null;
  return (
    <p className="mt-3 text-xs text-cream-500 font-mono">
      {originalCount.toLocaleString()} original
      <span className="mx-1.5 text-cream-600">−</span>
      {excludedCount.toLocaleString()} excluded
      <span className="mx-1.5 text-cream-600">=</span>
      {wordCount.toLocaleString()} counted
    </p>
  );
}

export default function WordCountMeter({ wordCount, wordLimit, assignmentType, originalCount, excludedCount }: Props) {
  if (assignmentType === 'Math IA') {
    return (
      <div>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span
            className="font-mono font-semibold text-cream-100 anim-count"
            style={{ fontSize: '5rem', letterSpacing: '-0.03em', lineHeight: 1 }}
          >
            {wordCount.toLocaleString()}
          </span>
          <span className="text-cream-400 text-lg font-sans">words</span>
        </div>
        <Breakdown originalCount={originalCount} excludedCount={excludedCount} wordCount={wordCount} />
        <p className="mt-4 text-sm text-honey-400 bg-honey-900/30 border border-honey-500/20 rounded-lg px-4 py-3 font-sans leading-snug">
          Math IA is assessed on page count (6–12 pages), not word count.
          This figure is for reference only.
        </p>
      </div>
    );
  }

  if (!wordLimit) {
    return (
      <div>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span
            className="font-mono font-semibold text-cream-100 anim-count"
            style={{ fontSize: '5rem', letterSpacing: '-0.03em', lineHeight: 1 }}
          >
            {wordCount.toLocaleString()}
          </span>
          <span className="text-cream-400 text-lg font-sans">words</span>
        </div>
        <Breakdown originalCount={originalCount} excludedCount={excludedCount} wordCount={wordCount} />
        <p className="mt-2 text-sm text-cream-400 font-sans">
          Could not determine assignment type. Showing raw word count.
        </p>
      </div>
    );
  }

  const percentage = Math.round((wordCount / wordLimit) * 100);
  const remaining = wordLimit - wordCount;
  const barWidth = Math.min(percentage, 100);

  let barColor = 'bg-sage-500';
  let statusColor = 'text-sage-500';
  let statusText = `${remaining.toLocaleString()} words remaining`;

  if (percentage > 100) {
    barColor = 'bg-clay-500';
    statusColor = 'text-clay-400';
    statusText = `${Math.abs(remaining).toLocaleString()} words over limit`;
  } else if (percentage >= 80) {
    barColor = 'bg-honey-500';
    statusColor = 'text-honey-400';
  }

  return (
    <div>
      {/* ── Hero number ── */}
      <div className="flex items-end gap-4 flex-wrap">
        <span
          className="font-mono font-semibold text-cream-100 anim-count"
          style={{ fontSize: '5rem', letterSpacing: '-0.03em', lineHeight: 1 }}
        >
          {wordCount.toLocaleString()}
        </span>
        <div className="pb-1 flex flex-col gap-0.5">
          <span className="text-cream-400 text-sm font-sans leading-none">
            / {wordLimit.toLocaleString()} words
          </span>
          <span className={`text-sm font-medium font-sans leading-none ${statusColor}`}>
            {statusText}
          </span>
        </div>
      </div>

      {/* ── Arithmetic breakdown ── */}
      <Breakdown originalCount={originalCount} excludedCount={excludedCount} wordCount={wordCount} />

      {/* ── Thin progress bar ── */}
      <div className="mt-5">
        <div className="h-[2px] bg-ink-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full anim-bar ${barColor}`}
            style={{ '--bar-target': `${barWidth}%` } as React.CSSProperties}
          />
        </div>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs text-cream-600 font-mono">0</span>
          <span className={`text-xs font-mono font-medium ${statusColor}`}>{percentage}%</span>
          <span className="text-xs text-cream-600 font-mono">{wordLimit.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

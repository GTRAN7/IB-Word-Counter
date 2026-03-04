'use client';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function TextPasteArea({ value, onChange }: Props) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your IB assignment here…"
        className="w-full h-60 px-4 py-3.5 text-sm text-cream-100 bg-ink-800/60 border border-ink-600 rounded-xl resize-none focus:outline-none focus:border-gold-600/70 focus:ring-1 focus:ring-gold-600/20 leading-relaxed font-sans transition-colors"
        spellCheck={false}
      />
      {value.length > 0 && (
        <span className="absolute bottom-3 right-3 text-xs text-cream-600 font-mono pointer-events-none">
          {value.length.toLocaleString()}
        </span>
      )}
    </div>
  );
}

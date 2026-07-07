'use client';

import type { StudioCard } from '@/lib/game-studio/studio-state';

interface Props {
  card: StudioCard;
  compact?: boolean;
}

const EFFECT_META: Record<string, { label: string; color: string; bg: string }> = {
  resource: { label: 'Resource', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' },
  move:     { label: 'Move',     color: 'text-sky-700 dark:text-sky-400',     bg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800' },
  skip:     { label: 'Skip',     color: 'text-rose-700 dark:text-rose-400',   bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800' },
  none:     { label: 'No effect',color: 'text-slate-500',                    bg: 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700' },
};

function effectSummary(card: StudioCard): string {
  switch (card.effectKind) {
    case 'resource': {
      const sign = card.effectDelta >= 0 ? '+' : '';
      return `${sign}${card.effectDelta} ${card.effectResource || 'resource'}`;
    }
    case 'move':
      return card.effectSpaces > 0
        ? `Move forward ${card.effectSpaces}`
        : `Move back ${Math.abs(card.effectSpaces)}`;
    case 'skip':
      return 'Skip next turn';
    default:
      return '—';
  }
}

export function CardPreview({ card, compact = false }: Props) {
  const meta = EFFECT_META[card.effectKind] ?? EFFECT_META['none']!;
  const icon = card.icon || '🃏';

  if (compact) {
    return (
      <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${meta.bg}`}>
        <span className="text-lg leading-none">{icon}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold">{card.title || 'Untitled Card'}</p>
          <p className={`text-[10px] ${meta.color}`}>{effectSummary(card)}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col gap-2 rounded-2xl border-2 p-4 shadow-sm transition-shadow hover:shadow-md ${meta.bg}`}
      style={{ minHeight: 200 }}
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-3xl leading-none">{icon}</span>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${meta.color} ${meta.bg}`}>
          {meta.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold leading-tight text-foreground">
        {card.title || 'Untitled Card'}
      </h3>

      {/* Body text */}
      <p className="flex-1 text-sm leading-relaxed text-foreground/80">
        {card.text || 'No description yet.'}
      </p>

      {/* Flavour */}
      {card.flavour && (
        <p className="border-l-2 border-current/30 pl-3 text-xs italic text-muted-foreground">
          {card.flavour}
        </p>
      )}

      {/* Effect pill */}
      <div className={`mt-auto flex items-center gap-1.5 rounded-lg border px-3 py-1.5 ${meta.bg}`}>
        <span className={`text-xs font-bold ${meta.color}`}>{effectSummary(card)}</span>
      </div>

      {/* Decorative corner */}
      <div className="absolute right-3 top-3 text-[8px] font-mono text-muted-foreground/40">
        {card.id || '---'}
      </div>
    </div>
  );
}

'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { SCENES } from '@/lib/game-studio/characters';
import { SceneCard } from './SceneCard';
import type { StudioState, StudioAction, StudioSpace } from '@/lib/game-studio/studio-state';
import type { SpaceType } from '@/lib/board-game/types';

interface Props {
  state: StudioState;
  dispatch: React.Dispatch<StudioAction>;
}

const SPACE_TYPES: { type: SpaceType; label: string; color: string; icon: string; description: string }[] = [
  { type: 'start',     label: 'Start',     icon: '🚀', color: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30', description: 'Where players begin' },
  { type: 'safe',      label: 'Safe',      icon: '·',  color: 'border-slate-300 bg-slate-50 dark:bg-slate-900/30',      description: 'No effect' },
  { type: 'event',     label: 'Event',     icon: '📋', color: 'border-sky-400 bg-sky-50 dark:bg-sky-950/30',             description: 'Draw a card' },
  { type: 'challenge', label: 'Challenge', icon: '⚡', color: 'border-rose-400 bg-rose-50 dark:bg-rose-950/30',          description: 'Obstacle space' },
  { type: 'blessing',  label: 'Blessing',  icon: '✨', color: 'border-violet-400 bg-violet-50 dark:bg-violet-950/30',   description: 'Reward space' },
  { type: 'finish',    label: 'Finish',    icon: '🏆', color: 'border-amber-400 bg-amber-50 dark:bg-amber-950/30',      description: 'Final destination' },
];

function SpaceRow({
  space,
  index,
  cards,
  dispatch,
}: {
  space: StudioSpace;
  index: number;
  cards: { id: string; title: string }[];
  dispatch: React.Dispatch<StudioAction>;
}) {
  const typeInfo = SPACE_TYPES.find((t) => t.type === space.type) ?? SPACE_TYPES[1]!;
  const scene = SCENES.find((s) => s.id === space.sceneId);
  const isFixed = space.type === 'start' || space.type === 'finish';

  return (
    <div className={cn('flex items-center gap-3 rounded-xl border-2 p-3 transition-all', typeInfo.color)}>
      {/* Index badge */}
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-background/60 text-xs font-bold text-foreground">
        {index + 1}
      </span>

      {/* Scene thumbnail */}
      {scene && (
        <div className="shrink-0">
          <SceneCard scene={scene} compact />
        </div>
      )}

      {/* Label */}
      <Input
        value={space.label}
        onChange={(e) => dispatch({ type: 'UPDATE_SPACE', id: space.id, patch: { label: e.target.value } })}
        className="h-8 min-w-0 flex-1 text-sm"
        placeholder="Space name"
      />

      {/* Type selector */}
      <div className="flex shrink-0 flex-wrap gap-1">
        {SPACE_TYPES.filter((t) => !isFixed || t.type === space.type).map((t) => (
          <button
            key={t.type}
            type="button"
            title={t.description}
            onClick={() => !isFixed && dispatch({ type: 'UPDATE_SPACE', id: space.id, patch: { type: t.type } })}
            className={cn(
              'rounded px-1.5 py-0.5 text-[10px] font-medium transition-all',
              space.type === t.type
                ? 'bg-foreground text-background'
                : 'bg-background/60 hover:bg-foreground/10',
              isFixed && 'cursor-default opacity-50',
            )}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Scene picker */}
      <select
        value={space.sceneId}
        onChange={(e) => dispatch({ type: 'UPDATE_SPACE', id: space.id, patch: { sceneId: e.target.value } })}
        className="h-8 shrink-0 rounded-md border border-input bg-background px-2 text-xs"
        aria-label="Scene"
      >
        {SCENES.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      {/* Card link */}
      {(space.type === 'event' || space.type === 'challenge' || space.type === 'blessing') && (
        <select
          value={space.cardId}
          onChange={(e) => dispatch({ type: 'UPDATE_SPACE', id: space.id, patch: { cardId: e.target.value } })}
          className="h-8 shrink-0 rounded-md border border-input bg-background px-2 text-xs"
          aria-label="Card"
        >
          <option value="">No card</option>
          {cards.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      )}

      {/* Delete */}
      {!isFixed && (
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={() => dispatch({ type: 'REMOVE_SPACE', id: space.id })}
          className="shrink-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
        </Button>
      )}
    </div>
  );
}

export function StepBoard({ state, dispatch }: Props) {
  const cardList = state.cards.map((c) => ({ id: c.id, title: c.title }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Build the path players travel. Each space can have a type, a scene illustration, and an optional card draw.
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => dispatch({ type: 'ADD_SPACE' })}
          disabled={state.spaces.length >= 40}
        >
          <Plus className="mr-1 size-4" />
          Add Space
        </Button>
      </div>

      {/* Space list */}
      <div className="flex flex-col gap-2">
        {state.spaces.map((space, i) => (
          <SpaceRow
            key={space.id}
            space={space}
            index={i}
            cards={cardList}
            dispatch={dispatch}
          />
        ))}
      </div>

      {/* Board preview */}
      <section className="rounded-xl border border-border bg-muted/20 p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Board Path Preview
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {state.spaces.map((space, i) => {
            const typeInfo = SPACE_TYPES.find((t) => t.type === space.type);
            const scene = SCENES.find((s) => s.id === space.sceneId);
            return (
              <div
                key={space.id}
                title={`${i + 1}. ${space.label} (${space.type})`}
                className={cn(
                  'flex size-8 items-center justify-center rounded border text-sm',
                  typeInfo?.color ?? '',
                )}
              >
                {scene ? (
                  <span title={scene.name} className="text-[10px]">{i + 1}</span>
                ) : (
                  <span className="text-[10px]">{i + 1}</span>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">
          {state.spaces.length} spaces · {state.spaces.filter((s) => s.cardId).length} with cards
        </p>
      </section>

      {/* Scene gallery */}
      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Available Scenes
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {SCENES.map((scene) => (
            <SceneCard key={scene.id} scene={scene} />
          ))}
        </div>
      </section>
    </div>
  );
}

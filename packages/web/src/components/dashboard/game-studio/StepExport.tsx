'use client';

import { useState } from 'react';
import { Download, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CHARACTERS, SCENES } from '@/lib/game-studio/characters';
import { buildGameDefinition } from '@/lib/game-studio/studio-state';
import { CharacterToken } from './CharacterToken';
import { SceneCard } from './SceneCard';
import { CardPreview } from './CardPreview';
import type { StudioState } from '@/lib/game-studio/studio-state';

interface Props {
  state: StudioState;
}

function ValidationItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 text-sm ${ok ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
      {ok ? <CheckCircle2 className="size-4 shrink-0" /> : <AlertCircle className="size-4 shrink-0" />}
      {label}
    </div>
  );
}

export function StepExport({ state }: Props) {
  const [copied, setCopied] = useState(false);
  const def = buildGameDefinition(state);

  const checks = [
    { ok: state.title.length > 0, label: 'Game has a title' },
    { ok: state.spaces.length >= 4, label: `Board has ${state.spaces.length} spaces (min 4)` },
    { ok: state.selectedCharacters.length >= 2, label: `${state.selectedCharacters.length} characters selected (min 2)` },
    { ok: state.cards.length > 0, label: `${state.cards.length} card${state.cards.length !== 1 ? 's' : ''} created` },
    {
      ok: state.winType === 'reachSpace' || (state.winResource.length > 0 && state.winAmount > 0),
      label: 'Win condition configured',
    },
  ];

  const allValid = checks.every((c) => c.ok);
  const json = JSON.stringify(def, null, 2);

  const copyJson = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${def.id}.game.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Validation */}
      <section className="flex flex-col gap-2 rounded-xl border border-border bg-muted/20 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Checklist</h2>
        {checks.map((c) => (
          <ValidationItem key={c.label} ok={c.ok} label={c.label} />
        ))}
      </section>

      {/* Game summary card */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Game Summary</h2>

        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 p-6">
          <h1 className="text-2xl font-bold">{state.title || 'Untitled Game'}</h1>
          {state.subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{state.subtitle}</p>}
          {state.description && (
            <p className="mt-3 max-w-prose text-sm text-foreground/80">{state.description}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-background/70 px-3 py-1 font-medium">
              {state.minPlayers}–{state.maxPlayers} players
            </span>
            <span className="rounded-full bg-background/70 px-3 py-1 font-medium">
              1d{state.diceSides}
            </span>
            <span className="rounded-full bg-background/70 px-3 py-1 font-medium">
              {state.spaces.length} spaces
            </span>
            <span className="rounded-full bg-background/70 px-3 py-1 font-medium">
              {state.cards.length} cards
            </span>
            {state.resources.map((r) => (
              <span key={r} className="rounded-full bg-background/70 px-3 py-1 font-medium capitalize">
                {r}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Characters */}
      {state.selectedCharacters.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Player Tokens</h2>
          <div className="flex flex-wrap gap-4">
            {state.selectedCharacters.map((id) => {
              const char = CHARACTERS.find((c) => c.id === id);
              return char ? <CharacterToken key={id} character={char} size="md" selected /> : null;
            })}
          </div>
        </section>
      )}

      {/* Board path with scenes */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Board ({state.spaces.length} spaces)
        </h2>
        <div className="flex flex-wrap gap-2">
          {state.spaces.map((space, i) => {
            const scene = SCENES.find((s) => s.id === space.sceneId);
            return (
              <div key={space.id} className="flex flex-col items-center gap-1">
                {scene && <SceneCard scene={scene} compact />}
                <span className="text-[9px] font-medium text-muted-foreground">{i + 1}. {space.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cards */}
      {state.cards.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Cards ({state.cards.length})
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {state.cards.map((card) => (
              <CardPreview key={card.id} card={card} />
            ))}
          </div>
        </section>
      )}

      {/* Export actions */}
      <section className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-muted/20 p-5">
        <Button onClick={downloadJson} disabled={!allValid}>
          <Download className="mr-2 size-4" />
          Download game.json
        </Button>
        <Button variant="outline" onClick={() => { void copyJson(); }}>
          {copied ? 'Copied!' : 'Copy JSON'}
        </Button>
        <Button variant="outline" asChild>
          <Link href="/game">
            <Play className="mr-2 size-4" />
            Open Game Board
          </Link>
        </Button>
        {!allValid && (
          <p className="text-xs text-muted-foreground">
            Complete the checklist above to enable export.
          </p>
        )}
      </section>

      {/* Raw JSON */}
      <details className="rounded-xl border border-border">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium">
          View generated game.json
        </summary>
        <pre className="max-h-96 overflow-auto rounded-b-xl bg-muted/40 p-4 text-[11px] text-foreground/80">
          {json}
        </pre>
      </details>
    </div>
  );
}

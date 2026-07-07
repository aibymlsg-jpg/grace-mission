'use client';

import { CHARACTERS } from '@/lib/game-studio/characters';
import { CharacterToken } from './CharacterToken';
import type { StudioState, StudioAction } from '@/lib/game-studio/studio-state';

interface Props {
  state: StudioState;
  dispatch: React.Dispatch<StudioAction>;
}

export function StepCharacters({ state, dispatch }: Props) {
  const biblical = CHARACTERS.filter((c) => c.category === 'biblical');
  const general = CHARACTERS.filter((c) => c.category === 'general');

  return (
    <div className="flex flex-col gap-8">
      <p className="text-sm text-muted-foreground">
        Select the player tokens. Each selected character becomes a playable piece. Choose at least 2.
      </p>

      {/* Biblical characters */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Biblical Characters
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {biblical.map((char) => {
            const selected = state.selectedCharacters.includes(char.id);
            return (
              <div key={char.id} className="flex flex-col items-center gap-2">
                <CharacterToken
                  character={char}
                  size="lg"
                  selected={selected}
                  onClick={() => dispatch({ type: 'TOGGLE_CHARACTER', characterId: char.id })}
                />
                <p className="max-w-[100px] text-center text-[10px] text-muted-foreground">
                  {char.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* General characters */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          General Characters
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {general.map((char) => {
            const selected = state.selectedCharacters.includes(char.id);
            return (
              <div key={char.id} className="flex flex-col items-center gap-2">
                <CharacterToken
                  character={char}
                  size="lg"
                  selected={selected}
                  onClick={() => dispatch({ type: 'TOGGLE_CHARACTER', characterId: char.id })}
                />
                <p className="max-w-[100px] text-center text-[10px] text-muted-foreground">
                  {char.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Selected summary */}
      {state.selectedCharacters.length > 0 && (
        <section className="rounded-xl border border-border bg-muted/30 p-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Selected Players ({state.selectedCharacters.length})
          </h3>
          <div className="flex flex-wrap gap-3">
            {state.selectedCharacters.map((id) => {
              const char = CHARACTERS.find((c) => c.id === id);
              if (!char) return null;
              return (
                <div key={id} className="flex items-center gap-2">
                  <CharacterToken character={char} size="sm" selected />
                  <span className="text-sm font-medium">{char.name}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {state.selectedCharacters.length < 2 && (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
          Select at least 2 characters to continue.
        </p>
      )}
    </div>
  );
}

'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { StudioState, StudioAction } from '@/lib/game-studio/studio-state';

interface Props {
  state: StudioState;
  dispatch: React.Dispatch<StudioAction>;
}

export function StepWin({ state, dispatch }: Props) {
  const lastSpace = state.spaces[state.spaces.length - 1];

  return (
    <div className="flex flex-col gap-8">
      <p className="text-sm text-muted-foreground">
        How does a player win? Choose a condition — the game engine enforces it automatically.
      </p>

      {/* Win type selector */}
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_WIN', winType: 'reachSpace' })}
          className={cn(
            'flex flex-col gap-3 rounded-xl border-2 p-5 text-left transition-all hover:scale-[1.02]',
            state.winType === 'reachSpace'
              ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/30'
              : 'border-border hover:border-amber-200',
          )}
        >
          <span className="text-3xl">🏆</span>
          <div>
            <p className="font-bold">First to the Finish</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              The first player to reach or pass the final space wins. Classic race-to-the-end.
            </p>
          </div>
          {state.winType === 'reachSpace' && lastSpace && (
            <div className="rounded-lg bg-amber-100 dark:bg-amber-900/30 px-3 py-2 text-xs font-medium text-amber-800 dark:text-amber-300">
              Win space: <strong>{lastSpace.label}</strong> (space {state.spaces.length})
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_WIN', winType: 'collectResource' })}
          disabled={state.resources.length === 0}
          className={cn(
            'flex flex-col gap-3 rounded-xl border-2 p-5 text-left transition-all',
            state.winType === 'collectResource'
              ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
              : 'border-border',
            state.resources.length === 0
              ? 'cursor-not-allowed opacity-40'
              : 'hover:scale-[1.02] hover:border-emerald-200',
          )}
        >
          <span className="text-3xl">🌾</span>
          <div>
            <p className="font-bold">Collect Resources</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              First player to accumulate a target amount of a named resource wins. Requires resources defined in Step 1.
            </p>
          </div>
          {state.resources.length === 0 && (
            <p className="text-xs text-muted-foreground">Go back to Step 1 to add resources first.</p>
          )}
        </button>
      </div>

      {/* Collect resource config */}
      {state.winType === 'collectResource' && state.resources.length > 0 && (
        <section className="flex flex-col gap-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 p-5">
          <h3 className="text-sm font-semibold">Collection Target</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-2">
              <Label>Resource to collect</Label>
              <div className="flex flex-wrap gap-2">
                {state.resources.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => dispatch({ type: 'SET_WIN', winType: 'collectResource', resource: r, amount: state.winAmount })}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-medium capitalize transition-all',
                      state.winResource === r
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-emerald-300 hover:border-emerald-400',
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="win-amount">Amount needed to win</Label>
              <Input
                id="win-amount"
                type="number"
                min={1}
                max={100}
                value={state.winAmount}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_WIN',
                    winType: 'collectResource',
                    resource: state.winResource,
                    amount: parseInt(e.target.value) || 10,
                  })
                }
                className="w-28"
              />
            </div>
          </div>
        </section>
      )}

      {/* Summary */}
      <div className="rounded-xl border border-border bg-muted/20 p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Win Condition Summary
        </h3>
        {state.winType === 'reachSpace' ? (
          <p className="text-sm">
            First player to reach <strong>{lastSpace?.label ?? 'the finish'}</strong> wins.
          </p>
        ) : (
          <p className="text-sm">
            First player to collect <strong>{state.winAmount}</strong>{' '}
            <strong>{state.winResource || '[resource]'}</strong> wins.
          </p>
        )}
      </div>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { StudioState, StudioAction, GameTheme } from '@/lib/game-studio/studio-state';

interface Props {
  state: StudioState;
  dispatch: React.Dispatch<StudioAction>;
}

const THEMES: { id: GameTheme; label: string; description: string; icon: string; palette: string }[] = [
  { id: 'biblical', label: 'Biblical', description: 'Stories of faith, redemption, and ancient lands', icon: '✡', palette: 'from-amber-50 to-amber-100 border-amber-300' },
  { id: 'fantasy',  label: 'Fantasy',  description: 'Magical realms, dragons, and ancient prophecies', icon: '⚔', palette: 'from-violet-50 to-violet-100 border-violet-300' },
  { id: 'historical', label: 'Historical', description: 'Real eras: Roman, medieval, renaissance', icon: '🏛', palette: 'from-stone-50 to-stone-100 border-stone-300' },
  { id: 'modern', label: 'Modern', description: 'Contemporary settings and everyday adventures', icon: '🌍', palette: 'from-sky-50 to-sky-100 border-sky-300' },
];

const DICE_OPTIONS = [
  { sides: 4, label: 'd4', desc: 'Short moves (1-4)' },
  { sides: 6, label: 'd6', desc: 'Classic (1-6)' },
  { sides: 8, label: 'd8', desc: 'Wide range (1-8)' },
  { sides: 10, label: 'd10', desc: 'Big boards (1-10)' },
];

export function StepIdentity({ state, dispatch }: Props) {
  return (
    <div className="flex flex-col gap-8">
      {/* Theme */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Theme</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => dispatch({ type: 'SET_THEME', theme: theme.id })}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border-2 bg-gradient-to-b p-4 text-center transition-all hover:scale-[1.03]',
                theme.palette,
                state.theme === theme.id
                  ? 'ring-2 ring-primary ring-offset-2'
                  : 'opacity-70 hover:opacity-100',
              )}
            >
              <span className="text-2xl">{theme.icon}</span>
              <p className="text-sm font-bold">{theme.label}</p>
              <p className="text-[10px] text-muted-foreground">{theme.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Title & metadata */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="game-title">Game Title</Label>
          <Input
            id="game-title"
            placeholder="The Journey of Ruth"
            value={state.title}
            onChange={(e) => dispatch({ type: 'SET_FIELD', key: 'title', value: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="game-subtitle">Subtitle <span className="text-muted-foreground">(optional)</span></Label>
          <Input
            id="game-subtitle"
            placeholder="A game of loyalty and harvest"
            value={state.subtitle}
            onChange={(e) => dispatch({ type: 'SET_FIELD', key: 'subtitle', value: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="game-desc">Description <span className="text-muted-foreground">(shown on start screen)</span></Label>
          <Input
            id="game-desc"
            placeholder="Follow the journey across ancient lands…"
            value={state.description}
            onChange={(e) => dispatch({ type: 'SET_FIELD', key: 'description', value: e.target.value })}
          />
        </div>
      </section>

      {/* Players */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Players & Dice</h2>
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col gap-2">
            <Label>Players</Label>
            <div className="flex gap-2">
              {[2, 3, 4].map((n) => (
                <Button
                  key={n}
                  size="sm"
                  variant={state.maxPlayers === n ? 'default' : 'outline'}
                  onClick={() => dispatch({ type: 'SET_PLAYERS', min: 2, max: n })}
                >
                  {n === 2 ? '2' : n === 3 ? '2–3' : '2–4'}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Dice type</Label>
            <div className="flex gap-2">
              {DICE_OPTIONS.map((d) => (
                <button
                  key={d.sides}
                  type="button"
                  onClick={() => dispatch({ type: 'SET_DICE', sides: d.sides })}
                  className={cn(
                    'flex flex-col items-center rounded-lg border-2 px-3 py-2 text-center transition-all hover:scale-[1.05]',
                    state.diceSides === d.sides
                      ? 'border-primary bg-primary/5 font-bold'
                      : 'border-border',
                  )}
                >
                  <span className="text-base font-mono font-bold">{d.label}</span>
                  <span className="text-[9px] text-muted-foreground">{d.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Resources <span className="font-normal normal-case text-muted-foreground">(optional — things players collect)</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {['grain', 'faith', 'kindness', 'gold', 'wisdom', 'strength'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                const has = state.resources.includes(r);
                dispatch({
                  type: 'SET_RESOURCES',
                  resources: has ? state.resources.filter((x) => x !== r) : [...state.resources, r],
                });
              }}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium capitalize transition-all',
                state.resources.includes(r)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-primary/50',
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

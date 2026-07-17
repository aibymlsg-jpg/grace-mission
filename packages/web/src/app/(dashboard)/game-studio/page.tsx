'use client';

import { useReducer } from 'react';
import { ChevronLeft, ChevronRight, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { studioReducer, INITIAL_STATE, type WizardStep } from '@/lib/game-studio/studio-state';
import { StepIdentity } from '@/components/dashboard/game-studio/StepIdentity';
import { StepBoard } from '@/components/dashboard/game-studio/StepBoard';
import { StepCharacters } from '@/components/dashboard/game-studio/StepCharacters';
import { StepCards } from '@/components/dashboard/game-studio/StepCards';
import { StepWin } from '@/components/dashboard/game-studio/StepWin';
import { StepExport } from '@/components/dashboard/game-studio/StepExport';
import { ComingSoon } from '@/components/dashboard/coming-soon';

const STEPS: { id: WizardStep; label: string; icon: string; description: string }[] = [
  { id: 'identity',   label: 'Identity',   icon: '🎭', description: 'Theme, title & rules' },
  { id: 'board',      label: 'Board',      icon: '🗺',  description: 'Spaces & scenes' },
  { id: 'characters', label: 'Characters', icon: '👥', description: 'Player tokens' },
  { id: 'cards',      label: 'Cards',      icon: '🃏', description: 'Event & effect cards' },
  { id: 'win',        label: 'Win',        icon: '🏆', description: 'Victory condition' },
  { id: 'export',     label: 'Export',     icon: '📦', description: 'Preview & download' },
];

// Flip to true once this wizard is wired to the real game-studio agent's
// storyboard-approval pipeline (Phase 2) instead of building in-memory only.
const GAME_STUDIO_ENABLED = false;

export default function GameStudioPage() {
  if (!GAME_STUDIO_ENABLED) {
    return (
      <ComingSoon
        title="Game Studio"
        description="Build short, Scripture-rooted narrative games for VBS and youth ministry through a storyboard-first, human-approved pipeline."
        eta="Phase 2"
      />
    );
  }
  return <GameStudioPageContent />;
}

function GameStudioPageContent() {
  const [state, dispatch] = useReducer(studioReducer, INITIAL_STATE);

  const currentIndex = STEPS.findIndex((s) => s.id === state.step);
  const currentStep = STEPS[currentIndex];
  const prevStep = STEPS[currentIndex - 1];
  const nextStep = STEPS[currentIndex + 1];

  const canAdvance =
    state.step !== 'identity' ||
    state.title.length > 0;

  return (
    <div className="flex min-w-0 flex-col gap-0 pb-8">
      {/* Header */}
      <div className="sticky top-14 z-20 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3 px-6 py-3">
          <Gamepad2 className="size-5 text-primary" />
          <div>
            <h1 className="text-lg font-bold leading-none">Game Studio</h1>
            <p className="text-xs text-muted-foreground">
              {state.title || 'Untitled Game'} · Step {currentIndex + 1} of {STEPS.length}
            </p>
          </div>
        </div>

        {/* Progress stepper */}
        <div className="flex items-stretch overflow-x-auto border-t border-border/40">
          {STEPS.map((step, i) => {
            const done = i < currentIndex;
            const active = i === currentIndex;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  if (i <= currentIndex || done) {
                    dispatch({ type: 'SET_STEP', step: step.id });
                  }
                }}
                className={cn(
                  'flex flex-1 flex-col items-center gap-0.5 border-b-2 px-3 py-2.5 text-center text-xs transition-all',
                  active
                    ? 'border-primary bg-primary/5 font-semibold text-primary'
                    : done
                    ? 'border-emerald-400 text-emerald-700 dark:text-emerald-400 hover:bg-muted/50 cursor-pointer'
                    : 'border-transparent text-muted-foreground cursor-default',
                )}
              >
                <span className="text-base leading-none">{step.icon}</span>
                <span className="hidden sm:block">{step.label}</span>
                {done && <span className="hidden sm:block text-[9px]">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="px-6 pt-6">
        {/* Step header */}
        {currentStep && (
          <div className="mb-6">
            <h2 className="text-xl font-bold">
              {currentStep.icon} {currentStep.label}
            </h2>
            <p className="text-sm text-muted-foreground">{currentStep.description}</p>
          </div>
        )}

        {/* Step body */}
        {state.step === 'identity' && <StepIdentity state={state} dispatch={dispatch} />}
        {state.step === 'board' && <StepBoard state={state} dispatch={dispatch} />}
        {state.step === 'characters' && <StepCharacters state={state} dispatch={dispatch} />}
        {state.step === 'cards' && <StepCards state={state} dispatch={dispatch} />}
        {state.step === 'win' && <StepWin state={state} dispatch={dispatch} />}
        {state.step === 'export' && <StepExport state={state} />}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-6">
          <Button
            variant="outline"
            onClick={() => prevStep && dispatch({ type: 'SET_STEP', step: prevStep.id })}
            disabled={!prevStep}
          >
            <ChevronLeft className="mr-1.5 size-4" />
            {prevStep ? prevStep.label : 'Back'}
          </Button>

          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={cn(
                  'size-1.5 rounded-full transition-all',
                  i === currentIndex
                    ? 'bg-primary w-4'
                    : i < currentIndex
                    ? 'bg-emerald-400'
                    : 'bg-border',
                )}
              />
            ))}
          </div>

          {nextStep ? (
            <Button
              onClick={() => dispatch({ type: 'SET_STEP', step: nextStep.id })}
              disabled={!canAdvance}
            >
              {nextStep.label}
              <ChevronRight className="ml-1.5 size-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => dispatch({ type: 'RESET' })}
            >
              Start Over
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

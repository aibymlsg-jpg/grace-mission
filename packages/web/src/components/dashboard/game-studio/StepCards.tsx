'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardPreview } from './CardPreview';
import type { StudioState, StudioAction, StudioCard } from '@/lib/game-studio/studio-state';

interface Props {
  state: StudioState;
  dispatch: React.Dispatch<StudioAction>;
}

const CARD_ICONS = ['📋','⚡','✨','💧','🌾','❤','⚔','🌿','🔥','🌊','🏔','🌟','💰','📜','🕊','🌸'];
const BLANK_CARD: Omit<StudioCard, 'id'> = {
  title: '', text: '', flavour: '', icon: '📋',
  effectKind: 'none', effectResource: '', effectDelta: 1, effectSpaces: 1,
};

function nanoid6() {
  return Math.random().toString(36).slice(2, 8);
}

function CardEditor({
  card,
  resources,
  onChange,
  onSave,
  onCancel,
}: {
  card: StudioCard;
  resources: string[];
  onChange: (patch: Partial<StudioCard>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border-2 border-primary/40 bg-card p-4 shadow-md">
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Icon picker */}
        <div className="flex flex-col gap-2">
          <Label>Icon</Label>
          <div className="flex flex-wrap gap-1">
            {CARD_ICONS.map((ic) => (
              <button
                key={ic}
                type="button"
                onClick={() => onChange({ icon: ic })}
                className={`rounded p-1 text-lg leading-none transition-all hover:scale-110 ${card.icon === ic ? 'bg-primary/20 ring-1 ring-primary' : ''}`}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        {/* Effect kind */}
        <div className="flex flex-col gap-2">
          <Label>Effect</Label>
          <div className="flex flex-wrap gap-1.5">
            {(['resource', 'move', 'skip', 'none'] as StudioCard['effectKind'][]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => onChange({ effectKind: k })}
                className={`rounded-md border px-2 py-1 text-xs capitalize transition-all ${card.effectKind === k ? 'border-primary bg-primary/10 font-medium' : 'border-border'}`}
              >
                {k}
              </button>
            ))}
          </div>
          {card.effectKind === 'resource' && (
            <div className="flex gap-2">
              <select
                value={card.effectResource}
                onChange={(e) => onChange({ effectResource: e.target.value })}
                className="h-8 flex-1 rounded-md border border-input bg-background px-2 text-xs"
              >
                <option value="">Select resource</option>
                {resources.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <Input
                type="number"
                value={card.effectDelta}
                onChange={(e) => onChange({ effectDelta: parseInt(e.target.value) || 0 })}
                className="h-8 w-20 text-xs"
                placeholder="±n"
              />
            </div>
          )}
          {card.effectKind === 'move' && (
            <Input
              type="number"
              value={card.effectSpaces}
              onChange={(e) => onChange({ effectSpaces: parseInt(e.target.value) || 0 })}
              className="h-8 w-32 text-xs"
              placeholder="spaces (neg = back)"
            />
          )}
        </div>
      </div>

      {/* Title + Text */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="card-title">Title</Label>
          <Input
            id="card-title"
            value={card.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Card name"
            className="text-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>ID (auto)</Label>
          <Input value={card.id} readOnly className="h-9 text-xs text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="card-text">Card Text</Label>
          <Input
            id="card-text"
            value={card.text}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder="What happens — written in second person (e.g. You glean grain…)"
            className="text-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="card-flavour">Flavour / Quote <span className="text-muted-foreground">(optional)</span></Label>
          <Input
            id="card-flavour"
            value={card.flavour}
            onChange={(e) => onChange({ flavour: e.target.value })}
            placeholder="Scripture or atmospheric quote"
            className="text-sm"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button size="sm" onClick={onSave}>
          <Check className="mr-1.5 size-3.5" />
          Save Card
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export function StepCards({ state, dispatch }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<StudioCard | null>(null);

  const startNew = () => {
    const id = nanoid6();
    const card: StudioCard = { ...BLANK_CARD, id };
    setDraft(card);
    setEditingId('__new__');
  };

  const startEdit = (card: StudioCard) => {
    setDraft({ ...card });
    setEditingId(card.id);
  };

  const saveCard = () => {
    if (!draft) return;
    if (editingId === '__new__') {
      dispatch({ type: 'ADD_CARD', card: draft });
    } else {
      dispatch({ type: 'UPDATE_CARD', id: draft.id, patch: draft });
    }
    setEditingId(null);
    setDraft(null);
  };

  const cancel = () => { setEditingId(null); setDraft(null); };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Cards are drawn when players land on event, challenge, or blessing spaces.
        </p>
        <Button size="sm" variant="outline" onClick={startNew} disabled={editingId !== null}>
          <Plus className="mr-1.5 size-4" />
          New Card
        </Button>
      </div>

      {/* New card editor */}
      {editingId === '__new__' && draft && (
        <CardEditor
          card={draft}
          resources={state.resources}
          onChange={(patch) => setDraft((prev) => (prev ? { ...prev, ...patch } : prev))}
          onSave={saveCard}
          onCancel={cancel}
        />
      )}

      {/* Empty state */}
      {state.cards.length === 0 && editingId !== '__new__' && (
        <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border py-12 text-center">
          <span className="text-4xl">🃏</span>
          <p className="text-sm text-muted-foreground">No cards yet. Add your first card above.</p>
        </div>
      )}

      {/* Card list */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {state.cards.map((card) => (
          <div key={card.id}>
            {editingId === card.id && draft ? (
              <CardEditor
                card={draft}
                resources={state.resources}
                onChange={(patch) => setDraft((prev) => (prev ? { ...prev, ...patch } : prev))}
                onSave={saveCard}
                onCancel={cancel}
              />
            ) : (
              <div className="group relative">
                <CardPreview card={card} />
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="icon-xs"
                    variant="secondary"
                    onClick={() => startEdit(card)}
                    className="shadow-sm"
                  >
                    <Edit2 className="size-3" />
                  </Button>
                  <Button
                    size="icon-xs"
                    variant="destructive"
                    onClick={() => dispatch({ type: 'REMOVE_CARD', id: card.id })}
                    className="shadow-sm"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

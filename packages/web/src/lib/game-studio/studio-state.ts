import type { SpaceType } from '@/lib/board-game/types';

export type WizardStep = 'identity' | 'board' | 'characters' | 'cards' | 'win' | 'export';
export type GameTheme = 'biblical' | 'fantasy' | 'historical' | 'modern';

export interface StudioCard {
  id: string;
  title: string;
  text: string;
  flavour: string;
  effectKind: 'resource' | 'move' | 'skip' | 'none';
  effectResource: string;
  effectDelta: number;
  effectSpaces: number;
  icon: string;
}

export interface StudioSpace {
  id: number;
  label: string;
  type: SpaceType;
  cardId: string;
  sceneId: string;
}

export interface StudioState {
  step: WizardStep;
  theme: GameTheme;
  title: string;
  subtitle: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  diceSides: number;
  resources: string[];
  spaces: StudioSpace[];
  cards: StudioCard[];
  winType: 'reachSpace' | 'collectResource';
  winResource: string;
  winAmount: number;
  selectedCharacters: string[];
}

export type StudioAction =
  | { type: 'SET_STEP'; step: WizardStep }
  | { type: 'SET_THEME'; theme: GameTheme }
  | { type: 'SET_FIELD'; key: 'title' | 'subtitle' | 'description'; value: string }
  | { type: 'SET_PLAYERS'; min: number; max: number }
  | { type: 'SET_DICE'; sides: number }
  | { type: 'SET_RESOURCES'; resources: string[] }
  | { type: 'ADD_SPACE' }
  | { type: 'UPDATE_SPACE'; id: number; patch: Partial<StudioSpace> }
  | { type: 'REMOVE_SPACE'; id: number }
  | { type: 'ADD_CARD'; card: StudioCard }
  | { type: 'UPDATE_CARD'; id: string; patch: Partial<StudioCard> }
  | { type: 'REMOVE_CARD'; id: string }
  | { type: 'SET_WIN'; winType: StudioState['winType']; resource?: string; amount?: number }
  | { type: 'TOGGLE_CHARACTER'; characterId: string }
  | { type: 'RESET' };

export const INITIAL_STATE: StudioState = {
  step: 'identity',
  theme: 'biblical',
  title: '',
  subtitle: '',
  description: '',
  minPlayers: 2,
  maxPlayers: 4,
  diceSides: 6,
  resources: [],
  spaces: [
    { id: 0, label: 'Start', type: 'start', cardId: '', sceneId: 'fields' },
    { id: 1, label: 'First Steps', type: 'safe', cardId: '', sceneId: 'road' },
    { id: 2, label: 'Challenge', type: 'challenge', cardId: '', sceneId: 'desert' },
    { id: 3, label: 'Blessing', type: 'blessing', cardId: '', sceneId: 'river' },
    { id: 4, label: 'Finish', type: 'finish', cardId: '', sceneId: 'city' },
  ],
  cards: [],
  winType: 'reachSpace',
  winResource: '',
  winAmount: 10,
  selectedCharacters: ['ruth', 'boaz'],
};

export function studioReducer(state: StudioState, action: StudioAction): StudioState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.step };
    case 'SET_THEME':
      return { ...state, theme: action.theme };
    case 'SET_FIELD':
      return { ...state, [action.key]: action.value };
    case 'SET_PLAYERS':
      return { ...state, minPlayers: action.min, maxPlayers: action.max };
    case 'SET_DICE':
      return { ...state, diceSides: action.sides };
    case 'SET_RESOURCES':
      return { ...state, resources: action.resources };
    case 'ADD_SPACE': {
      const nextId = Math.max(0, ...state.spaces.map((s) => s.id)) + 1;
      const newSpace: StudioSpace = {
        id: nextId,
        label: `Space ${nextId}`,
        type: 'safe',
        cardId: '',
        sceneId: 'fields',
      };
      // Insert before the last space (finish)
      const last = state.spaces[state.spaces.length - 1];
      const withoutLast = state.spaces.slice(0, -1);
      return { ...state, spaces: [...withoutLast, newSpace, ...(last ? [last] : [])] };
    }
    case 'UPDATE_SPACE':
      return {
        ...state,
        spaces: state.spaces.map((s) => (s.id === action.id ? { ...s, ...action.patch } : s)),
      };
    case 'REMOVE_SPACE':
      return { ...state, spaces: state.spaces.filter((s) => s.id !== action.id) };
    case 'ADD_CARD':
      return { ...state, cards: [...state.cards, action.card] };
    case 'UPDATE_CARD':
      return {
        ...state,
        cards: state.cards.map((c) => (c.id === action.id ? { ...c, ...action.patch } : c)),
      };
    case 'REMOVE_CARD':
      return { ...state, cards: state.cards.filter((c) => c.id !== action.id) };
    case 'SET_WIN':
      return {
        ...state,
        winType: action.winType,
        winResource: action.resource ?? state.winResource,
        winAmount: action.amount ?? state.winAmount,
      };
    case 'TOGGLE_CHARACTER': {
      const has = state.selectedCharacters.includes(action.characterId);
      return {
        ...state,
        selectedCharacters: has
          ? state.selectedCharacters.filter((c) => c !== action.characterId)
          : [...state.selectedCharacters, action.characterId],
      };
    }
    case 'RESET':
      return INITIAL_STATE;
    default:
      return state;
  }
}

export function buildGameDefinition(s: StudioState) {
  const lastSpace = s.spaces[s.spaces.length - 1];
  return {
    id: s.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'my-game',
    title: s.title || 'Untitled Game',
    subtitle: s.subtitle || undefined,
    description: s.description || undefined,
    minPlayers: s.minPlayers,
    maxPlayers: s.maxPlayers,
    dice: { count: 1, sides: s.diceSides },
    resources: s.resources.length > 0 ? s.resources : undefined,
    winCondition:
      s.winType === 'reachSpace'
        ? { type: 'reachSpace' as const, spaceId: lastSpace?.id ?? 0 }
        : { type: 'collectResource' as const, resource: s.winResource, amount: s.winAmount },
    board: {
      path: s.spaces.map((sp) => sp.id),
      spaces: s.spaces.map((sp) => ({
        id: sp.id,
        label: sp.label,
        type: sp.type,
        cardId: sp.cardId || undefined,
      })),
    },
    cards: s.cards.map((c) => ({
      id: c.id,
      title: c.title,
      text: c.text,
      flavour: c.flavour || undefined,
      effect: {
        kind: c.effectKind,
        resource: c.effectKind === 'resource' ? c.effectResource : undefined,
        delta: c.effectKind === 'resource' ? c.effectDelta : undefined,
        spaces: c.effectKind === 'move' ? c.effectSpaces : undefined,
      },
    })),
  };
}

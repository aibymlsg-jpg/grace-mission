export interface CharacterDef {
  id: string;
  name: string;
  role: string;
  description: string;
  category: 'biblical' | 'general';
  bgFrom: string;
  bgTo: string;
  skinColor: string;
  hairColor: string;
  clothingColor: string;
  clothingAccent: string;
  headwear: 'hood' | 'shawl' | 'cloth' | 'helmet' | 'turban' | 'wreath' | 'crown' | 'none';
  headwearColor: string;
}

export const CHARACTERS: readonly CharacterDef[] = [
  {
    id: 'ruth',
    name: 'Ruth',
    role: 'The Faithful',
    description: 'A woman of noble character who chose loyalty over ease.',
    category: 'biblical',
    bgFrom: '#FEF3C7', bgTo: '#FCD34D',
    skinColor: '#D4A257', hairColor: '#4A2512',
    clothingColor: '#92400E', clothingAccent: '#78350F',
    headwear: 'hood', headwearColor: '#6B3A2A',
  },
  {
    id: 'naomi',
    name: 'Naomi',
    role: 'The Wise Elder',
    description: 'A woman of wisdom who guided others through grief.',
    category: 'biblical',
    bgFrom: '#F0FDF4', bgTo: '#86EFAC',
    skinColor: '#C8956C', hairColor: '#9CA3AF',
    clothingColor: '#166534', clothingAccent: '#14532D',
    headwear: 'shawl', headwearColor: '#6B7280',
  },
  {
    id: 'boaz',
    name: 'Boaz',
    role: 'The Redeemer',
    description: 'A man of integrity who honored his obligations.',
    category: 'biblical',
    bgFrom: '#FFF7ED', bgTo: '#FDBA74',
    skinColor: '#C28240', hairColor: '#3B1F0A',
    clothingColor: '#7C2D12', clothingAccent: '#9A3412',
    headwear: 'cloth', headwearColor: '#92400E',
  },
  {
    id: 'orpah',
    name: 'Orpah',
    role: 'The Returner',
    description: 'A woman who chose a different path with courage.',
    category: 'biblical',
    bgFrom: '#EFF6FF', bgTo: '#93C5FD',
    skinColor: '#8B5E3C', hairColor: '#1C1917',
    clothingColor: '#1D4ED8', clothingAccent: '#1E40AF',
    headwear: 'hood', headwearColor: '#1E3A8A',
  },
  {
    id: 'shepherd',
    name: 'Shepherd',
    role: 'The Keeper',
    description: 'A guardian of the flock, patient and watchful.',
    category: 'general',
    bgFrom: '#F0FDF4', bgTo: '#4ADE80',
    skinColor: '#B8864A', hairColor: '#2C1810',
    clothingColor: '#166534', clothingAccent: '#15803D',
    headwear: 'none', headwearColor: '',
  },
  {
    id: 'elder',
    name: 'Elder',
    role: 'The Judge',
    description: 'A keeper of ancient wisdom and just rulings.',
    category: 'general',
    bgFrom: '#FAFAFA', bgTo: '#E5E7EB',
    skinColor: '#D4A899', hairColor: '#9CA3AF',
    clothingColor: '#F1F5F9', clothingAccent: '#CBD5E1',
    headwear: 'wreath', headwearColor: '#A3A3A3',
  },
  {
    id: 'warrior',
    name: 'Warrior',
    role: 'The Guardian',
    description: 'A protector who stands firm against adversity.',
    category: 'general',
    bgFrom: '#FFF1F2', bgTo: '#FDA4AF',
    skinColor: '#B87333', hairColor: '#1C1917',
    clothingColor: '#9F1239', clothingAccent: '#881337',
    headwear: 'helmet', headwearColor: '#78716C',
  },
  {
    id: 'merchant',
    name: 'Merchant',
    role: 'The Trader',
    description: 'A traveler of roads who knows the value of all things.',
    category: 'general',
    bgFrom: '#EFF6FF', bgTo: '#60A5FA',
    skinColor: '#A0714F', hairColor: '#292524',
    clothingColor: '#1E40AF', clothingAccent: '#1D4ED8',
    headwear: 'turban', headwearColor: '#1E3A8A',
  },
];

export interface SceneDef {
  id: string;
  name: string;
  description: string;
  skyFrom: string;
  skyTo: string;
  groundFrom: string;
  groundTo: string;
  elements: SceneElement[];
}

export interface SceneElement {
  kind: 'sun' | 'moon' | 'cloud' | 'tree' | 'building' | 'mountain' | 'water' | 'wheat' | 'arch' | 'pillar';
  x: number;
  y: number;
  color: string;
  size?: number;
}

export const SCENES: readonly SceneDef[] = [
  {
    id: 'fields',
    name: 'Gleaning Fields',
    description: 'Sunlit fields of grain stretching to the horizon.',
    skyFrom: '#87CEEB', skyTo: '#E0F2FE',
    groundFrom: '#84CC16', groundTo: '#65A30D',
    elements: [
      { kind: 'sun', x: 130, y: 20, color: '#FCD34D', size: 18 },
      { kind: 'wheat', x: 20, y: 62, color: '#CA8A04', size: 14 },
      { kind: 'wheat', x: 50, y: 60, color: '#B45309', size: 12 },
      { kind: 'wheat', x: 80, y: 63, color: '#CA8A04', size: 14 },
      { kind: 'wheat', x: 110, y: 61, color: '#B45309', size: 13 },
      { kind: 'cloud', x: 40, y: 18, color: 'rgba(255,255,255,0.8)', size: 20 },
    ],
  },
  {
    id: 'city',
    name: 'City Gate',
    description: 'The ancient stone gate where elders gather.',
    skyFrom: '#DBEAFE', skyTo: '#BFDBFE',
    groundFrom: '#A8A29E', groundTo: '#78716C',
    elements: [
      { kind: 'building', x: 20, y: 30, color: '#D6D3D1', size: 30 },
      { kind: 'arch', x: 60, y: 20, color: '#E7E5E4', size: 40 },
      { kind: 'building', x: 110, y: 35, color: '#D6D3D1', size: 25 },
      { kind: 'sun', x: 130, y: 15, color: '#FDE68A', size: 14 },
    ],
  },
  {
    id: 'desert',
    name: 'Desert Road',
    description: 'A dusty path through sun-baked hills.',
    skyFrom: '#FEF3C7', skyTo: '#FDE68A',
    groundFrom: '#D97706', groundTo: '#B45309',
    elements: [
      { kind: 'sun', x: 120, y: 18, color: '#F59E0B', size: 22 },
      { kind: 'mountain', x: 10, y: 40, color: '#92400E', size: 35 },
      { kind: 'mountain', x: 90, y: 45, color: '#78350F', size: 28 },
    ],
  },
  {
    id: 'river',
    name: 'Riverbank',
    description: 'Cool water flows through reeds and rushes.',
    skyFrom: '#BAE6FD', skyTo: '#7DD3FC',
    groundFrom: '#4ADE80', groundTo: '#22C55E',
    elements: [
      { kind: 'water', x: 0, y: 55, color: '#0EA5E9', size: 160 },
      { kind: 'tree', x: 15, y: 30, color: '#15803D', size: 25 },
      { kind: 'tree', x: 120, y: 35, color: '#166534', size: 20 },
      { kind: 'cloud', x: 65, y: 15, color: 'rgba(255,255,255,0.9)', size: 25 },
    ],
  },
  {
    id: 'road',
    name: 'Open Road',
    description: 'A winding path between two lands.',
    skyFrom: '#C7D2FE', skyTo: '#A5B4FC',
    groundFrom: '#A3A3A3', groundTo: '#737373',
    elements: [
      { kind: 'mountain', x: 5, y: 35, color: '#6366F1', size: 40 },
      { kind: 'mountain', x: 95, y: 40, color: '#4F46E5', size: 30 },
      { kind: 'cloud', x: 55, y: 12, color: 'rgba(255,255,255,0.85)', size: 22 },
    ],
  },
  {
    id: 'market',
    name: 'Marketplace',
    description: 'Colorful stalls full of goods and voices.',
    skyFrom: '#FDE68A', skyTo: '#FCD34D',
    groundFrom: '#92400E', groundTo: '#78350F',
    elements: [
      { kind: 'building', x: 8, y: 28, color: '#F87171', size: 28 },
      { kind: 'building', x: 55, y: 32, color: '#34D399', size: 24 },
      { kind: 'building', x: 105, y: 26, color: '#60A5FA', size: 30 },
      { kind: 'sun', x: 75, y: 14, color: '#F59E0B', size: 16 },
    ],
  },
  {
    id: 'temple',
    name: 'Temple Steps',
    description: 'White stone columns rising to the sky.',
    skyFrom: '#E0E7FF', skyTo: '#C7D2FE',
    groundFrom: '#F5F5F4', groundTo: '#E7E5E4',
    elements: [
      { kind: 'pillar', x: 25, y: 20, color: '#F5F5F4', size: 50 },
      { kind: 'pillar', x: 55, y: 20, color: '#E7E5E4', size: 50 },
      { kind: 'pillar', x: 85, y: 20, color: '#F5F5F4', size: 50 },
      { kind: 'sun', x: 130, y: 14, color: '#FDE68A', size: 16 },
    ],
  },
  {
    id: 'threshing',
    name: 'Threshing Floor',
    description: 'Grain swept by the evening wind.',
    skyFrom: '#FED7AA', skyTo: '#FB923C',
    groundFrom: '#CA8A04', groundTo: '#A16207',
    elements: [
      { kind: 'wheat', x: 15, y: 58, color: '#D97706', size: 16 },
      { kind: 'wheat', x: 55, y: 55, color: '#B45309', size: 20 },
      { kind: 'wheat', x: 100, y: 58, color: '#D97706', size: 16 },
      { kind: 'moon', x: 125, y: 16, color: '#FEF3C7', size: 16 },
    ],
  },
];

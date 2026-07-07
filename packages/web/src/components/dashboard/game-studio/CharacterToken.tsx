'use client';

import { cn } from '@/lib/utils';
import type { CharacterDef } from '@/lib/game-studio/characters';

interface Props {
  character: CharacterDef;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  onClick?: () => void;
}

const SIZE_MAP = { sm: 56, md: 80, lg: 112 };

function HeadwearPath({
  hw,
  color,
  cx,
  cy,
  r,
}: {
  hw: CharacterDef['headwear'];
  color: string;
  cx: number;
  cy: number;
  r: number;
}) {
  if (hw === 'hood')
    return (
      <path
        d={`M${cx - r} ${cy} Q${cx - r} ${cy - r * 1.5} ${cx} ${cy - r * 1.5} Q${cx + r} ${cy - r * 1.5} ${cx + r} ${cy} Q${cx + r} ${cy - r * 0.5} ${cx} ${cy - r * 0.6} Q${cx - r} ${cy - r * 0.5} ${cx - r} ${cy}`}
        fill={color}
      />
    );
  if (hw === 'shawl')
    return (
      <path
        d={`M${cx - r * 1.2} ${cy + r * 0.3} Q${cx - r * 0.8} ${cy - r * 1.6} ${cx} ${cy - r * 1.6} Q${cx + r * 0.8} ${cy - r * 1.6} ${cx + r * 1.2} ${cy + r * 0.3}`}
        stroke={color}
        strokeWidth={r * 0.3}
        fill="none"
        strokeLinecap="round"
      />
    );
  if (hw === 'cloth')
    return (
      <rect
        x={cx - r * 0.9}
        y={cy - r * 1.4}
        width={r * 1.8}
        height={r * 0.6}
        rx={r * 0.15}
        fill={color}
      />
    );
  if (hw === 'helmet')
    return (
      <path
        d={`M${cx - r * 0.9} ${cy} Q${cx - r * 1} ${cy - r * 1.8} ${cx} ${cy - r * 1.9} Q${cx + r} ${cy - r * 1.8} ${cx + r * 0.9} ${cy}`}
        fill={color}
      />
    );
  if (hw === 'turban')
    return (
      <>
        <ellipse cx={cx} cy={cy - r * 1.3} rx={r * 0.95} ry={r * 0.45} fill={color} />
        <ellipse cx={cx} cy={cy - r * 1.55} rx={r * 0.8} ry={r * 0.35} fill={color} />
        <circle cx={cx + r * 0.5} cy={cy - r * 1.6} r={r * 0.15} fill="white" opacity={0.7} />
      </>
    );
  if (hw === 'wreath')
    return (
      <path
        d={`M${cx - r * 0.9} ${cy - r * 0.9} Q${cx} ${cy - r * 1.9} ${cx + r * 0.9} ${cy - r * 0.9}`}
        stroke={color}
        strokeWidth={r * 0.25}
        fill="none"
        strokeLinecap="round"
      />
    );
  return null;
}

export function CharacterToken({ character, size = 'md', selected, onClick }: Props) {
  const px = SIZE_MAP[size];
  const cx = px / 2;
  const cy = px / 2;
  const r = px * 0.38;
  const headR = r * 0.55;
  const headCy = cy - r * 0.15;
  const bodyY = headCy + headR * 0.85;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex flex-col items-center gap-1 rounded-xl p-1.5 transition-all',
        onClick && 'cursor-pointer hover:scale-105',
        selected &&
          'ring-2 ring-primary ring-offset-2 ring-offset-background',
        !selected && onClick && 'hover:ring-2 hover:ring-primary/40 hover:ring-offset-1',
      )}
    >
      <svg
        width={px}
        height={px}
        viewBox={`0 0 ${px} ${px}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={character.name}
      >
        {/* Background */}
        <defs>
          <radialGradient id={`bg-${character.id}`} cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor={character.bgFrom} />
            <stop offset="100%" stopColor={character.bgTo} />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={cx - 2} fill={`url(#bg-${character.id})`} />
        <circle
          cx={cx}
          cy={cy}
          r={cx - 2}
          stroke={selected ? 'transparent' : character.bgTo}
          strokeWidth={1.5}
          fill="none"
          opacity={0.6}
        />

        {/* Body */}
        <path
          d={`M${cx - r * 0.75} ${px} Q${cx - r * 0.7} ${bodyY + r * 0.1} ${cx} ${bodyY} Q${cx + r * 0.7} ${bodyY + r * 0.1} ${cx + r * 0.75} ${px}`}
          fill={character.clothingColor}
        />
        <path
          d={`M${cx - r * 0.45} ${px} Q${cx - r * 0.4} ${bodyY + r * 0.3} ${cx} ${bodyY + r * 0.1} Q${cx + r * 0.4} ${bodyY + r * 0.3} ${cx + r * 0.45} ${px}`}
          fill={character.clothingAccent}
        />

        {/* Arms */}
        <path
          d={`M${cx - r * 0.7} ${bodyY + r * 0.4} Q${cx - r * 1.05} ${bodyY + r * 0.7} ${cx - r * 0.9} ${bodyY + r * 1.0}`}
          stroke={character.clothingColor}
          strokeWidth={r * 0.28}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={`M${cx + r * 0.7} ${bodyY + r * 0.4} Q${cx + r * 1.05} ${bodyY + r * 0.7} ${cx + r * 0.9} ${bodyY + r * 1.0}`}
          stroke={character.clothingColor}
          strokeWidth={r * 0.28}
          strokeLinecap="round"
          fill="none"
        />

        {/* Neck */}
        <rect
          x={cx - headR * 0.3}
          y={headCy + headR * 0.88}
          width={headR * 0.6}
          height={headR * 0.45}
          fill={character.skinColor}
        />

        {/* Head */}
        <circle cx={cx} cy={headCy} r={headR} fill={character.skinColor} />

        {/* Hair */}
        <path
          d={`M${cx - headR} ${headCy} Q${cx - headR * 1.05} ${headCy - headR * 1.1} ${cx} ${headCy - headR * 1.15} Q${cx + headR * 1.05} ${headCy - headR * 1.1} ${cx + headR} ${headCy}`}
          fill={character.hairColor}
        />

        {/* Headwear */}
        <HeadwearPath
          hw={character.headwear}
          color={character.headwearColor}
          cx={cx}
          cy={headCy}
          r={headR}
        />

        {/* Eyes */}
        <circle cx={cx - headR * 0.35} cy={headCy} r={headR * 0.14} fill="#1C1917" />
        <circle cx={cx + headR * 0.35} cy={headCy} r={headR * 0.14} fill="#1C1917" />
        <circle cx={cx - headR * 0.32} cy={headCy - headR * 0.04} r={headR * 0.05} fill="white" />
        <circle cx={cx + headR * 0.38} cy={headCy - headR * 0.04} r={headR * 0.05} fill="white" />

        {/* Smile */}
        <path
          d={`M${cx - headR * 0.28} ${headCy + headR * 0.3} Q${cx} ${headCy + headR * 0.52} ${cx + headR * 0.28} ${headCy + headR * 0.3}`}
          stroke={character.hairColor}
          strokeWidth={headR * 0.1}
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {size !== 'sm' && (
        <div className="text-center leading-tight">
          <p className="text-xs font-semibold text-foreground">{character.name}</p>
          <p className="text-[10px] text-muted-foreground">{character.role}</p>
        </div>
      )}
    </button>
  );
}

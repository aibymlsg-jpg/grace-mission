'use client';

import { cn } from '@/lib/utils';
import type { SceneDef, SceneElement } from '@/lib/game-studio/characters';

interface Props {
  scene: SceneDef;
  selected?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

const W = 160;
const H = 90;
const GROUND_Y = H * 0.6;

function SceneElementSvg({ el }: { el: SceneElement }) {
  const sz = el.size ?? 20;
  switch (el.kind) {
    case 'sun':
      return (
        <>
          <circle cx={el.x} cy={el.y} r={sz * 0.55} fill={el.color} opacity={0.9} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1={el.x + Math.cos((deg * Math.PI) / 180) * sz * 0.65}
              y1={el.y + Math.sin((deg * Math.PI) / 180) * sz * 0.65}
              x2={el.x + Math.cos((deg * Math.PI) / 180) * sz * 0.9}
              y2={el.y + Math.sin((deg * Math.PI) / 180) * sz * 0.9}
              stroke={el.color}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          ))}
        </>
      );
    case 'moon':
      return (
        <>
          <circle cx={el.x} cy={el.y} r={sz * 0.52} fill={el.color} opacity={0.9} />
          <circle cx={el.x + sz * 0.2} cy={el.y - sz * 0.1} r={sz * 0.38} fill="#FB923C" />
        </>
      );
    case 'cloud':
      return (
        <>
          <ellipse cx={el.x} cy={el.y} rx={sz * 0.9} ry={sz * 0.45} fill={el.color} />
          <ellipse cx={el.x - sz * 0.4} cy={el.y + sz * 0.1} rx={sz * 0.55} ry={sz * 0.38} fill={el.color} />
          <ellipse cx={el.x + sz * 0.38} cy={el.y + sz * 0.08} rx={sz * 0.5} ry={sz * 0.35} fill={el.color} />
        </>
      );
    case 'wheat':
      return (
        <>
          <line x1={el.x} y1={GROUND_Y} x2={el.x} y2={el.y} stroke={el.color} strokeWidth={2} />
          <ellipse cx={el.x} cy={el.y} rx={sz * 0.22} ry={sz * 0.5} fill={el.color} />
          <ellipse cx={el.x - sz * 0.18} cy={el.y + sz * 0.15} rx={sz * 0.14} ry={sz * 0.28} fill={el.color} transform={`rotate(-25 ${el.x - sz * 0.18} ${el.y + sz * 0.15})`} />
          <ellipse cx={el.x + sz * 0.18} cy={el.y + sz * 0.15} rx={sz * 0.14} ry={sz * 0.28} fill={el.color} transform={`rotate(25 ${el.x + sz * 0.18} ${el.y + sz * 0.15})`} />
        </>
      );
    case 'tree':
      return (
        <>
          <rect x={el.x - 3} y={GROUND_Y - sz * 0.3} width={6} height={sz * 0.3} fill="#92400E" />
          <ellipse cx={el.x} cy={GROUND_Y - sz * 0.6} rx={sz * 0.42} ry={sz * 0.5} fill={el.color} />
          <ellipse cx={el.x - sz * 0.15} cy={GROUND_Y - sz * 0.45} rx={sz * 0.28} ry={sz * 0.35} fill={el.color} opacity={0.85} />
        </>
      );
    case 'building':
      return (
        <>
          <rect x={el.x - sz * 0.5} y={el.y} width={sz} height={GROUND_Y - el.y} fill={el.color} />
          <rect x={el.x - sz * 0.5} y={el.y - sz * 0.15} width={sz} height={sz * 0.18} fill={el.color} opacity={0.7} />
          <rect x={el.x - sz * 0.15} y={el.y + (GROUND_Y - el.y) * 0.35} width={sz * 0.28} height={sz * 0.35} fill="#0369A1" opacity={0.5} />
        </>
      );
    case 'mountain':
      return (
        <path
          d={`M${el.x} ${el.y - sz * 0.05} L${el.x - sz * 0.8} ${GROUND_Y} L${el.x + sz * 0.8} ${GROUND_Y} Z`}
          fill={el.color}
        />
      );
    case 'water':
      return (
        <>
          <rect x={0} y={el.y} width={W} height={H - el.y} fill={el.color} opacity={0.8} />
          <path
            d={`M0 ${el.y} Q${W * 0.15} ${el.y - 5} ${W * 0.3} ${el.y} Q${W * 0.45} ${el.y + 5} ${W * 0.6} ${el.y} Q${W * 0.75} ${el.y - 5} ${W} ${el.y}`}
            stroke="white"
            strokeWidth={1.5}
            fill="none"
            opacity={0.5}
          />
        </>
      );
    case 'arch':
      return (
        <>
          <rect x={el.x - sz * 0.55} y={el.y + sz * 0.5} width={sz * 0.2} height={GROUND_Y - el.y - sz * 0.5} fill={el.color} />
          <rect x={el.x + sz * 0.35} y={el.y + sz * 0.5} width={sz * 0.2} height={GROUND_Y - el.y - sz * 0.5} fill={el.color} />
          <path
            d={`M${el.x - sz * 0.55} ${el.y + sz * 0.5} Q${el.x} ${el.y - sz * 0.3} ${el.x + sz * 0.55} ${el.y + sz * 0.5}`}
            stroke={el.color}
            strokeWidth={sz * 0.18}
            fill="none"
          />
        </>
      );
    case 'pillar':
      return (
        <>
          <rect x={el.x - 6} y={el.y} width={12} height={sz * 0.55} fill={el.color} />
          <rect x={el.x - 9} y={el.y - 4} width={18} height={6} rx={1} fill={el.color} opacity={0.8} />
          <rect x={el.x - 8} y={el.y + sz * 0.52} width={16} height={5} rx={1} fill={el.color} opacity={0.8} />
        </>
      );
    default:
      return null;
  }
}

export function SceneCard({ scene, selected, compact = false, onClick }: Props) {
  const h = compact ? 60 : H;
  const scale = compact ? 60 / H : 1;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex flex-col items-center gap-1.5 rounded-xl overflow-hidden transition-all',
        onClick && 'cursor-pointer hover:scale-[1.03]',
        selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
        !selected && onClick && 'hover:ring-2 hover:ring-primary/40',
      )}
    >
      <svg
        width={compact ? W * scale : W}
        height={h}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={scene.name}
      >
        <defs>
          <linearGradient id={`sky-${scene.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={scene.skyFrom} />
            <stop offset="100%" stopColor={scene.skyTo} />
          </linearGradient>
          <linearGradient id={`gnd-${scene.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={scene.groundFrom} />
            <stop offset="100%" stopColor={scene.groundTo} />
          </linearGradient>
        </defs>
        {/* Sky */}
        <rect x={0} y={0} width={W} height={GROUND_Y} fill={`url(#sky-${scene.id})`} />
        {/* Ground */}
        <rect x={0} y={GROUND_Y} width={W} height={H - GROUND_Y} fill={`url(#gnd-${scene.id})`} />
        {/* Elements */}
        {scene.elements.map((el, i) => (
          <SceneElementSvg key={i} el={el} />
        ))}
      </svg>
      {!compact && (
        <div className="px-1 pb-1 text-center">
          <p className="text-xs font-semibold text-foreground">{scene.name}</p>
          <p className="text-[10px] text-muted-foreground">{scene.description}</p>
        </div>
      )}
    </button>
  );
}

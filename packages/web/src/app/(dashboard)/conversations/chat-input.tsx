'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BarChart3,
  Bot,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  Globe,
  Network,
  Search,
  Send,
  Target,
  TrendingUp,
  Users,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { authFetch } from '@/lib/auth';
import { useT, type Messages } from '@/lib/i18n';

/* ------------------------------------------------------------------ */
/*  Slash commands & skills                                            */
/* ------------------------------------------------------------------ */

interface SlashItem {
  name: string;
  description: string;
  type: 'command' | 'skill';
}

const messages = {
  en: {
    cmdReset: 'Start a fresh conversation (current session is archived)',
    cmdCompact: 'Summarize conversation context to free up space',
    cmdHelp: 'Show available commands',
    emptyPrompt: 'What would you like to work on today?',
    placeholder: 'Type / for commands or send a message...',
    connected: 'Connected',
    disconnected: 'Disconnected',
    disclaimer: 'Clawix agents can make errors.',
    scenarios: {
      campaign: {
        title: 'Campaign Planning',
        subtitle: 'mission · objectives · beneficiaries',
        description:
          'Define your mission, set SMART objectives, identify target communities, and build a phased activity timeline that keeps the whole team aligned.',
        prompt:
          'Help me plan an NGO campaign. Define the mission statement, SMART objectives, target beneficiaries, key activities, and a 12-week delivery timeline.',
      },
      funding: {
        title: 'Funding Search',
        subtitle: 'donors · eligibility · deadlines',
        description:
          'Scan donor landscapes, score fit against eligibility criteria, and surface upcoming application windows before they close.',
        prompt:
          'Research funding opportunities for our NGO programme. Identify matching donors (USAID, FCDO, private foundations), their priorities, eligibility requirements, and next deadlines.',
      },
      application: {
        title: 'Funding Application',
        subtitle: 'proposal · log-frame · budget',
        description:
          'Draft proposals with theory of change, log-frames, budget narratives, and risk matrices tailored to each donor template.',
        prompt:
          'Help me write a funding proposal. I need a theory of change, logical framework with indicators, detailed budget narrative, and a risk matrix for submission.',
      },
      cooperation: {
        title: 'NGO Cooperation',
        subtitle: 'partnerships · MoU · joint delivery',
        description:
          'Frame shared objectives, structure collaboration or referral agreements, and coordinate joint reporting with peer organisations.',
        prompt:
          'Draft a cooperation proposal for another NGO. Outline shared objectives, a collaboration model, resource-sharing arrangement, and a joint reporting structure.',
      },
      mne: {
        title: 'M&E and Impact',
        subtitle: 'indicators · data collection · evaluation',
        description:
          'Design indicator frameworks, data-collection instruments, baseline studies, and endline evaluations aligned to OECD-DAC criteria — the evidence backbone of every programme.',
        prompt:
          'Design a monitoring and evaluation framework. Create SMART indicators, data collection instruments, a baseline methodology, and an impact assessment approach aligned to OECD-DAC criteria.',
      },
    },
  },
  'zh-TW': {
    cmdReset: '開始全新對話（目前的工作階段將被封存）',
    cmdCompact: '摘要對話脈絡以釋出空間',
    cmdHelp: '顯示可用指令',
    emptyPrompt: '今天想處理什麼工作？',
    placeholder: '輸入 / 使用指令，或傳送訊息…',
    connected: '已連線',
    disconnected: '已斷線',
    disclaimer: 'Clawix 代理可能會出錯。',
    scenarios: {
      campaign: {
        title: '活動規劃',
        subtitle: '使命 · 目標 · 受益者',
        description:
          '界定使命、訂定 SMART 目標、辨識目標社群，並建立分階段的活動時程，使整個團隊保持一致。',
        prompt:
          '協助我規劃一項 NGO 活動。界定使命宣言、SMART 目標、目標受益者、關鍵活動，以及為期 12 週的執行時程。',
      },
      funding: {
        title: '資金搜尋',
        subtitle: '捐助者 · 申請資格 · 截止日期',
        description: '掃描捐助者概況、依申請資格條件評估契合度，並在申請窗口截止前及時掌握。',
        prompt:
          '研究我們 NGO 計畫的資助機會。辨識相符的捐助者（USAID、FCDO、私人基金會）、其優先事項、申請資格要求，以及下次截止日期。',
      },
      application: {
        title: '資金申請',
        subtitle: '提案 · 邏輯架構 · 預算',
        description: '依各捐助者範本，草擬包含變革理論、邏輯架構、預算說明與風險矩陣的提案。',
        prompt:
          '協助我撰寫一份資金提案。我需要變革理論、含指標的邏輯架構、詳細的預算說明，以及供提交用的風險矩陣。',
      },
      cooperation: {
        title: 'NGO 合作',
        subtitle: '夥伴關係 · 合作備忘錄 · 聯合執行',
        description: '建構共同目標、規劃合作或轉介協議，並與夥伴組織協調聯合報告。',
        prompt:
          '為另一個 NGO 草擬一份合作提案。概述共同目標、合作模式、資源共享安排，以及聯合報告架構。',
      },
      mne: {
        title: '監測評估與成效',
        subtitle: '指標 · 資料蒐集 · 評估',
        description:
          '依 OECD-DAC 準則設計指標架構、資料蒐集工具、基線研究與終線評估，是每項計畫的證據基礎。',
        prompt:
          '設計一套監測與評估架構。建立 SMART 指標、資料蒐集工具、基線方法，以及符合 OECD-DAC 準則的成效評估方式。',
      },
    },
  },
} satisfies Messages<{
  cmdReset: string;
  cmdCompact: string;
  cmdHelp: string;
  emptyPrompt: string;
  placeholder: string;
  connected: string;
  disconnected: string;
  disclaimer: string;
  scenarios: Record<
    'campaign' | 'funding' | 'application' | 'cooperation' | 'mne',
    { title: string; subtitle: string; description: string; prompt: string }
  >;
}>;

type ScenarioKey = 'campaign' | 'funding' | 'application' | 'cooperation' | 'mne';

/* ------------------------------------------------------------------ */
/*  NGO scenario cards                                                 */
/* ------------------------------------------------------------------ */

interface NgoScenario {
  readonly step: string;
  readonly key: ScenarioKey;
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly icons: readonly React.ElementType[];
  readonly accentBorder: string;
  readonly accentBg: string;
  readonly accentText: string;
  readonly shadow: string;
  readonly prompt: string;
  readonly span: 'col-span-1' | 'col-span-2' | 'col-span-3';
}

// Static (non-text) presentation metadata. Visible text is pulled from i18n by key.
// Ordered for the 3-col grid:
//   Row 1 → [01 Campaign (×2)]  [02 Funding Search (×1)]
//   Row 2 → [03 Application (×1)]  [05 Cooperation (×2)]
//   Row 3 → [04 M&E (×3 full)]
interface NgoScenarioMeta {
  readonly step: string;
  readonly key: ScenarioKey;
  readonly icons: readonly React.ElementType[];
  readonly accentBorder: string;
  readonly accentBg: string;
  readonly accentText: string;
  readonly shadow: string;
  readonly span: 'col-span-1' | 'col-span-2' | 'col-span-3';
}

const NGO_SCENARIO_META: readonly NgoScenarioMeta[] = [
  {
    step: '01',
    key: 'campaign',
    icons: [Target, Users, CalendarDays],
    accentBorder: 'border-l-emerald-500/70',
    accentBg: 'hover:bg-emerald-500/10',
    accentText: 'text-emerald-500',
    shadow: 'hover:shadow-[0_8px_32px_-8px_rgba(16,185,129,0.45)]',
    span: 'col-span-2',
  },
  {
    step: '02',
    key: 'funding',
    icons: [Search, Globe],
    accentBorder: 'border-l-sky-500/70',
    accentBg: 'hover:bg-sky-500/10',
    accentText: 'text-sky-500',
    shadow: 'hover:shadow-[0_8px_32px_-8px_rgba(56,189,248,0.45)]',
    span: 'col-span-1',
  },
  {
    step: '03',
    key: 'application',
    icons: [FileText, CheckCircle2],
    accentBorder: 'border-l-amber-500/70',
    accentBg: 'hover:bg-amber-500/10',
    accentText: 'text-amber-500',
    shadow: 'hover:shadow-[0_8px_32px_-8px_rgba(245,158,11,0.45)]',
    span: 'col-span-1',
  },
  {
    step: '05',
    key: 'cooperation',
    icons: [Network, Users],
    accentBorder: 'border-l-rose-500/70',
    accentBg: 'hover:bg-rose-500/10',
    accentText: 'text-rose-500',
    shadow: 'hover:shadow-[0_8px_32px_-8px_rgba(244,63,94,0.45)]',
    span: 'col-span-2',
  },
  {
    step: '04',
    key: 'mne',
    icons: [BarChart3, TrendingUp, ClipboardList],
    accentBorder: 'border-l-violet-500/70',
    accentBg: 'hover:bg-violet-500/10',
    accentText: 'text-violet-500',
    shadow: 'hover:shadow-[0_8px_32px_-8px_rgba(139,92,246,0.45)]',
    span: 'col-span-3',
  },
];

function NgoScenarioCard({
  scenario,
  onClick,
}: {
  scenario: NgoScenario;
  onClick: () => void;
}) {
  const isFull = scenario.span === 'col-span-3';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group cursor-pointer rounded-lg border border-l-[3px] bg-muted/40 p-4 text-left',
        'transition-all duration-200 hover:-translate-y-0.5',
        scenario.accentBorder,
        scenario.accentBg,
        scenario.shadow,
        scenario.span,
        isFull ? 'flex flex-row items-center gap-6' : 'flex flex-col gap-3',
      )}
    >
      {/* Icon cluster */}
      <div className={cn('flex shrink-0 items-center gap-2', isFull && 'flex-col')}>
        {scenario.icons.map((Icon, i) => (
          <Icon
            key={i}
            className={cn(
              'transition-transform duration-200 group-hover:scale-110',
              i === 0
                ? cn('size-6', scenario.accentText)
                : 'size-4 text-muted-foreground/50',
            )}
          />
        ))}
      </div>

      {/* Text block */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className={cn('font-mono text-[10px] font-semibold', scenario.accentText)}>
            {scenario.step}
          </span>
          <span className="text-sm font-semibold leading-tight">{scenario.title}</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">
          {scenario.subtitle}
        </span>
        <p className="line-clamp-2 text-xs text-muted-foreground">{scenario.description}</p>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  EmptyState                                                         */
/* ------------------------------------------------------------------ */

export function EmptyState({ onSelectSuggestion }: { onSelectSuggestion: (text: string) => void }) {
  const t = useT(messages);
  const scenarios: NgoScenario[] = NGO_SCENARIO_META.map((meta) => ({
    ...meta,
    title: t.scenarios[meta.key].title,
    subtitle: t.scenarios[meta.key].subtitle,
    description: t.scenarios[meta.key].description,
    prompt: t.scenarios[meta.key].prompt,
  }));

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-6">
      <div className="flex flex-col items-center gap-2">
        <div className="flex size-12 items-center justify-center rounded-full border border-foreground/20 bg-muted">
          <Bot className="size-6" />
        </div>
        <p className="text-sm text-muted-foreground">{t.emptyPrompt}</p>
      </div>

      <div className="grid w-full max-w-[768px] grid-cols-3 gap-2.5">
        {scenarios.map((s) => (
          <NgoScenarioCard
            key={s.step}
            scenario={s}
            onClick={() => onSelectSuggestion(s.prompt)}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ChatInput                                                          */
/* ------------------------------------------------------------------ */

export function ChatInput({
  onSend,
  disabled,
  isConnected,
  userMessages = [],
}: {
  onSend: (content: string) => boolean | void;
  disabled: boolean;
  isConnected: boolean;
  userMessages?: string[];
}) {
  const t = useT(messages);
  const builtinCommands: SlashItem[] = useMemo(
    () => [
      { name: '/reset', description: t.cmdReset, type: 'command' },
      { name: '/compact', description: t.cmdCompact, type: 'command' },
      { name: '/help', description: t.cmdHelp, type: 'command' },
    ],
    [t],
  );
  const [value, setValue] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  // Skills fetched from the API; builtin commands are localized and merged below.
  const [skillItems, setSkillItems] = useState<SlashItem[]>([]);
  const slashItems = useMemo(
    () => [...skillItems, ...builtinCommands],
    [skillItems, builtinCommands],
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const historyIndexRef = useRef(-1);
  const savedInputRef = useRef('');
  // User messages in reverse order (most recent first) for history navigation
  const inputHistory = userMessages;
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch skills and merge with builtin commands
  useEffect(() => {
    void authFetch<{ data: { name: string; description: string }[] }>('/api/v1/skills')
      .then((res) => {
        const skills: SlashItem[] = (Array.isArray(res.data) ? res.data : []).map((s) => ({
          name: `/${s.name}`,
          description: s.description,
          type: 'skill' as const,
        }));
        setSkillItems(skills);
      })
      .catch(() => {
        /* keep builtin commands only */
      });
  }, []);

  // Filter commands based on current input
  const filteredCommands = value.startsWith('/')
    ? slashItems.filter((cmd) => cmd.name.toLowerCase().startsWith(value.toLowerCase()))
    : [];

  // Show/hide command menu based on input
  useEffect(() => {
    if (value.startsWith('/') && !value.includes(' ') && filteredCommands.length > 0) {
      setShowCommands(true);
      setSelectedCommandIndex(0);
    } else {
      setShowCommands(false);
    }
  }, [value, filteredCommands.length]);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, []);

  function selectCommand(command: string) {
    setValue(command);
    setShowCommands(false);
    textareaRef.current?.focus();
  }

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled || !isConnected) return;

    // Check if this is a skill invocation (not a builtin command)
    const matchedSkill = slashItems.find(
      (item) => item.type === 'skill' && trimmed.toLowerCase().startsWith(item.name.toLowerCase()),
    );
    let sent: boolean | void;
    if (matchedSkill) {
      const skillName = matchedSkill.name.slice(1); // remove leading /
      const args = trimmed.slice(matchedSkill.name.length).trim();
      const prompt = args
        ? `Use the ${skillName} skill to help me: ${args}`
        : `Use the ${skillName} skill to help me. Guide me step by step.`;
      sent = onSend(prompt);
    } else {
      sent = onSend(trimmed);
    }

    // Keep input text if send failed (e.g. disconnected)
    if (sent === false) return;

    historyIndexRef.current = -1;
    savedInputRef.current = '';

    setValue('');
    setShowCommands(false);
    // Reset textarea height after send
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }

  return (
    <div className="px-6 pb-2">
      <div className="relative mx-auto max-w-[768px]">
        {/* Slash command menu */}
        {showCommands && filteredCommands.length > 0 && (
          <div className="absolute bottom-full left-0 z-50 mb-2 w-full rounded-xl border bg-popover p-1 shadow-lg">
            {filteredCommands.map((cmd, i) => (
              <button
                key={cmd.name}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                  i === selectedCommandIndex
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-muted',
                )}
                onMouseEnter={() => {
                  setSelectedCommandIndex(i);
                }}
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent textarea blur
                  selectCommand(cmd.name);
                }}
              >
                {cmd.type === 'skill' && (
                  <Wrench className="size-3.5 shrink-0 text-muted-foreground" />
                )}
                <span className="shrink-0 font-mono font-medium">{cmd.name}</span>
                <span className="truncate text-muted-foreground">{cmd.description}</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2 rounded-3xl bg-muted p-2">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder={t.placeholder}
            className="flex-1 resize-none bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              autoResize();
            }}
            onKeyDown={(e) => {
              if (showCommands && filteredCommands.length > 0) {
                if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setSelectedCommandIndex((prev) =>
                    prev > 0 ? prev - 1 : filteredCommands.length - 1,
                  );
                  return;
                }
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setSelectedCommandIndex((prev) =>
                    prev < filteredCommands.length - 1 ? prev + 1 : 0,
                  );
                  return;
                }
                if (e.key === 'Tab') {
                  e.preventDefault();
                  selectCommand(filteredCommands[selectedCommandIndex]!.name);
                  return;
                }
                if (e.key === 'Escape') {
                  e.preventDefault();
                  setShowCommands(false);
                  return;
                }
              }
              // Input history: ArrowUp/Down when not in slash menu
              if (e.key === 'ArrowUp' && !showCommands && inputHistory.length > 0) {
                if (historyIndexRef.current === -1) {
                  savedInputRef.current = value;
                }
                const nextIndex = Math.min(historyIndexRef.current + 1, inputHistory.length - 1);
                if (nextIndex !== historyIndexRef.current || historyIndexRef.current === -1) {
                  historyIndexRef.current = nextIndex;
                  setValue(inputHistory[nextIndex]!);
                  e.preventDefault();
                }
                return;
              }
              if (e.key === 'ArrowDown' && !showCommands && historyIndexRef.current >= 0) {
                e.preventDefault();
                const nextIndex = historyIndexRef.current - 1;
                historyIndexRef.current = nextIndex;
                if (nextIndex < 0) {
                  setValue(savedInputRef.current);
                } else {
                  setValue(inputHistory[nextIndex]!);
                }
                return;
              }
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (showCommands && filteredCommands.length > 0) {
                  selectCommand(filteredCommands[selectedCommandIndex]!.name);
                  return;
                }
                handleSend();
              }
            }}
          />
          <Button
            size="icon"
            className="size-8 shrink-0 rounded-full"
            disabled={!value.trim() || disabled || !isConnected}
            onClick={handleSend}
          >
            <Send className="size-4" />
          </Button>
        </div>
        {mounted && (
          <p className="py-2 text-center text-xs text-muted-foreground">
            <span
              className={cn(
                'mr-1 inline-block size-2 rounded-full',
                isConnected ? 'animate-pulse bg-green-500' : 'bg-red-500',
              )}
            />
            {isConnected ? t.connected : t.disconnected} &mdash; {t.disclaimer}
          </p>
        )}
      </div>
    </div>
  );
}

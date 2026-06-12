'use client';

import Link from 'next/link';
import { MoreHorizontal, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useT, type Messages } from '@/lib/i18n';

const messages = {
  en: {
    title: 'Scheduled Tasks',
    description: 'Manage recurring and one-time scheduled agent tasks.',
    newTask: 'New Task',
    colName: 'Name',
    colAgent: 'Agent',
    colSchedule: 'Schedule',
    colLastRun: 'Last Run',
    colStatus: 'Status',
    colNextRun: 'Next Run',
    statusSuccess: 'success',
    statusFailed: 'failed',
    edit: 'Edit',
    runNow: 'Run Now',
    enable: 'Enable',
    disable: 'Disable',
    delete: 'Delete',
    scheduleEveryDayAt9: 'Every day at 09:00',
    scheduleEvery2Hours: 'Every 2 hours',
    scheduleEvery30Minutes: 'Every 30 minutes',
  },
  'zh-TW': {
    title: '排程任務',
    description: '管理週期性與一次性的排程代理任務。',
    newTask: '新增任務',
    colName: '名稱',
    colAgent: '代理',
    colSchedule: '排程',
    colLastRun: '上次執行',
    colStatus: '狀態',
    colNextRun: '下次執行',
    statusSuccess: '成功',
    statusFailed: '失敗',
    edit: '編輯',
    runNow: '立即執行',
    enable: '啟用',
    disable: '停用',
    delete: '刪除',
    scheduleEveryDayAt9: '每天 09:00',
    scheduleEvery2Hours: '每 2 小時',
    scheduleEvery30Minutes: '每 30 分鐘',
  },
} satisfies Messages<{
  title: string;
  description: string;
  newTask: string;
  colName: string;
  colAgent: string;
  colSchedule: string;
  colLastRun: string;
  colStatus: string;
  colNextRun: string;
  statusSuccess: string;
  statusFailed: string;
  edit: string;
  runNow: string;
  enable: string;
  disable: string;
  delete: string;
  scheduleEveryDayAt9: string;
  scheduleEvery2Hours: string;
  scheduleEvery30Minutes: string;
}>;

const tasks = [
  {
    id: '1',
    name: 'Daily Report Summary',
    agent: 'Report Generator',
    schedule: 'Every day at 09:00',
    scheduleKey: 'scheduleEveryDayAt9' as const,
    lastRun: '2025-03-07 09:00',
    status: 'success' as const,
    nextRun: '2025-03-08 09:00',
    enabled: true,
  },
  {
    id: '2',
    name: 'Slack Channel Digest',
    agent: 'Support Bot',
    schedule: 'Every 2 hours',
    scheduleKey: 'scheduleEvery2Hours' as const,
    lastRun: '2025-03-07 16:00',
    status: 'success' as const,
    nextRun: '2025-03-07 18:00',
    enabled: true,
  },
  {
    id: '3',
    name: 'Code Quality Scan',
    agent: 'Code Reviewer',
    schedule: '0 2 * * MON',
    scheduleKey: undefined,
    lastRun: '2025-03-03 02:00',
    status: 'failed' as const,
    nextRun: '2025-03-10 02:00',
    enabled: true,
  },
  {
    id: '4',
    name: 'Data Pipeline Check',
    agent: 'Data Analyst',
    schedule: 'Every 30 minutes',
    scheduleKey: 'scheduleEvery30Minutes' as const,
    lastRun: '2025-03-07 16:30',
    status: 'success' as const,
    nextRun: '2025-03-07 17:00',
    enabled: false,
  },
  {
    id: '5',
    name: 'Weekly Competitor Research',
    agent: 'Research Assistant',
    schedule: '0 8 * * FRI',
    scheduleKey: undefined,
    lastRun: '2025-03-07 08:00',
    status: 'success' as const,
    nextRun: '2025-03-14 08:00',
    enabled: true,
  },
];

export default function TasksPage() {
  const t = useT(messages);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t.title}</h1>
          <p className="text-sm text-muted-foreground">{t.description}</p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" />
          {t.newTask}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.colName}</TableHead>
              <TableHead>{t.colAgent}</TableHead>
              <TableHead>{t.colSchedule}</TableHead>
              <TableHead>{t.colLastRun}</TableHead>
              <TableHead>{t.colStatus}</TableHead>
              <TableHead>{t.colNextRun}</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} className={!task.enabled ? 'opacity-50' : undefined}>
                <TableCell className="font-medium">
                  <Link href={`/tasks/${task.id}`} className="hover:underline">
                    {task.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{task.agent}</TableCell>
                <TableCell>
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                    {task.scheduleKey ? t[task.scheduleKey] : task.schedule}
                  </code>
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">{task.lastRun}</TableCell>
                <TableCell>
                  <Badge variant={task.status === 'success' ? 'secondary' : 'destructive'}>
                    {task.status === 'success' ? t.statusSuccess : t.statusFailed}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">
                  {task.enabled ? task.nextRun : '--'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>{t.edit}</DropdownMenuItem>
                      <DropdownMenuItem>{t.runNow}</DropdownMenuItem>
                      <DropdownMenuItem>{task.enabled ? t.disable : t.enable}</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">{t.delete}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

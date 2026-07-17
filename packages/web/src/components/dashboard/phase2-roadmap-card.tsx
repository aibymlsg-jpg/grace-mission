import { Map } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface RoadmapItem {
  readonly title: string;
  readonly eta?: string;
}

const NEXT_UP: readonly RoadmapItem[] = [
  { title: 'Partners Directory', eta: '~1 wk' },
  { title: 'Mission Trip Fields', eta: '~1 wk' },
  { title: 'Kingdom Impact Indicators', eta: '~2–3 wks' },
  { title: 'Evangelism & Outreach Agent', eta: '~2 wks' },
  { title: 'Financial Stewardship & Ledger Export', eta: '~3–4 wks' },
];

const LATER: readonly RoadmapItem[] = [
  { title: 'Scripture & Literacy Tracker' },
  { title: 'Consent & Story Permissions Tracker' },
  { title: 'Game Studio live wiring' },
];

export function Phase2RoadmapCard() {
  return (
    <Card className="gap-3 py-4">
      <CardHeader className="px-4">
        <CardTitle className="flex items-center gap-1.5 text-xs font-semibold">
          <Map className="size-3.5" />
          Phase 2 Roadmap
        </CardTitle>
        <CardDescription className="text-[11px]">Planning estimates, not commitments.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-4 text-xs">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
            Next up
          </span>
          {NEXT_UP.map((item) => (
            <div key={item.title} className="flex items-center justify-between gap-2">
              <span className="truncate">{item.title}</span>
              <Badge variant="outline" className="shrink-0 font-normal">
                {item.eta}
              </Badge>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
            Later
          </span>
          {LATER.map((item) => (
            <span key={item.title} className="truncate text-muted-foreground">
              {item.title}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

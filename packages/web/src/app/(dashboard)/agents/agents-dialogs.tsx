'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, Loader2, Wand2 } from 'lucide-react';

const SYSTEM_PROMPT_TEMPLATE = `You are [role name], a specialist in [domain / expertise].

## Goal
[Primary objective — what you are here to accomplish for the user]

## Tone & style
- Be concise and direct; get to the point in the first sentence
- Match the user's level of expertise — explain jargon when unsure
- Ask one clarifying question at a time when the request is ambiguous

## Tools
- Use \`shell\` to run commands, scripts, and CLI utilities inside the workspace
- Use \`read_file\` / \`write_file\` / \`edit_file\` to work with workspace files
- Use \`web_search\` when you need current information not in context; use \`web_fetch\` to retrieve a specific URL
- Use \`save_memory\` / \`search_memory\` to persist and recall facts across sessions
- Use \`spawn\` to delegate a sub-task to another agent by name
- Use \`cron\` only when the user explicitly asks to schedule a recurring task

## Constraints
- Never delete files or run destructive commands without explicit confirmation
- Do not guess or fabricate facts; say "I'm not sure" and offer to search instead
- Stay focused on the current task; do not volunteer unrelated changes

## Output format
- Reply in the same language the user writes in
- Wrap all code in fenced code blocks with the language identifier
- For multi-step answers, use numbered steps; for reference lists, use bullets
`.trimEnd();

// ------------------------------------------------------------------ //
//  Available tools reference (shown below the system prompt field)   //
// ------------------------------------------------------------------ //

interface ToolEntry {
  name: string;
  tag: string;
  what: string;
  clarify: string;
  tip: string;
}

interface ToolGroup {
  group: string;
  tools: ToolEntry[];
}

const TOOL_GROUPS: ToolGroup[] = [
  {
    group: 'Shell',
    tools: [
      {
        name: 'shell',
        tag: 'Shell',
        what: 'Runs a command or script inside the agent\'s own isolated Docker container — think of it as a private terminal the agent controls.',
        clarify: 'This does NOT run on your server or host machine. The container is sandboxed (no network, capped CPU/memory, UID 1000). The agent can install packages, compile code, and run scripts — all inside its own box.',
        tip: 'Use shell to run scripts, process data, or call CLI tools. Tell the agent when it should prefer shell over file-io (e.g. "use shell for data processing, file-io for plain text edits").',
      },
    ],
  },
  {
    group: 'File system',
    tools: [
      {
        name: 'read_file',
        tag: 'File',
        what: 'Reads the contents of a file from inside the container\'s /workspace or /skills directory.',
        clarify: 'The agent can only read files within /workspace and /skills — it cannot access arbitrary paths on the host or other users\' workspaces.',
        tip: 'Useful when the agent needs to inspect an existing document before editing. Say "always read a file before editing it" to prevent blind overwrites.',
      },
      {
        name: 'write_file',
        tag: 'File',
        what: 'Creates or completely overwrites a file at the given path inside /workspace.',
        clarify: 'This replaces the entire file. If you only want a small change, prefer edit_file — write_file is for creating new files or full rewrites.',
        tip: 'Tell the agent "use write_file to create new files, edit_file for targeted changes" to keep partial edits safe.',
      },
      {
        name: 'edit_file',
        tag: 'File',
        what: 'Replaces one exact string inside a file with new text — like a precise find-and-replace.',
        clarify: 'The old_string must appear exactly once in the file. If it appears zero or multiple times the edit is rejected. This is intentional — it prevents accidental mass-replacement.',
        tip: 'Safer than write_file for modifying existing documents. Instruct the agent to "prefer edit_file for modifications to existing files".',
      },
      {
        name: 'list_directory',
        tag: 'File',
        what: 'Lists the files and subdirectories under a given path (defaults to /workspace).',
        clarify: 'This is read-only — it never creates or modifies files. The agent uses it to orient itself before reading or writing.',
        tip: 'Helpful at the start of a task ("first list the directory to understand what exists").',
      },
    ],
  },
  {
    group: 'Web',
    tools: [
      {
        name: 'web_search',
        tag: 'Web',
        what: 'Queries a search engine and returns a ranked list of results (title, URL, snippet).',
        clarify: 'The agent does NOT browse the web automatically. It only calls web_search when it decides to — controlled by your system prompt. Results are snippets, not full page content.',
        tip: 'Tell the agent when it should and shouldn\'t search: "use web_search for current events or information that may have changed since your training".',
      },
      {
        name: 'web_fetch',
        tag: 'Web',
        what: 'Fetches a specific URL and returns the readable text content of that page.',
        clarify: 'web_fetch is for a known URL; web_search is for discovering URLs. Fetching is blocked for private/internal IPs (SSRF protection) — it is for public web pages only.',
        tip: 'Pair with web_search: search first to find the right URL, then fetch to read the full content.',
      },
    ],
  },
  {
    group: 'Memory',
    tools: [
      {
        name: 'save_memory',
        tag: 'Memory',
        what: 'Stores a labelled note or fact that persists across all future sessions for this user.',
        clarify: 'Memory is scoped to the individual user — it is NOT shared with other users by default, and it does NOT carry over between different agents unless you explicitly share it.',
        tip: 'Tell the agent what kinds of things to remember: "save the user\'s preferences, decisions, and key facts when asked".',
      },
      {
        name: 'search_memory',
        tag: 'Memory',
        what: 'Searches saved memories by keyword or tag and returns matching items.',
        clarify: 'The agent doesn\'t recall memories automatically — it must call search_memory to look them up. Without this call, it has no access to past sessions.',
        tip: 'Instruct the agent to "always search memory at the start of a new task to check for relevant context".',
      },
      {
        name: 'share_memory',
        tag: 'Memory',
        what: 'Shares a saved memory item with a group or the entire organisation so other users can access it.',
        clarify: 'Sharing is explicit and one-way — a shared memory is visible to the target group but the agent cannot read other users\' private memories.',
        tip: 'Use for team knowledge: "when the user says \'share this with the team\', use share_memory to publish it org-wide".',
      },
    ],
  },
  {
    group: 'Agents',
    tools: [
      {
        name: 'spawn',
        tag: 'Agent',
        what: 'Creates a new sub-agent container, sends it a task prompt, waits for it to finish, and returns its output.',
        clarify: 'Sub-agents are NOT created automatically. The agent only spawns one when it decides to call this tool. Each spawned agent is ephemeral — it does not retain memory after the task ends.',
        tip: 'Use for parallelisable or specialised work: "use spawn to delegate research tasks to the Research agent while you draft the outline".',
      },
    ],
  },
  {
    group: 'Scheduling',
    tools: [
      {
        name: 'cron',
        tag: 'Cron',
        what: 'Creates, lists, or deletes a recurring scheduled task that will trigger the agent at set intervals.',
        clarify: 'cron does not make the agent run continuously in the background. It registers a schedule; the agent is invoked fresh each time the schedule fires, with only the cron prompt as input.',
        tip: 'Only wire this up when the user explicitly asks for automation: "use cron only when the user asks to schedule a recurring task — always confirm the schedule before creating it".',
      },
    ],
  },
];

function ToolsReference() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  const toggleTool = (name: string) =>
    setExpandedTool((prev) => (prev === name ? null : name));

  return (
    <div className="rounded-md border text-xs">
      <button
        type="button"
        onClick={() => setPanelOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2 text-muted-foreground hover:text-foreground"
      >
        <span className="font-medium">Available tools — click any tool to understand it</span>
        <ChevronDown
          className={`size-3.5 transition-transform ${panelOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {panelOpen && (
        <div className="border-t px-3 pb-3 pt-2">
          <p className="mb-3 text-muted-foreground">
            These are the capabilities your agent can invoke. Reference them by name in the system prompt to guide when and how the agent uses each one.
          </p>
          <div className="flex flex-col gap-1">
            {TOOL_GROUPS.map(({ group, tools }) => (
              <div key={group} className="mb-1">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group}
                </p>
                {tools.map((t) => {
                  const isOpen = expandedTool === t.name;
                  return (
                    <div key={t.name} className="rounded-md border mb-1 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleTool(t.name)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-muted/50"
                      >
                        <code className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">
                          {t.name}
                        </code>
                        <span className="flex-1 text-muted-foreground">{(t.what.split(' — ')[0] ?? t.what).slice(0, 72)}{t.what.length > 72 ? '…' : ''}</span>
                        <ChevronDown
                          className={`size-3 shrink-0 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {isOpen && (
                        <div className="border-t bg-muted/20 px-3 py-2 flex flex-col gap-2">
                          <p className="text-foreground">{t.what}</p>
                          <div className="rounded bg-amber-50 border border-amber-200 px-2 py-1.5 dark:bg-amber-950/30 dark:border-amber-800">
                            <span className="font-semibold text-amber-700 dark:text-amber-400">Common misconception: </span>
                            <span className="text-amber-800 dark:text-amber-300">{t.clarify}</span>
                          </div>
                          <div className="rounded bg-blue-50 border border-blue-200 px-2 py-1.5 dark:bg-blue-950/30 dark:border-blue-800">
                            <span className="font-semibold text-blue-700 dark:text-blue-400">System prompt tip: </span>
                            <span className="text-blue-800 dark:text-blue-300">{t.tip}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { authFetch } from '@/lib/auth';
import type { ApiAgent } from './agents-list';

// ------------------------------------------------------------------ //
//  Provider data                                                      //
// ------------------------------------------------------------------ //

interface ProviderInfo {
  name: string;
  displayName: string;
  defaultModel: string;
  models: string[];
}

function useProviders() {
  const [providers, setProviders] = useState<ProviderInfo[]>([]);

  useEffect(() => {
    void authFetch<{ data: ProviderInfo[] }>('/api/v1/agents/providers')
      .then((res) => {
        setProviders(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {});
  }, []);

  return providers;
}

// ------------------------------------------------------------------ //
//  Provider + Model selects (linked)                                  //
// ------------------------------------------------------------------ //

function ProviderModelFields({
  providers,
  defaultProvider,
  defaultModel,
  idPrefix,
}: {
  providers: ProviderInfo[];
  defaultProvider?: string;
  defaultModel?: string;
  idPrefix: string;
}) {
  const [selectedProvider, setSelectedProvider] = useState(
    defaultProvider ?? providers[0]?.name ?? '',
  );
  const currentProvider = providers.find((p) => p.name === selectedProvider);
  const models = currentProvider?.models ?? [];

  // Set default provider when providers load
  useEffect(() => {
    if (!selectedProvider && providers.length > 0) {
      setSelectedProvider(defaultProvider ?? providers[0]!.name);
    }
  }, [providers, defaultProvider, selectedProvider]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${idPrefix}-provider`}>Provider</Label>
        <select
          name="provider"
          id={`${idPrefix}-provider`}
          className="rounded-md border bg-background px-3 py-2 text-sm"
          value={selectedProvider}
          onChange={(e) => {
            setSelectedProvider(e.target.value);
          }}
        >
          {providers.map((p) => (
            <option key={p.name} value={p.name}>
              {p.displayName}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`${idPrefix}-model`}>Model</Label>
        <Input
          id={`${idPrefix}-model`}
          name="model"
          list={`${idPrefix}-model-suggestions`}
          placeholder={currentProvider?.defaultModel || 'model-name'}
          defaultValue={defaultModel ?? currentProvider?.defaultModel ?? ''}
          required
        />
        {models.length > 0 && (
          <datalist id={`${idPrefix}-model-suggestions`}>
            {models.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        )}
        <p className="text-xs text-muted-foreground">
          Type any model name. Predefined models appear as suggestions.
        </p>
      </div>
    </>
  );
}

// ------------------------------------------------------------------ //
//  Create Agent Dialog                                                //
// ------------------------------------------------------------------ //

export function CreateAgentDialog({
  open,
  onOpenChange,
  saving,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saving: boolean;
  onSubmit: (form: FormData) => void;
}) {
  const providers = useProviders();
  const [streamingEnabled, setStreamingEnabled] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) setSystemPrompt('');
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Agent</DialogTitle>
          <DialogDescription>
            Define a new AI agent with its model, prompt, and skills.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            fd.set('streamingEnabled', String(streamingEnabled));
            onSubmit(fd);
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="create-name">Name</Label>
            <Input id="create-name" name="name" placeholder="Research Assistant" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="create-description">Description</Label>
            <textarea
              id="create-description"
              name="description"
              rows={2}
              className="rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Optional description of this agent"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="create-systemPrompt">System Prompt</Label>
              <button
                type="button"
                onClick={() => setSystemPrompt(SYSTEM_PROMPT_TEMPLATE)}
                className="flex items-center gap-1 rounded px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Wand2 className="size-3" />
                Use template
              </button>
            </div>
            <textarea
              id="create-systemPrompt"
              name="systemPrompt"
              rows={10}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="rounded-md border bg-background px-3 py-2 font-mono text-sm leading-relaxed"
              placeholder={`You are [role], a specialist in [domain].\n\n## Goal\n[What this agent is here to accomplish]\n\n## Tone & style\n[Concise, expert, friendly — pick what fits]\n\n## Tools\n[When and how to use shell, file-io, web search]\n\n## Constraints\n[What to never do]\n\n## Output format\n[Code blocks, numbered steps, language matching]`}
              required
            />
            <p className="text-xs text-muted-foreground">
              A good system prompt covers: <span className="font-medium text-foreground">role</span>, <span className="font-medium text-foreground">goal</span>, <span className="font-medium text-foreground">tone</span>, <span className="font-medium text-foreground">tools</span>, <span className="font-medium text-foreground">constraints</span>, and <span className="font-medium text-foreground">output format</span>. Click &ldquo;Use template&rdquo; to start from a scaffold.
            </p>

            <ToolsReference />
          </div>

          {/* Role is always worker for user-created agents; primary is system-only */}
          <input type="hidden" name="role" value="worker" />

          <ProviderModelFields providers={providers} idPrefix="create" />

          <div className="flex flex-col gap-2">
            <Label htmlFor="create-apiBaseUrl">API Base URL</Label>
            <Input
              id="create-apiBaseUrl"
              name="apiBaseUrl"
              placeholder="https://api.example.com/v1"
            />
            <p className="text-xs text-muted-foreground">
              Optional. Override the default API endpoint for this provider.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="create-maxTokensPerRun">Max Tokens per Run</Label>
            <Input
              id="create-maxTokensPerRun"
              name="maxTokensPerRun"
              type="number"
              defaultValue={100000}
              min={1000}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="create-skillIds">Skill IDs</Label>
            <Input id="create-skillIds" name="skillIds" placeholder="Comma-separated skill IDs" />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="create-streamingEnabled" className="text-base">
                Streaming
              </Label>
              <p className="text-sm text-muted-foreground">
                Send each reasoning step as a separate message. When off, the user receives one
                combined reply at the end of the run.
              </p>
            </div>
            <Switch
              id="create-streamingEnabled"
              checked={streamingEnabled}
              onCheckedChange={setStreamingEnabled}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              Create Agent
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ------------------------------------------------------------------ //
//  Edit Agent Dialog                                                  //
// ------------------------------------------------------------------ //

export function EditAgentDialog({
  agent,
  onOpenChange,
  saving,
  onSubmit,
}: {
  agent: ApiAgent | null;
  onOpenChange: (open: boolean) => void;
  saving: boolean;
  onSubmit: (id: string, form: FormData) => void;
}) {
  const providers = useProviders();
  const [streamingEnabled, setStreamingEnabled] = useState(agent?.streamingEnabled ?? false);

  if (!agent) return null;

  return (
    <Dialog open={agent !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Agent</DialogTitle>
          <DialogDescription>Update settings for {agent.name}.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            fd.set('streamingEnabled', String(streamingEnabled));
            onSubmit(agent.id, fd);
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input id="edit-name" name="name" defaultValue={agent.name} required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-description">Description</Label>
            <textarea
              id="edit-description"
              name="description"
              rows={2}
              className="rounded-md border bg-background px-3 py-2 text-sm"
              defaultValue={agent.description}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-systemPrompt">System Prompt</Label>
            <textarea
              id="edit-systemPrompt"
              name="systemPrompt"
              rows={6}
              className="rounded-md border bg-background px-3 py-2 text-sm"
              defaultValue={agent.systemPrompt}
              required
            />
          </div>

          {/* Role cannot be changed; primary is system-only, workers stay workers */}
          <div className="flex flex-col gap-2">
            <Label>Role</Label>
            <p className="text-sm text-muted-foreground">
              {agent.role === 'primary' ? 'Primary (system)' : 'Worker (Sub-Agent)'}
            </p>
            <input type="hidden" name="role" value={agent.role} />
          </div>

          <ProviderModelFields
            providers={providers}
            defaultProvider={agent.provider}
            defaultModel={agent.model}
            idPrefix="edit"
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-apiBaseUrl">API Base URL</Label>
            <Input
              id="edit-apiBaseUrl"
              name="apiBaseUrl"
              defaultValue={agent.apiBaseUrl ?? ''}
              placeholder="https://api.example.com/v1"
            />
            <p className="text-xs text-muted-foreground">
              Optional. Override the default API endpoint for this provider.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-maxTokensPerRun">Max Tokens per Run</Label>
            <Input
              id="edit-maxTokensPerRun"
              name="maxTokensPerRun"
              type="number"
              defaultValue={agent.maxTokensPerRun ?? 100000}
              min={1000}
            />
          </div>

          {agent.role !== 'primary' && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-isActive">Status</Label>
              <select
                name="isActive"
                id="edit-isActive"
                className="rounded-md border bg-background px-3 py-2 text-sm"
                defaultValue={agent.isActive ? 'true' : 'false'}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="edit-streamingEnabled" className="text-base">
                Streaming
              </Label>
              <p className="text-sm text-muted-foreground">
                Send each reasoning step as a separate message. When off, the user receives one
                combined reply at the end of the run.
              </p>
            </div>
            <Switch
              id="edit-streamingEnabled"
              checked={streamingEnabled}
              onCheckedChange={setStreamingEnabled}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

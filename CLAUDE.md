# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm run dev              # Start API (:3001) + Web (:3000) with hot-reload
pnpm run build            # Build all packages
pnpm run lint             # ESLint + TypeScript type-check
pnpm run lint:fix         # Auto-fix lint issues
pnpm run format           # Prettier write
pnpm run typecheck        # Type-check only (builds shared + generates Prisma first)

# Testing
pnpm run test                            # Run all tests
pnpm run test:coverage                   # Tests with coverage (80% threshold enforced)
vitest run packages/api/src/engine/__tests__/agent-runner.service.test.ts  # Single test file

# Database
pnpm run db:migrate       # Prisma migrate dev + generate
pnpm run db:seed          # Seed initial data (reads .env for provider keys)
pnpm run db:studio        # Prisma Studio GUI
pnpm run db:reset         # Reset and re-migrate (destructive)

# Infrastructure (local dev)
pnpm run docker:dev       # Start Postgres (5433), Redis, pgAdmin
pnpm run docker:dev:down  # Stop local infra
```

**Before running `typecheck` or `build`**, `@clawix/shared` must be built first — the root `typecheck` script handles this automatically, but if running per-package, run `pnpm --filter @clawix/shared run build` first.

## Architecture

Clawix is a **self-hosted multi-agent AI orchestration platform** — every agent runs in its own isolated Docker container. The system is a pnpm monorepo with two live packages:

- **`packages/api`** — NestJS 11 + Fastify server; handles all orchestration, auth, channels, engine, and database access.
- **`packages/web`** — Next.js 15 + Tailwind + shadcn/ui admin dashboard.
- **`packages/shared`** — cross-package types, Zod schemas, provider interfaces, and the logger. Must be built before API/web type-check.

### Core Engine (`packages/api/src/engine/`)

The engine is the critical path for every agent invocation:

1. **`AgentRunnerService`** — entry point; acquires a warm container from `ContainerPoolService`, builds context, and drives the reasoning loop.
2. **`ReasoningLoop`** — multi-turn LLM loop: calls provider → receives `assistant` or `tool_call` → dispatches to `ToolRegistry` → feeds result back. Terminates on text-only response or max iterations.
3. **`ContextBuilderService`** — assembles the system prompt each turn: agent SOUL.md + USER.md bootstrap files + skills manifest + visible memory items (capped ~2000 tokens).
4. **`SessionManagerService`** — one active session per `(userId, agentDefinitionId, channelId)`; persists `SessionMessage` with monotonic ordering; supports compaction.
5. **`MemoryConsolidationService`** — triggers when a session exceeds 65,536 tokens; summarizes with an LLM; falls back to raw archival after 3 LLM failures.
6. **`ContainerPoolService` + `ContainerRunner`** — Docker-CLI-based container lifecycle; warm pool for primary agents (~50ms cold start); sub-agents are ephemeral. Hardened: UID 1000, `--network none`, PID 256, no-new-privileges, CPU 0.5/mem 512 MB.
7. **`CronSchedulerService`** — polls every 30s for due `Task` rows; `CronGuardService` enforces concurrency (20 global, 2 per user) and auto-disables tasks after 3 consecutive failures.

### Tool Registry (`packages/api/src/engine/tools/`)

Tools are registered TypeScript modules — not MCP (MCP is pending). Current tools: `shell`, `file-io`, `memory`, `spawn` (creates sub-agent containers), `cron`, `web` (fetch + search). All tool invocations run inside the agent container, never on the host.

### Channel System (`packages/api/src/channels/`)

Channels are pluggable adapters translating platform events into `InboundMessage` / `OutboundMessage`:

- **`ChannelManagerService`** — lifecycle (start/stop/reload); delivers async agent output back via Redis pub/sub.
- **`MessageRouterService`** — user lookup → auth check → command detection → concurrency guard (one run/user) → `AgentRunner`.
- **Telegram** (`grammy`, polling default or webhook) — supports voice messages (transcribed via OpenAI Whisper) with TTS replies.
- **Web** — WebSocket gateway on `/ws/chat` with JWT auth.
- **WhatsApp** — via `@whiskeysockets/baileys`.

### Invariants

- **No direct LLM calls outside the engine** — all provider calls go through `engine/providers/*` for token accounting.
- **No agent code on the host** — agents execute exclusively inside Docker sandboxes.
- **Append-only audit log** — `AuditLog` rows have no update/delete API surface.
- **Zod-validated inputs at the API boundary** — all request bodies go through Zod schemas in `packages/shared/src/schemas`.
- **Encrypted secrets** — provider API keys and channel secrets (e.g. `bot_token`) are AES-256-GCM encrypted via `PROVIDER_ENCRYPTION_KEY`.

### Configuration precedence

DB-backed config (cached 60s) → env vars → defaults. Required production env vars: `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `PROVIDER_ENCRYPTION_KEY`, `CORS_ALLOWED_ORIGINS`. See `docs/SPEC.md §4` for the full table.

## Code Conventions

- **TypeScript strict mode** — `strict: true`, `noUncheckedIndexedAccess`, `noUnusedLocals/Parameters`. No `any`.
- **Conventional commits** — `feat:`, `fix:`, `refactor:`, `docs:`, etc.
- **File size limit** — keep files under 400 LOC.
- **ESM throughout** — all packages use `"type": "module"`; use `.js` extensions in imports even for `.ts` source files (Node16 module resolution).
- **Shared logger** — use `createLogger('module:name')` from `@clawix/shared`, not `console.*`.
- **Skills** — builtin skills live in `skills/builtin/`; user-created skills in `skills/custom/`. Skills are loaded by `SkillLoaderService` at agent boot.

## Testing Notes

Tests use Vitest with SWC. Integration tests in `packages/api/src/__tests__/` require a running database — unit tests in subdirectory `__tests__/` folders mock dependencies. Coverage threshold is 80% across lines/functions/branches/statements.

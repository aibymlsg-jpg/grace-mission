<p align="center">
  <h1 align="center">Clawix for NGOs</h1>
  <p align="center">
    <strong>Your organisation's own team of AI assistants.</strong>
    <br />
    They help you draft proposals, reports, newsletters and plans — while keeping your data private and always leaving the final decision to a person.
  </p>
</p>

---

> **Who this guide is for**
>
> This page is written for the people who **use** Clawix every day — programme staff, fundraisers, M&E officers, communications teams and field coordinators. **You do not need to be technical.** If you can send a message in a chat app, you can use Clawix.
>
> If you are the person who *installs or maintains* Clawix on a server, skip to [**For administrators**](#for-administrators-technical-setup) at the bottom.

---

## What is Clawix?

Clawix gives your NGO a small **team of AI assistants** that work the way your real team does. Instead of one generic chatbot, you get a coordinator at the "front desk" and five specialists behind it — each trained for a specific part of NGO work.

You talk to them in plain language, the same way you'd brief a colleague. They do the heavy lifting — research, first drafts, structuring data — and hand the result back to **you** to review, finish and send.

Three promises sit underneath everything Clawix does:

- 🧑‍⚖️ **A human is always in charge.** Clawix only ever produces *drafts*. It never sends an email, posts to social media, or submits anything to a donor on its own. A person always presses "send".
- 🔒 **Your data stays yours.** Clawix runs on your organisation's own server. Beneficiary names and personal details are deliberately kept out of its memory.
- ✅ **It won't make things up.** If a figure or fact is missing, the assistants mark it clearly (e.g. `[FILL: 2024 beneficiary count]`) rather than inventing a number.

---

## Meet your AI team

At the front desk is the **NGO Programme Assistant**. This is who you talk to. You describe what you need in everyday words, and it quietly hands the job to the right specialist — one at a time — then brings the result back to you. You rarely need to talk to the specialists directly.

| The specialist | Think of them as… | Ask them for… |
| --- | --- | --- |
| **Programme Coordinator** | Your planning and tracking officer | Workplans, partner lists, activity trackers, weekly status notes |
| **Donor Engagement** | Your fundraising and grants officer | Proposals, donor reports, log-frames, and research into who might fund you |
| **Monitoring & Evaluation** | Your data and results officer | SMART indicators, data-collection forms, checking data quality, dashboard summaries |
| **Communications** | Your storytelling and outreach officer | Newsletters, social media posts, op-eds, advocacy briefs |
| **Field Operations** | Your logistics and safety officer | Logistics lists, risk registers, and writing up incident records *after* a person has handled the situation |

Each specialist has been given a set of **best-practice guides** ("skills") to read before it drafts — for example, how donors like FCDO, USAID and ECHO expect proposals to be structured, or the data-protection rules for handling sensitive information. So you're not just getting generic text; you're getting drafts that follow the standards your sector expects.

---

## Getting started in 4 steps

### 1. Open Clawix

Your administrator will give you one of these:

- **A web address** (for example `https://clawix.your-ngo.org`) — open it in any browser, just like a normal website.
- **A Telegram bot** — open Telegram, search for the bot name they gave you, and start a chat.

### 2. Sign in

Use the email and password your administrator set up for you. (On Telegram, your account is linked for you — just start chatting.)

### 3. Say hello to the Programme Assistant

In the web dashboard, open **Conversations** and choose the **NGO Programme Assistant**. On Telegram, just send a message. A simple "Hi, what can you help me with?" is a fine way to start.

### 4. Ask in plain English

Describe what you need the way you'd ask a colleague. You don't need special commands or keywords. For example:

> *"Find donors for a water and sanitation programme in West Africa."*
> → The assistant researches funders and saves a shortlist for you to review.

> *"Design SMART indicators for a livelihoods programme."*
> → You get a ready-to-edit set of indicators following M&E best practice.

> *"Draft this month's newsletter using our recent activity updates."*
> → A first draft of the newsletter, written in accessible, dignity-preserving language.

> *"Write a workplan for the next quarter for our girls' education project."*
> → A structured quarterly plan you can refine with your team.

---

## Where your work is saved

Everything the assistants produce is saved as **drafts** in a tidy set of folders set up for your organisation — for example `proposals/`, `reports/`, `mne/`, `comms/drafts/`, `field-ops/` and so on. You'll find the draft waiting there (and in the conversation) so you can open it, edit it, and finish it your way.

Nothing in those "drafts" folders has been sent anywhere. Sending — to a donor, a mailing list, or social media — is always a deliberate step **you** take.

---

## The ground rules that keep you safe

These rules are built into Clawix. Knowing them helps you trust what it gives you:

1. **Drafts only — a human always sends.** Emails, donor submissions, and social posts are prepared for you, never sent automatically.
2. **Beneficiary privacy is protected.** Personal details of the people you serve are kept out of the assistants' memory. When incidents are written up, real names are replaced with pseudonyms; the key linking them is kept separate and is people-only.
3. **Safeguarding comes first.** Field Operations will **not** handle a safeguarding disclosure or make first-contact decisions. A trained person deals with the situation; the assistant only helps *document* it afterwards, and mandatory-reporting flags can't be quietly removed.
4. **No invented facts or figures.** Missing data is flagged for you to fill in, not guessed.
5. **One specialist at a time.** The Programme Assistant routes each request to a single specialist — there's no uncontrolled chain of agents acting on their own.
6. **Everything is logged.** Each action is recorded in a tamper-evident activity log, so there's always a clear trail of what was done.

---

## What Clawix will *not* do

So there are no surprises, Clawix deliberately **does not**:

- Send emails, submit proposals, or publish posts on its own.
- Store or remember beneficiaries' personal information.
- Make safeguarding or protection *decisions* — that's always a person's job.
- Invent statistics, quotes, or results to fill a gap.
- Act on a story without consent — beneficiary stories are only used when the source is marked as shareable.

---

## Tips for getting great results

- **Be specific.** "Draft a 2-page concept note for a $50,000 girls' education project in rural Kenya" beats "write a proposal".
- **Point to context.** Mention the programme, the donor, or the time period so the assistant uses the right material.
- **Review every draft.** Treat it as a strong first draft from a capable colleague — your judgement and local knowledge make it final.
- **Fill in the `[FILL: …]` marks.** These are deliberate prompts where only you have the real number or detail.
- **Ask follow-ups.** "Make it shorter", "use a more formal tone", or "add a risk section" all work in the same conversation.

---

## Getting help

- **Something looks wrong, or you're stuck?** Contact whoever set Clawix up for your organisation (your administrator or IT focal point).
- **Want a new kind of assistant or skill?** Those can be added — pass the request to your administrator.

---
---

## For administrators (technical setup)

> The section above is for everyday users. The rest of this document is for the person installing or maintaining Clawix on a server.

Clawix is a **self-hosted multi-agent AI orchestration platform**: every agent runs in its own isolated Docker container, with full audit logging, role-based access, token budgets, and encrypted secrets. It's a pnpm monorepo (`packages/api` — NestJS + Fastify; `packages/web` — Next.js dashboard; `packages/shared`).

**Full guides:**
- **Server / cloud deployment (DigitalOcean, domains, SSL):** see [`DO_deploy.md`](DO_deploy.md)
- **Codebase architecture & developer commands:** see [`CLAUDE.md`](CLAUDE.md) and [`docs/`](docs/)

### Install (first run)

```bash
# Clone, then run the interactive installer — it generates .env
# (secrets, DB password), builds the images, and starts the stack.
git clone https://github.com/aibyml-ngo/clawix-ngo.git clawixngo
cd clawixngo
pnpm run install:clawix
```

There is also a one-step bootstrapper that clones *and* installs: `./setup-clawix.sh` (interactive) or `./setup-clawix.sh --auto --provider anthropic --api-key sk-ant-xxx` (unattended). Use it for **first-time installs only** — never for updates.

### Update / restart

```bash
pnpm run update:clawix              # rebuild + restart
pnpm run update:clawix -- --pull    # git pull --ff-only, then rebuild + restart
pnpm run update:clawix -- --no-build # plain restart, reuse existing images
```

Your `.env`, the `postgres_data` volume, and `redis_data` are preserved across updates.

### Uninstall

```bash
pnpm run uninstall:clawix            # remove containers/images/volumes, keep host data
pnpm run uninstall:clawix -- --full  # also remove .env, ./data/, ./skills/custom/
```

### Seed the NGO configuration

The NGO team (five specialists + Programme Assistant) and the workspace folder structure are created by:

```bash
node scripts/seed-ngo-agents.mjs    # create the five NGO specialist agents
node scripts/setup-ngo.mjs          # seed the 28-folder workspace + skill files
```

All NGO reference material (agent definitions, skill packages, architecture notes) lives under `reference/Clawix SKILL and Agent/`.

### Local development

```bash
pnpm install
cp .env.example .env                 # set PROVIDER_ENCRYPTION_KEY, provider key, etc.
pnpm --filter @clawix/shared run build
docker build -t clawix-agent:latest -f infra/docker/agent/Dockerfile .
pnpm run docker:dev                  # Postgres (5433) + Redis
pnpm run db:migrate && pnpm run db:seed
pnpm run dev                         # API on :3001, dashboard on :3000
```

### Supported AI providers

| Provider | Status |
| --- | --- |
| Anthropic (Claude) | Available |
| OpenAI (GPT) | Available |
| Z.AI Coding (GLM) | Available |
| Any OpenAI-compatible endpoint (Ollama, vLLM, …) | Available |
| Azure, DeepSeek, Gemini, Kimi, OpenRouter | Planned |

### Channels

| Channel | Status |
| --- | --- |
| Web dashboard | Available |
| Telegram | Available |
| WhatsApp, Slack | Planned |

---

## NGO configuration reference

A complete multi-agent setup for small-to-mid-size NGOs (10–80 staff, multi-donor, often field-based). All reference files live under `reference/Clawix SKILL and Agent/`.

### The five specialist agents

Created via `scripts/seed-ngo-agents.mjs` — each with `role: worker`, `isOfficial: true`, `model: claude-sonnet-4-5`:

| Agent | Responsibility | Tools | Reads skills |
|---|---|---|---|
| `program-coordinator` | Workplan, partner register, activity tracker, weekly status notes | Read, Write, Edit, Grep, Glob | safeguarding, ngo-comms |
| `donor-engagement` | Proposals, narrative reports, log-frames, donor research | Read, Write, Edit, Grep, Glob, WebSearch (domain-allowlisted) | donor-proposal, grant-research, impact-report, data-protection |
| `monitoring-evaluation` | SMART indicators, data-collection forms, period validation, dashboard summaries | Read, Write, Edit, Grep, Glob, Bash (read-only allowlist) | mne, data-protection |
| `communications` | Newsletters, social posts, op-eds, advocacy briefs | Read, Write, Edit, Grep, Glob | ngo-comms, data-protection |
| `field-operations` | Logistics lists, risk register, safeguarding incident records (post-triage only) | Read, Write, Edit, Grep, Glob | safeguarding, data-protection |

### The NGO Programme Assistant (orchestrator)

The user-facing agent. It knows all five specialists, when to spawn each, the full workspace layout, and enforces the security principles:

- Routes requests to exactly one specialist at a time — no autonomous agent-to-agent chaining
- Enforces the PII boundary (beneficiary data never enters agent memory)
- Applies safeguarding-first logic (field-ops is documentation-only, after human triage)
- All outbound actions (email, donor submission, social post) are draft-only; a human sends
- Every agent action appends to `.clawix/audit.log` (append-only)

### Workspace layout

Seeded via `scripts/setup-ngo.mjs` and `packages/api/prisma/setup-ngo.ts`:

- **28 folders** at `data/users/<userId>/workspace/`: `plans/`, `programs/`, `partners/`, `activities/`, `donors/`, `proposals/`, `reports/`, `mne/` (`raw/`, `processed/`, `quality/`, `indicators/`, `forms/`), `field-ops/`, `incidents/`, `comms/`, `finance/`, `briefs/`, `drafts/`, `status/`, `skills/`
- **7 skill files** copied from `reference/` into `workspace/skills/`
- `.clawix/audit.log` initialised (append-only)
- A workspace `README.md` explaining the layout and agent roster

### Skill packages

Read-only reference packages — encoded best practice the relevant agent reads before drafting. They grant no new tool access.

| Skill | Agent | Content |
|---|---|---|
| `donor-proposal/SKILL.md` | donor-engagement | Drafting order (Theory of Change → log-frame → activities → budget → risk → sustainability); indicator alignment for FCDO, USAID, ECHO, GAC, SDC, BMZ, private foundations; common rejection reasons |
| `mne/SKILL.md` | monitoring-evaluation | SMART indicator YAML template; baseline/midline/endline structure; OECD-DAC evaluation criteria; data-validation rules; anonymization recipe |
| `safeguarding/SKILL.md` | field-operations, program-coordinator | PSEA principles, child safeguarding, incident triage decision tree, mandatory reporting triggers, record structure with pseudonym convention |
| `data-protection/SKILL.md` | monitoring-evaluation, donor-engagement, communications, field-operations | GDPR + ICRC/IASC guidance; `pii: true` convention; consent capture; anonymization steps |
| `impact-report/SKILL.md` | donor-engagement | Narrative report structure by donor type; financial reporting touchpoints; beneficiary story consent rules; variance reporting standard |
| `grant-research/SKILL.md` | donor-engagement | Donor scanning checklist; eligibility filters; deadline tracking; fit-scoring rubric (1–5) |
| `ngo-comms/SKILL.md` | communications, program-coordinator | Accessible language standards; do-no-harm storytelling; dignity-preserving imagery; advocacy framing; status-note classification |

### Architecture docs

| File | Purpose |
|---|---|
| `reference/Clawix SKILL and Agent/README.md` | Architecture diagram, folder layout rationale, deployment runbook, operating rules for staff, what the configuration does not do |
| `reference/Clawix SKILL and Agent/PROPOSAL.md` | Strategic case; 10 non-negotiable security principles; full agent + skill roster; MCP connectors (KoboToolbox, PowerBI, Google Drive, Mailchimp — all gated); 90-day impact targets; phased rollout |

---

## Security model

Clawix follows a **zero-trust architecture** for agent execution:

| Threat | Mitigation |
| --- | --- |
| Cross-user data access | Workspaces only mounted into the owner's container |
| Sub-agent privilege escalation | Sub-agents get read-only curated context, never the full workspace |
| Memory poisoning | Agent context regenerated from the database each run |
| Disk exhaustion | Per-user quota enforcement (default 500 MB) |
| Path traversal | All paths validated to stay under `data/org/` |
| Secret leakage | API keys encrypted at rest (AES-256-GCM) |
| Untrusted code execution | All agent code runs inside sandboxed containers, never on the host |

---

## Acknowledgments

Clawix builds on ideas from [nanoClaw](https://github.com/qwibitai/nanoclaw) (container-isolated agent execution) and [nanobot](https://github.com/HKUDS/nanobot) (multi-provider AI design patterns).

## License

This project is **dual-licensed**:

- **Core Clawix platform** — [MIT License](LICENSE). Free to use, modify, and distribute, including commercially.
- **NGO-specific components** — [PolyForm Noncommercial License 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0). Noncommercial use only — but the PolyForm Noncommercial terms expressly permit charities, educational institutions, public research/health/safety bodies, environmental organizations, and governments, so **NGOs and nonprofits may use them freely.**

See the [NOTICE](NOTICE) file for the exact list of paths covered by each license. The NGO directories (`reference/Clawix SKILL and Agent/`, `skills/ARIA/`, `skills/builtin/aria-foundation/`) also carry their own local `LICENSE` files.

---

<p align="center">
  <sub>Built for organisations that need AI agents they can actually trust.</sub>
</p>

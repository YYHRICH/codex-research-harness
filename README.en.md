# Codex Research Harness

A lightweight Codex-native Harness for research coding, experiment hygiene, and
small-change review discipline.

This project is a research-oriented adaptation of
[Harness Starter](https://github.com/chenklein26-maker/Harness-Starter). The
original project is licensed under the MIT License.

## What It Keeps Small

The core Harness stays intentionally minimal:

- persistent Codex guidance in `AGENTS.md`
- reusable workflows in `.codex/skills/`
- project state in `.codex/harness-state.json`
- deterministic checks in `scripts/`
- review reports in `.codex/reviews/`

Research-specific behavior should be added as focused skills instead of making
the core Harness heavy.

## Included Skills

- `harness-mode`: switch or inspect the current Harness mode and phase.
- `harness-review`: run the local review script and summarize the report.

Planned research skills can be added later, for example `research-review`,
`experiment-runner`, or `paper-sync`.

## Commands

Run from the repository root:

```bash
node scripts/check-codex.mjs
node scripts/codex-harness-review.mjs
```

## Current Structure

```text
.
├── AGENTS.md
├── .codex/
│   ├── harness-state.json
│   └── skills/
│       ├── harness-mode/
│       └── harness-review/
├── scripts/
│   ├── check-codex.mjs
│   └── codex-harness-review.mjs
├── .github/workflows/harness-check.yml
├── LICENSE
└── package.json
```

## Attribution

Based on the original Harness Starter by chenklein26-maker:

https://github.com/chenklein26-maker/Harness-Starter

This adaptation removes Claude-specific hook files and keeps a Codex-first,
skill-based workflow for research projects.

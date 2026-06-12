# Codex Research Harness

A lightweight Codex-native Harness for research coding, experiment hygiene, and
small-change review discipline.

This project is a research-oriented adaptation of
[Harness Starter](https://github.com/chenklein26-maker/Harness-Starter). The
original project is licensed under the MIT License.

## Current Scope

`v0.2.0` is still a small Harness foundation, not a full research automation
system.

It provides:

- persistent Codex guidance in `AGENTS.md`
- reusable workflows in `.codex/skills/`
- project state in `.codex/harness-state.json`
- deterministic local checks in `scripts/`
- GitHub Actions health checks
- a first research-focused review skill

Future research behavior should continue to be added as focused skills instead
of making the core Harness heavy.

## Included Skills

- `harness-mode`: switch or inspect the current Harness mode and phase.
- `harness-review`: run the general local review script and summarize the report.
- `research-review`: run research-focused checks for experiment artifacts,
  checkpoints, local absolute paths, and possible oracle or target-label usage.

Planned skills can be added later, for example `experiment-runner` or
`paper-sync`.

## Commands

Run from the repository root:

```bash
node scripts/check-codex.mjs
node scripts/codex-harness-review.mjs
node scripts/research-harness-review.mjs
```

## Current Structure

```text
.
|-- AGENTS.md
|-- .codex/
|   |-- harness-state.json
|   `-- skills/
|       |-- harness-mode/
|       |-- harness-review/
|       `-- research-review/
|-- scripts/
|   |-- check-codex.mjs
|   |-- codex-harness-review.mjs
|   `-- research-harness-review.mjs
|-- .github/workflows/harness-check.yml
|-- LICENSE
`-- package.json
```

## Attribution

Based on the original Harness Starter by chenklein26-maker:

https://github.com/chenklein26-maker/Harness-Starter

This adaptation removes Claude-specific hook files and keeps a Codex-first,
skill-based workflow for research projects.

# Codex Research Harness

This repository is a lightweight Codex-native research Harness adapted from the
original Harness Starter template. Keep the core small and put specialized
research workflows into focused `.codex/skills/` entries.

## Project Purpose

Codex Research Harness provides reusable guardrails for research coding:

- persistent project instructions
- protected-file rules
- small-change review habits
- session/change review reports
- a clean place to add research-specific skills

For Codex, persistent repo guidance belongs in this `AGENTS.md`. Reusable task
workflows belong in `.codex/skills/`. Mechanical checks are exposed as scripts
under `scripts/`.

## Codex Entrypoints

- `AGENTS.md`: durable repo instructions for Codex.
- `.codex/harness-state.json`: current Harness mode and phase.
- `.codex/skills/harness-mode/SKILL.md`: workflow for switching mode/phase.
- `.codex/skills/harness-review/SKILL.md`: workflow for running a review.
- `scripts/check-codex.mjs`: verifies the Codex adaptation is present.
- `scripts/codex-harness-review.mjs`: writes a review report to `.codex/reviews/`.

## Common Commands

Run these from the repository root:

```bash
node scripts/check-codex.mjs
node scripts/codex-harness-review.mjs
```

No Claude-specific hook or check files are part of this cleaned Codex version.

## Behavior Rules

Think before coding:

- State important assumptions when they affect the implementation.
- Ask only when local context cannot resolve a risky ambiguity.
- Prefer the existing project style over new abstractions.

Keep changes small:

- Edit only files needed for the current task.
- Avoid unrelated refactors.
- Keep generated reports and metadata out of commits unless requested.

Protect sensitive files:

- Do not edit `.env`, `.env.local`, or other secret-bearing files unless the
  user explicitly asks for it.
- Prefer documenting required environment variables in an example file.

Verify work:

- Run the narrowest useful check after changes.
- If a check cannot run, report why and what remains unverified.

## Harness Modes

Mode is stored in `.codex/harness-state.json`.

- `full`: normal review, all checks enabled.
- `hotfix`: urgent fix mode, relaxed line/file-count warnings.
- `tweak`: minimal mode, only sensitive-file protection is emphasized.

Phase is also stored there:

- `design`: planning or exploratory work.
- `build`: normal implementation.
- `fix`: bug-fix work with tighter scope expectations.

Use the `harness-mode` skill when the user asks for `/harness-mode`,
`/harness-phase`, or `/harness-status`.

## Research Skill Direction

Keep `harness-mode` and `harness-review` generic. Add research behavior as
separate skills, such as `research-review`, `experiment-runner`, or
`paper-sync`, when those workflows become concrete.

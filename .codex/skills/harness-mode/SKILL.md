---
name: harness-mode
description: Switch the Codex Harness workflow mode or phase for this project. Use when the user enters /harness-mode, /harness-phase, or /harness-status.
---
# Harness Mode

Manage `.codex/harness-state.json`.

## Supported Commands

```text
/harness-mode full
/harness-mode hotfix
/harness-mode tweak
/harness-phase design
/harness-phase build
/harness-phase fix
/harness-status
```

## State Rules

Default state:

```json
{
  "phase": "build",
  "mode": "full",
  "since": "2026-06-03T00:00:00Z"
}
```

When switching mode:

- `full`: keep the current phase unless the user says otherwise.
- `hotfix`: set `mode` to `hotfix` and `phase` to `fix`.
- `tweak`: set `mode` to `tweak` and `phase` to `design`.

When switching phase:

- Update only `phase`.
- Keep the current `mode`.

Always update `since` to the current ISO timestamp.

## Workflow

1. Read `.codex/harness-state.json`.
2. If it is missing or invalid, recreate it with the default state.
3. Apply the requested mode or phase change.
4. Write the updated JSON with two-space indentation.
5. Reply with the active phase, mode, and the practical effect.

For `/harness-status`, read the file and report the current state without editing anything.

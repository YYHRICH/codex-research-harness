# Codex Research Harness Starter

[Chinese](README.zh-CN.md)

Clone once. Let Codex adapt the harness to your research project.

This repository is not a universal research Harness with every discipline baked
in. It is a small Codex-native starter kit that helps Codex inspect a research
project, infer what should be recorded, and generate a project-specific Harness
contract.

This project is a research-oriented adaptation of
[Harness Starter](https://github.com/chenklein26-maker/Harness-Starter). The
original project is licensed under the MIT License.

## How It Works

1. Clone or copy this starter into a research project.
2. Ask Codex to run `research-init`.
3. Review the generated `.codex/research-record.json` draft.
4. Keep or edit the fields that matter for that project.
5. Use `research-review` during development to check experiment hygiene.

The generated contract is intentionally a draft. It should be reviewed by the
user before becoming project policy.

## Current Scope

`v0.3.1` provides:

- persistent Codex guidance in `AGENTS.md`
- reusable workflows in `.codex/skills/`
- project state in `.codex/harness-state.json`
- deterministic local checks in `scripts/`
- GitHub Actions health checks
- adaptive research record initialization
- lightweight research-focused review checks

## Included Skills

- `harness-mode`: switch or inspect the current Harness mode and phase.
- `harness-review`: run the general local review script and summarize the report.
- `research-init`: infer what the current research project should record and
  generate `.codex/research-record.json`.
- `research-review`: check experiment artifacts, checkpoints, local absolute
  paths, and possible oracle or target-label usage.

## Commands

Run from the repository root:

```bash
node scripts/check-codex.mjs
node scripts/research-init.mjs --dry-run
node scripts/research-init.mjs
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
|       |-- research-init/
|       `-- research-review/
|-- scripts/
|   |-- check-codex.mjs
|   |-- codex-harness-review.mjs
|   |-- research-init.mjs
|   `-- research-harness-review.mjs
|-- .github/workflows/harness-check.yml
|-- LICENSE
`-- package.json
```

## Attribution

Based on the original Harness Starter by chenklein26-maker:

https://github.com/chenklein26-maker/Harness-Starter

This adaptation removes Claude-specific hook files and keeps a Codex-first,
skill-based workflow for project-specific research Harness generation.

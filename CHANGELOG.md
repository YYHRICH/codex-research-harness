# Changelog

## v0.2.0

Add the first research-specific review workflow.

- Add `research-review` skill.
- Add `scripts/research-harness-review.mjs`.
- Check changed experiment artifacts, checkpoints, local absolute paths, and possible oracle or label terms.
- Add `review:research` package script.
- Include research review in the Codex health check.
- Include untracked files in review scripts.
- Avoid lockfile warnings for package metadata-only changes.

## v0.1.0

Initial Codex Research Harness MVP.

- Add Codex-first project guidance in `AGENTS.md`.
- Add `harness-mode` and `harness-review` skills.
- Add `.codex/harness-state.json` for mode and phase state.
- Add local health check and review scripts.
- Add GitHub Actions health check.
- Keep MIT attribution to the original Harness Starter project.

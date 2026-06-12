# Changelog

## v0.3.2

Expand README documentation.

- Explain what the Harness does in detail.
- Document the typical clone-and-adapt workflow.
- Describe the generated `.codex/research-record.json` contract.
- Add explicit non-goals and safety boundaries.

## v0.3.1

Clarify project positioning as a project-specific Harness starter.

- Reframe README around clone-and-adapt workflow.
- Emphasize `research-init` as the main adaptation entrypoint.
- Clarify that generated research records are editable drafts, not universal policy.
- Update package description.

## v0.3.0

Add adaptive research record initialization.

- Add `research-init` skill.
- Add `scripts/research-init.mjs`.
- Generate `.codex/research-record.json` drafts from project evidence.
- Infer broad research project types and recommended record fields.
- Add `init:research` package script.
- Include research init in the Codex health check.

## v0.2.1

Repository hygiene and README cleanup.

- Use English `README.md` as the GitHub default.
- Move the Chinese documentation to `README.zh-CN.md`.
- Remove the legacy `README.en.md` naming.
- Add `.gitattributes` to reduce cross-platform line-ending and encoding churn.
- Avoid treating `https://` URLs as Windows absolute paths in research review.

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

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

## What This Harness Does

Codex Research Harness Starter gives Codex a repeatable way to become useful
inside a specific research repository.

It does four things:

1. **Establish project guardrails.**
   `AGENTS.md` tells Codex to keep changes small, protect sensitive files,
   prefer existing project style, and verify work before handoff.

2. **Track the current work mode.**
   `.codex/harness-state.json` records the active mode and phase. The
   `harness-mode` skill lets Codex switch between normal work, hotfixes,
   tweaks, design, build, and fix phases.

3. **Generate a research record contract.**
   `research-init` scans project evidence such as README files, dependencies,
   scripts, directories, notebooks, configs, and paper files. It then creates an
   editable `.codex/research-record.json` draft describing what this project
   should record for reproducibility.

4. **Review changes with research-aware checks.**
   `harness-review` checks general AI-coding risks. `research-review` checks
   research-specific risks such as generated artifacts, checkpoints, local
   absolute paths, and possible oracle or target-label usage.

The generated research contract is a draft. Users should review it before
treating it as project policy.

## Typical Workflow

1. Clone or copy this starter into a research project.
2. Ask Codex: `Run research-init and adapt this Harness to my project.`
3. Preview the generated contract:

   ```bash
   node scripts/research-init.mjs --dry-run
   ```

4. Write the contract:

   ```bash
   node scripts/research-init.mjs
   ```

5. Review `.codex/research-record.json` and edit any unknown or project-specific
   fields.
6. During development, run:

   ```bash
   node scripts/codex-harness-review.mjs
   node scripts/research-harness-review.mjs
   ```

## What `research-init` Generates

`research-init` writes `.codex/research-record.json`.

The draft includes:

- `project_type`: broad inferred type, such as machine learning experiment,
  data analysis, numerical simulation, algorithm research, paper reproduction,
  or generic research project.
- `confidence`: low, medium, or high confidence in the inference.
- `evidence`: project clues used for the inference.
- `record.required`: fields that should usually be recorded.
- `record.optional`: useful but non-mandatory fields.
- `artifacts`: likely metrics, logs, figures, and checkpoint patterns.
- `candidate_commands`: scripts or package commands that may run experiments.
- `unknowns`: items the user should confirm.
- `privacy`: rules for avoiding secrets and machine-local paths.

Example shape:

```json
{
  "status": "draft",
  "project_type": "machine-learning-experiment",
  "confidence": "medium",
  "record": {
    "required": [
      { "name": "command", "why": "Record the exact command used to reproduce a run." },
      { "name": "dataset", "why": "ML results depend on dataset identity and version." },
      { "name": "random_seed", "why": "Seeds affect training stability and metric variance." }
    ],
    "optional": [
      { "name": "hardware", "why": "Useful when results depend on GPU, CPU, memory, or accelerator availability." }
    ]
  }
}
```

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

## What It Does Not Do

- It does not claim to understand every scientific field out of the box.
- It does not make generated contracts authoritative without user review.
- It does not store secrets, tokens, credentials, or private data.
- It does not replace experiment tracking tools; it creates lightweight project
  rules that Codex can follow and review.

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

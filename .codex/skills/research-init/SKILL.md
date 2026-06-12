---
name: research-init
description: Infer a research project's experiment-recording needs and generate a project-specific `.codex/research-record.json` draft. Use when the user asks to initialize research records, adapt Harness to a research project, create an experiment record contract, or decide what a scientific project should record.
---

# Research Init

Run the project-local research init script:

```bash
node scripts/research-init.mjs
```

The script scans project structure, lightweight metadata, docs, dependencies,
and experiment-like scripts. It writes `.codex/research-record.json` unless the
file already exists.

Use preview mode when the user wants to inspect before writing:

```bash
node scripts/research-init.mjs --dry-run
```

Use overwrite only when the user explicitly asks to regenerate:

```bash
node scripts/research-init.mjs --force
```

After running, summarize:

- inferred project type and confidence
- evidence used for the inference
- required record fields
- optional record fields
- unknowns the user should fill in
- whether `.codex/research-record.json` was written or only previewed

Do not invent datasets, metrics, commands, or private paths. If the script marks
a value as `unknown`, keep it unknown and ask the user to refine it later.

---
name: harness-review
description: Run the Codex Harness project review and summarize the generated report. Use when the user asks for a Harness review, session review, or change audit.
---

# Harness Review

Run the project-local Codex review script:

```bash
node scripts/codex-harness-review.mjs
```

Then summarize the most important findings for the user:

- changed file count
- line-count size
- sensitive-file changes
- dependency manifest changes without lockfile changes
- debug residue such as `debugger`, `TODO`, `FIXME`, or `console.*`

The script writes reports to `.codex/reviews/YYYY-MM-DD.md`.

If the script cannot run, inspect the error, fix project-local issues when safe,
and rerun it. If the failure is environmental, tell the user what was not
verified.

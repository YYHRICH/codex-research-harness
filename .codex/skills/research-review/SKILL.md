---
name: research-review
description: Run research-focused Codex Harness checks for experiment hygiene, reproducibility risks, local path leakage, generated artifacts, and possible oracle or target-label usage. Use when the user asks for research review, experiment review, reproducibility audit, leakage audit, or scientific-code change review.
---

# Research Review

Run the project-local research review script:

```bash
node scripts/research-harness-review.mjs
```

Then summarize the most important findings for the user:

- generated result or artifact files changed
- model checkpoint or array/data artifacts changed
- local absolute paths introduced
- possible oracle, ground-truth, target-label, or test-label terms
- result files changed without nearby script/config changes

The script writes reports to `.codex/reviews/research-YYYY-MM-DD.md`.

Treat findings as review prompts, not automatic proof of a bug. If a term is
intentional, explain why it is safe or diagnostic.

If the script cannot run, inspect the error, fix project-local issues when safe,
and rerun it. If the failure is environmental, tell the user what was not
verified.

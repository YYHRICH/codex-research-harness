import { existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

const checks = [];
const has = (path) => existsSync(join(projectRoot, path));

checks.push({
  name: "AGENTS.md",
  ok: has("AGENTS.md"),
  hint: "Codex repo instructions",
});
checks.push({
  name: ".codex/harness-state.json",
  ok: has(".codex/harness-state.json"),
  hint: "Harness mode and phase state",
});
checks.push({
  name: ".codex/skills/harness-mode/SKILL.md",
  ok: has(".codex/skills/harness-mode/SKILL.md"),
  hint: "Mode switching workflow",
});
checks.push({
  name: ".codex/skills/harness-review/SKILL.md",
  ok: has(".codex/skills/harness-review/SKILL.md"),
  hint: "Review workflow",
});
checks.push({
  name: "scripts/codex-harness-review.mjs",
  ok: has("scripts/codex-harness-review.mjs"),
  hint: "Codex review script",
});
checks.push({
  name: ".codex/skills/research-review/SKILL.md",
  ok: has(".codex/skills/research-review/SKILL.md"),
  hint: "Research review workflow",
});
checks.push({
  name: "scripts/research-harness-review.mjs",
  ok: has("scripts/research-harness-review.mjs"),
  hint: "Research review script",
});

if (has(".codex/harness-state.json")) {
  try {
    const state = JSON.parse(readFileSync(join(projectRoot, ".codex/harness-state.json"), "utf-8"));
    checks.push({
      name: "Harness state shape",
      ok: Boolean(state.phase && state.mode && state.since),
      hint: "Expected phase, mode, and since",
    });
  } catch {
    checks.push({
      name: "Harness state JSON",
      ok: false,
      hint: "Invalid JSON",
    });
  }
}

const okCount = checks.filter((check) => check.ok).length;

console.log(`\nCodex Harness check: ${okCount}/${checks.length} passed\n`);
for (const check of checks) {
  console.log(`  ${check.ok ? "OK " : "FAIL"} ${check.name} - ${check.hint}`);
}
console.log("");

if (okCount !== checks.length) {
  process.exit(1);
}

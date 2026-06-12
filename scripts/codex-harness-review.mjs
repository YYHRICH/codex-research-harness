import { execSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const statePath = join(projectRoot, ".codex/harness-state.json");
const reviewsDir = join(projectRoot, ".codex/reviews");

const defaultState = {
  phase: "build",
  mode: "full",
  since: "2026-06-03T00:00:00Z",
};

const readState = () => {
  if (!existsSync(statePath)) return defaultState;
  try {
    return { ...defaultState, ...JSON.parse(readFileSync(statePath, "utf-8")) };
  } catch {
    return defaultState;
  }
};

const run = (cmd) => {
  try {
    return execSync(cmd, {
      cwd: projectRoot,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 8000,
    }).trim();
  } catch {
    return "";
  }
};

const unique = (items) => [...new Set(items.filter(Boolean))];
const isGitRepo = existsSync(join(projectRoot, ".git")) && run("git rev-parse --is-inside-work-tree") === "true";

const state = readState();
const isDesign = state.phase === "design";
const isFix = state.phase === "fix";
const isHotfix = state.mode === "hotfix";
const isTweak = state.mode === "tweak";

const changedFiles = isGitRepo ? unique([
  ...run("git diff --name-only").split("\n"),
  ...run("git diff --cached --name-only").split("\n"),
  ...run("git ls-files --others --exclude-standard").split("\n"),
]) : [];
const untracked = isGitRepo ? run("git ls-files --others --exclude-standard").split("\n").filter(Boolean) : [];
const added = isGitRepo ? unique([
  ...run("git diff --diff-filter=A --name-only").split("\n"),
  ...untracked,
]) : [];
const modified = isGitRepo ? run("git diff --diff-filter=M --name-only").split("\n").filter(Boolean) : [];
const deleted = isGitRepo ? run("git diff --diff-filter=D --name-only").split("\n").filter(Boolean) : [];
const diffStat = isGitRepo ? run("git diff --stat") : "";
const totalInsertions = Number(diffStat.match(/(\d+) insertions?/)?.[1] || 0);
const totalDeletions = Number(diffStat.match(/(\d+) deletions?/)?.[1] || 0);
const totalLines = totalInsertions + totalDeletions;
const diffContent = isGitRepo ? `${run("git diff --unified=0")}\n${run("git diff --cached --unified=0")}` : "";

const sensitivePatterns = [/(^|\/|\\)\.env(\.|$)/, /(^|\/|\\)\.env$/];
const sensitiveChanges = changedFiles.filter((file) =>
  sensitivePatterns.some((pattern) => pattern.test(file))
);

const debugChecks = [
  { label: "console.*", pattern: /console\.\w+\s*\(/ },
  { label: "TODO", pattern: /\bTODO\b/ },
  { label: "FIXME", pattern: /\bFIXME\b/ },
  { label: "debugger", pattern: /\bdebugger\b/ },
];
const debugHits = debugChecks
  .filter((check) => check.pattern.test(diffContent))
  .map((check) => check.label);

const dependencyFiles = ["package.json", "pyproject.toml", "go.mod", "Cargo.toml", "Gemfile"];
const lockFiles = [
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "bun.lock",
  "poetry.lock",
  "go.sum",
  "Cargo.lock",
  "Gemfile.lock",
];
const packageJsonChanged = changedFiles.some((changed) => changed.endsWith("package.json"));
const packageDependencyFieldsChanged = packageJsonChanged && /^[+-]\s*"(dependencies|devDependencies|peerDependencies|optionalDependencies)"\s*:/m.test(diffContent);
const nonPackageDepChanged = dependencyFiles
  .filter((file) => file !== "package.json")
  .some((file) => changedFiles.some((changed) => changed.endsWith(file)));
const depChanged = packageDependencyFieldsChanged || nonPackageDepChanged;
const lockChanged = lockFiles.some((file) => changedFiles.some((changed) => changed.endsWith(file)));

const maxFiles = isFix ? 5 : isDesign ? 20 : 10;
const maxLines = isHotfix || isTweak ? Infinity : 500;

const flags = [];
if (!isGitRepo) flags.push("Not a git repository; change-diff review was skipped");
if (sensitiveChanges.length > 0) flags.push(`Sensitive files changed: ${sensitiveChanges.join(", ")}`);
if (changedFiles.length > maxFiles) flags.push(`Large file scope: ${changedFiles.length} files, limit ${maxFiles}`);
if (totalLines > maxLines) flags.push(`Large diff: ${totalLines} changed lines, limit ${maxLines}`);
if (!isDesign && !isTweak && debugHits.length > 0) flags.push(`Debug residue: ${debugHits.join(", ")}`);
if (!isTweak && depChanged && !lockChanged) flags.push("Dependency manifest changed without a lockfile change");

mkdirSync(reviewsDir, { recursive: true });

const report = [
  "# Codex Harness Review",
  "",
  `Time: ${new Date().toISOString()}`,
  `Mode: ${state.mode}`,
  `Phase: ${state.phase}`,
  `Git repository: ${isGitRepo ? "yes" : "no"}`,
  "",
  "## Change Summary",
  "",
  `Files changed: ${changedFiles.length}`,
  `Added files: ${added.length}`,
  `Modified files: ${modified.length}`,
  `Deleted files: ${deleted.length}`,
  `Diff size: +${totalInsertions}/-${totalDeletions}`,
  "",
  "## Findings",
  "",
  ...(flags.length > 0 ? flags.map((flag) => `- ${flag}`) : ["- No Harness review flags found."]),
  "",
  "## Files",
  "",
  ...(changedFiles.length > 0 ? changedFiles.map((file) => `- ${file}`) : ["- No changed files detected."]),
  "",
].join("\n");

const reportName = `${new Date().toISOString().slice(0, 10)}.md`;
const reportPath = join(reviewsDir, reportName);
writeFileSync(reportPath, report, "utf-8");

console.log(report);
console.log(`Report written: ${reportPath}`);

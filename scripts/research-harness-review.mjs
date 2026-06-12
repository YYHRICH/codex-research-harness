import { execSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const reviewsDir = join(projectRoot, ".codex/reviews");

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

const changedFiles = isGitRepo ? unique([
  ...run("git diff --name-only").split("\n"),
  ...run("git diff --cached --name-only").split("\n"),
  ...run("git ls-files --others --exclude-standard").split("\n"),
]) : [];

const hasExt = (file, extensions) => extensions.some((ext) => file.toLowerCase().endsWith(ext));
const inDir = (file, dirs) => dirs.some((dir) => file.split(/[\\/]/).includes(dir));

const artifactDirs = ["results", "outputs", "runs", "checkpoints", "artifacts", "logs"];
const artifactExts = [".csv", ".tsv", ".xlsx", ".xls", ".png", ".jpg", ".jpeg", ".pdf", ".npy", ".npz", ".pkl"];
const checkpointExts = [".pt", ".pth", ".ckpt", ".onnx", ".safetensors", ".bin"];
const sourceExts = [".py", ".js", ".mjs", ".ts", ".tsx", ".ipynb", ".sh", ".ps1", ".yaml", ".yml", ".json", ".toml"];
const textScanExts = [...sourceExts, ".md", ".txt", ".rst"];

const artifactFiles = changedFiles.filter((file) => inDir(file, artifactDirs) || hasExt(file, artifactExts));
const checkpointFiles = changedFiles.filter((file) => hasExt(file, checkpointExts));
const sourceOrConfigFiles = changedFiles.filter((file) => hasExt(file, sourceExts));
const untrackedFiles = isGitRepo ? run("git ls-files --others --exclude-standard").split("\n").filter(Boolean) : [];
const readableUntracked = untrackedFiles
  .filter((file) => hasExt(file, textScanExts))
  .map((file) => {
    const fullPath = join(projectRoot, file);
    try {
      if (!existsSync(fullPath) || statSync(fullPath).size > 1024 * 1024) return "";
      return `\n--- untracked:${file} ---\n${readFileSync(fullPath, "utf-8")}`;
    } catch {
      return "";
    }
  })
  .join("\n");
const rawDiffContent = isGitRepo
  ? `${run("git diff --unified=0")}\n${run("git diff --cached --unified=0")}`
  : "";
const diffContent = isGitRepo
  ? `${rawDiffContent}\n${readableUntracked}`
  : "";

const localPathChecks = [
  { label: "Windows absolute path", pattern: /(?:^|[^A-Za-z])(?:[A-Za-z]:[\\/][^\s"'`]+)/ },
  { label: "Unix home path", pattern: /\/home\/[A-Za-z0-9_.-]+[^\s"'`]*/ },
  { label: "macOS user path", pattern: /\/Users\/[A-Za-z0-9_.-]+[^\s"'`]*/ },
];
const localPathHits = localPathChecks
  .filter((check) => check.pattern.test(diffContent))
  .map((check) => check.label);

const leakageTerms = [
  "oracle",
  "ground_truth",
  "ground truth",
  "gt_label",
  "target_label",
  "test_label",
  "true_label",
  "y_true",
  "label leakage",
];
const lowerDiff = diffContent.toLowerCase();
const leakageScanText = [];
let currentFile = "";
for (const line of rawDiffContent.split("\n")) {
  const fileMatch = line.match(/^diff --git a\/(.+) b\/(.+)$/);
  if (fileMatch) {
    currentFile = fileMatch[2];
    continue;
  }
  if (!line.startsWith("+") || line.startsWith("+++")) continue;
  if (!hasExt(currentFile, sourceExts)) continue;
  if (currentFile === "scripts/research-harness-review.mjs") continue;
  leakageScanText.push(line.slice(1));
}
for (const file of untrackedFiles) {
  if (!hasExt(file, sourceExts)) continue;
  if (file === "scripts/research-harness-review.mjs") continue;
  const fullPath = join(projectRoot, file);
  try {
    if (existsSync(fullPath) && statSync(fullPath).size <= 1024 * 1024) {
      leakageScanText.push(readFileSync(fullPath, "utf-8"));
    }
  } catch {
    // Ignore unreadable files; the file path still appears in the report.
  }
}
const lowerCodeDiff = leakageScanText.join("\n").toLowerCase();
const leakageHits = leakageTerms.filter((term) => lowerCodeDiff.includes(term));

const flags = [];
if (!isGitRepo) flags.push("Not a git repository; research diff review was skipped");
if (artifactFiles.length > 0) flags.push(`Research artifacts changed: ${artifactFiles.join(", ")}`);
if (checkpointFiles.length > 0) flags.push(`Model/checkpoint artifacts changed: ${checkpointFiles.join(", ")}`);
if (localPathHits.length > 0) flags.push(`Local absolute paths found in diff: ${localPathHits.join(", ")}`);
if (leakageHits.length > 0) flags.push(`Possible oracle/label terms found: ${leakageHits.join(", ")}`);
if (artifactFiles.length > 0 && sourceOrConfigFiles.length === 0) {
  flags.push("Artifacts changed without script/config changes; verify provenance and reproducibility");
}

mkdirSync(reviewsDir, { recursive: true });

const report = [
  "# Codex Research Harness Review",
  "",
  `Time: ${new Date().toISOString()}`,
  `Git repository: ${isGitRepo ? "yes" : "no"}`,
  "",
  "## Change Summary",
  "",
  `Files changed: ${changedFiles.length}`,
  `Research artifacts changed: ${artifactFiles.length}`,
  `Checkpoint artifacts changed: ${checkpointFiles.length}`,
  `Source/config files changed: ${sourceOrConfigFiles.length}`,
  "",
  "## Findings",
  "",
  ...(flags.length > 0 ? flags.map((flag) => `- ${flag}`) : ["- No research review flags found."]),
  "",
  "## Review Prompts",
  "",
  "- Can changed result files be regenerated from committed scripts or configs?",
  "- Are any oracle or label terms restricted to diagnostic code?",
  "- Are local paths replaced with relative paths or documented configuration?",
  "- Should large outputs or checkpoints be excluded from git?",
  "",
  "## Files",
  "",
  ...(changedFiles.length > 0 ? changedFiles.map((file) => `- ${file}`) : ["- No changed files detected."]),
  "",
].join("\n");

const reportName = `research-${new Date().toISOString().slice(0, 10)}.md`;
const reportPath = join(reviewsDir, reportName);
writeFileSync(reportPath, report, "utf-8");

console.log(report);
console.log(`Report written: ${reportPath}`);

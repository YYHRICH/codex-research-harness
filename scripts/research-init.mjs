import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { basename, dirname, extname, join, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const outputPath = join(projectRoot, ".codex/research-record.json");
const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const force = args.has("--force");

const skipDirs = new Set([
  ".git",
  ".codex/reviews",
  "node_modules",
  "__pycache__",
  ".pytest_cache",
  ".venv",
  "venv",
  "dist",
  "build",
]);
const maxFiles = 5000;
const maxReadBytes = 200_000;

const toPosix = (path) => path.replace(/\\/g, "/");
const hasExt = (file, extensions) => extensions.includes(extname(file).toLowerCase());
const fileExists = (path) => existsSync(join(projectRoot, path));

const walk = (dir, files = []) => {
  if (files.length >= maxFiles) return files;
  const relDir = toPosix(relative(projectRoot, dir));
  if (skipDirs.has(relDir) || skipDirs.has(basename(dir))) return files;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    const relPath = toPosix(relative(projectRoot, fullPath));
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else {
      files.push(relPath);
      if (files.length >= maxFiles) break;
    }
  }
  return files;
};

const safeRead = (relPath) => {
  const fullPath = join(projectRoot, relPath);
  try {
    if (!existsSync(fullPath) || statSync(fullPath).size > maxReadBytes) return "";
    return readFileSync(fullPath, "utf-8");
  } catch {
    return "";
  }
};

const files = walk(projectRoot);
const lowerFiles = files.map((file) => file.toLowerCase());
const dirs = new Set(files.flatMap((file) => file.split("/").slice(0, -1)));

const readFirstExisting = (names) => {
  for (const name of names) {
    if (fileExists(name)) return safeRead(name);
  }
  return "";
};

const evidence = [];
const addEvidence = (text) => {
  if (!evidence.includes(text)) evidence.push(text);
};

const docsText = readFirstExisting(["README.md", "README.zh-CN.md", "AGENTS.md"]).toLowerCase();
let packageJson = {};
if (fileExists("package.json")) {
  try {
    packageJson = JSON.parse(safeRead("package.json") || "{}");
  } catch {
    addEvidence("package.json exists but could not be parsed");
  }
}
const packageScripts = packageJson.scripts ? Object.entries(packageJson.scripts).map(([name, cmd]) => `${name}: ${cmd}`) : [];
const dependencyText = [
  safeRead("requirements.txt"),
  safeRead("pyproject.toml"),
  safeRead("environment.yml"),
  safeRead("environment.yaml"),
  safeRead("package.json"),
].join("\n").toLowerCase();

const scores = {
  "machine-learning-experiment": 0,
  "data-analysis": 0,
  "numerical-simulation": 0,
  "algorithm-research": 0,
  "paper-reproduction": 0,
  "research-project": 1,
};

const score = (type, points, reason) => {
  scores[type] += points;
  addEvidence(reason);
};

if (/(torch|tensorflow|keras|sklearn|scikit-learn|xgboost|lightgbm|transformers|pytorch)/.test(dependencyText)) {
  score("machine-learning-experiment", 4, "ML dependencies detected");
}
if (lowerFiles.some((file) => /(^|\/)(train|finetune|evaluate|eval|predict|inference)[._-]/.test(file))) {
  score("machine-learning-experiment", 3, "training or evaluation scripts detected");
}
if ([...dirs].some((dir) => ["data", "datasets", "checkpoints", "models", "weights"].includes(dir.toLowerCase()))) {
  score("machine-learning-experiment", 2, "ML-like data/model directories detected");
}
if (/(pandas|numpy|scipy|seaborn|matplotlib|plotly|statsmodels)/.test(dependencyText)) {
  score("data-analysis", 3, "data analysis dependencies detected");
}
if (lowerFiles.some((file) => hasExt(file, [".ipynb", ".csv", ".tsv", ".xlsx"]))) {
  score("data-analysis", 2, "notebooks or tabular data files detected");
}
if (/(simulation|solver|mesh|boundary|initial condition|convergence|finite element|monte carlo)/.test(docsText + dependencyText)) {
  score("numerical-simulation", 4, "simulation or solver terms detected");
}
if (lowerFiles.some((file) => /(^|\/)(simulate|solver|run_sim|model)[._-]/.test(file))) {
  score("numerical-simulation", 2, "simulation-like scripts detected");
}
if ([...dirs].some((dir) => ["src", "lib", "algorithms", "benchmarks", "tests"].includes(dir.toLowerCase()))) {
  score("algorithm-research", 2, "algorithm or benchmark directories detected");
}
if (/(algorithm|benchmark|baseline|ablation|complexity)/.test(docsText)) {
  score("algorithm-research", 2, "algorithm research terms detected");
}
if (lowerFiles.some((file) => hasExt(file, [".tex", ".bib"]) || file.startsWith("paper/") || file.startsWith("manuscript/"))) {
  score("paper-reproduction", 3, "paper or manuscript files detected");
}
if (/(reproduce|replication|manuscript|table|figure|ablation)/.test(docsText)) {
  score("paper-reproduction", 2, "paper/reproduction terms detected");
}

const sortedTypes = Object.entries(scores).sort((a, b) => b[1] - a[1]);
const [projectType, topScore] = sortedTypes[0];
const confidence = topScore >= 7 ? "high" : topScore >= 4 ? "medium" : "low";

const field = (name, why, source = "inferred") => ({ name, why, source });
const commonRequired = [
  field("command", "Record the exact command used to reproduce a run."),
  field("git_commit", "Tie results to a specific code version."),
  field("environment", "Capture dependencies or environment needed for reproducibility."),
  field("input_data", "Identify the data, dataset, or input files used by the run."),
  field("output_path", "Locate generated results, logs, figures, or artifacts."),
];
const commonOptional = [
  field("notes", "Record human interpretation or caveats."),
  field("runtime", "Help compare cost and detect unexpectedly slow runs."),
  field("hardware", "Useful when results depend on GPU, CPU, memory, or accelerator availability."),
];

const typeFields = {
  "machine-learning-experiment": {
    required: [
      field("dataset", "ML results depend on dataset identity and version."),
      field("data_split", "Train/validation/test boundaries are essential for trustworthy evaluation."),
      field("random_seed", "Seeds affect training stability and metric variance."),
      field("config", "Training hyperparameters and model options must be traceable."),
      field("metrics", "Evaluation metrics are the primary reported outputs."),
    ],
    optional: [
      field("checkpoint_path", "Checkpoints may be needed to reproduce or inspect a model."),
      field("baseline", "Useful when comparing against prior methods."),
    ],
  },
  "data-analysis": {
    required: [
      field("data_source", "Analysis conclusions depend on source data provenance."),
      field("cleaning_steps", "Data cleaning can change downstream results."),
      field("filter_criteria", "Filtering decisions should be auditable."),
      field("statistical_method", "Statistical methods must match the reported claim."),
      field("figure_or_table_outputs", "Figures and tables should be traceable to generated outputs."),
    ],
    optional: [
      field("missing_value_policy", "Missing data handling can materially affect conclusions."),
    ],
  },
  "numerical-simulation": {
    required: [
      field("parameters", "Simulation outputs depend on parameter values."),
      field("initial_conditions", "Initial conditions define the simulated scenario."),
      field("boundary_conditions", "Boundary conditions affect solver behavior."),
      field("solver", "Solver choice and version affect reproducibility."),
      field("convergence_criteria", "Convergence thresholds determine result validity."),
    ],
    optional: [
      field("mesh_or_resolution", "Resolution may affect numerical accuracy."),
    ],
  },
  "algorithm-research": {
    required: [
      field("benchmark", "Algorithm claims need benchmark identity and version."),
      field("baseline", "Comparisons require clear baseline settings."),
      field("parameters", "Algorithm parameters affect reported behavior."),
      field("metrics", "Metrics define how performance is judged."),
      field("random_seed", "Randomized algorithms need seed tracking."),
    ],
    optional: [
      field("complexity_notes", "Useful for interpreting runtime or memory behavior."),
    ],
  },
  "paper-reproduction": {
    required: [
      field("paper_reference", "Reproduction work must identify the source paper."),
      field("claimed_result", "Track which table, figure, or claim is being reproduced."),
      field("implementation_delta", "Record differences from the paper or original code."),
      field("metrics", "Reported numbers must map to exact metric definitions."),
      field("artifact_source", "Figures and tables should trace back to logs or result files."),
    ],
    optional: [
      field("deviation_notes", "Explain acceptable differences from published results."),
    ],
  },
  "research-project": {
    required: [
      field("research_question", "Clarify what the run is intended to answer."),
      field("method", "Record the method or procedure being evaluated."),
      field("parameters", "Capture important settings that affect results."),
      field("outputs", "Identify generated artifacts and result files."),
    ],
    optional: [
      field("limitations", "Record known caveats for later review."),
    ],
  },
};

const selected = typeFields[projectType] || typeFields["research-project"];
const artifactPatterns = {
  metrics: lowerFiles.some((file) => file.includes("result") || file.includes("metric"))
    ? ["results/*.json", "results/*.csv", "metrics/*.json"]
    : ["unknown"],
  logs: lowerFiles.some((file) => file.split("/").includes("logs") || file.endsWith(".log"))
    ? ["logs/*", "runs/*/logs/*"]
    : ["unknown"],
  figures: lowerFiles.some((file) => hasExt(file, [".png", ".jpg", ".jpeg", ".pdf"]))
    ? ["figures/*", "results/*.png", "results/*.pdf"]
    : ["unknown"],
  checkpoints: lowerFiles.some((file) => hasExt(file, [".pt", ".pth", ".ckpt", ".onnx", ".safetensors"]))
    ? ["checkpoints/*", "models/*"]
    : ["unknown"],
};

const candidateCommands = [
  ...packageScripts,
  ...files.filter((file) => /(^|\/)(train|run|eval|evaluate|simulate|experiment)[^/]*\.(py|mjs|js|sh|ps1)$/.test(file))
    .slice(0, 12)
    .map((file) => `script: ${file}`),
];

const contract = {
  schema_version: "0.1",
  generated_by: "codex-research-harness research-init",
  generated_at: new Date().toISOString(),
  status: "draft",
  project_type: projectType,
  confidence,
  evidence: evidence.slice(0, 12),
  record: {
    required: [...commonRequired, ...selected.required],
    optional: [...commonOptional, ...selected.optional],
  },
  artifacts: artifactPatterns,
  candidate_commands: candidateCommands.length > 0 ? candidateCommands : ["unknown"],
  unknowns: [
    "Confirm the real dataset or input source.",
    "Confirm the primary metrics or reported outputs.",
    "Confirm which generated artifacts should be committed, ignored, or archived elsewhere.",
  ],
  privacy: {
    secret_policy: "Do not record secrets, tokens, private credentials, or raw private data.",
    path_policy: "Prefer relative paths or documented configuration over machine-local absolute paths.",
  },
};

const rendered = `${JSON.stringify(contract, null, 2)}\n`;

if (existsSync(outputPath) && !force && !dryRun) {
  console.error(".codex/research-record.json already exists. Use --force to overwrite or --dry-run to preview.");
  process.exit(1);
}

if (!dryRun) {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, rendered, "utf-8");
}

console.log(rendered);
console.log(dryRun ? "Preview only; no file written." : `Research record contract written: ${outputPath}`);

# Codex Research Harness Starter

[English](README.md)

Clone 一次，让 Codex 根据你的科研项目自适应生成项目专属 Harness。

这个仓库不是一个内置所有学科规则的万能科研 Harness。它是一个轻量的 Codex-native 启动模板，用来帮助 Codex 扫描科研项目、推断需要记录的内容，并生成项目专属的 Harness 记录契约。

本项目基于 [Harness Starter](https://github.com/chenklein26-maker/Harness-Starter) 改造，原项目采用 MIT License。

## 这个 Harness 会做什么

Codex Research Harness Starter 给 Codex 提供一套可重复的流程，让它能在具体科研仓库里变得更有用。

它主要做四件事：

1. **建立项目护栏。**
   `AGENTS.md` 告诉 Codex 保持小范围修改、保护敏感文件、优先遵循现有风格，并在交付前验证工作。

2. **记录当前工作模式。**
   `.codex/harness-state.json` 记录当前 mode 和 phase。`harness-mode` skill 可以让 Codex 在正常开发、hotfix、轻量 tweak、design、build、fix 阶段之间切换。

3. **生成科研记录契约。**
   `research-init` 会扫描 README、依赖文件、脚本、目录、notebook、配置和论文文件等项目证据，然后生成可编辑的 `.codex/research-record.json` 草案，说明这个项目为了可复现性应该记录什么。

4. **用科研视角审查改动。**
   `harness-review` 检查通用 AI 编码风险。`research-review` 检查科研项目常见风险，例如实验产物、模型 checkpoint、本机绝对路径，以及可能的 oracle 或 target-label 使用。

生成的科研记录契约默认只是草案。用户确认后，它才应该成为项目规则。

## 典型使用流程

1. 把这个 starter clone 或复制到科研项目中。
2. 对 Codex 说：`Run research-init and adapt this Harness to my project.`
3. 先预览生成的记录契约：

   ```bash
   node scripts/research-init.mjs --dry-run
   ```

4. 写入记录契约：

   ```bash
   node scripts/research-init.mjs
   ```

5. 查看 `.codex/research-record.json`，修改 unknown 或项目专属字段。
6. 开发过程中运行：

   ```bash
   node scripts/codex-harness-review.mjs
   node scripts/research-harness-review.mjs
   ```

## `research-init` 会生成什么

`research-init` 会写入 `.codex/research-record.json`。

草案包括：

- `project_type`：推断的项目大类，例如机器学习实验、数据分析、数值仿真、算法研究、论文复现或通用科研项目。
- `confidence`：推断置信度，分为 low、medium、high。
- `evidence`：用于推断的项目证据。
- `record.required`：通常必须记录的字段。
- `record.optional`：有用但非强制的字段。
- `artifacts`：可能的 metrics、logs、figures、checkpoints 路径模式。
- `candidate_commands`：可能运行实验的脚本或 package 命令。
- `unknowns`：需要用户确认的事项。
- `privacy`：避免记录密钥和本机私有路径的规则。

示例结构：

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

## 当前内置 Skills

- `harness-mode`：切换或查看 Harness mode / phase。
- `harness-review`：运行通用本地审查脚本并总结报告。
- `research-init`：根据当前科研项目生成 `.codex/research-record.json` 记录契约草案。
- `research-review`：检查实验产物、模型权重、本机绝对路径，以及可能的 oracle / target-label 使用。

## 常用命令

在仓库根目录运行：

```bash
node scripts/check-codex.mjs
node scripts/research-init.mjs --dry-run
node scripts/research-init.mjs
node scripts/codex-harness-review.mjs
node scripts/research-harness-review.mjs
```

## 它不会做什么

- 它不会声称开箱即懂所有科研学科。
- 它不会把自动生成的记录契约直接当成权威规则。
- 它不会记录密钥、token、凭据或私有数据。
- 它不会替代实验追踪工具；它提供的是 Codex 可以遵循和审查的轻量项目规则。

## 当前结构

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

本项目是原 [Harness Starter](https://github.com/chenklein26-maker/Harness-Starter) 的 Codex 科研向改造版本。

当前版本已移除 Claude 专用 hook 文件，保留 MIT License，并转为 Codex-first、skill-based 的项目专属科研 Harness 生成流程。

# Codex Research Harness

[English](README.md)

一个轻量的 Codex 科研 Harness，用来约束科研代码修改、保护敏感文件、保持小步变更，并在交付前生成审查报告。

本项目基于 [Harness Starter](https://github.com/chenklein26-maker/Harness-Starter) 改造，原项目采用 MIT License。

## 当前定位

`v0.2.1` 仍然是一个轻量底座，不是完整科研自动化系统。

它提供：

- Codex 项目规则入口：`AGENTS.md`
- 可复用工作流：`.codex/skills/`
- Harness 状态文件：`.codex/harness-state.json`
- 本地检查脚本：`scripts/`
- GitHub CI 健康检查
- 第一个科研专用审查 skill

科研能力后续继续通过专用 skill 扩展，不把核心 Harness 做成复杂大系统。

## 当前内置 Skills

- `harness-mode`：切换或查看 Harness mode / phase。
- `harness-review`：运行通用本地审查脚本并总结报告。
- `research-review`：检查实验产物、模型权重、本机绝对路径，以及可能的 oracle / target-label 使用。

后续可以继续添加：

- `experiment-runner`：运行实验、记录命令和输出。
- `paper-sync`：检查论文数字、图表和结果文件是否一致。

## 常用命令

在仓库根目录运行：

```bash
node scripts/check-codex.mjs
node scripts/codex-harness-review.mjs
node scripts/research-harness-review.mjs
```

## 当前结构

```text
.
|-- AGENTS.md
|-- .codex/
|   |-- harness-state.json
|   `-- skills/
|       |-- harness-mode/
|       |-- harness-review/
|       `-- research-review/
|-- scripts/
|   |-- check-codex.mjs
|   |-- codex-harness-review.mjs
|   `-- research-harness-review.mjs
|-- .github/workflows/harness-check.yml
|-- LICENSE
`-- package.json
```

## Attribution

本项目是原 [Harness Starter](https://github.com/chenklein26-maker/Harness-Starter) 的 Codex 科研向改造版本。

当前版本已移除 Claude 专用 hook 文件，保留 MIT License，并转为 Codex-first、skill-based 的科研开发工作流。

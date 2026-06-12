# Codex Research Harness Starter

[English](README.md)

Clone 一次，让 Codex 根据你的科研项目自适应生成项目专属 Harness。

这个仓库不是一个内置所有学科规则的万能科研 Harness。它是一个轻量的 Codex-native 启动模板，用来帮助 Codex 扫描科研项目、推断需要记录的内容，并生成项目专属的 Harness 记录契约。

本项目基于 [Harness Starter](https://github.com/chenklein26-maker/Harness-Starter) 改造，原项目采用 MIT License。

## 工作流程

1. 把这个 starter clone 或复制到科研项目中。
2. 让 Codex 运行 `research-init`。
3. 查看生成的 `.codex/research-record.json` 草案。
4. 保留或修改当前项目真正需要记录的字段。
5. 开发过程中使用 `research-review` 检查实验产物、路径和可复现风险。

生成的记录契约默认只是草案。用户确认后，它才应该成为项目规则。

## 当前定位

`v0.3.1` 提供：

- Codex 项目规则入口：`AGENTS.md`
- 可复用工作流：`.codex/skills/`
- Harness 状态文件：`.codex/harness-state.json`
- 本地检查脚本：`scripts/`
- GitHub CI 健康检查
- 自适应科研记录初始化
- 轻量科研审查检查

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

# Codex Research Harness

一个轻量的 Codex 科研 Harness，用来约束科研代码修改、保护敏感文件、保持小步变更，并在交付前生成审查报告。

本项目基于 [Harness Starter](https://github.com/chenklein26-maker/Harness-Starter) 改造，原项目采用 MIT License。

## 设计原则

核心 Harness 保持很小，只负责通用底座：

- `AGENTS.md`：Codex 长期项目规则。
- `.codex/skills/`：可复用工作流。
- `.codex/harness-state.json`：当前 mode 和 phase。
- `scripts/`：确定性的本地检查脚本。
- `.codex/reviews/`：审查报告输出目录。

科研能力通过专用 skill 扩展，不把核心 Harness 做成复杂大系统。

## 当前内置 Skills

- `harness-mode`：切换或查看 Harness mode / phase。
- `harness-review`：运行本地审查脚本并总结报告。

后续可以继续添加：

- `research-review`：科研代码和实验可信度审查。
- `experiment-runner`：运行实验、记录命令和输出。
- `paper-sync`：检查论文数字、图表和结果文件是否一致。

## 常用命令

在仓库根目录运行：

```bash
node scripts/check-codex.mjs
node scripts/codex-harness-review.mjs
```

## 当前结构

```text
.
├── AGENTS.md
├── .codex/
│   ├── harness-state.json
│   └── skills/
│       ├── harness-mode/
│       └── harness-review/
├── scripts/
│   ├── check-codex.mjs
│   └── codex-harness-review.mjs
├── .github/workflows/harness-check.yml
├── LICENSE
└── package.json
```

## Attribution

本项目是原 [Harness Starter](https://github.com/chenklein26-maker/Harness-Starter) 的 Codex 科研向改造版本。

当前版本已移除 Claude 专用 hook 文件，保留 MIT License，并转为 Codex-first、skill-based 的科研开发工作流。

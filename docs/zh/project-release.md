# 项目发布指南

本文档介绍 slice-store 基于 [@qlover/fe-release](https://www.npmjs.com/package/@qlover/fe-release) **5.x** 的自动化发布流程（与 pam / fe-base 对齐）。

## 发布概述

```
feature/*  ──PR──►  main  ──fe-release──►  release/*  ──PR──►  main  ──►  npm
                 (+ preRelease)              (+ CI-Release)
```

| 阶段 | 触发条件 | 作用 |
| --- | --- | --- |
| 1. 功能 PR | PR → `main` | `general-check`：lint / test / build |
| 2. 创建 Release PR | 合并到 `main` 且带 **`preRelease`**（或手动 `workflow_dispatch`） | 检测变更包、升版本、写 changelog、打开 `release/*` PR |
| 3. 发布 | `release/*` → `main` 且带 **`CI-Release`** | publish、推 tag、创建 GitHub Release |

> **不要**在功能 PR 上打 `CI-Release`。需要发布时请打 **`preRelease`**。

## 标签

| 标签 | 谁加 | 作用 |
| --- | --- | --- |
| `preRelease` | **手动**（功能 PR） | 合并后触发「创建 Release PR」 |
| `increment:major` / `increment:minor` / `increment:patch` | 可选 | 覆盖默认 patch 递增 |
| `CI-Release` | **系统自动**（挂在 `release/*` PR 上） | 标识发布 PR；合并后触发 publish |

变更包由 **git diff** 检测（相对 PR base SHA）。

也可在 Actions 里手动跑 **Release sub packages**（`workflow_dispatch`），无需 `preRelease`。

## npm Trusted Publishing（OIDC）

发布阶段使用 [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers)，**不再依赖** `NPM_TOKEN`。

CI 侧：`publish` job 使用 `permissions.id-token: write`，并传入 `--changesetVersion.use-trusted-publishing`。

对每个会发布到 npm 的包（`@qlover/slice-store`、`@qlover/slice-store-react`），在 npm 包设置里添加 Trusted Publisher：

| 项 | 值 |
| --- | --- |
| Provider | GitHub Actions |
| Repository | `qlover/slice-store` |
| Workflow filename | `release.yml` |
| Environment | （留空，除非 workflow 绑定了 environment） |

本地 dry-run：

```bash
pnpm dryrun:release
```

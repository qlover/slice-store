# slice-store-monorepo

[English](./README_EN.md) | 简体中文

轻量级状态切片仓库（monorepo）：`@qlover/slice-store` 与 `@qlover/slice-store-react`。

## 发布

基于 [@qlover/fe-release](https://www.npmjs.com/package/@qlover/fe-release) 5.x（与 pam / fe-base 对齐）。

流程：功能 PR 合并到 `main` 时打上 **`preRelease`** → 自动创建 `release/*` PR → 合并带 **`CI-Release`** 的 Release PR 后发布到 npm。

不要在功能 PR 上打 `CI-Release`。需要发布时请打 **`preRelease`**。也可在 Actions 里手动跑 **Release sub packages**（`workflow_dispatch`）。

发布使用 npm Trusted Publishing（OIDC），不再依赖 `NPM_TOKEN`。详见 [项目发布指南](docs/zh/project-release.md)。

## 文档

- [项目发布指南](docs/zh/project-release.md)
- [English docs](docs/en/project-release.md)

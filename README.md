# slice-store-monorepo

简体中文 | [English](./README_EN.md)

轻量级状态切片仓库（monorepo）：`@qlover/slice-store` 与 `@qlover/slice-store-react`。

**本仓库文档默认使用中文。** 英文见 [README_EN.md](./README_EN.md) 与 [docs/en](./docs/en/project-release.md)。

## 包

| 包 | 说明 |
| --- | --- |
| [`@qlover/slice-store`](./packages/slice-store) | 核心 store：`emit` / `observe` / microtask 批处理 |
| [`@qlover/slice-store-react`](./packages/slice-store-react) | React 绑定：`useSliceStore`（基于 `useSyncExternalStore`） |
| [`examples/playground`](./examples/playground) | 与 packages 同级的真实示例应用（不发布） |

## 本地开发

```bash
pnpm install
pnpm test
pnpm build                 # 只构建 packages/*
pnpm dev:playground        # 启动示例台
```

## 发布

基于 [@qlover/fe-release](https://www.npmjs.com/package/@qlover/fe-release) 5.x（与 pam / fe-base 对齐）。

流程：功能 PR 合并到 `main` 时打上 **`preRelease`** → 自动创建 `release/*` PR → 合并带 **`CI-Release`** 的 Release PR 后发布到 npm。

不要在功能 PR 上打 `CI-Release`。需要发布时请打 **`preRelease`**。也可在 Actions 里手动跑 **Release sub packages**（`workflow_dispatch`）。

发布使用 npm Trusted Publishing（OIDC），不再依赖 `NPM_TOKEN`。详见 [项目发布指南](docs/zh/project-release.md)。

## 文档

- [项目发布指南（中文，默认）](docs/zh/project-release.md)
- [Release guide (English)](docs/en/project-release.md)
- [slice-store 包文档](./packages/slice-store/README.md)
- [slice-store-react 包文档](./packages/slice-store-react/README.md)
- [Playground 说明](./examples/playground/README.md)

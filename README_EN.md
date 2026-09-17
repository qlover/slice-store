# slice-store-monorepo

[简体中文](./README.md) | English

Lightweight slice state store monorepo: `@qlover/slice-store` and `@qlover/slice-store-react`.

**Chinese is the default language for this repository.** Prefer [README.md](./README.md) and [docs/zh](./docs/zh/project-release.md).

## Packages

| Package | Description |
| --- | --- |
| [`@qlover/slice-store`](./packages/slice-store) | Core store: `emit` / `observe` / microtask batching |
| [`@qlover/slice-store-react`](./packages/slice-store-react) | React bindings: `useSliceStore` (`useSyncExternalStore`) |
| [`examples/playground`](./examples/playground) | Real demo app sibling to `packages/` (not published) |

## Local development

```bash
pnpm install
pnpm test
pnpm build                 # packages/* only
pnpm dev:playground        # start playground
```

## Release

Based on [@qlover/fe-release](https://www.npmjs.com/package/@qlover/fe-release) 5.x (aligned with pam / fe-base).

Flow: merge a feature PR to `main` with **`preRelease`** → auto-create a `release/*` PR → merge the **`CI-Release`** PR to publish to npm.

Do **not** put `CI-Release` on feature PRs. Use **`preRelease`** when you want a release. You can also run **Release sub packages** manually (`workflow_dispatch`).

Publish uses npm Trusted Publishing (OIDC); `NPM_TOKEN` is not required. See [Chinese release guide](docs/zh/project-release.md) (canonical) or [English](docs/en/project-release.md).

## Docs

- [Project release guide (Chinese, default)](docs/zh/project-release.md)
- [Release guide (English)](docs/en/project-release.md)
- [slice-store package docs](./packages/slice-store/README.md)
- [slice-store-react package docs](./packages/slice-store-react/README.md)
- [Playground](./examples/playground/README.md)

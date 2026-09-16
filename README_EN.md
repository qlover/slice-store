# slice-store-monorepo

[English](./README_EN.md) | [简体中文](./README.md)

Lightweight slice state store monorepo: `@qlover/slice-store` and `@qlover/slice-store-react`.

**Default language for this repository is Chinese.** Prefer [README.md](./README.md) and [docs/zh](./docs/zh/project-release.md).

## Release

Based on [@qlover/fe-release](https://www.npmjs.com/package/@qlover/fe-release) 5.x (aligned with pam / fe-base).

Flow: merge a feature PR to `main` with **`preRelease`** → auto-create a `release/*` PR → merge the **`CI-Release`** PR to publish to npm.

Do **not** put `CI-Release` on feature PRs. Use **`preRelease`** when you want a release. You can also run **Release sub packages** manually (`workflow_dispatch`).

Publish uses npm Trusted Publishing (OIDC); `NPM_TOKEN` is not required. See [Chinese release guide](docs/zh/project-release.md) (canonical) or [English](docs/en/project-release.md).

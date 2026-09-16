# Project Release Guide

This guide describes slice-store’s automated release flow based on [@qlover/fe-release](https://www.npmjs.com/package/@qlover/fe-release) **5.x** (aligned with pam / fe-base).

## Overview

```
feature/*  ──PR──►  main  ──fe-release──►  release/*  ──PR──►  main  ──►  npm
                 (+ preRelease)              (+ CI-Release)
```

| Phase | Trigger | What happens |
| --- | --- | --- |
| 1. Feature PR | PR → `main` | `general-check`: lint / test / build |
| 2. Create Release PR | Merge to `main` with **`preRelease`** (or manual `workflow_dispatch`) | Detect changed packages, bump versions, write changelogs, open `release/*` PR |
| 3. Publish | `release/*` → `main` with **`CI-Release`** | Publish, push tags, create GitHub Releases |

> Do **not** put `CI-Release` on feature PRs. Use **`preRelease`** when you want a release.

## Labels

| Label | Who adds it | Purpose |
| --- | --- | --- |
| `preRelease` | **Manual** (on feature PR) | After merge, triggers “create Release PR” |
| `increment:major` / `increment:minor` / `increment:patch` | Optional | Override default patch bump |
| `CI-Release` | **Auto** (on `release/*` PR) | Marks the release PR; merge triggers publish |

Changed packages are detected via **git diff** (against the PR base SHA).

You can also run **Release sub packages** manually (`workflow_dispatch`) without `preRelease`.

## npm Trusted Publishing (OIDC)

Publish uses [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers); **`NPM_TOKEN` is not required**.

CI: the `publish` job uses `permissions.id-token: write` and `--changesetVersion.use-trusted-publishing`.

For each npm package (`@qlover/slice-store`, `@qlover/slice-store-react`), add a Trusted Publisher in the package settings:

| Field | Value |
| --- | --- |
| Provider | GitHub Actions |
| Repository | `qlover/slice-store` |
| Workflow filename | `release.yml` |
| Environment | (leave empty unless the workflow binds an environment) |

Local dry-run:

```bash
pnpm dryrun:release
```

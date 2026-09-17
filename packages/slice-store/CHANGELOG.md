# @qlover/slice-store

## 1.5.0

### Minor Changes

#### ✨ Features

- **slice-store:** batch emit notifications by microtask ([3ddef6d](https://github.com/qlover/slice-store/commit/3ddef6dde4c30db0931e7d165d193cee14413e8a)) ([#34](https://github.com/qlover/slice-store/pull/34))

  Defer observer notify to a microtask so consecutive sync emits coalesce, and support updater emit plus flush for sync/async-safe updates.

  Co-authored-by: Cursor <cursoragent@cursor.com>

#### 🐞 Bug Fixes

- **slice-store:** 补充 emit updater 重载并修复 eslint ([5108175](https://github.com/qlover/slice-store/commit/5108175f36e3f5a9ce400ae230d538fcb7d20b91)) ([#34](https://github.com/qlover/slice-store/pull/34))

  为 emit 增加 value/updater 重载，调整 eslint 以支持重载与 queueMicrotask，并应用 lint:fix 补全 public 修饰符。

  Co-authored-by: Cursor <cursoragent@cursor.com>

- **nx:** 解除 playground 与 packages 的构建循环依赖 ([b6734d8](https://github.com/qlover/slice-store/commit/b6734d8c48b1297b47a154a153b819a6c88dc515)) ([#34](https://github.com/qlover/slice-store/pull/34))

  将 emit-scenarios 收回 package fixtures，playground 仅再导出；Nx build 只跑 packages，示例不参与 run-many。

  Co-authored-by: Cursor <cursoragent@cursor.com>

#### 📝 Documentation

- 更新中文默认文档并补充 emit 批处理与 playground 说明 ([37bf488](https://github.com/qlover/slice-store/commit/37bf488ba22f33c23e5135aa159b122a759e74a4)) ([#34](https://github.com/qlover/slice-store/pull/34))

  根 README 与两个包 README 默认中文；同步 English 镜像，修正 observe API，并说明 microtask 批处理、updater、useSliceStore 与示例台。

  Co-authored-by: Cursor <cursoragent@cursor.com>

## 1.4.1

### Patch Changes

#### ✨ Features

- maker ([2dcf01b](https://github.com/qlover/slice-store/commit/2dcf01bc6a37c8659e63c7710fc7fb0310de8d77)) ([#22](https://github.com/qlover/slice-store/pull/22))

- add base v1.2.0 code ([51fc29a](https://github.com/qlover/slice-store/commit/51fc29ab46faea1f7092313210d1c0ffa41c2edf)) ([#9](https://github.com/qlover/slice-store/pull/9))

- add pnpm lock ([32a7145](https://github.com/qlover/slice-store/commit/32a71451d9d462bbdbd80e2fe5b57345301c9cd8)) ([#9](https://github.com/qlover/slice-store/pull/9))

- fe-scripts release(packages) ([e5c7d7c](https://github.com/qlover/slice-store/commit/e5c7d7c936d81ad51f5eee7c83b5dd264f5975cb)) ([#9](https://github.com/qlover/slice-store/pull/9))

#### 📝 Documentation

- slice-store readme ([5ee9337](https://github.com/qlover/slice-store/commit/5ee9337166f37e2a0d26e45b25dfc96b8288aae8)) ([#16](https://github.com/qlover/slice-store/pull/16))

#### ♻️ Refactors

- update project structure and configurations ([a9fd645](https://github.com/qlover/slice-store/commit/a9fd6458c0e18cee901d7d6565bf823796b83478)) ([#26](https://github.com/qlover/slice-store/pull/26))
  - Changed frontend release branch from 'main' to 'master' in .env and .env.template files.
  - Updated package.json to reflect new project name and versioning.
  - Added new configuration files for changesets and commitlint.
  - Removed outdated release workflows and added a new unified release workflow.
  - Updated dependencies and scripts for improved build and test processes.
  - Refactored Vite configuration for better test environment setup.
  - Added asset management utilities and Rollup configuration for building packages.
  - Updated README files to reflect new project name and structure.

  Co-authored-by: QRJ <renjie.qin@brain.im>

## <small>1.2.6 (2025-03-25)</small>

- fix: fe release pr no command (#23) ([27d65c7](https://github.com/qlover/slice-store/commit/27d65c7)), closes [#23](https://github.com/qlover/slice-store/issues/23)
- feat: slice store maker (#22) ([f958d0d](https://github.com/qlover/slice-store/commit/f958d0d)), closes [#22](https://github.com/qlover/slice-store/issues/22)

## [1.2.4](https://github.com/qlover/slice-store/compare/slice-store-v1.2.3...slice-store-v1.2.4) (2025-01-16)

### Documentation

- slice-store readme ([#16](https://github.com/qlover/slice-store/issues/16)) ([677e1d5](https://github.com/qlover/slice-store/commit/677e1d591fa1bcd2bfbca13722c44ef229a171d4))

## 1.2.3 (2025-01-16)

### Features

- v1.2.0 ([#9](https://github.com/qlover/slice-store/issues/9)) ([921ff68](https://github.com/qlover/slice-store/commit/921ff686596699a9ff5194a6dc7bff878a690938))

### Bug Fixes

- ci error ([#11](https://github.com/qlover/slice-store/issues/11)) ([7d87588](https://github.com/qlover/slice-store/commit/7d87588118532f0ebad239739f1173e43bd5378c))

## 1.2.1 (2025-01-16)

### Features

- v1.2.0 ([#9](https://github.com/qlover/slice-store/issues/9)) ([921ff68](https://github.com/qlover/slice-store/commit/921ff686596699a9ff5194a6dc7bff878a690938))

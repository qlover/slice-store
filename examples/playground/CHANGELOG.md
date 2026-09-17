# @qlover/slice-store-playground

## 0.1.0

### Minor Changes

#### 🐞 Bug Fixes

- **nx:** 解除 playground 与 packages 的构建循环依赖 ([b6734d8](https://github.com/qlover/slice-store/commit/b6734d8c48b1297b47a154a153b819a6c88dc515)) ([#34](https://github.com/qlover/slice-store/pull/34))

  将 emit-scenarios 收回 package fixtures，playground 仅再导出；Nx build 只跑 packages，示例不参与 run-many。

  Co-authored-by: Cursor <cursoragent@cursor.com>

#### 📝 Documentation

- 更新中文默认文档并补充 emit 批处理与 playground 说明 ([37bf488](https://github.com/qlover/slice-store/commit/37bf488ba22f33c23e5135aa159b122a759e74a4)) ([#34](https://github.com/qlover/slice-store/pull/34))

  根 README 与两个包 README 默认中文；同步 English 镜像，修正 observe API，并说明 microtask 批处理、updater、useSliceStore 与示例台。

  Co-authored-by: Cursor <cursoragent@cursor.com>

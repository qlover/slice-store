# slice-store 示例台

与 `packages` 同级的真实示例应用，用于本地手动验证 `@qlover/slice-store` / `@qlover/slice-store-react`。

不参与 npm 发布；Nx / CI 的库构建也不会包含本应用。

## 启动

在 monorepo 根目录：

```bash
pnpm install
pnpm dev:playground
# 或
pnpm --filter @qlover/slice-store-playground dev
```

默认 <http://localhost:5173>。Vite 已将 workspace 包指到源码，改 packages 后刷新即可验证。

## 包含

- **计数器**：基础 React 订阅与更新
- **多次 emit**：一个业务方法里连续多次 `emit` / 多字段更新（观察通知次数与渲染次数）
- **Emit 场景**：microtask 合并、updater、flush、跨 await、并行竞态等（场景实现位于 `packages/slice-store/__tests__/fixtures/emit-scenarios.ts`）

## 说明

文档默认中文。包说明见：

- [slice-store](../../packages/slice-store/README.md)
- [slice-store-react](../../packages/slice-store-react/README.md)

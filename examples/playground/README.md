# slice-store 示例台

与 `packages` 同级的真实示例应用，用于本地手动验证 `@qlover/slice-store` / `@qlover/slice-store-react`。

## 启动

```bash
pnpm --filter @qlover/slice-store-playground dev
# 或
pnpm dev:playground
```

## 包含

- 计数器：基础 React 订阅与更新
- 多次 emit：一个业务方法里连续多次 emit / 多字段同时更新（看通知与渲染次数）
- Emit 场景：microtask 合并、updater、flush、跨 await、并行竞态等自动化断言

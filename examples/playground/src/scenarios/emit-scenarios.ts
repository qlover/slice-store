/**
 * Emit 更新场景 — 可运行的活文档示例
 *
 * 每个场景对应 SliceStore 的一类真实更新模式：
 * microtask 合并、updater emit、flush、跨 await、并行竞态等。
 *
 * 可在 playground UI 中运行，或通过 vitest：
 * packages/slice-store/__tests__/emitScenarios.example.test.ts
 */

import { SliceStore } from '@qlover/slice-store';

export type DemoState = {
  a: number;
  b: number;
  loading: boolean;
  data: string | null;
};

export type ScenarioResult = {
  id: string;
  title: string;
  description: string;
  notifyCount: number;
  finalState: DemoState;
  notes: string[];
};

function createDemoStore(): SliceStore<DemoState> {
  return new SliceStore<DemoState>(() => ({
    a: 0,
    b: 0,
    loading: false,
    data: null
  }));
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitMicrotask(): Promise<void> {
  await Promise.resolve();
}

/**
 * 1. 同步连续 value emit → 只通知一次，保留最终状态
 */
export async function scenarioSyncValueBatch(): Promise<ScenarioResult> {
  const store = createDemoStore();
  let notifyCount = 0;
  store.observe(() => {
    notifyCount++;
  });

  store.emit({ ...store.state, a: 1 });
  store.emit({ ...store.state, b: 2 });
  await waitMicrotask();

  return {
    id: 'sync-value-batch',
    title: '一个方法里连续多次 emit（多字段）',
    description:
      '模拟业务方法内连续 emit 改 a、再 emit 改 b：state 立刻到位，观察者只通知一次。',
    notifyCount,
    finalState: { ...store.state },
    notes: [
      '对应真实写法：updateBoth() { emit(...a); emit(...b); }',
      '业务代码无需包一层 batch()',
      '观察者看到的是最终状态 { a: 1, b: 2 }'
    ]
  };
}

/**
 * 2. 同步连续 updater emit → 两个字段都生效，只通知一次
 */
export async function scenarioSyncUpdaterBatch(): Promise<ScenarioResult> {
  const store = createDemoStore();
  let notifyCount = 0;
  store.observe(() => {
    notifyCount++;
  });

  store.emit((s) => ({ ...s, a: 1 }));
  store.emit((s) => ({ ...s, b: 2 }));
  await waitMicrotask();

  return {
    id: 'sync-updater-batch',
    title: '一个方法里连续 updater emit（多字段）',
    description:
      '同一方法内两次 emit(prev => ...)，每次都基于最新 state，合并后只通知一次。',
    notifyCount,
    finalState: { ...store.state },
    notes: [
      '对应真实写法：patch() { emit(s=>({...s,a:1})); emit(s=>({...s,b:2})); }',
      '比先读 store.state 再快照写入更稳妥',
      '同一同步轮次仍然只通知一次'
    ]
  };
}

/**
 * 3. emit(..., { flush: true }) → 同步立刻通知
 */
export async function scenarioFlushOption(): Promise<ScenarioResult> {
  const store = createDemoStore();
  let notifyCount = 0;
  store.observe(() => {
    notifyCount++;
  });

  store.emit({ ...store.state, a: 1 }, { flush: true });

  return {
    id: 'flush-option',
    title: '使用 { flush: true } 立刻通知',
    description:
      '当订阅者必须在同一调用栈内执行时使用（测试、同步副作用等）。',
    notifyCount,
    finalState: { ...store.state },
    notes: ['在等待任何 microtask 之前，notifyCount 已经是 1']
  };
}

/**
 * 4. store.flush() 冲刷挂起的批次
 */
export async function scenarioManualFlush(): Promise<ScenarioResult> {
  const store = createDemoStore();
  let notifyCount = 0;
  store.observe(() => {
    notifyCount++;
  });

  store.emit({ ...store.state, a: 1 });
  store.emit({ ...store.state, b: 2 });
  const beforeFlush = notifyCount;
  store.flush();

  return {
    id: 'manual-flush',
    title: '手动调用 flush()',
    description: '强制把挂起的 microtask 批次立刻通知出去。',
    notifyCount,
    finalState: { ...store.state },
    notes: [
      `flush 前 notifyCount: ${beforeFlush}`,
      `flush 后 notifyCount: ${notifyCount}`
    ]
  };
}

/**
 * 5. 跨 await 的异步流程 → 两次通知（loading 再 data）
 */
export async function scenarioAsyncAcrossAwait(): Promise<ScenarioResult> {
  const store = createDemoStore();
  let notifyCount = 0;
  store.observe(() => {
    notifyCount++;
  });

  store.emit((s) => ({ ...s, loading: true }));
  await waitMicrotask();

  await delay(1);
  store.emit((s) => ({ ...s, data: 'ok', loading: false }));
  await waitMicrotask();

  return {
    id: 'async-across-await',
    title: '跨 await 的异步更新',
    description:
      'await 之后是新的一轮批次——loading 与结果会分别通知。',
    notifyCount,
    finalState: { ...store.state },
    notes: [
      '这是预期行为：UI 应先看到 loading=true，再看到结果',
      '不要试图把 await 两侧的更新强行合并'
    ]
  };
}

/**
 * 6. 并行普通 emit → 竞态，后写覆盖（字段丢失）
 */
export async function scenarioParallelPlainRace(): Promise<ScenarioResult> {
  const store = createDemoStore();
  let notifyCount = 0;
  store.observe(() => {
    notifyCount++;
  });

  await Promise.all([
    (async () => {
      const snapshot = store.state;
      await delay(5);
      store.emit({ ...snapshot, a: 1 });
    })(),
    (async () => {
      const snapshot = store.state;
      await delay(5);
      store.emit({ ...snapshot, b: 2 });
    })()
  ]);
  store.flush();

  const bothKept = store.state.a === 1 && store.state.b === 2;

  return {
    id: 'parallel-plain-race',
    title: '并行普通 emit（竞态）',
    description:
      '两个异步任务都快照了同一份旧 state；后到的 emit 会覆盖先到的字段。',
    notifyCount,
    finalState: { ...store.state },
    notes: [
      bothKept
        ? '意外：两个字段都保留了（取决于时序）'
        : '预期：某个字段丢失——后写覆盖',
      '不要在并发任务里扩散过期快照'
    ]
  };
}

/**
 * 7. 并行 updater emit → 两个字段都保留
 */
export async function scenarioParallelUpdaterSafe(): Promise<ScenarioResult> {
  const store = createDemoStore();
  let notifyCount = 0;
  store.observe(() => {
    notifyCount++;
  });

  await Promise.all([
    (async () => {
      await delay(5);
      store.emit((s) => ({ ...s, a: 1 }));
    })(),
    (async () => {
      await delay(5);
      store.emit((s) => ({ ...s, b: 2 }));
    })()
  ]);
  store.flush();

  return {
    id: 'parallel-updater-safe',
    title: '并行 updater emit（安全）',
    description:
      '每次 updater 在提交时读取最新 state，因此并发字段更新可以正确合并。',
    notifyCount,
    finalState: { ...store.state },
    notes: [
      '并发异步业务逻辑优先使用 emit(prev => ...)',
      '每一轮内部仍然受 microtask 合并约束'
    ]
  };
}

/**
 * 8. 批次内 selector 仅在选中值变化时触发
 */
export async function scenarioSelectorInBatch(): Promise<ScenarioResult> {
  const store = new SliceStore<DemoState>(() => ({
    a: 1,
    b: 0,
    loading: false,
    data: null
  }));

  let aNotify = 0;
  let bNotify = 0;
  store.observe(
    (s) => s.a,
    () => {
      aNotify++;
    }
  );
  store.observe(
    (s) => s.b,
    () => {
      bNotify++;
    }
  );

  store.emit((s) => ({ ...s, b: 1 }));
  store.emit((s) => ({ ...s, b: 2 }));
  await waitMicrotask();

  return {
    id: 'selector-in-batch',
    title: 'Selector 比较基于批次起始旧状态',
    description:
      '只有选中值在批次起止之间发生变化的 selector 才会被通知。',
    notifyCount: aNotify + bNotify,
    finalState: { ...store.state },
    notes: [
      `a selector 通知次数: ${aNotify}（未变化）`,
      `b selector 通知次数: ${bNotify}（0 → 2）`
    ]
  };
}

export const allScenarios = [
  scenarioSyncValueBatch,
  scenarioSyncUpdaterBatch,
  scenarioFlushOption,
  scenarioManualFlush,
  scenarioAsyncAcrossAwait,
  scenarioParallelPlainRace,
  scenarioParallelUpdaterSafe,
  scenarioSelectorInBatch
] as const;

/**
 * 运行全部场景并返回结果（供 UI 或测试使用）。
 */
export async function runAllScenarios(): Promise<ScenarioResult[]> {
  const results: ScenarioResult[] = [];
  for (const run of allScenarios) {
    results.push(await run());
  }
  return results;
}

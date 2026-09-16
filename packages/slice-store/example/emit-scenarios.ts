/**
 * Emit update scenarios — runnable living examples
 *
 * Each scenario documents a real-world update pattern for SliceStore:
 * microtask batching, updater emits, flush, async boundaries, and races.
 *
 * Run via vitest: packages/slice-store/__tests__/emitScenarios.example.test.ts
 */

import { SliceStore } from '../src';

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
 * 1. Sync consecutive value emits → one notify, final state kept
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
    title: 'Sync consecutive value emits',
    description:
      'Multiple emit(value) calls in the same turn update state immediately but notify once.',
    notifyCount,
    finalState: { ...store.state },
    notes: [
      'No need to wrap business code in batch()',
      'Observers see the final state { a: 1, b: 2 }'
    ]
  };
}

/**
 * 2. Sync consecutive updater emits → both fields applied, one notify
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
    title: 'Sync consecutive updater emits',
    description:
      'Updater form reads the latest state at each emit, then one microtask notify.',
    notifyCount,
    finalState: { ...store.state },
    notes: [
      'Preferred over reading store.state into a local snapshot before emit',
      'Still one notify for the whole sync turn'
    ]
  };
}

/**
 * 3. emit(..., { flush: true }) → notify runs synchronously
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
    title: 'Immediate notify with { flush: true }',
    description:
      'Use when a subscriber must run in the same stack (tests, sync side effects).',
    notifyCount,
    finalState: { ...store.state },
    notes: ['notifyCount is already 1 before awaiting any microtask']
  };
}

/**
 * 4. store.flush() drains a pending batch
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
    title: 'Manual flush()',
    description: 'Force a pending microtask batch to notify immediately.',
    notifyCount,
    finalState: { ...store.state },
    notes: [
      `notifyCount before flush: ${beforeFlush}`,
      `notifyCount after flush: ${notifyCount}`
    ]
  };
}

/**
 * 5. Async flow across await → two notifies (loading then data)
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
    title: 'Async updates across await',
    description:
      'Each turn after await is a separate batch — loading and result notify separately.',
    notifyCount,
    finalState: { ...store.state },
    notes: [
      'This is intentional: UI should see loading=true before the result',
      'Do not try to merge across await boundaries'
    ]
  };
}

/**
 * 6. Parallel plain emits → race, last write wins (field loss)
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
    title: 'Parallel plain emits (race)',
    description:
      'Both async tasks snapshot the same old state; the later emit overwrites the earlier field.',
    notifyCount,
    finalState: { ...store.state },
    notes: [
      bothKept
        ? 'Unexpected: both fields kept (timing dependent)'
        : 'Expected: one field lost — last write wins',
      'Avoid spreading a stale snapshot across concurrent tasks'
    ]
  };
}

/**
 * 7. Parallel updater emits → both fields preserved
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
    title: 'Parallel updater emits (safe)',
    description:
      'Each updater reads the latest state at commit time, so concurrent field updates compose.',
    notifyCount,
    finalState: { ...store.state },
    notes: [
      'Prefer emit(prev => ...) for concurrent async business logic',
      'Still subject to microtask batching within each turn'
    ]
  };
}

/**
 * 8. Selector only fires when selected value changes inside a batch
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
    title: 'Selector comparison uses batch old state',
    description:
      'Only selectors whose selected value changed between batch start and end are notified.',
    notifyCount: aNotify + bNotify,
    finalState: { ...store.state },
    notes: [
      `a selector notifies: ${aNotify} (unchanged)`,
      `b selector notifies: ${bNotify} (0 → 2)`
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
 * Run every scenario and return results (for CLI or tests).
 */
export async function runAllScenarios(): Promise<ScenarioResult[]> {
  const results: ScenarioResult[] = [];
  for (const run of allScenarios) {
    results.push(await run());
  }
  return results;
}

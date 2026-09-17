import { runAllScenarios } from '../../../examples/playground/src/scenarios/emit-scenarios';

/**
 * Living example assertions for emit update scenarios.
 * Scenario implementations live in examples/playground.
 */
describe('emit scenarios (example)', () => {
  test('lists and verifies all update situations', async () => {
    const results = await runAllScenarios();

    expect(results.map((r) => r.id)).toEqual([
      'sync-value-batch',
      'sync-updater-batch',
      'flush-option',
      'manual-flush',
      'async-across-await',
      'parallel-plain-race',
      'parallel-updater-safe',
      'selector-in-batch'
    ]);

    const byId = Object.fromEntries(results.map((r) => [r.id, r]));

    expect(byId['sync-value-batch'].notifyCount).toBe(1);
    expect(byId['sync-value-batch'].finalState).toMatchObject({ a: 1, b: 2 });

    expect(byId['sync-updater-batch'].notifyCount).toBe(1);
    expect(byId['sync-updater-batch'].finalState).toMatchObject({ a: 1, b: 2 });

    expect(byId['flush-option'].notifyCount).toBe(1);
    expect(byId['flush-option'].finalState.a).toBe(1);

    expect(byId['manual-flush'].notifyCount).toBe(1);
    expect(byId['manual-flush'].finalState).toMatchObject({ a: 1, b: 2 });

    expect(byId['async-across-await'].notifyCount).toBe(2);
    expect(byId['async-across-await'].finalState).toMatchObject({
      data: 'ok',
      loading: false
    });

    expect(
      byId['parallel-plain-race'].finalState.a === 1 &&
        byId['parallel-plain-race'].finalState.b === 2
    ).toBe(false);

    expect(byId['parallel-updater-safe'].finalState).toMatchObject({
      a: 1,
      b: 2
    });

    expect(byId['selector-in-batch'].notifyCount).toBe(1);
    expect(byId['selector-in-batch'].finalState.b).toBe(2);
    expect(byId['selector-in-batch'].notes[0]).toContain('0');
  });
});

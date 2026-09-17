import { useState } from 'react';
import Counter from './components/Counter';
import { MultiEmitDemo } from './components/MultiEmitDemo';
import { EmitScenariosPanel } from './components/EmitScenariosPanel';

type Tab = 'counter' | 'multi' | 'emit';

export function App() {
  const [tab, setTab] = useState<Tab>('multi');

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 880 }}>
      <h1>slice-store 示例台</h1>
      <p>独立真实示例项目，用于手动验证 packages 行为。</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button type="button" onClick={() => setTab('counter')}>
          计数器
        </button>
        <button type="button" onClick={() => setTab('multi')}>
          多次 emit
        </button>
        <button type="button" onClick={() => setTab('emit')}>
          Emit 场景
        </button>
      </div>
      {tab === 'counter' ? (
        <Counter />
      ) : tab === 'multi' ? (
        <MultiEmitDemo />
      ) : (
        <EmitScenariosPanel />
      )}
    </main>
  );
}

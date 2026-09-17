import { useState } from 'react';
import {
  runAllScenarios,
  type ScenarioResult
} from '../scenarios/emit-scenarios';

export function EmitScenariosPanel() {
  const [results, setResults] = useState<ScenarioResult[]>([]);
  const [running, setRunning] = useState(false);

  const onRun = async (): Promise<void> => {
    setRunning(true);
    try {
      setResults(await runAllScenarios());
    } finally {
      setRunning(false);
    }
  };

  return (
    <section>
      <h2>Emit 更新场景</h2>
      <p>
        自动化断言版：覆盖「一个方法多次 emit / 多字段更新」、flush、跨
        await、并行竞态等。交互演示见「多次 emit」页签。
      </p>
      <button type="button" disabled={running} onClick={onRun}>
        {running ? '运行中…' : '运行全部场景'}
      </button>
      <ul>
        {results.map((item) => (
          <li key={item.id} style={{ marginTop: 12 }}>
            <strong>{item.title}</strong>
            <div>{item.description}</div>
            <div>
              通知次数: {item.notifyCount}；状态:{' '}
              {JSON.stringify(item.finalState)}
            </div>
            <div>{item.notes.join(' · ')}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}

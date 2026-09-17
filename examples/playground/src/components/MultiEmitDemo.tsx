import { useEffect, useRef } from 'react';
import { SliceStore } from '@qlover/slice-store';
import { useSliceStore } from '@qlover/slice-store-react';

type MultiState = {
  name: string;
  age: number;
  score: number;
};

/**
 * 模拟真实业务方法：一次用户操作里连续多次 emit。
 * microtask 合并后，订阅方只收到一次通知。
 */
class MultiEmitStore extends SliceStore<MultiState> {
  constructor() {
    super(() => ({ name: '未设置', age: 0, score: 0 }));
  }

  /** 多个字段在同一次方法里分步更新 */
  updateProfile = (name: string, age: number): void => {
    this.emit({ ...this.state, name });
    this.emit({ ...this.state, age });
  };

  /** 推荐：同一方法里用 updater 连续改多个字段 */
  addScoreTwice = (): void => {
    this.emit((s) => ({ ...s, score: s.score + 1 }));
    this.emit((s) => ({ ...s, score: s.score + 1 }));
  };

  reset = (): void => {
    this.emit({ name: '未设置', age: 0, score: 0 }, { flush: true });
  };
}

const multiEmitStore = new MultiEmitStore();

export function MultiEmitDemo() {
  const state = useSliceStore(multiEmitStore);

  // 通知次数用 ref，挂在同一次 store 通知里更新；
  // 不要再 setState，否则会和 useSliceStore 各触发一次渲染（1 次点击 → 渲染 +2）
  const notifyCountRef = useRef(0);
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  useEffect(() => {
    return multiEmitStore.observe(() => {
      notifyCountRef.current += 1;
    });
  }, []);

  const onReset = (): void => {
    multiEmitStore.reset();
    // reset 的 flush 会同步通知一次；清零后由 useSliceStore 触发的渲染展示 0
    notifyCountRef.current = 0;
  };

  return (
    <section>
      <h2>一个方法里多次 emit</h2>
      <p>
        点击下方按钮会进入业务方法，方法内部连续调用多次 <code>emit</code>。
        请看「观察者通知次数」与「组件渲染次数」是否每次点击都只 +1。
      </p>

      <pre
        style={{
          background: '#f6f8fa',
          padding: 12,
          overflow: 'auto',
          fontSize: 13,
          lineHeight: 1.5
        }}
      >{`updateProfile(name, age) {
  this.emit({ ...this.state, name }); // 第 1 次
  this.emit({ ...this.state, age });  // 第 2 次
  // → state 立刻变成最终值，观察者/React 只通知 1 次
}`}</pre>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '12px 0' }}>
        <button
          type="button"
          onClick={() => multiEmitStore.updateProfile('张三', 18)}
        >
          更新姓名+年龄（方法内 2 次 emit）
        </button>
        <button type="button" onClick={() => multiEmitStore.addScoreTwice()}>
          分数连加两次（方法内 2 次 emit）
        </button>
        <button type="button" onClick={onReset}>
          重置
        </button>
      </div>

      <dl
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '4px 16px',
          margin: 0
        }}
      >
        <dt>姓名</dt>
        <dd style={{ margin: 0 }}>{state.name}</dd>
        <dt>年龄</dt>
        <dd style={{ margin: 0 }}>{state.age}</dd>
        <dt>分数</dt>
        <dd style={{ margin: 0 }}>{state.score}</dd>
        <dt>观察者通知次数</dt>
        <dd style={{ margin: 0 }}>{notifyCountRef.current}</dd>
        <dt>组件渲染次数</dt>
        <dd style={{ margin: 0 }}>{renderCountRef.current}</dd>
      </dl>

      <p style={{ color: '#555', fontSize: 14 }}>
        预期：初始渲染 1；点一次第一个按钮后，通知与渲染都变成 2（只
        +1）。请先硬刷新页面；playground 已关闭 StrictMode，且 useSliceStore
        已改为 useSyncExternalStore。
      </p>
    </section>
  );
}

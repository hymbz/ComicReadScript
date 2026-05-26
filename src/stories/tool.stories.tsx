import {
  type Component,
  For,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';

type EventLog = {
  type: string;
  time: number;
  data: Record<string, unknown>;
};

const EventLogItem: Component<{ log: EventLog; latest: boolean }> = (props) => (
  <div
    style={{
      display: 'flex',
      'flex-direction': 'column',
      gap: '2px',
      padding: '4px 8px',
      'border-bottom': '1px solid #eee',
      background: props.latest ? '#e3f2fd' : undefined,
      'font-size': '12px',
      'font-family': 'monospace',
    }}
  >
    <div style={{ display: 'flex', gap: '8px', 'align-items': 'center' }}>
      <span
        style={{
          'font-weight': 'bold',
          color: '#1565c0',
        }}
      >
        {props.log.type}
      </span>
      <span style={{ color: '#999' }}>{props.log.time}ms</span>
    </div>
    <div style={{ display: 'flex', 'flex-wrap': 'wrap', gap: '4px' }}>
      <For each={Object.entries(props.log.data)}>
        {([key, val]) => (
          <span
            style={{
              background: '#f5f5f5',
              padding: '1px 4px',
              'border-radius': '3px',
              color: '#666',
            }}
          >
            {key}: {JSON.stringify(val)}
          </span>
        )}
      </For>
    </div>
  </div>
);

const EventLogList: Component<{ logs: EventLog[] }> = (props) => (
  <>
    {props.logs.length === 0 ? (
      <div
        style={{
          padding: '24px',
          'text-align': 'center',
          color: '#ccc',
          'font-size': '12px',
        }}
      >
        暂无事件
      </div>
    ) : (
      props.logs.map((log, i) => <EventLogItem log={log} latest={i === 0} />)
    )}
  </>
);

const EventColumn: Component<{
  title: string;
  logs: EventLog[];
  color: string;
}> = (props) => (
  <div
    style={{
      flex: 1,
      display: 'flex',
      'flex-direction': 'column',
      'min-width': 0,
    }}
  >
    <div
      style={{
        padding: '8px 12px',
        background: props.color,
        color: '#fff',
        'font-size': '13px',
        'font-weight': 'bold',
        'flex-shrink': 0,
      }}
    >
      {props.title}
      <span
        style={{
          'margin-left': '8px',
          'font-weight': 'normal',
          opacity: 0.8,
        }}
      >
        {props.logs.length} 条
      </span>
    </div>
    <div
      style={{
        flex: 1,
        overflow: 'auto',
        'min-height': 0,
      }}
    >
      <EventLogList logs={props.logs} />
    </div>
  </div>
);

const SplitEventColumn: Component<{
  title: string;
  color: string;
  logs: EventLog[];
  isMove: (type: string) => boolean;
}> = (props) => {
  const moveLogs = () => props.logs.filter((l) => props.isMove(l.type));
  const nonMoveLogs = () => props.logs.filter((l) => !props.isMove(l.type));

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        'flex-direction': 'column',
        'min-width': 0,
      }}
    >
      <div
        style={{
          padding: '6px 12px',
          background: props.color,
          color: '#fff',
          'font-size': '12px',
          'font-weight': 'bold',
          'flex-shrink': 0,
        }}
      >
        {props.title}
        <span
          style={{
            'margin-left': '6px',
            'font-weight': 'normal',
            opacity: 0.7,
          }}
        >
          非 Move
        </span>
        <span
          style={{
            'margin-left': '6px',
            'font-weight': 'normal',
            opacity: 0.8,
          }}
        >
          {nonMoveLogs().length} 条
        </span>
      </div>
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          'min-height': 0,
        }}
      >
        <EventLogList logs={nonMoveLogs()} />
      </div>
      <div
        style={{
          padding: '4px 12px',
          background: props.color,
          color: '#fff',
          'font-size': '11px',
          'font-weight': 'bold',
          'flex-shrink': 0,
          opacity: 0.85,
        }}
      >
        Move 事件
        <span
          style={{
            'margin-left': '6px',
            'font-weight': 'normal',
            opacity: 0.8,
          }}
        >
          {moveLogs().length} 条
        </span>
      </div>
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          'min-height': 0,
        }}
      >
        <EventLogList logs={moveLogs()} />
      </div>
    </div>
  );
};

const EventTestPage: Component = () => {
  const [wheelLogs, setWheelLogs] = createSignal<EventLog[]>([]);
  const [pointerLogs, setPointerLogs] = createSignal<EventLog[]>([]);
  const [mouseLogs, setMouseLogs] = createSignal<EventLog[]>([]);
  const [paused, setPaused] = createSignal(false);
  let triggerArea!: HTMLDivElement; // oxlint-disable-line no-unassigned-vars
  let startTime = 0;

  const addLog = (
    type: string,
    data: Record<string, unknown>,
    category: 'wheel' | 'pointer' | 'mouse',
  ) => {
    if (paused()) return;
    const time = performance.now() - startTime;
    const log: EventLog = { type, time, data };

    if (category === 'wheel')
      setWheelLogs((prev) => [log, ...prev].slice(0, 200));
    else if (category === 'pointer')
      setPointerLogs((prev) => [log, ...prev].slice(0, 200));
    else setMouseLogs((prev) => [log, ...prev].slice(0, 200));
  };

  const clearAll = () => {
    setWheelLogs([]);
    setPointerLogs([]);
    setMouseLogs([]);
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    addLog(
      'wheel',
      {
        deltaX: Math.round(e.deltaX),
        deltaY: Math.round(e.deltaY),
        deltaZ: Math.round(e.deltaZ),
        deltaMode: e.deltaMode,
        clientX: Math.round(e.clientX),
        clientY: Math.round(e.clientY),
        ctrlKey: e.ctrlKey,
      },
      'wheel',
    );
  };

  const handlePointer = (e: PointerEvent) => {
    const data: Record<string, unknown> = {
      pointerId: e.pointerId,
      pointerType: e.pointerType,
      clientX: Math.round(e.clientX),
      clientY: Math.round(e.clientY),
      pageX: Math.round(e.pageX),
      pageY: Math.round(e.pageY),
      buttons: e.buttons,
      button: e.button,
    };
    if (e.type === 'pointermove') {
      data.pressure = Number(e.pressure.toFixed(2));
    }
    addLog(e.type, data, 'pointer');
  };

  const handleMouse = (e: MouseEvent) => {
    addLog(
      e.type,
      {
        clientX: Math.round(e.clientX),
        clientY: Math.round(e.clientY),
        pageX: Math.round(e.pageX),
        pageY: Math.round(e.pageY),
        screenX: Math.round(e.screenX),
        screenY: Math.round(e.screenY),
        buttons: e.buttons,
        button: e.button,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
      },
      'mouse',
    );
  };

  onMount(() => {
    startTime = performance.now();
    const area = triggerArea;

    area.addEventListener('wheel', handleWheel as EventListener, {
      passive: false,
    });

    const pointerEventList = [
      'pointerdown',
      'pointermove',
      'pointerup',
      'pointerenter',
      'pointerleave',
      'pointercancel',
    ] as const;
    for (const eventType of pointerEventList)
      area.addEventListener(eventType, handlePointer as EventListener);

    const mouseEventList = [
      'mousedown',
      'mousemove',
      'mouseup',
      'mouseenter',
      'mouseleave',
      'click',
      'dblclick',
      'contextmenu',
    ] as const;
    for (const eventType of mouseEventList)
      area.addEventListener(eventType, handleMouse as EventListener);

    onCleanup(() => {
      area.removeEventListener('wheel', handleWheel as EventListener);
      for (const eventType of pointerEventList)
        area.removeEventListener(eventType, handlePointer as EventListener);
      for (const eventType of mouseEventList)
        area.removeEventListener(eventType, handleMouse as EventListener);
    });
  });

  return (
    <div
      style={{
        display: 'flex',
        'flex-direction': 'column',
        height: '100vh',
        'font-family': 'sans-serif',
      }}
    >
      <div
        style={{
          padding: '12px',
          background: '#fafafa',
          'border-bottom': '2px solid #1976d2',
          display: 'flex',
          'align-items': 'center',
          gap: '12px',
          'flex-shrink': 0,
        }}
      >
        <h1 style={{ margin: 0, 'font-size': '16px', color: '#1976d2' }}>
          事件测试工具
        </h1>
        <button
          onClick={() => setPaused((v) => !v)}
          style={{
            padding: '4px 12px',
            border: `1px solid ${paused() ? '#f44336' : '#4caf50'}`,
            background: paused() ? '#ffebee' : '#e8f5e9',
            color: paused() ? '#f44336' : '#4caf50',
            'border-radius': '4px',
            cursor: 'pointer',
            'font-size': '12px',
          }}
        >
          {paused() ? '已暂停' : '记录中'}
        </button>
        <button
          onClick={clearAll}
          style={{
            padding: '4px 12px',
            border: '1px solid #999',
            background: '#fff',
            'border-radius': '4px',
            cursor: 'pointer',
            'font-size': '12px',
          }}
        >
          清空全部
        </button>
        <span style={{ 'font-size': '12px', color: '#999' }}>
          总计 {wheelLogs().length + pointerLogs().length + mouseLogs().length}{' '}
          条
        </span>
      </div>

      <div
        ref={triggerArea}
        style={{
          height: '160px',
          overflow: 'hidden',
          background:
            'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          cursor: 'crosshair',
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center',
          'flex-shrink': 0,
          'user-select': 'none',
        }}
      >
        <div style={{ 'text-align': 'center', color: '#e0e0e0' }}>
          <div
            style={{
              'font-size': '20px',
              'font-weight': 'bold',
              'margin-bottom': '8px',
            }}
          >
            事件触发区域
          </div>
          <div style={{ 'font-size': '13px', opacity: 0.7 }}>
            在此区域内滚动、点击、移动指针
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flex: 1,
          'min-height': 0,
          'border-top': '1px solid #ddd',
        }}
      >
        <EventColumn title="Wheel 事件" logs={wheelLogs()} color="#e65100" />
        <div style={{ width: '1px', background: '#ddd' }} />
        <SplitEventColumn
          title="Pointer 事件"
          color="#1565c0"
          logs={pointerLogs()}
          isMove={(type) => type === 'pointermove'}
        />
        <div style={{ width: '1px', background: '#ddd' }} />
        <SplitEventColumn
          title="Mouse 事件"
          color="#2e7d32"
          logs={mouseLogs()}
          isMove={(type) => type === 'mousemove'}
        />
      </div>
    </div>
  );
};

export default {
  title: '测试/工具',
  component: EventTestPage,
  parameters: { layout: 'fullscreen' },
};

export const 事件测试 = {};

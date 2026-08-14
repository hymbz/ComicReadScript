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
  interval: number | null;
  data: Record<string, unknown>;
};

const filterData = (
  data: Record<string, unknown>,
  showCoords: boolean,
  showModifiers: boolean,
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    const isCoord = key === 'clientX' || key === 'clientY';
    const isModifier =
      key === 'ctrlKey' || key === 'shiftKey' || key === 'altKey';
    if (isCoord && !showCoords) continue;
    if (isModifier && !showModifiers) continue;
    result[key] = value;
  }
  return result;
};

const EventLogItem: Component<{
  log: EventLog;
  latest: boolean;
  showCoords: boolean;
  showModifiers: boolean;
}> = (props) => {
  const data = () =>
    filterData(props.log.data, props.showCoords, props.showModifiers);

  return (
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
        <span style={{ color: '#999' }}>{Math.round(props.log.time)}ms</span>
        {props.log.interval !== null && (
          <span style={{ color: '#666' }}>
            +{Math.round(props.log.interval)}ms
          </span>
        )}
      </div>
      <div style={{ display: 'flex', 'flex-wrap': 'wrap', gap: '4px' }}>
        <For each={Object.entries(data())}>
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
};

const EventLogList: Component<{
  logs: EventLog[];
  showCoords: boolean;
  showModifiers: boolean;
}> = (props) => (
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
      props.logs.map((log, i) => (
        <EventLogItem
          log={log}
          latest={i === 0}
          showCoords={props.showCoords}
          showModifiers={props.showModifiers}
        />
      ))
    )}
  </>
);

const formatLogs = (
  logs: EventLog[],
  showCoords: boolean,
  showModifiers: boolean,
): string =>
  [...logs]
    .toReversed()
    .map((log) => {
      const interval =
        log.interval === null ? '' : ` +${Math.round(log.interval)}ms`;
      const data = Object.entries(
        filterData(log.data, showCoords, showModifiers),
      )
        .map(([key, val]) => `${key}: ${JSON.stringify(val)}`)
        .join(' ');
      return `${log.type} ${Math.round(log.time)}ms${interval}${data ? ` ${data}` : ''}`;
    })
    .join('\n');

const copyLogs = async (text: string, onFail: (text: string) => void) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    onFail(text);
  }
};

const CopyButton: Component<{
  logs: EventLog[];
  showCoords: boolean;
  showModifiers: boolean;
  onFail: (text: string) => void;
}> = (props) => (
  <button
    onClick={() =>
      copyLogs(
        formatLogs(props.logs, props.showCoords, props.showModifiers),
        props.onFail,
      )
    }
    disabled={props.logs.length === 0}
    style={{
      padding: '2px 8px',
      border: '1px solid rgba(255,255,255,0.5)',
      background: 'transparent',
      color: '#fff',
      'border-radius': '3px',
      cursor: props.logs.length > 0 ? 'pointer' : 'not-allowed',
      'font-size': '11px',
      opacity: props.logs.length > 0 ? 1 : 0.5,
    }}
  >
    复制
  </button>
);

const FallbackCopyModal: Component<{
  text: string;
  onClose: () => void;
}> = (props) => (
  <div
    onClick={props.onClose}
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      'z-index': 1000,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: '#fff',
        padding: '20px',
        'border-radius': '8px',
        width: '80%',
        'max-width': '600px',
        display: 'flex',
        'flex-direction': 'column',
        gap: '12px',
      }}
    >
      <div style={{ 'font-size': '14px', color: '#333' }}>
        无法写入剪贴板，请手动复制下方内容：
      </div>
      <textarea
        readOnly
        value={props.text}
        style={{
          width: '100%',
          height: '200px',
          'font-family': 'monospace',
          'font-size': '12px',
          padding: '8px',
          'box-sizing': 'border-box',
          border: '1px solid #ddd',
          'border-radius': '4px',
          resize: 'vertical',
        }}
      />
      <button
        onClick={props.onClose}
        style={{
          padding: '6px 16px',
          border: 'none',
          background: '#1976d2',
          color: '#fff',
          'border-radius': '4px',
          cursor: 'pointer',
          'font-size': '13px',
          'align-self': 'flex-end',
        }}
      >
        关闭
      </button>
    </div>
  </div>
);

const EventColumn: Component<{
  title: string;
  logs: EventLog[];
  color: string;
  showCoords: boolean;
  showModifiers: boolean;
  onCopyFail: (text: string) => void;
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
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'space-between',
      }}
    >
      <div>
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
      <CopyButton
        logs={props.logs}
        showCoords={props.showCoords}
        showModifiers={props.showModifiers}
        onFail={props.onCopyFail}
      />
    </div>
    <div
      style={{
        flex: 1,
        overflow: 'auto',
        'min-height': 0,
      }}
    >
      <EventLogList
        logs={props.logs}
        showCoords={props.showCoords}
        showModifiers={props.showModifiers}
      />
    </div>
  </div>
);

const SplitEventColumn: Component<{
  title: string;
  color: string;
  logs: EventLog[];
  isMove: (type: string) => boolean;
  showCoords: boolean;
  showModifiers: boolean;
  onCopyFail: (text: string) => void;
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
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'space-between',
        }}
      >
        <div>
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
        <CopyButton
          logs={props.logs}
          showCoords={props.showCoords}
          showModifiers={props.showModifiers}
          onFail={props.onCopyFail}
        />
      </div>
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          'min-height': 0,
        }}
      >
        <EventLogList
          logs={nonMoveLogs()}
          showCoords={props.showCoords}
          showModifiers={props.showModifiers}
        />
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
        <EventLogList
          logs={moveLogs()}
          showCoords={props.showCoords}
          showModifiers={props.showModifiers}
        />
      </div>
    </div>
  );
};

const EventTestPage: Component = () => {
  const [wheelLogs, setWheelLogs] = createSignal<EventLog[]>([]);
  const [pointerLogs, setPointerLogs] = createSignal<EventLog[]>([]);
  const [mouseLogs, setMouseLogs] = createSignal<EventLog[]>([]);
  const [paused, setPaused] = createSignal(false);
  const [showCoords, setShowCoords] = createSignal(false);
  const [showModifiers, setShowModifiers] = createSignal(false);
  const [fallbackText, setFallbackText] = createSignal<string | null>(null);
  let triggerArea!: HTMLDivElement; // oxlint-disable-line no-unassigned-vars
  let startTime = 0;

  const addLog = (
    type: string,
    data: Record<string, unknown>,
    category: 'wheel' | 'pointer' | 'mouse',
  ) => {
    if (paused()) return;
    const time = performance.now() - startTime;
    const makeLog = (prev: EventLog[]): EventLog => ({
      type,
      time,
      interval: prev.length > 0 ? time - prev[0].time : null,
      data,
    });

    if (category === 'wheel')
      setWheelLogs((prev) => [makeLog(prev), ...prev].slice(0, 200));
    else if (category === 'pointer')
      setPointerLogs((prev) => [makeLog(prev), ...prev].slice(0, 200));
    else setMouseLogs((prev) => [makeLog(prev), ...prev].slice(0, 200));
  };

  const clearAll = () => {
    setWheelLogs([]);
    setPointerLogs([]);
    setMouseLogs([]);
    startTime = performance.now();
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    addLog(
      'wheel',
      {
        deltaX: Math.round(e.deltaX),
        deltaY: Math.round(e.deltaY),
        clientX: Math.round(e.clientX),
        clientY: Math.round(e.clientY),
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
      },
      'wheel',
    );
  };

  const handlePointer = (e: PointerEvent) => {
    addLog(
      e.type,
      {
        pointerId: e.pointerId,
        pointerType: e.pointerType,
        clientX: Math.round(e.clientX),
        clientY: Math.round(e.clientY),
        buttons: e.buttons,
        button: e.button,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
      },
      'pointer',
    );
  };

  const handleMouse = (e: MouseEvent) => {
    addLog(
      e.type,
      {
        clientX: Math.round(e.clientX),
        clientY: Math.round(e.clientY),
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
        <button
          onClick={() => setShowCoords((v) => !v)}
          style={{
            padding: '4px 12px',
            border: `1px solid ${showCoords() ? '#1976d2' : '#999'}`,
            background: showCoords() ? '#e3f2fd' : '#fff',
            color: showCoords() ? '#1976d2' : '#666',
            'border-radius': '4px',
            cursor: 'pointer',
            'font-size': '12px',
          }}
        >
          坐标
        </button>
        <button
          onClick={() => setShowModifiers((v) => !v)}
          style={{
            padding: '4px 12px',
            border: `1px solid ${showModifiers() ? '#1976d2' : '#999'}`,
            background: showModifiers() ? '#e3f2fd' : '#fff',
            color: showModifiers() ? '#1976d2' : '#666',
            'border-radius': '4px',
            cursor: 'pointer',
            'font-size': '12px',
          }}
        >
          修饰键
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
        <EventColumn
          title="Wheel 事件"
          logs={wheelLogs()}
          color="#e65100"
          showCoords={showCoords()}
          showModifiers={showModifiers()}
          onCopyFail={setFallbackText}
        />
        <div style={{ width: '1px', background: '#ddd' }} />
        <SplitEventColumn
          title="Pointer 事件"
          color="#1565c0"
          logs={pointerLogs()}
          isMove={(type) => type === 'pointermove'}
          showCoords={showCoords()}
          showModifiers={showModifiers()}
          onCopyFail={setFallbackText}
        />
        <div style={{ width: '1px', background: '#ddd' }} />
        <SplitEventColumn
          title="Mouse 事件"
          color="#2e7d32"
          logs={mouseLogs()}
          isMove={(type) => type === 'mousemove'}
          showCoords={showCoords()}
          showModifiers={showModifiers()}
          onCopyFail={setFallbackText}
        />
      </div>
      {fallbackText() && (
        <FallbackCopyModal
          text={fallbackText()!}
          onClose={() => setFallbackText(null)}
        />
      )}
    </div>
  );
};

export default {
  title: '测试/工具',
  component: EventTestPage,
  parameters: { layout: 'fullscreen' },
};

export const 事件测试 = {};

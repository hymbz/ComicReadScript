let clickTimeout: number | null = null;

type ClickEventHandler = (e: MouseEvent) => void;

export const useDoubleClick =
  (
    click: ClickEventHandler,
    doubleClick?: ClickEventHandler,
    timeout = 200,
  ): ClickEventHandler =>
  (event) => {
    // 如果点击触发时还有上次计时器的记录，说明这次是双击
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      doubleClick?.(event);
      return;
    }

    // 单击事件延迟触发
    clickTimeout = window.setTimeout(() => {
      click(event);
      clickTimeout = null;
    }, timeout);
  };

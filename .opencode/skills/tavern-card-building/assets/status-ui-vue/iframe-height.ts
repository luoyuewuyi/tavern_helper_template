export interface IframeHeightSync {
  refresh: () => void;
  destroy: () => void;
}

let activeSync: IframeHeightSync | undefined;

/**
 * 让消息楼层 iframe 跟随真实内容高度。
 * 根布局必须保持正常文档流，不能使用 100vh 或根级 height/min-height: 100%。
 */
export function installIframeHeightSync(): IframeHeightSync {
  if (activeSync) return activeSync;

  let animationFrame = 0;
  let destroyed = false;
  let lastHeight = -1;

  const measure = () => {
    animationFrame = 0;
    if (destroyed) return;

    try {
      const body = document.body;
      const frame = window.frameElement as HTMLElement | null;
      if (!body || !frame) return;

      const height = Math.ceil(body.scrollHeight);
      if (!Number.isFinite(height) || height <= 0 || Math.abs(height - lastHeight) <= 1) return;

      frame.style.height = `${height}px`;
      lastHeight = height;
    } catch (error) {
      console.warn('[status-ui] 无法同步 iframe 高度', error);
    }
  };

  const refresh = () => {
    if (destroyed || animationFrame !== 0) return;
    animationFrame = window.requestAnimationFrame(measure);
  };

  const resizeObserver = new ResizeObserver(refresh);
  resizeObserver.observe(document.body);

  const onAsyncLayout = () => refresh();
  window.addEventListener('load', onAsyncLayout, { capture: true });
  document.body.addEventListener('transitionend', onAsyncLayout);
  document.body.addEventListener('animationend', onAsyncLayout);
  void document.fonts?.ready.then(refresh);

  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    resizeObserver.disconnect();
    if (animationFrame !== 0) window.cancelAnimationFrame(animationFrame);
    window.removeEventListener('load', onAsyncLayout, { capture: true });
    document.body.removeEventListener('transitionend', onAsyncLayout);
    document.body.removeEventListener('animationend', onAsyncLayout);
    window.removeEventListener('pagehide', destroy);
    activeSync = undefined;
  };

  activeSync = { refresh, destroy };
  window.addEventListener('pagehide', destroy, { once: true });
  refresh();
  return activeSync;
}

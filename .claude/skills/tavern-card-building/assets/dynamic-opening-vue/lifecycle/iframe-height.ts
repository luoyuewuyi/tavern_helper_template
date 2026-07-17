export interface IframeHeightSync {
  refresh: () => void;
  destroy: () => void;
}

let activeSync: IframeHeightSync | undefined;

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
      console.warn('[dynamic-opening] 无法同步 iframe 高度', error);
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

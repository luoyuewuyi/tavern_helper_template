const app = document.querySelector<HTMLElement>('#app');

const fields = [
  ['type', '世界类型'],
  ['name', '世界名称'],
  ['tags', '世界观/tag'],
  ['tone', '基调'],
  ['player', '{{user}}定位'],
  ['roles', '主要人物/势力'],
  ['map', '地图/区域'],
  ['resource', '资源/货币/背包'],
  ['system', '等级/战斗/风险'],
  ['quest', '委托/主线/可探索目标'],
  ['special', '特殊互动/种族/生理设定'],
  ['ban', '边界/禁止内容'],
  ['start', '开局场景'],
] as const;

function render(): void {
  if (!app) return;
  app.innerHTML = `
    <section class="rccg-root">
      <h1>创建世界</h1>
      <div class="grid">
        <label>世界类型<input data-k="type" /></label>
        <label>世界名称<input data-k="name" /></label>
        <label class="wide">世界观 / tag<textarea data-k="tags"></textarea></label>
        <label>基调<input data-k="tone" /></label>
        <label>{{user}}定位<input data-k="player" /></label>
        <label class="wide">主要人物 / 势力<textarea data-k="roles"></textarea></label>
        <details class="wide" open>
          <summary>玩法与开局</summary>
          <div class="grid inner">
            <label class="wide">地图 / 区域<textarea data-k="map"></textarea></label>
            <label>资源 / 货币 / 背包<textarea data-k="resource"></textarea></label>
            <label>等级 / 战斗 / 风险<textarea data-k="system"></textarea></label>
            <label>委托 / 主线 / 可探索目标<textarea data-k="quest"></textarea></label>
            <label>特殊互动 / 种族 / 生理设定<textarea data-k="special"></textarea></label>
            <label>边界 / 禁止内容<textarea data-k="ban"></textarea></label>
            <label class="wide">开局场景<textarea data-k="start"></textarea></label>
          </div>
        </details>
        <label class="wide">请求文本<textarea class="output" data-k="out"></textarea></label>
      </div>
      <div class="actions">
        <button type="button" data-action="send">生成世界</button>
        <button type="button" data-action="copy">复制</button>
        <button type="button" data-action="refresh">刷新</button>
      </div>
      <p class="status">就绪。</p>
    </section>
  `;
}

function input(key: string): HTMLInputElement | HTMLTextAreaElement | null {
  return app?.querySelector(`[data-k="${key}"]`) ?? null;
}

function value(key: string): string {
  return input(key)?.value.trim() || '自动生成';
}

function requestText(): string {
  const lines = ['【世界生成请求】'];
  for (const [key, label] of fields) {
    lines.push(`${label}：${value(key)}`);
  }
  lines.push(
    '额外要求：直接生成可游玩的世界与开局，留空项自行补全；至少三位可互动人物或势力代表；正式开局500到600字；三份备选开局；约八条对话示例；八到十二条世界重要信息；附带用三反引号代码块包裹的纯文字状态栏；生成后直接进入游玩，不要输出制卡教程，不要代替{{user}}行动。',
  );
  return lines.join('\n');
}

function setStatus(text: string, error = false): void {
  const node = app?.querySelector<HTMLElement>('.status');
  if (!node) return;
  node.textContent = text;
  node.style.color = error ? '#b91c1c' : '#047857';
}

function refresh(): string {
  const output = input('out');
  const text = requestText();
  if (output) output.value = text;
  return text;
}

async function copy(): Promise<void> {
  const text = refresh();
  const output = input('out');
  output?.focus();
  output?.select();
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
  }
  setStatus('已复制或已选中文本。');
}

function fillInput(text: string): boolean {
  const target = document.querySelector<HTMLTextAreaElement>(
    '#send_textarea, textarea[name="send_textarea"], #chat-textarea, textarea',
  );
  if (!target || target.closest('.rccg-root')) return false;
  target.value = text;
  target.dispatchEvent(new Event('input', { bubbles: true }));
  target.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}

function clickSend(): boolean {
  const button = document.querySelector<HTMLButtonElement>(
    '#send_but, #send-button, button[title*="Send"], button[title*="发送"]',
  );
  if (!button || button.disabled) return false;
  button.click();
  return true;
}

function bind(): void {
  app?.addEventListener('input', () => refresh());
  app?.addEventListener('click', event => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'refresh') {
      refresh();
      setStatus('已刷新。');
    }
    if (action === 'copy') {
      copy().catch(() => setStatus('复制失败，请手动复制。', true));
    }
    if (action === 'send') {
      const text = refresh();
      if (!fillInput(text)) {
        setStatus('未找到输入框，请复制请求文本。', true);
        return;
      }
      setStatus(clickSend() ? '已尝试发送。' : '已填入输入框。');
    }
  });
  refresh();
}

function style(): void {
  const tag = document.createElement('style');
  tag.textContent = `
    body{margin:0;background:transparent;color:#1f2937;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    .rccg-root{max-width:860px;margin:12px auto;padding:14px;border:1px solid #c4b5fd;border-radius:10px;background:#fbfaff;line-height:1.55}
    *{box-sizing:border-box}
    h1{text-align:center;margin:0 0 10px;font-size:21px;font-weight:800;color:#6d28d9}
    .grid{display:grid;grid-template-columns:1fr;gap:10px}
    label{display:grid;gap:5px;font-size:13px;font-weight:700;color:#374151}
    input,textarea{width:100%;border:1px solid #ddd6fe;border-radius:8px;background:#fff;color:#111827;padding:9px 10px;font:inherit;line-height:1.45}
    textarea{min-height:60px;resize:vertical}
    .output{min-height:220px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:13px;white-space:pre-wrap}
    details{border:1px solid #e9d5ff;border-radius:8px;padding:8px;background:#fff}
    summary{cursor:pointer;font-weight:800;color:#6d28d9}
    .inner{margin-top:10px}
    .actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
    button{border:1px solid #a78bfa;border-radius:8px;background:#fff;color:#5b21b6;padding:8px 10px;font:inherit;cursor:pointer}
    button:first-child{background:#7c3aed;color:#fff;border-color:#7c3aed}
    .status{margin:8px 0 0;font-size:12px;color:#047857}
    @media (min-width:680px){.grid{grid-template-columns:1fr 1fr}.wide{grid-column:1/-1}}
  `;
  document.head.append(tag);
}

style();
render();
bind();

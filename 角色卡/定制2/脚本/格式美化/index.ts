// ═══════════════════════════════════════════════════════
// 格式美化脚本 — 「定制2」
// 美化 5 种输出标签 + 详细报错弹窗
// ═══════════════════════════════════════════════════════

// ============ 样式配置 ============

/** 正文标签 — 暗夜书卷风 */
const STYLE_MAIN = {
  container: `
    background: linear-gradient(135deg, #0c1220 0%, #111a2e 50%, #0e1525 100%);
    border: 1px solid #c9a96244;
    border-left: 3px solid #c9a962;
    border-radius: 6px;
    padding: 18px 20px;
    margin: 12px 0;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(201,169,98,0.1);
    font-family: 'Georgia', 'Noto Serif SC', serif;
    color: #e8dcc8;
    font-size: 1em;
    line-height: 1.85;
    letter-spacing: 0.3px;
  `,
  header: `
    display: flex;
    align-items: center;
    gap: 8px;
    color: #c9a962;
    font-size: 0.8em;
    font-weight: bold;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #c9a96230;
    text-transform: uppercase;
    letter-spacing: 2px;
  `,
  content: `
    text-indent: 2em;
  `,
};

/** 遭遇判定标签 — 科技面板风 */
const STYLE_ENCOUNTER = {
  container: `
    background: linear-gradient(135deg, #0a0a1a 0%, #0d0d2b 50%, #0a0a1a 100%);
    border: 1px solid #00d4ff33;
    border-radius: 8px;
    padding: 16px;
    margin: 12px 0;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0,212,255,0.1), inset 0 0 40px rgba(0,0,0,0.5);
    font-family: 'Consolas', 'Monaco', monospace;
    color: #b0d4e8;
    font-size: 0.95em;
  `,
  scanline: `
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.02) 2px, rgba(0,212,255,0.02) 4px);
    pointer-events: none;
    z-index: 1;
  `,
  header: `
    display: flex;
    align-items: center;
    gap: 8px;
    color: #00d4ff;
    font-size: 1.1em;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(0,212,255,0.6);
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #00d4ff33;
  `,
  line: `
    margin: 5px 0;
    padding: 2px 0;
  `,
  highlight: `
    color: #00ffcc;
    font-weight: bold;
    text-shadow: 0 0 6px rgba(0,255,204,0.5);
  `,
  result: `
    color: #ffcc00;
    font-weight: bold;
    font-size: 1.05em;
    text-shadow: 0 0 8px rgba(255,204,0,0.4);
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px dashed #00d4ff33;
  `,
};

/** 隐奸视角标签 — 暗红阴谋风 */
const STYLE_SPY = {
  container: `
    background: linear-gradient(135deg, #1a0a0a 0%, #2b0d0d 50%, #1a0808 100%);
    border: 1px solid #ff222244;
    border-left: 3px solid #ff2222;
    border-radius: 6px;
    padding: 16px 18px;
    margin: 12px 0;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 25px rgba(255,34,34,0.12), inset 0 0 50px rgba(0,0,0,0.4);
    font-family: 'Georgia', 'Noto Serif SC', serif;
    color: #e8c0c0;
    font-size: 0.95em;
    line-height: 1.8;
  `,
  pulseBar: `
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 2px;
    background: linear-gradient(90deg, transparent, #ff2222, transparent);
    animation: spyPulse 3s ease-in-out infinite;
  `,
  header: `
    display: flex;
    align-items: center;
    gap: 8px;
    color: #ff4444;
    font-size: 0.85em;
    font-weight: bold;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid #ff222230;
    letter-spacing: 1.5px;
  `,
  badge: `
    display: inline-block;
    background: #ff222233;
    color: #ff6666;
    padding: 2px 8px;
    border-radius: 3px;
    font-size: 0.75em;
    border: 1px solid #ff222255;
    margin-left: auto;
  `,
};

/** 每日总结标签 — 档案报告风 */
const STYLE_DAILY = {
  container: `
    background: linear-gradient(135deg, #1a1812 0%, #201c14 50%, #1a1710 100%);
    border: 1px solid #8b7355aa;
    border-radius: 4px;
    padding: 16px 18px;
    margin: 12px 0;
    position: relative;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,0.3);
    font-family: 'Courier New', 'Consolas', monospace;
    color: #d4c4a0;
    font-size: 0.92em;
    line-height: 1.7;
  `,
  bindingLine: `
    position: absolute;
    top: 0; bottom: 0; left: 28px;
    width: 2px;
    background: repeating-linear-gradient(180deg, #8b7355 0px, #8b7355 4px, transparent 4px, transparent 8px);
    opacity: 0.4;
  `,
  header: `
    display: flex;
    align-items: center;
    gap: 8px;
    color: #c9a962;
    font-size: 0.95em;
    font-weight: bold;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 2px solid #8b735544;
    letter-spacing: 1px;
  `,
  line: `
    margin: 4px 0;
    padding-left: 20px;
  `,
};

/** 选项标签 — 交互卡片风 */
const STYLE_OPTIONS = {
  container: `
    margin: 16px 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  header: `
    display: flex;
    align-items: center;
    gap: 6px;
    color: #bb86fc;
    font-size: 0.8em;
    font-weight: bold;
    margin-bottom: 4px;
    letter-spacing: 1.5px;
  `,
  button: `
    display: block;
    width: 100%;
    text-align: left;
    background: linear-gradient(135deg, #1a1030 0%, #201540 100%);
    border: 1px solid #bb86fc44;
    border-radius: 8px;
    padding: 12px 16px;
    color: #e0d0f0;
    font-size: 0.95em;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    font-family: inherit;
    line-height: 1.5;
  `,
  buttonHover: `
    background: linear-gradient(135deg, #2a1850 0%, #351f6a 100%);
    border-color: #bb86fcaa;
    box-shadow: 0 0 20px rgba(187,134,252,0.2);
    transform: translateX(4px);
    color: #ffffff;
  `,
  buttonIndex: `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: #bb86fc33;
    border-radius: 50%;
    color: #bb86fc;
    font-size: 0.8em;
    font-weight: bold;
    margin-right: 10px;
    flex-shrink: 0;
  `,
  buttonGlow: `
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(187,134,252,0.08), transparent);
    transition: left 0.5s ease;
  `,
};

// ============ 全局动画样式 ============
const ANIMATION_CSS = `
<style data-beautify-format>
  @keyframes spyPulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  .beautify-option-btn:hover {
    background: linear-gradient(135deg, #2a1850 0%, #351f6a 100%) !important;
    border-color: #bb86fcaa !important;
    box-shadow: 0 0 20px rgba(187,134,252,0.2) !important;
    transform: translateX(4px) !important;
    color: #ffffff !important;
  }
  .beautify-option-btn:hover .beautify-btn-glow {
    left: 100% !important;
  }
  .beautify-option-btn:active {
    transform: translateX(2px) scale(0.98) !important;
  }
</style>
`;

// ============ 报错弹窗系统 ============
interface FormatError {
  type: '标签未闭合' | '标签嵌套' | '选项格式错误' | '内容为空' | '未知标签';
  tag: string;
  detail: string;
  messageId: number;
}

function showFormatError(error: FormatError): void {
  const title = `⚠️ 格式错误 [消息#${error.messageId}]`;
  const msg = `<b>错误类型：</b>${error.type}<br><b>相关标签：</b>&lt;${error.tag}&gt;<br><b>详情：</b>${error.detail}`;

  toastr.error(msg, title, {
    closeButton: true,
    timeOut: 10000,
    extendedTimeOut: 5000,
    progressBar: true,
    escapeHtml: false,
    positionClass: 'toast-top-right',
  });

  console.error(`[格式美化] ${title}`, error);
}

function showFormatWarning(messageId: number, message: string): void {
  const title = `💡 格式提示 [消息#${messageId}]`;
  toastr.warning(message, title, {
    closeButton: true,
    timeOut: 6000,
    progressBar: true,
    positionClass: 'toast-top-right',
  });
  console.warn(`[格式美化] ${title}:`, message);
}

// ============ 需要屏蔽的标签 ============
const TAGS_TO_HIDE = ['thinking', 'think', 'daily_summary', 'VariableThink', 'VariableInsert'];

// ============ 标签验证 ============
const KNOWN_TAGS = ['正文', '遭遇判定', '隐奸视角', '每日总结', '选项'];

function validateTags(rawMessage: string, messageId: number): FormatError[] {
  const errors: FormatError[] = [];

  for (const tag of KNOWN_TAGS) {
    const openRegex = new RegExp(`<${tag}>`, 'g');
    const closeRegex = new RegExp(`</${tag}>`, 'g');
    const openCount = (rawMessage.match(openRegex) || []).length;
    const closeCount = (rawMessage.match(closeRegex) || []).length;

    if (openCount > 0 && closeCount === 0) {
      errors.push({
        type: '标签未闭合',
        tag,
        detail: `找到 <${tag}> 开始标签但缺少 </${tag}> 闭合标签`,
        messageId,
      });
    }
    if (openCount === 0 && closeCount > 0) {
      errors.push({
        type: '标签未闭合',
        tag,
        detail: `找到 </${tag}> 闭合标签但缺少 <${tag}> 开始标签`,
        messageId,
      });
    }
    if (openCount > 1 || closeCount > 1) {
      errors.push({
        type: '标签嵌套',
        tag,
        detail: `<${tag}> 标签出现了 ${openCount} 次开启和 ${closeCount} 次闭合，应各只出现1次`,
        messageId,
      });
    }
  }

  // 检测标签嵌套
  for (const outerTag of KNOWN_TAGS) {
    const outerMatch = rawMessage.match(new RegExp(`<${outerTag}>([\\s\\S]*?)</${outerTag}>`));
    if (outerMatch) {
      const innerContent = outerMatch[1];
      for (const innerTag of KNOWN_TAGS) {
        if (innerTag !== outerTag && innerContent.includes(`<${innerTag}>`)) {
          errors.push({
            type: '标签嵌套',
            tag: innerTag,
            detail: `<${innerTag}> 被错误地嵌套在 <${outerTag}> 内部，标签之间不可嵌套`,
            messageId,
          });
        }
      }
    }
  }

  // 验证选项格式
  const optionMatch = rawMessage.match(/<选项>([\s\S]*?)<\/选项>/);
  if (optionMatch) {
    const optionText = optionMatch[1].trim();
    if (!optionText) {
      errors.push({
        type: '选项格式错误',
        tag: '选项',
        detail: '选项内容为空',
        messageId,
      });
    } else {
      const options = optionText.split('|');
      if (options.length !== 4) {
        errors.push({
          type: '选项格式错误',
          tag: '选项',
          detail: `选项数量应为4个（用|分隔），当前为 ${options.length} 个。内容：「${optionText.substring(0, 80)}」`,
          messageId,
        });
      }
      for (let i = 0; i < options.length; i++) {
        if (!options[i].trim()) {
          errors.push({
            type: '选项格式错误',
            tag: '选项',
            detail: `第 ${i + 1} 个选项内容为空`,
            messageId,
          });
        }
      }
    }
  }

  return errors;
}

// ============ HTML 转义 ============
function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ============ 正文美化 ============
function beautifyMainText(content: string): string {
  // 将段落按空行分段
  const paragraphs = content
    .trim()
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);

  let inner = '';
  for (const para of paragraphs) {
    const lines = para
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);
    inner += `<p style="${STYLE_MAIN.content}">${lines.map(l => escapeHtml(l)).join('<br>')}</p>`;
  }

  // 如果没有段落分隔，按行处理
  if (paragraphs.length === 0) {
    const lines = content
      .trim()
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);
    inner = lines.map(l => `<p style="${STYLE_MAIN.content}">${escapeHtml(l)}</p>`).join('');
  }

  return `
    <div style="${STYLE_MAIN.container}">
      <div style="${STYLE_MAIN.header}">
        <span>📖</span> <span>正 文</span>
      </div>
      ${inner}
    </div>
  `;
}

// ============ 遭遇判定美化 ============
function beautifyEncounter(content: string): string {
  const lines = content
    .trim()
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.match(/^[═─]+$/));

  let inner = '';
  for (const line of lines) {
    let formatted = escapeHtml(line);

    // 高亮标题行（包含 ═══ 或 【xxx】 的行）
    if (line.includes('═') || line.match(/【.+】/)) {
      formatted = `<div style="${STYLE_ENCOUNTER.line}; ${STYLE_ENCOUNTER.highlight}">${formatted}</div>`;
    }
    // 高亮判定结果行（→ 开头的行）
    else if (line.startsWith('→') || line.startsWith('→')) {
      formatted = `<div style="${STYLE_ENCOUNTER.line}; ${STYLE_ENCOUNTER.result}">${formatted}</div>`;
    }
    // 高亮数值（xxx: 数字）
    else {
      formatted = formatted.replace(/(\d+)/g, `<span style="color:#00ffcc; font-weight:bold;">$1</span>`);
      formatted = formatted.replace(/(判定结果)/g, `<span style="${STYLE_ENCOUNTER.result}">$1</span>`);
      formatted = `<div style="${STYLE_ENCOUNTER.line}">${formatted}</div>`;
    }

    inner += formatted;
  }

  return `
    <div style="${STYLE_ENCOUNTER.container}">
      <div style="${STYLE_ENCOUNTER.scanline}"></div>
      <div style="position:relative; z-index:2;">
        <div style="${STYLE_ENCOUNTER.header}">
          <span>⚔️</span> <span>遭遇判定</span>
        </div>
        ${inner}
      </div>
    </div>
  `;
}

// ============ 隐奸视角美化 ============
function beautifySpy(content: string): string {
  const paragraphs = content
    .trim()
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);

  let inner = '';
  for (const para of paragraphs) {
    // 跳过标记行
    if (para.includes('——仅用户可见——') || para.includes('隐奸视角')) {
      continue;
    }
    const lines = para
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);
    inner += `<p style="margin: 8px 0; text-indent: 2em;">${lines.map(l => escapeHtml(l)).join('<br>')}</p>`;
  }

  // 如果没有分段，说明段落本身就是一整段
  if (!inner) {
    const lines = content
      .trim()
      .split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.includes('——仅用户可见——') && !l.includes('隐奸视角'));
    inner = lines.map(l => `<p style="margin: 6px 0; text-indent: 2em;">${escapeHtml(l)}</p>`).join('');
  }

  return `
    <div style="${STYLE_SPY.container}">
      <div style="${STYLE_SPY.pulseBar}"></div>
      <div style="${STYLE_SPY.header}">
        <span>🕵️</span>
        <span>隐 奸 视 角</span>
        <span style="${STYLE_SPY.badge}">仅用户可见</span>
      </div>
      ${inner}
    </div>
  `;
}

// ============ 每日总结美化 ============
function beautifyDailySummary(content: string): string {
  const lines = content
    .trim()
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.match(/^[═─]+$/));

  let inner = '';
  for (const line of lines) {
    let formatted = escapeHtml(line);

    // 标题行
    if (line.includes('═') || line.match(/【.+】/) || line.includes('报告') || line.includes('总结')) {
      formatted = `<div style="${STYLE_DAILY.line}; color:#c9a962; font-weight:bold; font-size:1.05em;">${formatted}</div>`;
    }
    // 变化值行（包含 +/- 数字）
    else if (line.match(/[+-]\d+/) || line.includes('变化')) {
      // 高亮正数为绿色，负数为红色
      formatted = formatted.replace(/(\+\d+)/g, `<span style="color:#00cc66; font-weight:bold;">$1</span>`);
      formatted = formatted.replace(/(-\d+)/g, `<span style="color:#ff4444; font-weight:bold;">$1</span>`);
      formatted = `<div style="${STYLE_DAILY.line}">${formatted}</div>`;
    }
    // 普通行
    else {
      formatted = `<div style="${STYLE_DAILY.line}">${formatted}</div>`;
    }

    inner += formatted;
  }

  return `
    <div style="${STYLE_DAILY.container}">
      <div style="${STYLE_DAILY.bindingLine}"></div>
      <div style="position:relative; z-index:1;">
        <div style="${STYLE_DAILY.header}">
          <span>📋</span> <span>每日总结</span>
        </div>
        ${inner}
      </div>
    </div>
  `;
}

// ============ 选项美化 ============
function beautifyOptions(content: string, messageId: number): string {
  const optionTexts = content
    .trim()
    .split('|')
    .map(o => o.trim())
    .filter(Boolean);

  const labels = ['A', 'B', 'C', 'D'];

  let buttons = '';
  for (let i = 0; i < optionTexts.length; i++) {
    const label = labels[i] || `${i + 1}`;
    const text = escapeHtml(optionTexts[i]);
    buttons += `
      <button
        class="beautify-option-btn"
        style="${STYLE_OPTIONS.button}"
        data-option-text="${optionTexts[i].replace(/"/g, '&quot;')}"
        data-message-id="${messageId}"
      >
        <span class="beautify-btn-glow" style="${STYLE_OPTIONS.buttonGlow}"></span>
        <span style="${STYLE_OPTIONS.buttonIndex}">${label}</span>
        <span>${text}</span>
      </button>
    `;
  }

  return `
    <div style="${STYLE_OPTIONS.container}">
      <div style="${STYLE_OPTIONS.header}">
        <span>🎯</span> <span>请选择行动</span>
      </div>
      ${buttons}
    </div>
  `;
}

// ============ 选项点击事件处理 ============
function setupOptionClickHandler(): void {
  $(document)
    .off('click.beautifyOptions')
    .on('click.beautifyOptions', '.beautify-option-btn', async function (this: HTMLElement) {
      const optionText = $(this).data('option-text') as string;
      if (!optionText) {
        toastr.error('选项文本为空，无法发送', '⚠️ 选项错误');
        return;
      }

      console.log(`[格式美化] 用户选择: ${optionText}`);

      // 禁用所有选项按钮防止重复点击
      const $container = $(this).closest(`div`);
      $container.find('.beautify-option-btn').each(function () {
        $(this).prop('disabled', true).css({
          opacity: '0.5',
          pointerEvents: 'none',
        });
      });

      // 高亮选中的按钮
      $(this).css({
        opacity: '1',
        borderColor: '#bb86fc',
        boxShadow: '0 0 15px rgba(187,134,252,0.4)',
        background: 'linear-gradient(135deg, #2a1850 0%, #4a2a8a 100%)',
      });

      // 使用 /send + /trigger 管道命令发送用户消息并触发 AI 回复
      try {
        await triggerSlash(`/send ${optionText} | /trigger`);
      } catch (e) {
        console.error('[格式美化] 发送消息失败:', e);
        toastr.error(`发送选项「${optionText}」失败: ${e}`, '⚠️ 发送错误', {
          closeButton: true,
          timeOut: 8000,
        });
      }
    });
}

// ============ 屏蔽思考标签 ============
function hideThinkingTags(messageId: number): void {
  const $mes = retrieveDisplayedMessage(messageId);
  if (!$mes.length) return;

  let html = $mes.html();
  if (!html) return;

  const originalHtml = html;

  for (const tag of TAGS_TO_HIDE) {
    // 匹配转义形式 &lt;tag&gt;...&lt;/tag&gt;
    html = html.replace(new RegExp(`&lt;${tag}&gt;[\\s\\S]*?&lt;\\/${tag}&gt;`, 'gi'), '');

    // 匹配原始 HTML 形式 <tag>...</tag>
    html = html.replace(new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi'), '');

    // 匹配单独残留的标签文本
    html = html.replace(new RegExp(`&lt;\\/?${tag}[^&]*&gt;`, 'gi'), '');
  }

  if (html !== originalHtml) {
    // 清理多余空段落
    html = html.replace(/<p>\s*<\/p>/gi, '');
    html = html.replace(/<p>\s*<br\s*\/?>/gi, '<p>');
    $mes.html(html);
    console.log(`[格式美化] 消息 #${messageId} 已屏蔽思考标签`);
  }
}

// ============ 辅助：从原始文本中去除 thinking 标签 ============
function stripThinkingFromRaw(raw: string): string {
  let cleaned = raw;
  for (const tag of TAGS_TO_HIDE) {
    cleaned = cleaned.replace(new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi'), '');
  }
  return cleaned;
}

// ============ 辅助：取最后一个匹配 ============
function getLastMatch(text: string, regex: RegExp): RegExpMatchArray | null {
  const matches = [...text.matchAll(regex)];
  return matches.length > 0 ? matches[matches.length - 1] : null;
}

// ============ 在已渲染 HTML 中定位标签并局部替换 ============
function replaceTagInHtml(
  html: string,
  tagName: string,
  rawMessage: string,
  beautifier: (content: string) => string,
): string {
  // 从原始消息中提取最后一个标签内容
  const lastMatch = getLastMatch(rawMessage, new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'g'));
  if (!lastMatch) return html;

  const content = lastMatch[1].trim();
  if (!content) return html;

  const beautified = beautifier(content);

  // 在 HTML 中匹配转义形式的标签: &lt;标签名&gt;...&lt;/标签名&gt;
  const escapedRegex = new RegExp(`&lt;${tagName}&gt;[\\s\\S]*?&lt;\\/${tagName}&gt;`, 'gi');
  if (escapedRegex.test(html)) {
    // 重置 lastIndex（test 会改变 lastIndex）
    escapedRegex.lastIndex = 0;
    return html.replace(escapedRegex, beautified);
  }

  // 也匹配可能的原始 HTML 形式（酒馆有时直接渲染）
  const rawRegex = new RegExp(`<${tagName}>[\\s\\S]*?<\\/${tagName}>`, 'gi');
  if (rawRegex.test(html)) {
    rawRegex.lastIndex = 0;
    return html.replace(rawRegex, beautified);
  }

  // 如果标签在 HTML 中被酒馆渲染为 <p> 段落等，尝试匹配残留标签文本
  // 先清理标签文本，然后在该位置插入美化内容
  const tagOpenEsc = `&lt;${tagName}&gt;`;
  const tagCloseEsc = `&lt;/${tagName}&gt;`;
  const tagOpenRaw = `<${tagName}>`;
  const tagCloseRaw = `</${tagName}>`;

  // 检查是否有散落的标签文本（被 <p> 等包裹分割了）
  if (html.includes(tagOpenEsc) || html.includes(tagOpenRaw)) {
    // 移除开关标签文本并在开标签位置插入美化内容
    let result = html;
    // 替换开标签为美化内容
    result = result.replace(
      new RegExp(`(?:<p>\\s*)?${tagOpenEsc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\s*</p>)?`, 'gi'),
      beautified,
    );
    result = result.replace(
      new RegExp(`(?:<p>\\s*)?${tagOpenRaw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\s*</p>)?`, 'gi'),
      beautified,
    );
    // 移除闭标签
    result = result.replace(
      new RegExp(`(?:<p>\\s*)?${tagCloseEsc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\s*</p>)?`, 'gi'),
      '',
    );
    result = result.replace(
      new RegExp(`(?:<p>\\s*)?${tagCloseRaw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\s*</p>)?`, 'gi'),
      '',
    );
    return result;
  }

  return html;
}

// ============ 主处理函数（在酒馆渲染后的 HTML 上局部替换标签） ============
function processMessage(messageId: number): void {
  try {
    const $mes = retrieveDisplayedMessage(messageId);
    if (!$mes.length) return;

    // 先屏蔽显示中的思考标签
    hideThinkingTags(messageId);

    // 如果已经美化过，跳过
    if ($mes.data('beautified')) return;

    // 获取原始消息内容
    const chatMessages = getChatMessages(messageId);
    if (!chatMessages || chatMessages.length === 0) return;

    const rawMessage = chatMessages[0].message;
    if (!rawMessage) return;

    // 先从原始文本中去除 thinking 内容，避免匹配到思维链中的标签
    const cleanedMessage = stripThinkingFromRaw(rawMessage);

    // 检测是否有需要美化的标签
    const hasTags = KNOWN_TAGS.some(tag => cleanedMessage.includes(`<${tag}>`));
    if (!hasTags) return;

    console.log(`[格式美化] 消息 #${messageId} 开始处理`);

    // 获取酒馆已渲染的 HTML（包含正则处理结果）
    let html = $mes.html();
    if (!html) return;

    // 注入动画样式（仅一次，检查是否已存在）
    if (!html.includes('data-beautify-format')) {
      html = ANIMATION_CSS + html;
    }

    // 在已渲染 HTML 上对每个标签做局部替换（保留正则等其他处理结果）
    html = replaceTagInHtml(html, '正文', cleanedMessage, c => beautifyMainText(c));
    html = replaceTagInHtml(html, '遭遇判定', cleanedMessage, c => beautifyEncounter(c));
    html = replaceTagInHtml(html, '隐奸视角', cleanedMessage, c => beautifySpy(c));
    html = replaceTagInHtml(html, '每日总结', cleanedMessage, c => beautifyDailySummary(c));
    html = replaceTagInHtml(html, '选项', cleanedMessage, c => beautifyOptions(c, messageId));

    // 清理可能残留的空段落
    html = html.replace(/<p>\s*<\/p>/gi, '');
    html = html.replace(/<p>\s*<br\s*\/?>/gi, '<p>');

    $mes.html(html);
    $mes.data('beautified', true);
    console.log(`[格式美化] 消息 #${messageId} 美化完成`);
  } catch (e) {
    console.error(`[格式美化] 处理消息 #${messageId} 时发生未预期错误:`, e);
    toastr.error(
      `处理消息 #${messageId} 时出错: ${e instanceof Error ? e.message : String(e)}`,
      '❌ 格式美化脚本错误',
      {
        closeButton: true,
        timeOut: 10000,
        progressBar: true,
      },
    );
  }
}

// ============ 批量处理所有消息 ============
function processAllMessages(): void {
  try {
    const lastId = getLastMessageId();
    let processed = 0;
    for (let i = 0; i <= lastId; i++) {
      const $mes = retrieveDisplayedMessage(i);
      if ($mes.length && !$mes.data('beautified')) {
        processMessage(i);
        processed++;
      }
    }
    if (processed > 0) {
      console.log(`[格式美化] 批量处理完成，共处理 ${processed} 条消息`);
    }
  } catch (e) {
    console.error('[格式美化] 批量处理时出错:', e);
  }
}

// ============ 初始化 ============
$(() => {
  console.log('[格式美化脚本] 已加载 — 正文+选项美化 + 思考屏蔽');

  // 注册选项点击事件
  setupOptionClickHandler();

  // AI 消息渲染
  eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, (messageId: number) => {
    processMessage(messageId);
  });

  // 消息更新（流式传输完成后）
  eventOn(tavern_events.MESSAGE_UPDATED, (messageId: number) => {
    // 清除已处理标记以便重新渲染
    const $mes = retrieveDisplayedMessage(messageId);
    if ($mes.length) {
      $mes.data('beautified', false);
    }
    processMessage(messageId);
  });

  // 聊天切换
  eventOn(tavern_events.CHAT_CHANGED, () => {
    setTimeout(() => {
      processAllMessages();
    }, 500);
  });

  // 初始化处理现有消息
  setTimeout(() => {
    processAllMessages();
  }, 1000);
});

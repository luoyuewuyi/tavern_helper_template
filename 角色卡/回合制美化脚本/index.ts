// 高达科幻主题战斗面板美化脚本
// 用于美化 <battle_panel> 标签内的战斗数据

// ============ 样式配置 ============
const STYLES = {
  // 主容器样式 - 深空黑 + 霓虹边框
  container: `
    background: linear-gradient(135deg, #0a0a0f 0%, #0d1520 50%, #0a0f14 100%);
    border: 1px solid #00d4ff44;
    border-radius: 8px;
    padding: 16px;
    margin: 12px 0;
    position: relative;
    overflow: hidden;
    box-shadow:
      0 0 20px rgba(0, 212, 255, 0.15),
      inset 0 0 60px rgba(0, 0, 0, 0.5);
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  `,

  // 扫描线效果
  scanline: `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 212, 255, 0.03) 2px,
      rgba(0, 212, 255, 0.03) 4px
    );
    pointer-events: none;
    z-index: 1;
  `,

  // 回合头样式 (青色) - 回合数、距离、行动
  roundHeader: `
    color: #00d4ff;
    font-size: 1.15em;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(0, 212, 255, 0.8);
    border-bottom: 1px solid #00d4ff44;
    padding-bottom: 10px;
    margin-bottom: 12px;
  `,

  // 回合标题
  roundTitle: `
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  `,

  // 状态变化区 (橙红色) - HP/EN/精神韧性
  statusSection: `
    color: #ff6b35;
    background: rgba(255, 107, 53, 0.08);
    border-left: 3px solid #ff6b35;
    padding: 10px 12px;
    margin: 10px 0;
    font-size: 0.95em;
  `,

  // 关键判定区 (蓝色) - 命中/暴击/伤害/回避
  judgmentSection: `
    color: #66ccff;
    background: rgba(102, 204, 255, 0.08);
    border-left: 3px solid #66ccff;
    padding: 10px 12px;
    margin: 10px 0;
    font-size: 0.95em;
  `,

  // 子项目样式 - 用于判定细节
  subItem: `
    color: #88eeff;
    padding-left: 24px;
    margin: 3px 0;
    font-size: 0.9em;
    opacity: 0.95;
  `,

  // 节标题
  sectionTitle: `
    font-weight: bold;
    font-size: 1.05em;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  `,

  // 分隔线
  divider: `
    border: none;
    height: 1px;
    background: linear-gradient(90deg, transparent, #00d4ff44, transparent);
    margin: 12px 0;
  `,

  // 发光圆点图标
  icon: `
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    box-shadow: 0 0 8px currentColor;
  `,
};

// ============ 内容解析器 ============
interface ParsedBattlePanel {
  roundInfo: string[]; // 【回合: X】及行动描述
  statusChanges: string[]; // 状态变化（HP/EN/精神韧性）
  judgments: string[]; // 关键判定
}

function parseBattlePanelContent(content: string): ParsedBattlePanel {
  const result: ParsedBattlePanel = {
    roundInfo: [],
    statusChanges: [],
    judgments: [],
  };

  content = content.trim();
  const lines = content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && line !== '---');

  let currentSection: 'roundInfo' | 'statusChanges' | 'judgments' = 'roundInfo';

  for (const line of lines) {
    // 检测节标记
    if (line.includes('【关键判定】') || line.includes('关键判定')) {
      currentSection = 'judgments';
      continue;
    }
    if (line.includes('状态变化】') || line.includes('【目标状态') || line.includes('状态变化')) {
      currentSection = 'statusChanges';
      continue;
    }
    if (line.includes('【回合') || line.match(/回合[:\s：]*\d+/)) {
      currentSection = 'roundInfo';
      result.roundInfo.push(line);
      continue;
    }

    // 根据当前节添加内容
    switch (currentSection) {
      case 'roundInfo':
        result.roundInfo.push(line);
        break;
      case 'statusChanges':
        result.statusChanges.push(line);
        break;
      case 'judgments':
        result.judgments.push(line);
        break;
    }
  }

  return result;
}

// ============ HTML 生成器 ============
function generateBeautifiedHtml(content: string): string {
  const parsed = parseBattlePanelContent(content);

  const animationStyles = `
    <style>
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
      @keyframes glow { 0% { box-shadow: 0 0 5px currentColor; } 100% { box-shadow: 0 0 15px currentColor; } }
    </style>
  `;

  let html = `${animationStyles}<div style="${STYLES.container}">`;
  html += `<div style="${STYLES.scanline}"></div>`;
  html += `<div style="position: relative; z-index: 2;">`;

  // 状态变化区（状态监测）
  if (parsed.statusChanges.length > 0) {
    html += `<div style="${STYLES.statusSection}">`;
    html += `<div style="${STYLES.sectionTitle}"><span style="${STYLES.icon} background: #ff6b35;"></span><span style="color:#ff6b35;">状态监测</span></div>`;
    for (const line of parsed.statusChanges) {
      html += `<div style="margin: 4px 0;">${formatStatusLine(line)}</div>`;
    }
    html += `</div>`;
  }

  // 关键判定区
  if (parsed.judgments.length > 0) {
    html += `<hr style="${STYLES.divider}">`;
    html += `<div style="${STYLES.judgmentSection}">`;
    html += `<div style="${STYLES.sectionTitle}"><span style="${STYLES.icon} background: #66ccff;"></span><span style="color:#66ccff;">关键判定</span></div>`;
    for (const line of parsed.judgments) {
      const isSubItem = line.startsWith('*') || line.startsWith('○') || line.startsWith('◦') || line.startsWith('-');
      if (isSubItem) {
        html += `<div style="${STYLES.subItem}">${formatJudgmentLine(line)}</div>`;
      } else {
        html += `<div style="margin: 6px 0;">${formatJudgmentLine(line)}</div>`;
      }
    }
    html += `</div>`;
  }

  html += `</div></div>`;
  return html;
}

// ============ 格式化函数 ============
function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatRoundLine(line: string): string {
  let formatted = escapeHtml(line);

  // 高亮回合数
  formatted = formatted.replace(
    /(【回合[:\s：]*\d+】|回合[:\s：]*\d+)/g,
    '<span style="color:#00ffcc;font-weight:bold;text-shadow:0 0 8px #00ffcc;">$1</span>',
  );

  // 高亮距离
  formatted = formatted.replace(/(目标距离[:\s：]*[^\n,，]+)/g, '<span style="color:#88ddff;">$1</span>');

  // 高亮行动描述
  formatted = formatted.replace(/(行动[:\s：])/g, '<span style="color:#ffcc00;">$1</span>');

  // 高亮目标
  formatted = formatted.replace(/(\(目标[:\s：]*[^)]+\))/g, '<span style="color:#ff9966;">$1</span>');

  return formatted;
}

function formatStatusLine(line: string): string {
  let formatted = escapeHtml(line);

  // HP高亮 - 红色
  formatted = formatted.replace(/(HP[:\s：]*\d+\/\d+)/g, '<span style="color:#ff6666;font-weight:bold;">$1</span>');
  formatted = formatted.replace(/(HP[:\s：]*当前\/最大[^)]*\))/g, '<span style="color:#ff6666;">$1</span>');

  // EN高亮 - 绿色
  formatted = formatted.replace(/(EN[:\s：]*\d+\/\d+)/g, '<span style="color:#00ff88;font-weight:bold;">$1</span>');
  formatted = formatted.replace(/(EN[:\s：]*当前\/最大[^)]*\))/g, '<span style="color:#00ff88;">$1</span>');

  // 精神韧性/压力 - 紫色
  formatted = formatted.replace(/(精神韧性|精神压力)/g, '<span style="color:#cc66ff;font-weight:bold;">$1</span>');

  // 状态标签高亮
  formatted = formatted.replace(
    /(\[状态[:\s：]*[^\]]+\])/g,
    '<span style="color:#ffaa00;font-weight:bold;text-shadow:0 0 5px #ffaa00;">$1</span>',
  );

  // 变化值
  formatted = formatted.replace(/(\([+-]\d+[^)]*\))/g, '<span style="color:#ffcc66;">$1</span>');

  return formatted;
}

function formatJudgmentLine(line: string): string {
  let formatted = escapeHtml(line);

  // 成功结果 - 绿色高亮
  formatted = formatted.replace(
    /(\*\*成功[^*]*\*\*|成功|命中|暴击!|触发)/g,
    '<span style="color:#00ff88;font-weight:bold;text-shadow:0 0 8px #00ff88;">$1</span>',
  );

  // 失败结果 - 红色高亮
  formatted = formatted.replace(
    /(\*\*失败[^*]*\*\*|失败|未命中|未触发)/g,
    '<span style="color:#ff4444;font-weight:bold;">$1</span>',
  );

  // d100掷骰 - 黄色
  formatted = formatted.replace(/(d100掷骰\s*\d+)/g, '<span style="color:#ffff00;font-weight:bold;">$1</span>');

  // 百分比 - 青色
  formatted = formatted.replace(/(\d+%)/g, '<span style="color:#00d4ff;">$1</span>');

  // DC值 - 橙色
  formatted = formatted.replace(/(DC\s*\d+)/g, '<span style="color:#ff8800;font-weight:bold;">$1</span>');

  // 最终伤害 - 红橙色
  formatted = formatted.replace(
    /(最终伤害\s*\d+|伤害[:\s：]*\d+)/g,
    '<span style="color:#ff6633;font-weight:bold;text-shadow:0 0 5px #ff6633;">$1</span>',
  );

  // 命中率/回避率/暴击率
  formatted = formatted.replace(
    /(最终(?:命中率|回避率|暴击率|效果命中率)\s*\d+%)/g,
    '<span style="color:#66ccff;">$1</span>',
  );

  // 检定类型标签
  formatted = formatted.replace(
    /(命中检定|暴击检定|回避检定|伤害计算|效果触发检定|抵抗检定|对抗检定)/g,
    '<span style="color:#aaddff;font-weight:bold;">$1</span>',
  );

  // 武器/技能名
  formatted = formatted.replace(
    /\[([^\]]+)\]/g,
    '<span style="color:#ffcc66;">[<span style="color:#ffdd88;">$1</span>]</span>',
  );

  return formatted;
}

// ============ HTML 清理函数 ============
function stripHtmlTags(html: string): string {
  // 将 HTML 转换为纯文本，保留换行结构
  let text = html;

  // 处理列表项 - 转换为带符号的行
  text = text.replace(/<li[^>]*>/gi, '* ');
  text = text.replace(/<\/li>/gi, '\n');

  // 处理标题 - 保留文本并添加换行
  text = text.replace(/<h[1-6][^>]*>/gi, '\n');
  text = text.replace(/<\/h[1-6]>/gi, '\n');

  // 处理换行标签
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<\/p>\s*<p>/gi, '\n');
  text = text.replace(/<p[^>]*>/gi, '\n');
  text = text.replace(/<\/p>/gi, '\n');

  // 处理块级元素
  text = text.replace(/<\/?(?:div|ul|ol|blockquote|pre|details|summary)[^>]*>/gi, '\n');

  // 移除所有其他 HTML 标签
  text = text.replace(/<\/?[^>]+>/gi, '');

  // 解码 HTML 实体
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  text = text.replace(/&nbsp;/g, ' ');

  // 清理多余的空白行
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
}

// ============ 美化处理函数 ============
function beautifyBattlePanel(message_id: number): void {
  const $mes = retrieveDisplayedMessage(message_id);
  if (!$mes.length) return;

  // 获取原始消息内容（未经酒馆渲染处理，标签完整）
  const chatMessages = getChatMessages(message_id);
  if (!chatMessages || chatMessages.length === 0) return;

  const rawMessage = chatMessages[0].message;
  if (!rawMessage) return;

  // 只匹配 <battle_panel> 标签，不使用任何备用方案
  const battlePanelMatch = rawMessage.match(/<battle_panel>([\s\S]*?)<\/battle_panel>/i);
  if (!battlePanelMatch) {
    // 没有 battle_panel 标签，直接返回不处理
    return;
  }

  console.log(`[战斗面板美化] 消息 ${message_id} 找到 battle_panel 标签`);

  // 提取并清理 battle_panel 内的原始内容
  const battleContent = battlePanelMatch[1].trim();

  // 生成美化 HTML
  const beautifiedHtml = generateBeautifiedHtml(battleContent);

  // 在显示的消息中替换战斗面板区域
  let html = $mes.html();
  if (!html) return;

  // 先移除显示的 <battle_panel> 标签文本（可能以转义形式存在）
  html = html.replace(/&lt;battle_panel&gt;/gi, '');
  html = html.replace(/&lt;\/battle_panel&gt;/gi, '');
  html = html.replace(/<battle_panel>/gi, '');
  html = html.replace(/<\/battle_panel>/gi, '');

  // 匹配战斗数据内容并替换
  const newHtml = html.replace(
    /(【回合[\s\S]*?【关键判定】[\s\S]*?)(?=<\/p>\s*<p>(?![\s\S]*?【)|<hr|<\/p>\s*$|$)/gi,
    beautifiedHtml,
  );

  if (newHtml !== html) {
    console.log(`[战斗面板美化] 消息 ${message_id} 美化完成`);
    $mes.html(newHtml);
  }
}

// ============ 隐藏不需要的标签 ============
// 需要隐藏的标签列表
const TAGS_TO_HIDE = [
  'battle_panel',
  'thinking',
  'VariableThink',
  'VariableInsert',
  'Anchor_\\d*',
  'Anchor',
  'summary',
  'options',
  'era_data',
  'StatusPlaceHolderImpl',
  'time_location',
  'objective_hint',
  'emotion_check',
];

function hideUnwantedTags(message_id: number): void {
  const $mes = retrieveDisplayedMessage(message_id);
  if (!$mes.length) return;

  let html = $mes.html();
  if (!html) return;

  let changed = false;

  // 移除每个需要隐藏的标签及其内容
  for (const tag of TAGS_TO_HIDE) {
    // 匹配转义形式 &lt;tag&gt;...&lt;/tag&gt;
    const escapedRegex = new RegExp(`&lt;${tag}&gt;[\\s\\S]*?&lt;\\/${tag}&gt;`, 'gi');
    if (escapedRegex.test(html)) {
      html = html.replace(escapedRegex, '');
      changed = true;
    }

    // 匹配原始形式 <tag>...</tag>
    const rawRegex = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi');
    if (rawRegex.test(html)) {
      html = html.replace(rawRegex, '');
      changed = true;
    }

    // 匹配单独的标签文本（可能没有被正确解析）
    const tagTextRegex = new RegExp(`&lt;\\/?${tag}[^&]*&gt;`, 'gi');
    if (tagTextRegex.test(html)) {
      html = html.replace(tagTextRegex, '');
      changed = true;
    }
  }

  // 移除 <!-- comment --> HTML 注释
  if (html.includes('&lt;!--')) {
    html = html.replace(/&lt;!--[\s\S]*?--&gt;/gi, '');
    changed = true;
  }

  // 清理多余的空段落
  html = html.replace(/<p>\s*<\/p>/gi, '');
  html = html.replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, '');

  if (changed) {
    console.log(`[标签隐藏] 消息 ${message_id} 已清理无关标签`);
    $mes.html(html);
  }
}

// ============ 消息处理入口 ============
function processMessage(message_id: number): void {
  hideUnwantedTags(message_id);
  beautifyBattlePanel(message_id);
}

// ============ 初始化 ============
$(() => {
  console.log('[战斗面板美化脚本] 已加载 - 高达科幻主题 + 标签隐藏');

  eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, (message_id: number) => {
    processMessage(message_id);
  });

  eventOn(tavern_events.USER_MESSAGE_RENDERED, (message_id: number) => {
    processMessage(message_id);
  });

  eventOn(tavern_events.MESSAGE_UPDATED, (message_id: number) => {
    processMessage(message_id);
  });

  eventOn(tavern_events.CHAT_CHANGED, () => {
    setTimeout(() => {
      const lastId = getLastMessageId();
      for (let i = 0; i <= lastId; i++) {
        processMessage(i); // Changed to processMessage
      }
    }, 500);
  });

  // 初始化处理现有消息
  setTimeout(() => {
    const lastId = getLastMessageId();
    for (let i = 0; i <= lastId; i++) {
      beautifyBattlePanel(i);
    }
  }, 1000);
});

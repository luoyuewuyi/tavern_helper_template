import { teleportStyle } from '../../util/script';

$(() => {
  // --- 配置与常量 ---
  const THOUGHT_REGEX = /<thought>([\s\S]*?)<\/thought>|（思维：([\s\S]*?)）/g;

  // --- 样式注入 ---
  const { destroy: destroyStyle } = teleportStyle();

  const injectCSS = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&display=swap');

    :root {
      --fantasy-gold: #8b6c42;
      --fantasy-gold-bright: #f1c40f;
      --fantasy-parchment: #fdf5e6;
      --fantasy-ruby: #9b111e;
      --fantasy-magic: #8e44ad;
      --fantasy-shadow: 0 15px 45px rgba(0,0,0,0.6);
      --fantasy-ink: #2c1e11;
    }

    /* 羊皮纸纹理增强 */
    .mes_text {
      font-family: 'Crimson Text', serif !important;
      font-size: 1.15em !important;
      line-height: 1.7 !important;
      color: var(--fantasy-ink) !important;
      background: var(--fantasy-parchment) !important;
      background-image:
        radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 100%),
        url('https://www.transparenttextures.com/patterns/parchment.png') !important;
      border: 3px double var(--fantasy-gold) !important;
      border-radius: 4px !important;
      padding: 25px 30px !important;
      box-shadow: var(--fantasy-shadow) !important;
      position: relative;
      margin-bottom: 25px !important;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      overflow: visible !important;
    }

    /* 金色流光动画 */
    @keyframes golden-shimmer {
      0% { box-shadow: 0 0 5px var(--fantasy-gold); }
      50% { box-shadow: 0 0 20px var(--fantasy-gold-bright), inset 0 0 15px rgba(241, 196, 15, 0.2); }
      100% { box-shadow: 0 0 5px var(--fantasy-gold); }
    }

    .mes_text:hover {
      animation: golden-shimmer 2s infinite;
      transform: translateY(-2px);
    }

    /* 史诗角标装饰 */
    .mes_text::before, .mes_text::after {
      content: '';
      position: absolute;
      width: 40px;
      height: 40px;
      pointer-events: none;
    }

    .mes_text::before {
      top: -5px; left: -5px;
      border-top: 3px solid var(--fantasy-gold-bright);
      border-left: 3px solid var(--fantasy-gold-bright);
    }

    .mes_text::after {
      bottom: -5px; right: -5px;
      border-bottom: 3px solid var(--fantasy-gold-bright);
      border-right: 3px solid var(--fantasy-gold-bright);
    }

    /* 符合西幻审美的思维链容器 */
    .thought-container {
      margin: 20px 0;
      border: 1px solid rgba(139, 108, 66, 0.3);
      background: linear-gradient(135deg, rgba(142, 68, 173, 0.05) 0%, rgba(139, 108, 66, 0.05) 100%);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
    }

    .thought-header {
      padding: 10px 15px;
      background: rgba(142, 68, 173, 0.08);
      border-bottom: 1px solid rgba(139, 108, 66, 0.2);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: 'Cinzel', serif;
      font-size: 0.85em;
      letter-spacing: 1px;
      color: var(--fantasy-magic);
      transition: all 0.3s ease;
    }

    .thought-header:hover {
      background: rgba(142, 68, 173, 0.15);
      color: var(--fantasy-gold-bright);
    }

    .thought-header .icon {
      font-size: 0.8em;
      transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    .thought-content {
      padding: 0 20px;
      max-height: 0;
      opacity: 0;
      font-style: italic;
      color: #795548;
      font-size: 0.95em;
      transition: all 0.5s ease-out;
      border-top: 0px solid transparent;
    }

    /* 展开态魔力涌动 */
    .thought-container.expanded {
      border-color: var(--fantasy-magic);
      box-shadow: 0 0 15px rgba(142, 68, 173, 0.2);
    }

    .thought-container.expanded .thought-content {
      padding: 15px 20px;
      max-height: 2000px;
      opacity: 1;
      border-top: 1px solid rgba(142, 68, 173, 0.1);
    }

    .thought-container.expanded .thought-header .icon {
      transform: rotate(180deg) scale(1.2);
      color: var(--fantasy-gold-bright);
    }

    /* 魔法文字脉冲 */
    @keyframes magic-rune-glow {
      0%, 100% { opacity: 0.6; text-shadow: 0 0 2px var(--fantasy-magic); }
      50% { opacity: 1; text-shadow: 0 0 8px var(--fantasy-magic), 1px 1px 2px black; }
    }

    .magic-text {
      animation: magic-rune-glow 3s infinite;
      font-weight: bold;
    }

    /* 适配窄屏 */
    @media (max-width: 600px) {
      .mes_text {
        padding: 15px 20px !important;
        font-size: 1.05em !important;
      }
    }
  `;

  const $style = $('<style>').text(injectCSS).appendTo('head');

  // --- 核心功能：处理思维链 ---
  function processMessage($mes: JQuery) {
    if ($mes.data('processed-thought')) return;
    $mes.data('processed-thought', true);

    const html = $mes.html();
    let hasThought = false;

    // 替换 <thought> 标签或 (思维：...)
    const newHtml = html.replace(THOUGHT_REGEX, (_match, p1, p2) => {
      const content = p1 || p2;
      hasThought = true;
      return `
        <div class="thought-container">
          <div class="thought-header">
            <span class="icon">▶</span>
            <span class="magic-text">✧ 显现。深邃的心声...</span>
          </div>
          <div class="thought-content">${content}</div>
        </div>
      `;
    });

    if (hasThought) {
      $mes.html(newHtml);

      // 绑定点击事件
      $mes.find('.thought-header').on('click', function () {
        $(this).closest('.thought-container').toggleClass('expanded');
      });
    }
  }

  // --- 监听消息变化 ---
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        $(mutation.addedNodes).each(function () {
          const $node = $(this);
          // 如果增加的是消息容器
          if ($node.hasClass('mes')) {
            processMessage($node.find('.mes_text'));
          } else {
            // 或者正在现有消息中加载内容（流式传输）
            $node.find('.mes_text').each(function () {
              processMessage($(this));
            });
          }
        });
      }
    });
  });

  const chatConfig = { childList: true, subtree: true };
  const $chat = $('#chat');
  if ($chat.length) {
    observer.observe($chat[0], chatConfig);
    // 处理已有消息
    $chat.find('.mes_text').each(function () {
      processMessage($(this));
    });
  }

  // --- 清理函数 ---
  $(window).on('pagehide', () => {
    observer.disconnect();
    destroyStyle();
    $style.remove();
  });

  console.log('西幻主题助手脚本已启动 - 魔法共鸣中...');
});

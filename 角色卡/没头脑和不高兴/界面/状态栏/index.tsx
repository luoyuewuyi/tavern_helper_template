import './style.css';

declare const Mvu: {
  getMvuData: (options: { type: 'message'; message_id: number | string }) => unknown;
};
declare const _: {
  get: <T = unknown>(object: unknown, path: string, defaultValue?: T) => T;
  clamp: (value: number, lower: number, upper: number) => number;
};
declare function waitGlobalInitialized(name: string): Promise<void>;
declare function getCurrentMessageId(): number;

type Tone = 'sword' | 'demon';

type StatData = {
  realms: {
    user: string;
    baili: string;
    tingyu: string;
  };
  bonds: {
    baili: number;
    tingyu: number;
  };
  cultivation: {
    bailiSevenEmotions: number;
    userEmotionalSword: number;
  };
};

const DEFAULT_DATA: StatData = {
  realms: {
    user: '元婴前期',
    baili: '元婴前期',
    tingyu: '炼气巅峰',
  },
  bonds: {
    baili: 0,
    tingyu: 0,
  },
  cultivation: {
    bailiSevenEmotions: 0,
    userEmotionalSword: 0,
  },
};

function readStatData(): StatData {
  const variables = Mvu.getMvuData({ type: 'message', message_id: getCurrentMessageId() });
  return {
    realms: {
      user: toText(_.get(variables, 'stat_data.角色状态.主角境界', DEFAULT_DATA.realms.user), DEFAULT_DATA.realms.user),
      baili: toText(_.get(variables, 'stat_data.角色状态.白荔境界', DEFAULT_DATA.realms.baili), DEFAULT_DATA.realms.baili),
      tingyu: toText(_.get(variables, 'stat_data.角色状态.庭玉境界', DEFAULT_DATA.realms.tingyu), DEFAULT_DATA.realms.tingyu),
    },
    bonds: {
      baili: toPercent(_.get(variables, 'stat_data.羁绊系统.白荔羁绊值', 0)),
      tingyu: toPercent(_.get(variables, 'stat_data.羁绊系统.庭玉羁绊值', 0)),
    },
    cultivation: {
      bailiSevenEmotions: toPercent(_.get(variables, 'stat_data.功法领悟系统.白荔七情进度', 0)),
      userEmotionalSword: toPercent(_.get(variables, 'stat_data.功法领悟系统.主角有情剑进度', 0)),
    },
  };
}

function toText(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function escapeHtml(value: string): string {
  const amp = String.fromCharCode(38);
  return value
    .replaceAll(amp, `${amp}amp;`)
    .replaceAll('<', `${amp}lt;`)
    .replaceAll('>', `${amp}gt;`);
}

function toPercent(value: unknown): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? _.clamp(numeric, 0, 100) : 0;
}

function formatPercent(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function stageLabel(value: number, labels: [string, string, string, string]): string {
  if (value >= 75) return labels[3];
  if (value >= 45) return labels[2];
  if (value >= 20) return labels[1];
  return labels[0];
}

function icon(name: 'sword' | 'wind' | 'activity' | 'flame'): string {
  const paths = {
    sword:
      '<path d="m11 19-6-6"/><path d="m5 21-2-2"/><path d="m8 16-4 4"/><path d="M9.5 17.5 21 6V3h-3L6.5 14.5"/>',
    wind:
      '<path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/>',
    activity:
      '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
    flame:
      '<path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/>',
  };
  return `<svg class="icon icon--${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
}

function progress(value: number, tone: Tone): string {
  return `
    <div class="progress-track">
      <div class="progress-fill progress-fill--${tone}" style="--value:${value}%"></div>
    </div>
  `;
}

function characterCard(options: {
  name: string;
  iconName: 'wind' | 'activity';
  meta: string;
  tag: string;
  label: string;
  value: number;
  tone: Tone;
}): string {
  const relationLabel =
    options.tone === 'sword'
      ? stageLabel(options.value, ['初识', '亲近', '相伴', '牵念'])
      : stageLabel(options.value, ['遥望', '试探', '纠葛', '难分']);

  return `
    <section class="character-card character-card--${options.tone}">
      <header class="character-card__head">
        <span class="character-card__name">${options.name}${icon(options.iconName)}</span>
        <span class="status-tag">${options.tag}</span>
      </header>
      <p class="character-card__meta">${options.meta}</p>
      <div class="divider"></div>
      <div>
        <div class="metric-label">${options.label}</div>
        <div class="metric-row">
          <span class="metric-value metric-value--${options.tone}">
            ${formatPercent(options.value)}<span> / 100</span>
          </span>
          <span class="metric-state">[ ${relationLabel} ]</span>
        </div>
        ${progress(options.value, options.tone)}
      </div>
    </section>
  `;
}

function techniqueCard(options: {
  label: string;
  value: number;
  tone: Tone;
  iconName?: 'flame';
}): string {
  const state =
    options.tone === 'sword'
      ? stageLabel(options.value, ['冰心未动', '动情之兆', '剑意回暖', '有情入剑'])
      : stageLabel(options.value, ['七情未满', '情念见影', '欲念成形', '七情近圆']);

  return `
    <section class="technique-card">
      <div class="technique-card__label">
        ${options.label}
        ${options.iconName ? icon(options.iconName) : ''}
      </div>
      <div class="metric-row metric-row--compact">
        <span class="metric-value metric-value--${options.tone}">${formatPercent(options.value)}%</span>
        <span class="metric-state">[ ${state} ]</span>
      </div>
      ${progress(options.value, options.tone)}
    </section>
  `;
}

function render(data: StatData): string {
  return `
    <main class="panel-shell">
      <div class="panel">
        <div class="panel__line panel__line--top"></div>
        <div class="panel__line panel__line--bottom"></div>

        <header class="hero">
          <div>
            <div class="hero__title-row">
              <h1>大师兄</h1>
              <span>${escapeHtml(data.realms.user)}</span>
            </div>
            <p><b>&lt;user&gt;</b>剑阁长锋 · 无情剑道至臻</p>
          </div>
          <div class="hero__trait">
            ${icon('sword')}
            <span>核心体质</span>
            <strong>天生剑体</strong>
          </div>
        </header>

        <div class="character-grid">
          ${characterCard({
            name: '庭玉',
            iconName: 'wind',
            meta: `${escapeHtml(data.realms.tingyu)} · 纯真好奇`,
            tag: '剑阁小师妹',
            label: '羁绊系统.庭玉羁绊值',
            value: data.bonds.tingyu,
            tone: 'sword',
          })}
          ${characterCard({
            name: '白荔',
            iconName: 'activity',
            meta: `${escapeHtml(data.realms.baili)} · 天生魔体`,
            tag: '魔宗圣女',
            label: '羁绊系统.白荔羁绊值',
            value: data.bonds.baili,
            tone: 'demon',
          })}
        </div>

        <section class="techniques">
          <p class="section-label">功法领悟系统 / TECHNIQUE INSIGHT</p>
          <div class="technique-grid">
            ${techniqueCard({
              label: '主角有情剑进度',
              value: data.cultivation.userEmotionalSword,
              tone: 'sword',
            })}
            ${techniqueCard({
              label: '白荔七情进度',
              value: data.cultivation.bailiSevenEmotions,
              tone: 'demon',
              iconName: 'flame',
            })}
          </div>
        </section>

        <footer class="panel-footer">
          <span>MVU DATA MONITOR</span>
          <span>冷锋对阵</span>
        </footer>
      </div>
    </main>
  `;
}

async function bootstrap() {
  const root = document.getElementById('root');
  if (!root) return;

  try {
    await waitGlobalInitialized('Mvu');
    root.innerHTML = render(readStatData());
    setInterval(() => {
      root.innerHTML = render(readStatData());
    }, 1000);
  } catch (error) {
    console.error('[没头脑和不高兴] 状态栏读取 MVU 变量失败', error);
    root.innerHTML = render(DEFAULT_DATA);
  }
}

bootstrap();

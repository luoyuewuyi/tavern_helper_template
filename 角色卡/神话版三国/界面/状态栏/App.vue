<template>
  <section class="status-shell">
    <div class="sky-layer"></div>
    <div class="grain-layer"></div>

    <header class="hero-grid">
      <article class="hero-panel stage-panel">
        <div class="panel-kicker">战后窗口</div>
        <div class="panel-headline">{{ world.主线阶段 }}</div>
        <p class="panel-copy">{{ world.天下风向 }}</p>

        <div class="stage-pills">
          <span class="stage-pill">{{ world.当前时间.纪年 }}</span>
          <span class="stage-pill">{{ world.当前时间.季节 }} · {{ world.当前时间.时段 }}</span>
          <span class="stage-pill">{{ world.当前地点.州郡 }} / {{ world.当前地点.场景 }}</span>
        </div>
      </article>

      <article class="hero-panel identity-panel">
        <div class="panel-kicker">玩家核心</div>
        <div class="identity-topline">
          <strong>{{ player.发展阶段 }}</strong>
          <span>{{ player.立场倾向 }}</span>
        </div>
        <div class="identity-subline">{{ player.天赋 }} / {{ player.性格 }} / {{ player.行事风格 }}</div>
        <p class="identity-copy">{{ identityExcerpt }}</p>

        <div class="tag-row">
          <span v-for="item in tagItems" :key="item.label" class="identity-tag">
            {{ item.label }} · {{ item.value }}
          </span>
        </div>

        <div class="identity-ledger">
          <span>明面：{{ player.公开身份 }}</span>
          <span>暗线：{{ player.隐藏身份 }}</span>
        </div>
      </article>

      <article class="hero-panel pulse-panel">
        <div class="panel-kicker">天命脉冲</div>
        <div class="metric-grid">
          <div v-for="item in pulseItems" :key="item.label" class="metric-card">
            <span class="metric-label">{{ item.label }}</span>
            <strong class="metric-value">{{ item.value }}</strong>
            <div class="metric-track">
              <div class="metric-fill" :style="{ width: item.percent + '%' }"></div>
            </div>
          </div>
        </div>
      </article>
    </header>

    <section class="main-grid">
      <article class="astral-panel">
        <div class="section-header">
          <div>
            <div class="section-kicker">阵营关系盘</div>
            <div class="section-title">青铜星象主舞台</div>
          </div>
          <div class="section-meta">{{ factionCards.length }} 方势力</div>
        </div>

        <div class="astral-board">
          <div class="player-core">
            <div class="core-ring"></div>
            <div class="core-name">user</div>
            <div class="core-style">{{ derived.权谋风格 }}</div>
            <div class="core-stance">{{ derived.影响力摘要 }}</div>
          </div>

          <div class="orbit-grid">
            <button
              v-for="faction in factionCards"
              :key="faction.name"
              class="orbit-card"
              :class="{ active: selectedFaction === faction.name }"
              type="button"
              @click="selectedFaction = faction.name"
            >
              <div class="orbit-top">
                <strong>{{ faction.name }}</strong>
                <span class="orbit-badge" :class="toneClass(faction.attitude)">{{ faction.attitude }}</span>
              </div>
              <div class="orbit-bars">
                <div v-for="bar in faction.bars" :key="bar.label" class="mini-bar">
                  <span>{{ bar.label }}</span>
                  <div class="mini-track">
                    <div class="mini-fill" :style="{ width: bar.value + '%' }"></div>
                  </div>
                  <em>{{ bar.value }}</em>
                </div>
              </div>
              <p class="orbit-copy">{{ faction.judgement }}</p>
            </button>
          </div>
        </div>
      </article>

      <aside class="focus-panel" v-if="focusedFaction">
        <div class="section-header">
          <div>
            <div class="section-kicker">当前焦点</div>
            <div class="section-title">{{ focusedFaction.name }}</div>
          </div>
          <button
            class="detail-launch detail-launch-inline"
            type="button"
            @click="openFactionDrawer(focusedFaction.name)"
          >
            {{ focusedFaction.attitude }} · 展开
          </button>
        </div>

        <div class="focus-block">
          <div class="focus-label">阵营判断</div>
          <p class="focus-copy">{{ focusedFaction.judgement }}</p>
        </div>

        <div class="focus-block">
          <div class="focus-label">即时风险</div>
          <p class="focus-copy">{{ world.即时风险 }}</p>
        </div>

        <div class="focus-block">
          <div class="focus-label">即时机会</div>
          <p class="focus-copy">{{ world.即时机会 }}</p>
        </div>

        <div class="focus-events">
          <div class="focus-label">受影响事件</div>
          <div v-if="focusedFaction.events.length" class="focus-list">
            <div v-for="item in focusedFaction.events" :key="item.name" class="focus-item">
              <strong>{{ item.name }}</strong>
              <span>{{ item.desc }}</span>
            </div>
          </div>
          <div v-else class="empty-note">暂无阵营级事件。</div>
        </div>
      </aside>
    </section>

    <nav class="tab-strip" aria-label="神话版三国状态栏分区">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="tab-button"
        :class="{ active: activeTab === tab }"
        type="button"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </nav>

    <section v-if="activeTab === '玩家'" class="tab-grid grouped-grid balanced-grid">
      <article class="group-card">
        <div class="detail-head">
          <strong>玩家底盘</strong>
          <span>{{ player.发展阶段 }}</span>
        </div>
        <div class="detail-bar-grid">
          <div v-for="item in foundationItems" :key="item.label" class="detail-metric">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </div>
        <p class="detail-copy">{{ player.当前诉求 }}</p>
      </article>

      <article class="group-card">
        <div class="detail-head">
          <strong>阵营履历</strong>
          <span>{{ factionHistoryCards.length }} 方</span>
        </div>
        <div class="figure-list">
          <div v-for="item in factionHistoryCards" :key="item.name" class="figure-card">
            <div class="figure-top">
              <strong>{{ item.name }}</strong>
              <span>{{ item.level }}</span>
            </div>
            <div class="figure-metrics">
              <span>恩义 {{ item.favor }}</span>
              <span>嫌隙 {{ item.grudge }}</span>
            </div>
            <p class="figure-copy">{{ item.result }}</p>
          </div>
        </div>
      </article>

      <article class="group-card">
        <div class="detail-head">
          <strong>阶段履历</strong>
          <span>{{ stageHistory.length }} 条</span>
        </div>
        <div class="event-list">
          <div v-for="item in stageHistory" :key="item.name" class="event-card">
            <strong>{{ item.name }}</strong>
            <p>{{ item.summary }}</p>
            <span>收获：{{ item.gain }}</span>
            <span>代价：{{ item.cost }}</span>
          </div>
        </div>
      </article>
    </section>

    <section v-else-if="activeTab === '势力'" class="tab-grid dense-grid">
      <article v-for="faction in factionCards" :key="faction.name" class="detail-card">
        <div class="detail-head">
          <strong>{{ faction.name }}</strong>
          <span>{{ faction.attitude }}</span>
        </div>
        <div class="detail-bar-grid">
          <div v-for="bar in faction.bars" :key="bar.label" class="detail-metric">
            <span>{{ bar.label }}</span>
            <strong>{{ bar.value }}</strong>
          </div>
        </div>
        <div class="figure-metrics">
          <span>渗透 {{ faction.infiltration }}</span>
          <span>绑定 {{ faction.binding }}</span>
        </div>
        <p class="detail-copy">{{ faction.judgement }}</p>
        <p class="figure-note">{{ faction.token }}</p>
        <div class="card-actions">
          <button class="detail-launch" type="button" @click="openFactionDrawer(faction.name)">查看势力详情</button>
        </div>
      </article>
    </section>

    <section v-else-if="activeTab === '人物专区'" class="tab-grid grouped-grid dense-grid">
      <article class="group-card">
        <div class="detail-head">
          <strong>当前焦点</strong>
          <span>{{ focusFigureNames.length }} 人</span>
        </div>
        <div v-if="focusFigureNames.length" class="exposure-tags">
          <button
            v-for="name in focusFigureNames"
            :key="name"
            class="exposure-tag exposure-tag-button"
            type="button"
            @click="openFigureDrawer(name)"
          >
            {{ name }}
          </button>
        </div>
        <div v-else class="empty-note">暂无焦点人物。</div>
        <p class="detail-copy">这里只保留当前真会牵动阵营判断、人物关系和蝴蝶链的人物，不把整部书的人一次性铺满。</p>
      </article>

      <article v-for="group in figureGroupsList" :key="group.name" class="group-card">
        <div class="detail-head">
          <strong>{{ group.name }}</strong>
          <span>{{ group.items.length }} 人</span>
        </div>
        <div class="figure-list">
          <div v-for="figure in group.items" :key="figure.name" class="figure-card">
            <div class="figure-top">
              <strong>{{ figure.name }}</strong>
              <span :class="riskClass(figure.risk)">{{ figure.risk }}</span>
            </div>
            <div class="figure-metrics">
              <span v-if="figure.isFocus">焦点人物</span>
              <span>注意 {{ figure.notice }}</span>
              <span>权重 {{ figure.weight }}</span>
            </div>
            <p class="figure-copy">{{ figure.judgement }}</p>
            <p class="figure-note">{{ figure.role }}</p>
            <p class="figure-note">{{ figure.contact }}</p>
            <div class="card-actions">
              <button class="detail-launch" type="button" @click="openFigureDrawer(figure.name)">查看人物详情</button>
            </div>
          </div>
        </div>
      </article>
    </section>

    <section v-else-if="activeTab === '蝴蝶效应'" class="tab-grid grouped-grid balanced-grid">
      <article class="group-card">
        <div class="detail-head">
          <strong>活跃链路</strong>
          <span>{{ activeChains.length }} 条</span>
        </div>
        <div v-if="activeChains.length" class="chain-list">
          <div v-for="chain in activeChains" :key="chain.name" class="chain-card">
            <div class="chain-top">
              <strong>{{ chain.name }}</strong>
              <span>热度 {{ chain.heat }}</span>
            </div>
            <p>{{ chain.source }}</p>
            <p>{{ chain.direct }}</p>
            <p>{{ chain.indirect }}</p>
            <div class="card-actions">
              <button class="detail-launch" type="button" @click="openChainDrawer(chain.name, false)">
                查看链路详情
              </button>
            </div>
          </div>
        </div>
        <div v-else class="empty-note">暂无活跃链路。</div>
      </article>

      <article class="group-card">
        <div class="detail-head">
          <strong>已兑现链路</strong>
          <span>{{ archivedChains.length }} 条</span>
        </div>
        <div v-if="archivedChains.length" class="chain-list compact">
          <div v-for="chain in archivedChains" :key="chain.name" class="chain-card compact">
            <div class="chain-top">
              <strong>{{ chain.name }}</strong>
              <span>{{ chain.result }}</span>
            </div>
            <p>{{ chain.direct }}</p>
            <div class="card-actions">
              <button class="detail-launch" type="button" @click="openChainDrawer(chain.name, true)">
                查看链路详情
              </button>
            </div>
          </div>
        </div>
        <div v-else class="empty-note">暂无历史链路。</div>
      </article>
    </section>

    <section v-else class="tab-grid grouped-grid balanced-grid">
      <article class="group-card">
        <div class="detail-head">
          <strong>天下态势</strong>
          <span>{{ derived.阵营偏向 }}</span>
        </div>
        <div class="world-stack">
          <div class="world-row">
            <span>即时风险</span>
            <strong>{{ world.即时风险 }}</strong>
          </div>
          <div class="world-row">
            <span>即时机会</span>
            <strong>{{ world.即时机会 }}</strong>
          </div>
          <div class="world-row">
            <span>近期涟漪</span>
            <strong>{{ butterflyRipple }}</strong>
          </div>
        </div>
      </article>

      <article class="group-card">
        <div class="detail-head">
          <strong>公开大事记</strong>
          <span>{{ publicEvents.length }} 条</span>
        </div>
        <div class="event-list">
          <div v-for="item in publicEvents" :key="item.name" class="event-card">
            <strong>{{ item.name }}</strong>
            <p>{{ item.summary }}</p>
            <span>{{ item.scope }} / 热度 {{ item.heat }}</span>
            <div class="card-actions">
              <button class="detail-launch" type="button" @click="openWorldEventDrawer(item.name)">查看事件详情</button>
            </div>
          </div>
        </div>
      </article>

      <article class="group-card">
        <div class="detail-head">
          <strong>地缘热区</strong>
          <span>{{ hotspotItems.length }} 处</span>
        </div>
        <div class="event-list">
          <div v-for="item in hotspotItems" :key="item.name" class="event-card">
            <strong>{{ item.name }}</strong>
            <p>{{ item.desc }}</p>
            <span>{{ item.factions }} / 热度 {{ item.heat }}</span>
            <div class="card-actions">
              <button class="detail-launch" type="button" @click="openHotspotDrawer(item.name)">查看热区详情</button>
            </div>
          </div>
        </div>
      </article>

      <article class="group-card">
        <div class="detail-head">
          <strong>曝光摘要</strong>
          <span>{{ exposureItems.length }} 组</span>
        </div>
        <div class="exposure-list">
          <div v-for="group in exposureItems" :key="group.title" class="exposure-card">
            <strong>{{ group.title }}</strong>
            <div v-if="group.items.length" class="exposure-tags">
              <button
                v-for="item in group.items"
                :key="item.name"
                class="exposure-tag exposure-tag-button"
                type="button"
                @click="openExposureDrawer(group.title, item.name, item.desc)"
              >
                {{ item.name }} · {{ item.desc }}
              </button>
            </div>
            <div v-else class="empty-note small">暂无。</div>
          </div>
        </div>
      </article>
    </section>

    <transition name="drawer-fade">
      <div v-if="detailDrawer" class="detail-overlay" @click.self="closeDetailDrawer">
        <aside class="detail-drawer detail-modal">
          <div class="drawer-head">
            <div>
              <div class="section-kicker">二级详情</div>
              <div class="section-title">{{ detailDrawer.title }}</div>
            </div>
            <button class="drawer-close" type="button" @click="closeDetailDrawer">关闭</button>
          </div>

          <div class="drawer-subtitle">{{ detailDrawer.subtitle }}</div>
          <p class="drawer-summary">{{ detailDrawer.summary }}</p>

          <div v-if="detailDrawer.rows.length" class="drawer-grid">
            <div v-for="row in detailDrawer.rows" :key="row.label" class="drawer-row">
              <span>{{ row.label }}</span>
              <strong>{{ row.value }}</strong>
            </div>
          </div>

          <div v-if="detailDrawer.tags.length" class="drawer-tags">
            <span v-for="tag in detailDrawer.tags" :key="tag" class="exposure-tag">{{ tag }}</span>
          </div>

          <div v-if="detailDrawer.notes.length" class="drawer-notes">
            <div v-for="note in detailDrawer.notes" :key="note" class="drawer-note">{{ note }}</div>
          </div>

          <div class="drawer-actions">
            <button class="drawer-close drawer-close-bottom" type="button" @click="closeDetailDrawer">关闭详情</button>
          </div>
        </aside>
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { useDataStore } from './store';

const tabs = ['玩家', '势力', '人物专区', '蝴蝶效应', '天下'] as const;
type TabKey = (typeof tabs)[number];
type DrawerPayload = {
  title: string;
  subtitle: string;
  summary: string;
  rows: Array<{ label: string; value: string }>;
  tags: string[];
  notes: string[];
};

const store = useDataStore();
const activeTab = useLocalStorage<TabKey>('myth-sg:tab', '玩家');
const selectedFaction = useLocalStorage('myth-sg:faction', '刘备集团');
const data = computed(() => store.data);
const detailDrawer = ref<DrawerPayload | null>(null);

const world = computed(() => data.value?.世界 ?? {});
const player = computed(() => data.value?.玩家 ?? {});
const derived = computed(() => data.value?._派生 ?? {});
const figureZone = computed(() => data.value?.人物专区 ?? {});
const figureRecords = computed(() => data.value?.核心人物 ?? {});

const identityExcerpt = computed(() => {
  const raw = `${player.value?.身份自述 ?? '待玩家自由书写'}`.trim();
  return raw.length > 64 ? `${raw.slice(0, 64)}...` : raw;
});

const tagItems = computed(() => [
  { label: '出身', value: derived.value?.身份标签?.出身 ?? '游士未明' },
  { label: '手段', value: derived.value?.身份标签?.手段 ?? '观势试探' },
  { label: '外显', value: derived.value?.身份标签?.外显 ?? '待显' },
]);

const pulseItems = computed(() => {
  const hiddenCapital = player.value?.隐秘资本 ?? {};
  const foundation = player.value?.个人底盘 ?? {};
  const totalCapital =
    Number(hiddenCapital.情报 ?? 0) +
    Number(hiddenCapital.人脉 ?? 0) +
    Number(hiddenCapital.资源 ?? 0) +
    Number(hiddenCapital.武力 ?? 0) +
    Number(hiddenCapital.天命因子 ?? 0);
  const totalFoundation =
    Number(foundation.情报网 ?? 0) +
    Number(foundation.可调用人手 ?? 0) +
    Number(foundation.资金调度 ?? 0) +
    Number(foundation.据点 ?? 0) +
    Number(foundation.盟约筹码 ?? 0);

  return [
    { label: '天命波动', value: Number(world.value?.天命波动 ?? 0), percent: Number(world.value?.天命波动 ?? 0) },
    { label: '战后余震', value: Number(world.value?.战后余震 ?? 0), percent: Number(world.value?.战后余震 ?? 0) },
    { label: '公开名望', value: Number(player.value?.公开名望 ?? 0), percent: Number(player.value?.公开名望 ?? 0) },
    { label: '隐秘资本', value: totalCapital, percent: Math.min(100, Math.round(totalCapital / 4)) },
    { label: '底盘强度', value: totalFoundation, percent: Math.min(100, Math.round(totalFoundation / 4)) },
  ];
});
const compactList = (items: Array<string | null | undefined>, limit = 8) =>
  items
    .map(item => `${item ?? ''}`.trim())
    .filter(Boolean)
    .slice(0, limit);

const factionCards = computed(() =>
  Object.entries(data.value?.势力 ?? {})
    .map(([name, value]) => ({
      name,
      attitude: `${value.态度 ?? '观望'}`,
      judgement: `${value.当前判断 ?? '暂无定评'}`,
      dependence: Number(value.依赖度 ?? 0),
      bars: [
        { label: '关注', value: Number(value.关注度 ?? 0) },
        { label: '戒备', value: Number(value.戒备度 ?? 0) },
        { label: '借势', value: Number(value.可借势度 ?? 0) },
      ],
      infiltration: Number(value.渗透度 ?? 0),
      binding: Number(value.绑定度 ?? 0),
      token: `${value.牵引筹码 ?? '暂无'}`,
      events: Object.entries(value.已受影响事件 ?? {}).map(([eventName, desc]) => ({
        name: eventName,
        desc: `${desc}`,
      })),
    }))
    .sort((lhs, rhs) => rhs.bars[2].value - lhs.bars[2].value),
);

watchEffect(() => {
  if ((activeTab.value as string) === '核心人物') {
    activeTab.value = '人物专区';
    return;
  }
  if (!tabs.includes(activeTab.value)) {
    activeTab.value = '玩家';
  }
});

watchEffect(() => {
  if (!factionCards.value.length) {
    return;
  }
  if (!factionCards.value.some(item => item.name === selectedFaction.value)) {
    selectedFaction.value = factionCards.value[0].name;
  }
});

const focusedFaction = computed(() => factionCards.value.find(item => item.name === selectedFaction.value));
const focusFigureNames = computed(() =>
  (Array.isArray(figureZone.value?.当前焦点) ? figureZone.value.当前焦点 : [])
    .map(item => `${item}`)
    .filter(item => Boolean(item) && Boolean(figureRecords.value?.[item])),
);
const focusFigureSet = computed(() => new Set(focusFigureNames.value));

const figureGroups = computed(() =>
  Object.entries(figureRecords.value).reduce(
    (groups, [name, value]) => {
      const faction = `${value.所属势力 ?? '未分组'}`;
      if (!groups[faction]) {
        groups[faction] = [];
      }
      groups[faction].push({
        name,
        isFocus: focusFigureSet.value.has(name),
        faction,
        contact: `${value.接触层级 ?? '未深接触'}`,
        heat: Number(value.关系热度 ?? 0),
        notice: Number(value.注意度 ?? 0),
        weight: Number(value.影响权重 ?? 0),
        judgement: `${value.当前判断 ?? '暂无定论'}`,
        role: `${value.人物定位 ?? value.立场 ?? '暂无定位'}`,
        stance: `${value.立场 ?? '观望'}`,
        need: `${value.短期诉求 ?? '暂无'}`,
        view: `${value.对user认知 ?? '尚无明确认知'}`,
        risk: `${value.风险判定 ?? '低'}`,
      });
      return groups;
    },
    {} as Record<
      string,
      Array<{
        name: string;
        isFocus: boolean;
        faction: string;
        contact: string;
        heat: number;
        notice: number;
        weight: number;
        judgement: string;
        role: string;
        stance: string;
        need: string;
        view: string;
        risk: string;
      }>
    >,
  ),
);

const figureGroupsList = computed(() =>
  Object.entries(figureGroups.value)
    .map(([name, items]) => ({
      name,
      focusCount: items.filter(item => item.isFocus).length,
      maxWeight: Math.max(...items.map(item => item.weight), 0),
      items: items.sort((lhs, rhs) => {
        if (lhs.isFocus !== rhs.isFocus) {
          return Number(rhs.isFocus) - Number(lhs.isFocus);
        }
        if (lhs.weight !== rhs.weight) {
          return rhs.weight - lhs.weight;
        }
        return rhs.notice - lhs.notice;
      }),
    }))
    .sort((lhs, rhs) => {
      if (lhs.focusCount !== rhs.focusCount) {
        return rhs.focusCount - lhs.focusCount;
      }
      if (lhs.maxWeight !== rhs.maxWeight) {
        return rhs.maxWeight - lhs.maxWeight;
      }
      return rhs.items.length - lhs.items.length;
    }),
);

const foundationItems = computed(() => [
  { label: '情报网', value: Number(player.value?.个人底盘?.情报网 ?? 0) },
  { label: '人手', value: Number(player.value?.个人底盘?.可调用人手 ?? 0) },
  { label: '资金', value: Number(player.value?.个人底盘?.资金调度 ?? 0) },
  { label: '据点', value: Number(player.value?.个人底盘?.据点 ?? 0) },
  { label: '盟约', value: Number(player.value?.个人底盘?.盟约筹码 ?? 0) },
]);

const factionHistoryCards = computed(() =>
  Object.entries(player.value?.阵营履历 ?? {})
    .map(([name, value]) => ({
      name,
      level: `${value.接触层级 ?? '未接触'}`,
      favor: Number(value.恩义 ?? 0),
      grudge: Number(value.嫌隙 ?? 0),
      result: `${value.渗透成果 ?? '暂无'}`,
    }))
    .sort((lhs, rhs) => rhs.favor - lhs.favor + (lhs.grudge - rhs.grudge)),
);

const stageHistory = computed(() =>
  Object.entries(player.value?.阶段履历 ?? {})
    .map(([name, value]) => ({
      name,
      summary: `${value.摘要 ?? '暂无'}`,
      gain: `${value.收获 ?? '暂无'}`,
      cost: `${value.代价 ?? '暂无'}`,
    }))
    .reverse(),
);

const activeChains = computed(() =>
  Object.entries(data.value?.蝴蝶效应?.活跃链路 ?? {})
    .map(([name, value]) => ({
      name,
      heat: Number(value.热度 ?? 0),
      source: `${value.触发源 ?? '暂无'}`,
      direct: `${value.直接影响 ?? '暂无'}`,
      indirect: `${value.二级传导 ?? '暂无'}`,
    }))
    .sort((lhs, rhs) => rhs.heat - lhs.heat),
);

const archivedChains = computed(() =>
  Object.entries(data.value?.蝴蝶效应?.已兑现链路 ?? {})
    .map(([name, value]) => ({
      name,
      result: `${value.已兑现后果 ?? '已兑现'}`,
      direct: `${value.直接影响 ?? '暂无'}`,
    }))
    .sort((lhs, rhs) => lhs.name.localeCompare(rhs.name, 'zh-Hans-CN')),
);

const butterflyRipple = computed(() => `${data.value?.蝴蝶效应?.近期涟漪 ?? '尚无足以改写原轨迹的蝴蝶涟漪'}`);

const publicEvents = computed(() =>
  Object.entries(world.value?.公开大事记 ?? {})
    .map(([name, value]) => ({
      name,
      summary: `${value.摘要 ?? '暂无摘要'}`,
      scope: `${value.影响范围 ?? '局部'}`,
      heat: Number(value.热度 ?? 0),
    }))
    .sort((lhs, rhs) => rhs.heat - lhs.heat),
);

const hotspotItems = computed(() =>
  Object.entries(world.value?.地缘热区 ?? {})
    .map(([name, value]) => ({
      name,
      desc: `${value.说明 ?? '暂无'}`,
      factions: `${value.牵涉势力 ?? '全局'}`,
      heat: Number(value.热度 ?? 0),
    }))
    .sort((lhs, rhs) => rhs.heat - lhs.heat),
);

const exposureItems = computed(() => [
  {
    title: '注意',
    items: Object.entries(player.value?.被谁注意 ?? {}).map(([name, desc]) => ({ name, desc: `${desc}` })),
  },
  {
    title: '怀疑',
    items: Object.entries(player.value?.被谁怀疑 ?? {}).map(([name, desc]) => ({ name, desc: `${desc}` })),
  },
  {
    title: '忌惮',
    items: Object.entries(player.value?.被谁忌惮 ?? {}).map(([name, desc]) => ({ name, desc: `${desc}` })),
  },
]);

const openDetailDrawer = (payload: DrawerPayload) => {
  detailDrawer.value = payload;
};

const closeDetailDrawer = () => {
  detailDrawer.value = null;
};

const openFactionDrawer = (name: string) => {
  const faction = factionCards.value.find(item => item.name === name);
  if (!faction) {
    return;
  }
  openDetailDrawer({
    title: faction.name,
    subtitle: `势力详情 · ${faction.attitude}`,
    summary: faction.judgement,
    rows: [
      { label: '关注度', value: `${faction.bars[0].value}` },
      { label: '戒备度', value: `${faction.bars[1].value}` },
      { label: '可借势度', value: `${faction.bars[2].value}` },
      { label: '依赖度', value: `${faction.dependence}` },
      { label: '渗透度', value: `${faction.infiltration}` },
      { label: '绑定度', value: `${faction.binding}` },
    ],
    tags: compactList([`牵引筹码 · ${faction.token}`]),
    notes: faction.events.length ? faction.events.map(item => `${item.name}：${item.desc}`) : ['暂无阵营级事件沉淀。'],
  });
};

const openFigureDrawer = (name: string) => {
  const figure = figureRecords.value?.[name];
  if (!figure) {
    return;
  }
  openDetailDrawer({
    title: name,
    subtitle: `人物专区 · ${figure.所属势力 ?? '未分组'}`,
    summary: `${figure.当前判断 ?? '暂无定论'}`,
    rows: [
      { label: '接触层级', value: `${figure.接触层级 ?? '未深接触'}` },
      { label: '关系热度', value: `${Number(figure.关系热度 ?? 0)}` },
      { label: '注意度', value: `${Number(figure.注意度 ?? 0)}` },
      { label: '影响权重', value: `${Number(figure.影响权重 ?? 0)}` },
      { label: '立场', value: `${figure.立场 ?? '观望'}` },
      { label: '风险判定', value: `${figure.风险判定 ?? '低'}` },
    ],
    tags: compactList([
      `人物定位 · ${figure.人物定位 ?? '暂无定位'}`,
      `短期诉求 · ${figure.短期诉求 ?? '暂无'}`,
      ...Object.entries(figure.可触发联动 ?? {}).map(([eventName, desc]) => `${eventName} · ${desc}`),
    ]),
    notes: compactList(
      [
        `认知：${figure.对user认知 ?? '尚无明确认知'}`,
        ...Object.entries(figure.已受影响事件 ?? {}).map(([eventName, desc]) => `${eventName}：${desc}`),
      ],
      10,
    ),
  });
};

const openChainDrawer = (name: string, archived: boolean) => {
  const source = archived ? data.value?.蝴蝶效应?.已兑现链路?.[name] : data.value?.蝴蝶效应?.活跃链路?.[name];
  if (!source) {
    return;
  }
  openDetailDrawer({
    title: name,
    subtitle: archived ? '蝴蝶效应 · 已兑现链路' : '蝴蝶效应 · 活跃链路',
    summary: `${source.直接影响 ?? '暂无'}`,
    rows: [
      { label: '热度', value: `${Number(source.热度 ?? 0)}` },
      { label: '公开度', value: `${Number(source.公开度 ?? 0)}` },
      { label: '失效条件', value: `${source.失效条件 ?? '暂无'}` },
      { label: '已兑现后果', value: `${source.已兑现后果 ?? '暂无'}` },
    ],
    tags: compactList(Object.entries(source.涉及势力 ?? {}).map(([factionName, desc]) => `${factionName} · ${desc}`)),
    notes: compactList([`触发源：${source.触发源 ?? '暂无'}`, `二级传导：${source.二级传导 ?? '暂无'}`]),
  });
};

const openWorldEventDrawer = (name: string) => {
  const item = world.value?.公开大事记?.[name];
  if (!item) {
    return;
  }
  openDetailDrawer({
    title: name,
    subtitle: '天下 · 公开大事记',
    summary: `${item.摘要 ?? '暂无摘要'}`,
    rows: [
      { label: '影响范围', value: `${item.影响范围 ?? '局部'}` },
      { label: '热度', value: `${Number(item.热度 ?? 0)}` },
      { label: '公开度', value: `${Number(item.公开度 ?? 0)}` },
    ],
    tags: [],
    notes: ['这是会影响天下判断的公开事件。'],
  });
};

const openHotspotDrawer = (name: string) => {
  const item = world.value?.地缘热区?.[name];
  if (!item) {
    return;
  }
  openDetailDrawer({
    title: name,
    subtitle: '天下 · 地缘热区',
    summary: `${item.说明 ?? '暂无'}`,
    rows: [
      { label: '热度', value: `${Number(item.热度 ?? 0)}` },
      { label: '牵涉势力', value: `${item.牵涉势力 ?? '全局'}` },
    ],
    tags: [],
    notes: ['这是下一阶段行动路线和冲突走向的重要热区。'],
  });
};

const openExposureDrawer = (title: string, name: string, desc: string) => {
  openDetailDrawer({
    title: name,
    subtitle: `曝光摘要 · ${title}`,
    summary: desc,
    rows: [{ label: '类别', value: title }],
    tags: [],
    notes: ['该条目会影响你在不同阵营中的公开风险与后续互动门槛。'],
  });
};

const riskClass = (risk: string) => {
  if (risk === '极高') {
    return 'risk-extreme';
  }
  if (risk === '高') {
    return 'risk-high';
  }
  if (risk === '中') {
    return 'risk-mid';
  }
  return 'risk-low';
};

const toneClass = (attitude: string) => {
  if (['拉拢', '依赖', '盟友'].includes(attitude)) {
    return 'tone-positive';
  }
  if (['警惕', '敌视'].includes(attitude)) {
    return 'tone-negative';
  }
  return 'tone-neutral';
};
</script>

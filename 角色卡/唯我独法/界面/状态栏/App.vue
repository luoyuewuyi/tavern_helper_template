<template>
  <div class="shell">
    <div class="ambient ambient-left" />
    <div class="ambient ambient-right" />

    <section class="top-bar">
      <div class="top-meta">
        <span>{{ data.世界.当前日期 }}</span>
        <span>{{ data.世界.当前时段 }}</span>
        <span>{{ data.世界.当前地点 }}</span>
      </div>
      <div class="top-pills">
        <span>{{ data.世界.灵气复苏阶段 }}</span>
        <span>世界改变 {{ data.世界.世界改变进度 }}%</span>
        <span>全球关注 {{ data.世界.全球关注度 }}%</span>
      </div>
    </section>

    <section class="main-stage">
      <aside class="side-rail">
        <article class="rail-card world-card">
          <div class="card-head">
            <div>
              <span class="kicker">World</span>
              <h1>现实局势</h1>
            </div>
            <span class="chip">{{ data.世界.灵气复苏阶段 }}</span>
          </div>
          <p class="lead">{{ data.世界.当前局势摘要 }}</p>
          <div class="metric-pair">
            <div class="metric-cell">
              <span>世界改变</span>
              <strong>{{ data.世界.世界改变进度 }}%</strong>
            </div>
            <div class="metric-cell">
              <span>全球关注</span>
              <strong>{{ data.世界.全球关注度 }}%</strong>
            </div>
          </div>
          <div class="inline-block">
            <span>最近异象</span>
            <p>{{ data.世界.最近异象 }}</p>
          </div>
        </article>

        <article class="rail-card system-card">
          <div class="card-head">
            <div>
              <span class="kicker">System</span>
              <h2>系统资源</h2>
            </div>
            <span class="chip soft">保底 {{ data.系统.距离保底还需次数 }}</span>
          </div>
          <div class="metric-stack">
            <div class="metric-row">
              <span>当前积分</span>
              <strong>{{ data.系统.当前积分 }}</strong>
            </div>
            <div class="metric-row">
              <span>累计抽卡</span>
              <strong>{{ data.系统.累计抽卡次数 }}</strong>
            </div>
          </div>
          <div class="inline-block">
            <span>最近结果</span>
            <p>{{ data.系统.最近抽卡结果 || '尚未抽取能力。' }}</p>
          </div>
        </article>

        <article class="rail-card tree-card">
          <div class="card-head">
            <div>
              <span class="kicker">Dream Tree</span>
              <h2>神树 / 保留</h2>
            </div>
            <span class="chip gold">{{ data.神树.当前等级 }}</span>
          </div>
          <div class="progress-block">
            <div class="progress-label">
              <span>成长进度</span>
              <strong>{{ data.神树.成长百分比 }}%</strong>
            </div>
            <div class="track"><i :style="{ width: `${data.神树.成长百分比}%` }" /></div>
          </div>
          <div class="metric-pair">
            <div class="metric-cell">
              <span>槽位</span>
              <strong>{{ data.保留能力.当前保留数 }} / {{ data.保留能力.槽位上限 }}</strong>
            </div>
            <div class="metric-cell">
              <span>隐蔽度</span>
              <strong>{{ data.主角.隐蔽度 }}%</strong>
            </div>
          </div>
          <div class="inline-block">
            <span>当前主保留</span>
            <p>{{ data.保留能力.当前主保留能力 }}</p>
          </div>
        </article>

        <article class="rail-card focus-card">
          <div class="card-head">
            <div>
              <span class="kicker">Ripple</span>
              <h2>焦点 / 风险</h2>
            </div>
            <span class="chip muted">{{ topFaction?.态度 || '无察觉' }}</span>
          </div>
          <template v-if="focusActor">
            <div class="focus-shell">
              <div class="focus-top">
                <strong>{{ focusActor.名称 }}</strong>
                <span>{{ focusActor.身份 }}</span>
              </div>
              <p>{{ focusActor.当前状态 }}</p>
              <div class="mini-progress">
                <span>认知距离 {{ focusActor.认知距离 }}%</span>
                <div class="track teal"><i :style="{ width: `${focusActor.认知距离}%` }" /></div>
              </div>
              <div class="mini-progress">
                <span>暴露风险 {{ focusActor.暴露风险 }}%</span>
                <div class="track danger"><i :style="{ width: `${focusActor.暴露风险}%` }" /></div>
              </div>
            </div>
          </template>
          <template v-else>
            <p class="lead">当前没有已落地赐能对象，焦点区保持静默。</p>
          </template>
          <div class="risk-grid">
            <div>
              <span>最高风险势力</span>
              <strong>{{ topFaction?.名称 || '暂无' }}</strong>
            </div>
            <div>
              <span>最高等级事件</span>
              <strong>{{ topEvent?.标题 || '暂无' }}</strong>
            </div>
          </div>
        </article>
      </aside>

      <section class="primary-stage">
        <header class="stage-header">
          <div>
            <span class="kicker">Workspace</span>
            <h2>{{ groupLabel }}</h2>
          </div>
          <div class="group-tabs">
            <button
              v-for="group in groups"
              :key="group.id"
              class="tab-button"
              :class="{ active: currentGroup === group.id }"
              type="button"
              @click="setGroup(group.id)"
            >
              {{ group.label }}
            </button>
          </div>
        </header>

        <nav class="sub-tabs">
          <button
            v-for="tab in activeTabs"
            :key="tab.id"
            class="tab-button"
            :class="{ active: currentPage === tab.id }"
            type="button"
            @click="setPage(tab.id)"
          >
            {{ tab.label }}
          </button>
        </nav>

        <section v-if="currentPage === 'draw'" class="workspace-grid draw-grid">
          <article class="stage-card action-card">
            <div class="section-head">
              <strong>抽奖动作</strong>
              <span>先确认再写入</span>
            </div>
            <div class="draw-metrics">
              <div class="metric-cell">
                <span>当前积分</span>
                <strong>{{ data.系统.当前积分 }}</strong>
              </div>
              <div class="metric-cell">
                <span>保底剩余</span>
                <strong>{{ data.系统.距离保底还需次数 }}</strong>
              </div>
            </div>
            <div class="action-stack">
              <button class="action-button" type="button" :disabled="data.系统.当前积分 < 1" @click="prepareDraw(1)">
                单抽
                <small>消耗 1 积分，按当前概率直接结算</small>
              </button>
              <button class="action-button" type="button" :disabled="data.系统.当前积分 < 10" @click="prepareDraw(10)">
                十连
                <small>消耗 10 积分，第十抽保底 B 级</small>
              </button>
            </div>
            <div class="inline-block">
              <span>池子摘要</span>
              <p>{{ data.系统.抽奖池摘要 }}</p>
            </div>
          </article>

          <article class="stage-card">
            <div class="section-head">
              <strong>作品分池</strong>
              <span>{{ pools.length }} 组</span>
            </div>
            <div class="pool-list">
              <div v-for="pool in pools" :key="pool.name" class="pool-item">
                <strong>{{ pool.name }}</strong>
                <p>{{ pool.note }}</p>
              </div>
            </div>
            <div class="inline-block">
              <span>最近抽取</span>
              <p>{{ data.系统.最近抽卡结果 || '尚未有新的抽取记录。' }}</p>
            </div>
          </article>
        </section>

        <section v-else-if="currentPage === 'gift'" class="workspace-grid gift-grid">
          <article class="stage-card">
            <div class="section-head">
              <strong>第 1 步：选择能力</strong>
              <span>{{ giftableInventory.length }} 项可赠予</span>
            </div>
            <div v-if="giftableInventory.length" class="record-list scroll-area">
              <button
                v-for="item in giftableInventory"
                :key="item.key"
                class="select-row"
                :class="{ selected: selectedInventoryKey === item.key }"
                type="button"
                @click="selectedInventoryKey = item.key"
              >
                <div class="record-top">
                  <strong>{{ item.value.名称 }}</strong>
                  <span>{{ item.value.来源作品 }} · {{ item.value.评级 }} · {{ item.value.类型 }}</span>
                </div>
                <p>{{ item.value.核心效果 }}</p>
              </button>
            </div>
            <p v-else class="empty-copy">当前没有处于“未使用”状态的能力库存，无法执行匿名赠予。</p>
          </article>

          <article class="stage-card">
            <div class="section-head">
              <strong>第 2 步：选择焦点人物</strong>
              <span>{{ focusActorEntries.length }} 个目标</span>
            </div>
            <div v-if="focusActorEntries.length" class="record-list scroll-area">
              <button
                v-for="item in focusActorEntries"
                :key="item.key"
                class="select-row"
                :class="{ selected: selectedActorKey === item.key }"
                type="button"
                @click="selectedActorKey = item.key"
              >
                <div class="record-top">
                  <strong>{{ item.value.名称 }}</strong>
                  <span>{{ item.value.身份 }} · {{ item.value.当前地区 }}</span>
                </div>
                <p>{{ item.value.当前状态 }}</p>
              </button>
            </div>
            <p v-else class="empty-copy">当前没有可选焦点人物，赠予页不支持临时创建新目标。</p>
          </article>

          <article class="stage-card action-card">
            <div class="section-head">
              <strong>第 3 步：写入确认</strong>
              <span>仅对现有焦点人物生效</span>
            </div>
            <div class="preview-stack">
              <div class="confirm-preview">
                <div>
                  <span>赠予能力</span>
                  <strong>{{ selectedGiftInventory?.value.名称 || '未选择' }}</strong>
                </div>
                <div>
                  <span>目标人物</span>
                  <strong>{{ selectedGiftActor?.value.名称 || '未选择' }}</strong>
                </div>
              </div>
              <div class="inline-block">
                <span>变化预估</span>
                <p v-if="selectedGiftInventory && selectedGiftActor">
                  {{ selectedGiftActor.value.名称 }} 将接收「{{ selectedGiftInventory.value.名称 }}」，库存状态会更新为已赐予，并同步重写焦点人物档案。
                </p>
                <p v-else>先选能力，再选人物，之后才能进入确认层。</p>
              </div>
              <button class="action-button" type="button" :disabled="!selectedGiftInventory || !selectedGiftActor" @click="prepareGift()">
                确认进入写入确认
                <small>库存状态与焦点人物条目会同时更新</small>
              </button>
            </div>
          </article>
        </section>

        <section v-else-if="currentPage === 'sacrifice'" class="workspace-grid sacrifice-grid">
          <article class="stage-card">
            <div class="section-head">
              <strong>可献祭库存</strong>
              <span>{{ sacrificialInventory.length }} 项</span>
            </div>
            <div v-if="sacrificialInventory.length" class="record-list scroll-area">
              <button
                v-for="item in sacrificialInventory"
                :key="item.key"
                class="select-row"
                :class="{ selected: selectedSacrificeKey === item.key }"
                type="button"
                @click="selectedSacrificeKey = item.key"
              >
                <div class="record-top">
                  <strong>{{ item.value.名称 }}</strong>
                  <span>{{ item.value.来源作品 }} · {{ item.value.评级 }}</span>
                </div>
                <p>{{ item.value.风险提示 }}</p>
              </button>
            </div>
            <p v-else class="empty-copy">当前没有可献祭库存。</p>
          </article>

          <article class="stage-card action-card">
            <div class="section-head">
              <strong>神树增益预览</strong>
              <span>{{ data.神树.当前等级 }}</span>
            </div>
            <div class="progress-block">
              <div class="progress-label">
                <span>当前成长</span>
                <strong>{{ data.神树.成长百分比 }}%</strong>
              </div>
              <div class="track"><i :style="{ width: `${data.神树.成长百分比}%` }" /></div>
            </div>
            <div class="confirm-preview">
              <div>
                <span>献祭目标</span>
                <strong>{{ selectedSacrificeItem?.value.名称 || '未选择' }}</strong>
              </div>
              <div>
                <span>预计成长</span>
                <strong>{{ selectedSacrificeItem ? `+${getSacrificeGain(selectedSacrificeItem.value.评级)}%` : '--' }}</strong>
              </div>
            </div>
            <div class="inline-block">
              <span>最近喂养记录</span>
              <p>{{ data.神树.最近喂养记录 }}</p>
            </div>
            <button class="action-button" type="button" :disabled="!selectedSacrificeItem" @click="prepareSacrifice()">
              确认进入写入确认
              <small>能力库存会标记为已献祭</small>
            </button>
          </article>
        </section>

        <section v-else-if="currentPage === 'world'" class="workspace-grid intel-grid">
          <article class="stage-card">
            <div class="section-head">
              <strong>势力态势</strong>
              <span>{{ factionEntries.length }} 组</span>
            </div>
            <div class="record-list scroll-area tall-scroll">
              <div v-for="item in factionEntries" :key="item.key" class="record-item">
                <div class="record-top">
                  <strong>{{ item.value.名称 }}</strong>
                  <span>{{ item.value.类型 }} · {{ item.value.态度 }}</span>
                </div>
                <p>{{ item.value.当前动作 }}</p>
                <em>风险 {{ item.value.风险评级 }} / 渗透 {{ item.value.渗透程度 }}</em>
              </div>
            </div>
          </article>

          <article class="stage-card">
            <div class="section-head">
              <strong>世界事件</strong>
              <span>{{ eventEntries.length }} 条</span>
            </div>
            <div class="record-list scroll-area tall-scroll">
              <div v-for="item in eventEntries" :key="item.key" class="record-item">
                <div class="record-top">
                  <strong>{{ item.value.标题 }}</strong>
                  <span>{{ item.value.等级 }} · {{ item.value.地区 }}</span>
                </div>
                <p>{{ item.value.摘要 }}</p>
                <em>{{ item.value.状态 }}</em>
              </div>
            </div>
          </article>
        </section>

        <section v-else class="workspace-grid chronicle-grid">
          <article class="stage-card full-span">
            <div class="section-head">
              <strong>当前阶段摘要</strong>
              <span>{{ recentChronicles.length }} 条近期记录</span>
            </div>
            <div class="timeline-preview">
              <div v-for="item in recentChronicles" :key="item.key" class="preview-chip">
                <strong>{{ item.value.标题 }}</strong>
                <span>{{ item.value.时间标记 }}</span>
              </div>
            </div>
          </article>

          <article class="stage-card full-span">
            <div class="section-head">
              <strong>编年史</strong>
              <span>{{ chronicleEntries.length }} 条记录</span>
            </div>
            <div class="record-list scroll-area tall-scroll">
              <div v-for="item in chronicleEntries" :key="item.key" class="record-item">
                <div class="record-top">
                  <strong>{{ item.value.标题 }}</strong>
                  <span>{{ item.value.时间标记 }} · {{ item.value.影响层级 }}</span>
                </div>
                <p>{{ item.value.摘要 }}</p>
              </div>
            </div>
          </article>
        </section>

        <footer class="stage-footer">
          <article class="footer-card">
            <div class="section-head">
              <strong>主角外壳</strong>
              <span>{{ data.主角.梦境状态 }}</span>
            </div>
            <div class="footer-grid">
              <div>
                <span>公开身份</span>
                <strong>{{ data.主角.公开身份 }}</strong>
              </div>
              <div>
                <span>职业/学业</span>
                <strong>{{ data.主角.职业学业 }}</strong>
              </div>
              <div class="full-line">
                <span>当前目标</span>
                <strong>{{ data.主角.当前目标 }}</strong>
              </div>
            </div>
          </article>

          <article class="footer-card">
            <div class="section-head">
              <strong>保留能力</strong>
              <span>{{ data.保留能力.来源作品 }}</span>
            </div>
            <div v-if="data.保留能力.已保留列表.length" class="record-list compact-scroll">
              <div
                v-for="item in data.保留能力.已保留列表"
                :key="`${item.名称}-${item.来源作品}`"
                class="record-item"
              >
                <div class="record-top">
                  <strong>{{ item.名称 }}</strong>
                  <span>{{ item.来源作品 }} · {{ item.评级 }}</span>
                </div>
                <p>{{ item.效果摘要 }}</p>
              </div>
            </div>
            <p v-else class="empty-copy">当前没有保留能力，系统仍处于前置观察阶段。</p>
          </article>
        </footer>
      </section>
    </section>

    <div v-if="pendingAction" class="confirm-backdrop" @click.self="closeConfirm">
      <div class="confirm-card">
        <button class="close-button" type="button" @click="closeConfirm">×</button>
        <div class="section-head">
          <strong>写入确认</strong>
          <span>{{ confirmTitle }}</span>
        </div>
        <p class="lead">{{ confirmText }}</p>
        <div class="confirm-actions">
          <button class="secondary-button" type="button" @click="closeConfirm">取消</button>
          <button class="action-button" type="button" @click="commitPendingAction">确认写入</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from './store';
import type { StateData } from '../../schema';

type GroupId = 'action' | 'intel';
type PageId = 'draw' | 'gift' | 'sacrifice' | 'world' | 'chronicle';
type PendingAction =
  | { type: 'draw'; count: 1 | 10 }
  | { type: 'gift'; inventoryKey: string; actorKey: string }
  | { type: 'sacrifice'; inventoryKey: string };

const store = useDataStore();
const data = computed(() => store.data as StateData);

const groups: Array<{ id: GroupId; label: string }> = [
  { id: 'action', label: '行动' },
  { id: 'intel', label: '情报' },
];

const pageGroups: Record<GroupId, Array<{ id: PageId; label: string }>> = {
  action: [
    { id: 'draw', label: '抽奖' },
    { id: 'gift', label: '赠予' },
    { id: 'sacrifice', label: '献祭' },
  ],
  intel: [
    { id: 'world', label: '世界' },
    { id: 'chronicle', label: '编年史' },
  ],
};

const pools = [
  { name: '漫威', note: '宇宙级到低阶变种' },
  { name: 'DC', note: '神明系到义警模板' },
  { name: '火影', note: '六道级到学徒级' },
  { name: '死神', note: '友哈级到灵术院' },
  { name: '海贼王', note: '高位多停在 A 级' },
  { name: '全职猎人', note: '念能力重代价与条件' },
  { name: '魔兽世界', note: '职业与神话残响并存' },
  { name: '守望先锋', note: '偏科技与战术强化' },
  { name: '拳皇', note: '格斗极境与血统力量' },
  { name: '最终幻想', note: '召唤、晶石与职业' },
  { name: '街头霸王', note: '武道、波动与体魄' },
] as const;

const probabilities = [
  { grade: 'S', weight: 0.5 },
  { grade: 'A', weight: 4.0 },
  { grade: 'B', weight: 10.0 },
  { grade: 'C', weight: 20.0 },
  { grade: 'D', weight: 25.0 },
  { grade: 'E', weight: 40.5 },
] as const;

const abilityTemplates = {
  漫威: { S: ['现实扭曲残片', '宇宙能量主宰残片'], A: ['凤凰之火碎羽', '心灵王权投影'], B: ['高阶再生模板', '雷霆权柄片段'], C: ['蜘蛛感应脉冲', '振金战斗心智'], D: ['轻型血清强化', '念动力触须'], E: ['体能强化种子', '夜视适配'] },
  DC: { S: ['新神神格火种', '第五维度残响'], A: ['氪级战斗残模', '神速力裂片'], B: ['心灵护盾模块', '魔法回路片段'], C: ['蝙蝠战术记忆', '声波操控触发器'], D: ['格斗本能增强', '侦查感知节点'], E: ['警觉提升', '夜行适应'] },
  火影: { S: ['六道阴阳碎印', '辉夜血脉残片'], A: ['轮回眼投影', '尾兽级查克拉种子'], B: ['万花筒瞳术片段', '仙术适应体'], C: ['上忍级属性遁模板', '通灵契约节点'], D: ['中忍级查克拉控制', '瞬身术习性'], E: ['下忍级查克拉种子', '基础三身术记忆'] },
  死神: { S: ['全知全能残辉', '崩玉级进化碎屑'], A: ['队长级始解本源', '灭却王血统刻痕'], B: ['卍解前驱模组', '高阶灵压涌泉'], C: ['席官级斩术模板', '鬼道构式群'], D: ['灵压感知强化', '斩拳走鬼基础'], E: ['灵术院生模板', '灵子亲和种子'] },
  海贼王: { A: ['霸王色雏核', '自然系共鸣片段'], B: ['武装色流转核心', '见闻色增幅种子'], C: ['动物系适应性', '体魄极限突破'], D: ['海军六式基础', '航海直觉'], E: ['格斗本能火种', '耐力强化'] },
  全职猎人: { A: ['特质系构想核心', '王级念压残影'], B: ['念能力条件模块', '圆与凝强化'], C: ['缠绝练发一体化', '变化系流形'], D: ['气量提升', '念感知种子'], E: ['开精孔倾向', '基础专注力'] },
  魔兽世界: { A: ['泰坦赐纹微片', '古神抗性残痕'], B: ['圣光/邪能双回路', '高阶职业专精源块'], C: ['元素契约核心', '死亡之力适配'], D: ['职业熟练骨架', '战斗直觉'], E: ['初阶法力池', '基础武技适配'] },
  守望先锋: { A: ['尖端战术义体蓝核', '时空锚定模块'], B: ['重构装甲平台', '脉冲核心片段'], C: ['战地支援框架', '极限机动义体'], D: ['枪械直觉增强', '战术视野修正'], E: ['反应强化', '目镜级辅助模块'] },
  拳皇: { A: ['大蛇之力残焰', '宿命格斗核心'], B: ['极限流奥义碎片', '火焰血统引子'], C: ['格斗家体魄模板', '气感应强化'], D: ['连段记忆', '搏杀本能'], E: ['基础格斗感', '短时爆发倾向'] },
  最终幻想: { A: ['召唤兽契约残晶', '职业大师灵纹'], B: ['晶石魔导核心', '高阶职业转位'], C: ['元素魔法模组', '战场指令框架'], D: ['武具适应强化', '初级魔力池'], E: ['战斗职业种子', '以太亲和'] },
  街头霸王: { A: ['波动奥义本源', '杀意之波残片'], B: ['格斗宗师记忆束', '气流操控核心'], C: ['极限体魄模板', '街斗反应强化'], D: ['招式肌肉记忆', '对抗压迫本能'], E: ['基础波动感', '下盘稳定强化'] },
} as const;

const currentGroup = ref<GroupId>('action');
const currentPage = ref<PageId>('draw');
const pendingAction = ref<PendingAction | null>(null);
const selectedInventoryKey = ref('');
const selectedActorKey = ref('');
const selectedSacrificeKey = ref('');

const activeTabs = computed(() => pageGroups[currentGroup.value]);
const groupLabel = computed(() => groups.find(group => group.id === currentGroup.value)?.label ?? '行动');
const inventoryEntries = computed(() => Object.entries(data.value.能力库存).map(([key, value]) => ({ key, value })));
const giftableInventory = computed(() => inventoryEntries.value.filter(item => item.value.当前状态 === '未使用'));
const sacrificialInventory = computed(() => inventoryEntries.value.filter(item => item.value.当前状态 === '未使用'));
const focusActorEntries = computed(() => Object.entries(data.value.焦点人物).map(([key, value]) => ({ key, value })));
const factionEntries = computed(() => Object.entries(data.value.势力).map(([key, value]) => ({ key, value })));
const eventEntries = computed(() => Object.entries(data.value.世界事件).map(([key, value]) => ({ key, value })));
const chronicleEntries = computed(() => Object.entries(data.value.编年史).map(([key, value]) => ({ key, value })).reverse());
const recentChronicles = computed(() => chronicleEntries.value.slice(0, 3));
const focusActor = computed(() => focusActorEntries.value[0]?.value ?? null);
const topFaction = computed(() => factionEntries.value.slice().sort((lhs, rhs) => rhs.value.风险评级 - lhs.value.风险评级)[0]?.value ?? null);
const topEvent = computed(() => {
  const order = ['地方级', '城市级', '区域级', '国家级', '全球级'];
  return eventEntries.value.slice().sort((lhs, rhs) => order.indexOf(rhs.value.等级) - order.indexOf(lhs.value.等级))[0]?.value ?? null;
});
const selectedGiftInventory = computed(() => giftableInventory.value.find(item => item.key === selectedInventoryKey.value) ?? null);
const selectedGiftActor = computed(() => focusActorEntries.value.find(item => item.key === selectedActorKey.value) ?? null);
const selectedSacrificeItem = computed(() => sacrificialInventory.value.find(item => item.key === selectedSacrificeKey.value) ?? null);

const confirmTitle = computed(() => {
  if (!pendingAction.value) return '';
  if (pendingAction.value.type === 'draw') return pendingAction.value.count === 10 ? '十连抽' : '单抽';
  return pendingAction.value.type === 'gift' ? '匿名赠予' : '神树献祭';
});

const confirmText = computed(() => {
  if (!pendingAction.value) return '';
  if (pendingAction.value.type === 'draw') {
    return `即将执行${pendingAction.value.count === 10 ? '十连抽' : '单抽'}，会直接写入系统计数、能力库存与最近结果。`;
  }
  if (pendingAction.value.type === 'gift') {
    const ability = data.value.能力库存[pendingAction.value.inventoryKey];
    const actor = data.value.焦点人物[pendingAction.value.actorKey];
    return `即将把「${ability?.名称 || '未知能力'}」匿名赠予「${actor?.名称 || '未知对象'}」，并更新库存状态与焦点人物记录。`;
  }
  const ability = data.value.能力库存[pendingAction.value.inventoryKey];
  return `即将把「${ability?.名称 || '未知能力'}」献祭给神树，成长进度会按当前等级和能力评级结算。`;
});

function setGroup(group: GroupId) {
  currentGroup.value = group;
  currentPage.value = pageGroups[group][0]?.id ?? 'draw';
}

function setPage(page: PageId) {
  currentPage.value = page;
  currentGroup.value = (page === 'world' || page === 'chronicle') ? 'intel' : 'action';
}

function closeConfirm() {
  pendingAction.value = null;
}

function prepareDraw(count: 1 | 10) {
  pendingAction.value = { type: 'draw', count };
}

function prepareGift() {
  if (!selectedGiftInventory.value || !selectedGiftActor.value) return;
  pendingAction.value = { type: 'gift', inventoryKey: selectedGiftInventory.value.key, actorKey: selectedGiftActor.value.key };
}

function prepareSacrifice() {
  if (!selectedSacrificeItem.value) return;
  pendingAction.value = { type: 'sacrifice', inventoryKey: selectedSacrificeItem.value.key };
}

function getRandomPoolName() {
  return pools[Math.floor(Math.random() * pools.length)]?.name ?? '漫威';
}

function gradeOrder(grade: string) {
  return ['E', 'D', 'C', 'B', 'A', 'S'].indexOf(grade);
}

function drawGrade(minimum: 'B' | null = null) {
  const threshold = Math.random() * 100;
  let cursor = 0;
  for (const item of probabilities) {
    cursor += item.weight;
    if (threshold <= cursor) {
      return minimum && gradeOrder(item.grade) < gradeOrder(minimum) ? minimum : item.grade;
    }
  }
  return minimum ?? 'E';
}

function pickAbilityName(poolName: string, grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'E') {
  const templates = abilityTemplates[poolName as keyof typeof abilityTemplates];
  const list = templates?.[grade] ?? abilityTemplates.漫威.E;
  return list[Math.floor(Math.random() * list.length)] ?? `${poolName}${grade}级能力`;
}

function inferAbilityType(grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'E') {
  return ['S', 'A', 'B'].includes(grade) ? '灵魂碎片' : '提取能力';
}

function buildAbilityRecord(grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'E') {
  const poolName = getRandomPoolName();
  const 名称 = pickAbilityName(poolName, grade);
  const 类型 = inferAbilityType(grade);
  return {
    名称,
    来源作品: poolName,
    评级: grade,
    类型,
    形态: 类型 === '灵魂碎片' ? '完整人格残片' : '可拆解能力模组',
    核心效果: `${grade}级 ${poolName} 系能力，适合${类型 === '灵魂碎片' ? '长期人格渗透' : '短中期能力投放'}。`,
    适配对象: '对当前剧情有牵动效应的现实人物',
    风险提示: 类型 === '灵魂碎片' ? '会逐步改变目标性格与思维倾向' : '赠出后自身不可继续使用该能力',
    当前状态: '未使用' as const,
    备注: `由状态栏${grade === 'S' ? '顶级' : '常规'}抽奖生成`,
  };
}

function buildChronicleEntry(title: string, summary: string, impact: string) {
  return {
    时间标记: `${data.value.世界.当前日期} ${data.value.世界.当前时段}`,
    标题: title,
    摘要: summary,
    影响层级: impact,
  };
}

function appendChronicle(target: StateData, title: string, summary: string, impact: string) {
  const keys = Object.keys(target.编年史);
  const nextIndex = `${String(keys.length + 1).padStart(4, '0')}`;
  target.编年史[nextIndex] = buildChronicleEntry(title, summary, impact);
}

function getSacrificeGain(grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'E') {
  const treeRank = ['E级', 'D级', 'C级', 'B级', 'A级', 'S级'].indexOf(data.value.神树.当前等级);
  const abilityRank = ['E', 'D', 'C', 'B', 'A', 'S'].indexOf(grade);
  const diff = Math.max(0, abilityRank - treeRank);
  const raw = diff === 0 ? 1 : 2 ** diff;
  if (data.value.神树.当前等级 === 'D级' && grade === 'S') return 16;
  return Math.min(raw, 32);
}

function promoteTreeIfNeeded(target: StateData) {
  const stages = ['E级', 'D级', 'C级', 'B级', 'A级', 'S级'] as const;
  let currentIndex = stages.indexOf(target.神树.当前等级);
  while (target.神树.成长百分比 >= 100 && currentIndex < stages.length - 1) {
    target.神树.成长百分比 -= 100;
    currentIndex += 1;
    target.神树.当前等级 = stages[currentIndex];
  }
  target.神树.下一级目标 = currentIndex === stages.length - 1 ? '神树已达顶点，等待结果' : `累积成长至 100% 后蜕变为 ${stages[currentIndex + 1]}`;
  target.神树.结果状态 = target.神树.当前等级 === 'S级' ? '已具备结果条件' : '尚未结果';
}

function updateWorldProgressByGift(target: StateData, actorName: string, grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'E') {
  const deltaMap = { S: 8, A: 5, B: 3, C: 2, D: 1, E: 1 } as const;
  target.世界.世界改变进度 = _.clamp(target.世界.世界改变进度 + deltaMap[grade], 0, 100);
  target.世界.全球关注度 = _.clamp(target.世界.全球关注度 + Math.max(1, deltaMap[grade] - 1), 0, 100);
  target.世界.最近异象 = `${actorName} 相关的异常波动开始在暗面扩散。`;
  target.世界.当前局势摘要 = `你对 ${actorName} 的匿名出手让现实暗面出现了新的波纹，局势正在悄悄偏移。`;
  target.保留能力.槽位上限 = Math.min(5, 1 + Math.floor(target.世界.世界改变进度 / 20));
}

function commitDraw(count: 1 | 10) {
  updateVariablesWith(variables => {
    const nextData = _.cloneDeep(data.value);
    const results: string[] = [];
    let pity = nextData.系统.距离保底还需次数;
    nextData.系统.当前积分 = Math.max(0, nextData.系统.当前积分 - count);
    for (let index = 0; index < count; index += 1) {
      const grade = drawGrade(count === 10 && index === 9 ? 'B' : pity <= 1 ? 'B' : null);
      const record = buildAbilityRecord(grade);
      const entryKey = `${Date.now()}-${index}-${Math.floor(Math.random() * 10000)}`;
      nextData.能力库存[entryKey] = record;
      nextData.系统.累计抽卡次数 += 1;
      results.push(`${record.来源作品} ${record.评级}级 ${record.名称}`);
      pity = gradeOrder(grade) >= gradeOrder('B') ? 10 : Math.max(0, pity - 1);
    }
    nextData.系统.距离保底还需次数 = pity;
    nextData.系统.最近抽卡结果 = results.join(' / ');
    appendChronicle(nextData, count === 10 ? '十连抽完成' : '单抽完成', nextData.系统.最近抽卡结果, '系统级');
    _.set(variables, 'stat_data', nextData);
  }, { type: 'message', message_id: getCurrentMessageId() });
}

function commitGift(inventoryKey: string, actorKey: string) {
  updateVariablesWith(variables => {
    const nextData = _.cloneDeep(data.value);
    const ability = nextData.能力库存[inventoryKey];
    const actor = nextData.焦点人物[actorKey];
    if (!ability || !actor) return;
    ability.当前状态 = '已赐予';
    actor.获得内容 = ability.名称;
    actor.获得形式 = ability.类型;
    actor.评级 = ability.评级;
    actor.变化趋势 = ability.类型 === '灵魂碎片' ? '人格缓慢趋同，行为边缘开始偏移' : '能力觉醒，正在摸索新力量边界';
    actor.当前状态 = `已匿名获得 ${ability.名称}`;
    actor.暴露风险 = _.clamp(actor.暴露风险 + (ability.类型 === '灵魂碎片' ? 8 : 5), 0, 100);
    actor.认知距离 = _.clamp(actor.认知距离 - (ability.类型 === '灵魂碎片' ? 12 : 8), 0, 100);
    actor.对世界影响 = `${actor.名称} 已成为你在现实世界中的新涟漪节点。`;
    updateWorldProgressByGift(nextData, actor.名称, ability.评级);
    appendChronicle(nextData, '匿名赐能完成', `你将 ${ability.名称} 赠予了 ${actor.名称}。`, '现实涟漪');
    _.set(variables, 'stat_data', nextData);
  }, { type: 'message', message_id: getCurrentMessageId() });
}

function commitSacrifice(inventoryKey: string) {
  updateVariablesWith(variables => {
    const nextData = _.cloneDeep(data.value);
    const ability = nextData.能力库存[inventoryKey];
    if (!ability) return;
    const gain = getSacrificeGain(ability.评级);
    ability.当前状态 = '已献祭';
    nextData.神树.成长百分比 += gain;
    nextData.神树.最近喂养记录 = `献祭 ${ability.来源作品}·${ability.评级}级「${ability.名称}」，成长 +${gain}%`;
    promoteTreeIfNeeded(nextData);
    appendChronicle(nextData, '神树献祭完成', nextData.神树.最近喂养记录, '神树级');
    _.set(variables, 'stat_data', nextData);
  }, { type: 'message', message_id: getCurrentMessageId() });
}

function commitPendingAction() {
  const action = pendingAction.value;
  if (!action) return;
  if (action.type === 'draw') commitDraw(action.count);
  else if (action.type === 'gift') commitGift(action.inventoryKey, action.actorKey);
  else commitSacrifice(action.inventoryKey);
  closeConfirm();
}
</script>

<style scoped lang="scss">
.shell {
  position: relative;
  overflow: hidden;
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 1rem;
  border-radius: 1.75rem;
  color: #ecf5f2;
  background:
    radial-gradient(circle at top left, rgba(66, 132, 137, 0.2), transparent 34%),
    radial-gradient(circle at top right, rgba(207, 173, 102, 0.16), transparent 32%),
    linear-gradient(155deg, rgba(5, 15, 19, 0.98), rgba(8, 24, 31, 0.96) 54%, rgba(4, 10, 15, 0.98));
  border: 1px solid rgba(131, 178, 173, 0.18);
  box-shadow: 0 1.75rem 4.5rem rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.shell::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(rgba(138, 182, 177, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(138, 182, 177, 0.04) 1px, transparent 1px);
  background-size: 1.5rem 1.5rem;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.55), transparent 95%);
}

.ambient {
  position: absolute;
  width: 18rem;
  height: 18rem;
  border-radius: 999px;
  filter: blur(1.25rem);
  opacity: 0.54;
  pointer-events: none;
}

.ambient-left {
  top: -6rem;
  left: -4rem;
  background: radial-gradient(circle, rgba(91, 171, 163, 0.28), transparent 70%);
}

.ambient-right {
  right: -5rem;
  bottom: -7rem;
  background: radial-gradient(circle, rgba(213, 177, 95, 0.2), transparent 70%);
}

.top-bar,
.main-stage,
.confirm-backdrop {
  position: relative;
  z-index: 1;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.625rem 0.875rem;
  border-radius: 1rem;
  background: rgba(8, 18, 24, 0.74);
  border: 1px solid rgba(124, 172, 167, 0.16);
  backdrop-filter: blur(0.75rem);
}

.top-meta,
.top-pills,
.group-tabs,
.sub-tabs,
.confirm-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.top-meta span,
.top-pills span,
.chip {
  display: inline-flex;
  align-items: center;
  min-height: 1.9rem;
  padding: 0 0.75rem;
  border-radius: 999px;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
}

.top-meta span {
  color: rgba(227, 242, 238, 0.78);
  background: rgba(95, 145, 149, 0.12);
}

.top-pills span,
.chip.gold {
  color: #f1ddb0;
  background: rgba(169, 136, 72, 0.16);
  border: 1px solid rgba(206, 175, 111, 0.18);
}

.main-stage {
  display: grid;
  grid-template-columns: minmax(13.5rem, 15.5rem) minmax(0, 1fr);
  gap: 0.875rem;
  min-width: 0;
}

.side-rail,
.primary-stage,
.footer-grid,
.draw-metrics,
.metric-pair,
.risk-grid,
.workspace-grid,
.pool-list,
.timeline-preview {
  display: grid;
  gap: 0.75rem;
}

.side-rail {
  align-content: start;
}

.primary-stage {
  min-width: 0;
  padding: 0.95rem;
  border-radius: 1.5rem;
  background: rgba(5, 13, 18, 0.58);
  border: 1px solid rgba(121, 171, 166, 0.12);
}

.rail-card,
.stage-card,
.footer-card,
.confirm-card {
  background: linear-gradient(180deg, rgba(9, 23, 29, 0.95), rgba(5, 15, 20, 0.96));
  border: 1px solid rgba(129, 174, 170, 0.16);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.rail-card {
  display: grid;
  gap: 0.75rem;
  padding: 0.95rem;
  border-radius: 1.35rem;
}

.stage-card,
.footer-card {
  display: grid;
  gap: 0.85rem;
  min-width: 0;
  padding: 1rem;
  border-radius: 1.35rem;
}

.world-card {
  background:
    linear-gradient(160deg, rgba(8, 26, 31, 0.97), rgba(5, 15, 20, 0.98)),
    radial-gradient(circle at top left, rgba(89, 157, 159, 0.16), transparent 40%);
}

.system-card,
.tree-card,
.focus-card {
  background:
    linear-gradient(180deg, rgba(10, 24, 30, 0.96), rgba(4, 14, 19, 0.98)),
    radial-gradient(circle at top right, rgba(182, 153, 88, 0.09), transparent 42%);
}

.stage-header,
.card-head,
.section-head,
.record-top,
.focus-top,
.progress-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.card-head,
.stage-header,
.section-head {
  padding-bottom: 0.65rem;
  border-bottom: 1px solid rgba(121, 167, 162, 0.12);
}

.kicker {
  display: inline-block;
  margin-bottom: 0.25rem;
  color: rgba(145, 205, 199, 0.78);
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

h1,
h2,
strong,
p {
  margin: 0;
}

h1 {
  font-size: clamp(1.35rem, 2.8cqi, 1.7rem);
  line-height: 1.08;
}

h2 {
  font-size: clamp(1rem, 2.2cqi, 1.2rem);
  line-height: 1.12;
}

.chip {
  color: rgba(223, 238, 235, 0.76);
  background: rgba(90, 135, 145, 0.14);
  border: 1px solid rgba(117, 172, 178, 0.16);
}

.chip.soft {
  color: rgba(233, 244, 240, 0.78);
  background: rgba(72, 110, 123, 0.18);
}

.chip.muted {
  color: rgba(220, 237, 234, 0.82);
  background: rgba(97, 136, 145, 0.14);
}

.lead,
.inline-block p,
.record-item p,
.select-row p,
.empty-copy {
  color: rgba(221, 237, 233, 0.8);
  line-height: 1.62;
  font-size: 0.82rem;
}

.metric-stack,
.preview-stack {
  display: grid;
  gap: 0.65rem;
}

.metric-row,
.metric-cell,
.inline-block,
.confirm-preview,
.record-item,
.select-row,
.focus-shell,
.pool-item,
.preview-chip {
  border: 1px solid rgba(126, 172, 167, 0.14);
  background: rgba(8, 18, 24, 0.66);
}

.metric-row,
.metric-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.8rem 0.9rem;
  border-radius: 1rem;
}

.metric-cell {
  display: grid;
  gap: 0.35rem;
  align-content: start;
}

.metric-cell span,
.metric-row span,
.inline-block span,
.progress-label span,
.record-item em,
.preview-chip span,
.focus-top span,
.section-head span,
.record-top span,
.footer-grid span {
  color: rgba(175, 204, 199, 0.74);
  font-size: 0.74rem;
}

.metric-row strong,
.metric-cell strong,
.inline-block strong,
.record-top strong,
.focus-top strong,
.confirm-preview strong,
.preview-chip strong,
.footer-grid strong {
  color: #f8fbf8;
  font-weight: 700;
}

.metric-row strong,
.metric-cell strong {
  font-size: 1.15rem;
}

.inline-block,
.confirm-preview {
  display: grid;
  gap: 0.45rem;
  padding: 0.85rem 0.95rem;
  border-radius: 1rem;
}

.metric-pair,
.draw-metrics,
.risk-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.track {
  overflow: hidden;
  height: 0.48rem;
  border-radius: 999px;
  background: rgba(78, 111, 116, 0.22);
}

.track i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, rgba(218, 188, 121, 0.78), rgba(246, 232, 193, 0.98));
}

.track.teal i {
  background: linear-gradient(90deg, rgba(96, 180, 171, 0.72), rgba(145, 228, 218, 0.96));
}

.track.danger i {
  background: linear-gradient(90deg, rgba(170, 77, 72, 0.76), rgba(232, 128, 115, 0.96));
}

.progress-block,
.mini-progress {
  display: grid;
  gap: 0.55rem;
}

.focus-shell {
  display: grid;
  gap: 0.65rem;
  padding: 0.9rem;
  border-radius: 1rem;
}

.risk-grid {
  align-items: stretch;
}

.risk-grid div {
  display: grid;
  gap: 0.3rem;
  padding: 0.8rem 0.9rem;
  border-radius: 1rem;
  border: 1px solid rgba(127, 173, 168, 0.12);
  background: rgba(8, 18, 24, 0.62);
}

.tab-button,
.secondary-button,
.action-button,
.close-button {
  appearance: none;
  border: 0;
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease;
}

.tab-button {
  min-height: 2.25rem;
  padding: 0 0.9rem;
  border-radius: 999px;
  color: rgba(223, 238, 235, 0.76);
  background: rgba(10, 20, 27, 0.75);
  border: 1px solid rgba(120, 167, 163, 0.14);
}

.tab-button.active {
  color: #071116;
  background: linear-gradient(135deg, rgba(197, 171, 106, 0.94), rgba(241, 227, 189, 0.98));
  box-shadow: 0 0.8rem 1.8rem rgba(165, 135, 76, 0.18);
}

.sub-tabs {
  padding-top: 0.15rem;
}

.workspace-grid {
  min-width: 0;
}

.draw-grid,
.intel-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.gift-grid {
  grid-template-columns: 1.15fr 1.05fr 0.9fr;
}

.sacrifice-grid {
  grid-template-columns: 1.15fr 0.95fr;
}

.chronicle-grid {
  grid-template-columns: 1fr;
}

.full-span {
  grid-column: 1 / -1;
}

.pool-list,
.record-list {
  min-width: 0;
}

.pool-list {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.pool-item,
.record-item,
.select-row,
.preview-chip {
  padding: 0.85rem 0.95rem;
  border-radius: 1rem;
}

.pool-item {
  display: grid;
  gap: 0.35rem;
}

.record-list {
  display: grid;
  gap: 0.65rem;
}

.record-item em {
  font-style: normal;
}

.scroll-area {
  max-height: 23rem;
  overflow: auto;
  padding-right: 0.25rem;
}

.tall-scroll {
  max-height: 27rem;
}

.compact-scroll {
  max-height: 10rem;
  overflow: auto;
  padding-right: 0.25rem;
}

.select-row {
  width: 100%;
  text-align: left;
  color: inherit;
}

.select-row.selected {
  border-color: rgba(220, 190, 122, 0.42);
  background: linear-gradient(180deg, rgba(171, 136, 76, 0.2), rgba(8, 18, 25, 0.84));
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.18);
}

.action-card {
  align-content: start;
}

.action-stack {
  display: grid;
  gap: 0.75rem;
}

.action-button {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.25rem;
  min-height: 3.2rem;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  color: #0a1316;
  font-weight: 700;
  background: linear-gradient(135deg, rgba(193, 167, 104, 0.96), rgba(242, 231, 200, 0.98));
  box-shadow: 0 1rem 2rem rgba(168, 136, 74, 0.18);
}

.action-button small {
  color: rgba(15, 22, 24, 0.74);
  font-weight: 500;
}

.action-button:disabled {
  cursor: not-allowed;
  opacity: 0.48;
  box-shadow: none;
}

.secondary-button {
  min-height: 2.65rem;
  padding: 0 0.9rem;
  border-radius: 0.9rem;
  color: rgba(223, 238, 235, 0.82);
  background: rgba(12, 24, 30, 0.92);
  border: 1px solid rgba(123, 170, 167, 0.18);
}

.timeline-preview {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.preview-chip {
  display: grid;
  gap: 0.3rem;
}

.stage-footer {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.footer-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.full-line {
  grid-column: 1 / -1;
}

.empty-copy {
  padding: 0.35rem 0 0;
}

.confirm-backdrop {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(2, 8, 12, 0.62);
  backdrop-filter: blur(0.8rem);
}

.confirm-card {
  position: relative;
  width: min(33rem, 100%);
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 1.45rem;
  box-shadow: 0 1.5rem 3.75rem rgba(0, 0, 0, 0.38);
}

.close-button {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: grid;
  place-items: center;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 999px;
  color: rgba(227, 241, 238, 0.86);
  background: rgba(12, 24, 29, 0.84);
}

.tab-button:hover,
.secondary-button:hover,
.action-button:hover,
.select-row:hover,
.close-button:hover {
  transform: translateY(-1px);
}

@container (max-width: 1100px) {
  .main-stage {
    grid-template-columns: minmax(12.75rem, 14.5rem) minmax(0, 1fr);
  }

  .gift-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .gift-grid > :last-child {
    grid-column: 1 / -1;
  }

  .pool-list,
  .timeline-preview {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@container (max-width: 860px) {
  .shell {
    padding: 0.875rem;
  }

  .top-bar,
  .stage-header,
  .card-head,
  .section-head,
  .confirm-actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .draw-grid,
  .gift-grid,
  .sacrifice-grid,
  .intel-grid,
  .stage-footer,
  .footer-grid,
  .pool-list,
  .timeline-preview,
  .metric-pair,
  .draw-metrics,
  .risk-grid {
    grid-template-columns: 1fr;
  }

  .top-bar {
    padding: 0.75rem;
  }

  .primary-stage,
  .rail-card,
  .stage-card,
  .footer-card {
    padding: 0.875rem;
  }
}

@container (max-width: 720px) {
  .main-stage {
    grid-template-columns: minmax(11.75rem, 13.25rem) minmax(0, 1fr);
  }

  .top-meta,
  .top-pills {
    gap: 0.375rem;
  }

  .top-meta span,
  .top-pills span,
  .chip,
  .tab-button {
    min-height: 1.8rem;
    padding: 0 0.65rem;
    font-size: 0.68rem;
  }
}

@container (max-width: 620px) {
  .main-stage {
    grid-template-columns: 1fr;
  }

  .side-rail {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .primary-stage {
    padding-top: 0.8rem;
  }
}

@container (max-width: 560px) {
  .shell {
    padding: 0.75rem;
    border-radius: 1.4rem;
  }

  .side-rail,
  .group-tabs,
  .sub-tabs {
    grid-template-columns: 1fr;
  }

  .group-tabs,
  .sub-tabs {
    display: grid;
  }

  .confirm-card {
    padding: 1rem;
  }
}
</style>

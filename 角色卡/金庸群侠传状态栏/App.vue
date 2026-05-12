<template>
  <div v-if="data" class="wuxia-card">
    <!-- 动态装饰 -->
    <div class="cloud-bg"></div>
    <div class="inner-border"></div>

    <!-- 顶部导航栏 -->
    <div class="tab-navigation">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-item"
        :class="{ active: currentTab === tab.id }"
        @click="currentTab = tab.id"
      >
        {{ tab.label }}
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- [状态] 核心版块 -->
      <div v-if="currentTab === 'status'" class="status-page fade-in">
        <div class="status-grid">
          <!-- 左侧：立绘与核心条 -->
          <div class="char-portrait-section">
            <div class="char-header-info">
              <div class="char-name">{{ (data as any).基础信息.姓名 }}</div>
              <div class="char-realm-tag">
                {{ (data as any).核心属性.境界 }} · 第{{ (data as any).核心属性.等级 }}重
              </div>
            </div>

            <div class="vitals-section">
              <div class="vital-row">
                <span class="vital-label">气血</span>
                <div class="vital-bar-container">
                  <div
                    class="vital-fill hp"
                    :style="{ width: Math.min(((data as any).核心属性.状态.气血 / 100) * 100, 100) + '%' }"
                  ></div>
                  <div class="vital-text">{{ (data as any).核心属性.状态.气血 }} / 100</div>
                </div>
              </div>
              <div class="vital-row">
                <span class="vital-label">内力</span>
                <div class="vital-bar-container">
                  <div
                    class="vital-fill mp"
                    :style="{ width: Math.min(((data as any).核心属性.状态.内力 / 50) * 100, 100) + '%' }"
                  ></div>
                  <div class="vital-text">{{ (data as any).核心属性.状态.内力 }} / 50</div>
                </div>
              </div>
              <div class="vital-row">
                <span class="vital-label">体力</span>
                <div class="vital-bar-container">
                  <div
                    class="vital-fill sp"
                    :style="{ width: Math.min(((data as any).核心属性.状态.体力 / 100) * 100, 100) + '%' }"
                  ></div>
                  <div class="vital-text">{{ (data as any).核心属性.状态.体力 }} / 100</div>
                </div>
              </div>
            </div>

            <!-- D20 联动检定 -->
            <div class="wuxia-section-title">江湖秘策 (随机判定)</div>
            <div class="check-panel">
              <div v-if="(data as any).当前检定.描述 !== '无'" class="check-header">
                <span class="check-title">【{{ (data as any).当前检定.描述 }}】</span>
                <div class="check-subtitle">
                  <span class="check-difficulty">难度 DC: {{ (data as any).当前检定.难度 }}</span>
                </div>
              </div>
              <div v-else class="check-header">
                <span class="check-subtitle">当前暂无具体检定，可随手一掷</span>
              </div>

              <!-- 抉择分支 -->
              <div
                v-if="(data as any).当前检定.描述 !== '无' && !rolling && (data as any).当前检定.结果 === '无'"
                class="choice-grid"
              >
                <button v-for="choice in d20Choices" :key="choice.id" class="choice-btn" @click="startD20Roll(choice)">
                  <span class="choice-attr">[{{ choice.attr }}]</span> {{ choice.label }}
                </button>
              </div>

              <button
                v-else-if="(data as any).当前检定.描述 === '无'"
                class="action-btn roll-trigger"
                :disabled="rolling"
                @click="startD20Roll(null)"
              >
                {{ rolling ? '命理演化中...' : '随手一掷' }}
              </button>

              <div v-if="(data as any).当前检定.结果 !== '无'" class="check-result-container fade-in">
                <div class="check-heavenly-title">—— 天意昭示 ——</div>
                <div class="check-result-text" :class="(data as any).当前检定.结果">
                  {{ getHeavenlyResultText((data as any).当前检定.结果) }}
                  <span class="check-math"
                    >({{ (data as any).当前检定.数值
                    }}{{ ((data as any).当前检定.加成 || 0) > 0 ? ' + ' + (data as any).当前检定.加成 : '' }})</span
                  >
                </div>
                <div class="check-actions">
                  <button class="action-btn tiny retry-btn" @click="resetD20">再卜一卦</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：六维与装备摘要 -->
          <div class="char-details-section">
            <div class="wuxia-section-title">根骨属性</div>
            <div class="attr-hex-grid">
              <div v-for="(val, key) in (data as any).核心属性.属性" :key="key" class="attr-hex-item">
                <span class="attr-hx-label">{{ key }}</span>
                <span class="attr-hx-val">{{ val }}</span>
              </div>
            </div>

            <div class="wuxia-section-title">当前装备</div>
            <div class="management-grid">
              <div class="equip-group">
                <div v-for="(item, slot) in (data as any).武学装备.当前装备物品" :key="slot" class="slot-premium">
                  <div class="slot-left" @click="currentTab = 'inventory'">
                    <span class="slot-label">{{ slot }}</span>
                    <span class="slot-val">{{ item || '无' }}</span>
                  </div>
                  <button v-if="item && item !== '无'" class="unequip-btn" @click.stop="unequipItem(slot as string)">
                    脱下
                  </button>
                </div>
              </div>
            </div>

            <div class="char-tags-row">
              <span class="tag-wuxia">称号：{{ (data as any).基础信息.称号 }}</span>
              <span class="tag-wuxia">门派：{{ (data as any).基础信息.门派 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- [行囊] 仓库系统 -->
      <div v-if="currentTab === 'inventory'" class="inventory-page fade-in">
        <div class="inventory-container">
          <div class="item-grid-scroll">
            <div class="item-grid">
              <div
                v-for="(info, name) in unifiedInventory"
                :key="name"
                class="item-slot"
                :class="{ selected: selectedItemName === name, 'is-martial': (info as any).isMartial }"
                @click="selectedItemName = name as string"
              >
                <div class="item-icon">{{ getItemIcon(name as string, (info as any).isMartial) }}</div>
                <div class="item-name-tag">{{ name }}</div>
                <div v-if="(info as any).数量 > 1" class="item-count">x{{ (info as any).数量 }}</div>
                <div v-if="(info as any).isMartial" class="martial-tag">功法</div>
              </div>
              <div v-for="i in 12" :key="'empty' + i" class="item-slot empty"></div>
            </div>
          </div>

          <!-- 详情与操作 -->
          <div class="inventory-detail-pane">
            <div v-if="selectedItem" class="detail-content">
              <div class="detail-p-name">{{ selectedItemName }}</div>
              <div class="detail-p-rank">{{ (selectedItem as any).品级 }}</div>
              <div class="detail-p-desc">{{ (selectedItem as any).描述 }}</div>

              <div class="action-buttons">
                <button v-if="isEquippable(selectedItemName)" class="action-btn" @click="equipItem">装备此物</button>
                <button v-if="!(selectedItem as any).isMartial" class="action-btn" @click="useItem">使用道具</button>
                <button class="action-btn danger" @click="discardItem">丢弃</button>
                <button class="action-btn secondary" @click="selectedItemName = null">收起</button>
              </div>
              <div v-if="actionFeedback" class="action-feedback fade-in">{{ actionFeedback }}</div>
            </div>
            <div v-else class="empty-hint">点击行囊物品<br />查看详述</div>
          </div>
        </div>
      </div>

      <!-- [武学] 修行版块 -->
      <div v-if="currentTab === 'martial'" class="martial-page fade-in">
        <div class="wuxia-section-title">内功心法</div>
        <div class="martial-list">
          <div
            v-for="(info, name) in learnedNeigong"
            :key="name"
            class="martial-item"
            :class="{ active: (data as any).武学装备.当前运行内功 === name }"
          >
            <div class="m-info">
              <span class="m-name">{{ name }}</span>
              <span class="m-lvl"> 等级: {{ (info as any).等级 }}</span>
            </div>
            <button class="action-btn tiny" @click="runNeigong(name as string)">
              {{ (data as any).武学装备.当前运行内功 === name ? '正在运行' : '运功' }}
            </button>
          </div>
        </div>

        <div class="wuxia-section-title">外功招式</div>
        <div class="skill-group-grid">
          <div v-for="i in 4" :key="i" class="skill-slot-wide" @click="openSkillSelect(`招式${i}`)">
            <span class="slot-label">招式 {{ i }}</span>
            <span class="slot-val">{{ (data as any).武学装备.装备外功列表[`招式${i}`] || '空' }}</span>
          </div>
        </div>
      </div>

      <!-- [江湖] 社交版块 -->
      <div v-if="currentTab === 'social'" class="social-page fade-in">
        <div class="wuxia-section-title">红颜知己 / 莫逆之交</div>
        <div class="social-card-grid">
          <div v-for="(info, name) in (data as any).社交关系.好感度" :key="name" class="social-card">
            <div class="social-header">
              <span class="social-name">{{ name }}</span>
              <span class="social-rel">{{ (info as any).关系描述 }}</span>
            </div>
            <div class="friendship-bar">
              <div class="friendship-fill" :style="{ width: (((info as any).数值 + 100) / 200) * 100 + '%' }"></div>
            </div>
            <div class="friendship-footer">
              <div class="friendship-val">好感度: {{ (info as any).数值 }}</div>
              <button
                v-if="(info as any).数值 >= 50"
                class="action-btn tiny recruit-btn"
                :class="{ dismiss: isMember(name as string) }"
                @click="toggleTeamMember(name as string)"
              >
                {{ isMember(name as string) ? '请离' : '邀请同行' }}
              </button>
            </div>
          </div>
        </div>

        <div class="wuxia-section-title">当前同行</div>
        <div class="team-list">
          <span v-for="member in (data as any).社交关系.队伍成员" :key="member" class="tag-wuxia secondary">{{
            member
          }}</span>
          <span v-if="(data as any).社交关系.队伍成员.length === 0">孤身一人，仗剑天涯</span>
        </div>
      </div>

      <!-- [纪闻] 经历版块 -->
      <div v-if="currentTab === 'history'" class="history-page fade-in">
        <div class="wuxia-section-title">江湖履历</div>
        <div class="history-summary">{{ (data as any).江湖经历.经历概况 }}</div>

        <div class="wuxia-section-title">重要纪事</div>
        <div class="event-list">
          <div v-for="(event, idx) in (data as any).江湖经历.重要事件录" :key="idx" class="event-item">
            <span class="event-mark">◈</span> {{ event }}
          </div>
        </div>
      </div>
    </div>

    <!-- 底部状态摘要 (始终可见) -->
    <div class="footer-summary">
      <div class="footer-item">
        📍 {{ (data as any).世界状态.当前地点.区域 }} · {{ (data as any).世界状态.当前地点.场所 }}
      </div>
      <div class="footer-item">
        ⏳ {{ (data as any).世界状态.当前时间.年份 }}年{{ (data as any).世界状态.当前时间.季节
        }}{{ (data as any).世界状态.当前时间.月份 }}月
      </div>
      <div class="footer-item money">💰 {{ (data as any).资源资产.银两 }} | 📜 {{ (data as any).资源资产.声望 }}</div>
    </div>

    <!-- D20 掷骰全屏遮罩 -->
    <div v-if="rolling" class="dice-overlay">
      <div class="dice-container">
        <div class="d20-visual dice-rolling">
          {{ displayDiceValue }}
        </div>
        <div class="dice-hint">天命流转，福祸难测...</div>
      </div>
    </div>

    <!-- 武学选择浮窗 -->
    <div v-if="skillSelectMode.active" class="modal-overlay" @click.self="skillSelectMode.active = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>配置 {{ skillSelectMode.slot }}</h3>
          <button class="close-btn" @click="skillSelectMode.active = false">×</button>
        </div>
        <div class="item-list">
          <div class="list-item" @click="confirmSkillSelect('空')">【 卸载招式 】</div>
          <div
            v-for="(info, name) in learnedWaigong"
            :key="name"
            class="list-item"
            @click="confirmSkillSelect(name as string)"
          >
            {{ name }} <small>[{{ (info as any).品级 }}]</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useDataStore } from './store';

const store = useDataStore();
const data = store.data;

// Tab 切换逻辑
const currentTab = ref('status');
const tabs = [
  { id: 'status', label: '状态' },
  { id: 'inventory', label: '行囊' },
  { id: 'martial', label: '武学' },
  { id: 'social', label: '江湖' },
  { id: 'history', label: '纪闻' },
];

// 行囊逻辑 - 统一整合仓库与已学功法
const unifiedInventory = computed(() => {
  if (!data) return {};
  const inv = { ...(data as any).资源资产.背包 };
  const martial = (data as any).武学装备.已习得武学;
  for (const [name, info] of Object.entries(martial)) {
    inv[name] = {
      ...(info as any),
      isMartial: true,
      数量: 1,
    };
  }
  return inv;
});

const selectedItemName = ref<string | null>(null);
const selectedItem = computed(() => {
  if (!selectedItemName.value || !data) return null;
  return unifiedInventory.value[selectedItemName.value];
});

const actionFeedback = ref('');
function setFeedback(msg: string) {
  actionFeedback.value = msg;
  setTimeout(() => {
    actionFeedback.value = '';
  }, 3000);
}

function getItemIcon(name: string, isMartial = false) {
  if (isMartial) return '📜';
  if (name.includes('剑') || name.includes('刀')) return '⚔️';
  if (name.includes('丹') || name.includes('药')) return '💊';
  if (name.includes('甲') || name.includes('衣')) return '🛡️';
  if (name.includes('书') || name.includes('秘籍')) return '📜';
  return '📦';
}

function isEquippable(name: string | null) {
  if (!name) return false;
  const equippableKeywords = ['剑', '刀', '棍', '甲', '衣', '戒', '链', '坠'];
  return equippableKeywords.some(key => name.includes(key));
}

function equipItem() {
  if (!data || !selectedItemName.value) return;
  const name = selectedItemName.value;
  const equip = (data as any).武学装备.当前装备物品;

  // 记录旧物品，用于“撤回/存回行囊”
  let targetSlot = '';
  if (name.includes('剑') || name.includes('刀') || name.includes('棍')) targetSlot = '兵器';
  else if (name.includes('甲') || name.includes('衣')) targetSlot = '防具';
  else targetSlot = '饰品';

  const oldItem = equip[targetSlot];
  if (oldItem && oldItem !== '无') {
    // 自动将旧装备存回行囊
    const inv = (data as any).资源资产.背包;
    if (inv[oldItem]) inv[oldItem].数量++;
    else inv[oldItem] = { 数量: 1, 描述: '先前替换下的装备', 品级: '普通' };
  }

  equip[targetSlot] = name;

  const actionMsg = `在状态栏装备了【${name}】作为${targetSlot}`;
  if ((data as any).江湖经历) (data as any).江湖经历.最近动作 = actionMsg;

  // 如果是从行囊装备的，扣除数量
  if ((data as any).资源资产.背包[name]) {
    (data as any).资源资产.背包[name].数量--;
    if ((data as any).资源资产.背包[name].数量 <= 0) delete (data as any).资源资产.背包[name];
  }

  store.save();
  setFeedback(`成功装备【${name}】`);
  currentTab.value = 'status';
}

function unequipItem(slot: string) {
  if (!data) return;
  const equip = (data as any).武学装备.当前装备物品;
  const name = equip[slot];
  if (!name || name === '无') return;

  const inv = (data as any).资源资产.背包;
  if (inv[name]) inv[name].数量++;
  else inv[name] = { 数量: 1, 描述: '脱下的装备', 品级: '普通' };

  equip[slot] = '无';

  const actionMsg = `在状态栏脱下了装配在${slot}的【${name}】`;
  if ((data as any).江湖经历) (data as any).江湖经历.最近动作 = actionMsg;

  store.save();
  setFeedback(`已将【${name}】脱下并收回行囊`);
}

function useItem() {
  if (!data || !selectedItemName.value) return;
  const name = selectedItemName.value;
  const item = (data as any).资源资产.背包[name];
  if (!item) return;

  // 1. 判断是否为消耗品 (根据名称关键词或明确的类型字段)
  const isConsumable =
    (item as any).类型 === '消耗品' ||
    ['丹', '药', '散', '酒', '茶', '汤', '丸', '膏', '粮', '饮', '食', '烛', '香'].some(k => name.includes(k));

  let actionDesc = `使用了【${name}】`;

  if (isConsumable) {
    item.数量--;
    const remaining = item.数量;
    actionDesc = `消耗了一份【${name}】`;
    if (item.数量 <= 0) {
      delete (data as any).资源资产.背包[name];
      selectedItemName.value = null;
    }
    setFeedback(`${actionDesc}，剩余数量: ${remaining}`);
  } else {
    // 非消耗品逻辑
    if (name.includes('书') || name.includes('秘籍')) {
      actionDesc = `研读了【${name}】，深有感触`;
    } else {
      actionDesc = `使用了【${name}】`;
    }
    setFeedback(actionDesc);
  }

  // 2. 写入“最近动作”，让 AI 在写正文时能感知到
  if ((data as any).江湖经历) {
    (data as any).江湖经历.最近动作 = `玩家在状态栏执行：${actionDesc}。请务必在下一段正文描写中体现此动作的因果。`;
  }

  store.save();
}

function discardItem() {
  if (!data || !selectedItemName.value) return;
  const name = selectedItemName.value;
  if (!confirm(`确定要永远丢弃【${name}】吗？此举不可撤回！`)) return;

  if ((data as any).资源资产.背包[name]) {
    delete (data as any).资源资产.背包[name];
  } else if ((data as any).武学装备.已习得武学[name]) {
    delete (data as any).武学装备.已习得武学[name];
  }

  selectedItemName.value = null;
  store.save();
  setFeedback(`已丢弃【${name}】`);
}

// 武学逻辑
const learnedNeigong = computed(() => {
  if (!data) return {};
  return Object.fromEntries(
    Object.entries((data as any).武学装备.已习得武学).filter(([_, i]) => (i as any).类型 === '内功'),
  );
});

const learnedWaigong = computed(() => {
  if (!data) return {};
  return Object.fromEntries(
    Object.entries((data as any).武学装备.已习得武学).filter(([_, i]) => (i as any).类型 === '外功'),
  );
});

function runNeigong(name: string) {
  if (!data) return;
  (data as any).武学装备.currentRunningNeigong = name;
  (data as any).武学装备.当前运行内功 = name;

  const actionMsg = `在状态栏开始运使【${name}】心法`;
  if ((data as any).江湖经历) (data as any).江湖经历.最近动作 = actionMsg;

  store.save();
}

const skillSelectMode = reactive({ active: false, slot: '' });
function openSkillSelect(slot: string) {
  skillSelectMode.slot = slot;
  skillSelectMode.active = true;
}
function confirmSkillSelect(name: string) {
  if (!data) return;
  ((data as any).武学装备.装备外功列表 as any)[skillSelectMode.slot] = name;

  const actionMsg =
    name === '空'
      ? `在状态栏去除了${skillSelectMode.slot}位的招式`
      : `在状态栏将${skillSelectMode.slot}位配置为【${name}】`;
  if ((data as any).江湖经历) (data as any).江湖经历.最近动作 = actionMsg;

  store.save();
  skillSelectMode.active = false;
}

// D20 抉择逻辑
const d20Choices = [
  { id: 'str', label: '奋力一击 / 硬闯', attr: '臂力' },
  { id: 'agi', label: '轻功闪避 / 潜行', attr: '身法' },
  { id: 'int', label: '寻找破绽 / 忽悠', attr: '悟性' },
  { id: 'luck', label: '随缘应对 / 听天', attr: '机敏' },
];

function getHeavenlyResultText(res: string) {
  switch (res) {
    case '大成功':
      return '紫气东来 · 天佑之相';
    case '成功':
      return '顺水推舟 · 逢凶化吉';
    case '失败':
      return '棋差一着 · 运势稍逊';
    case '大失败':
      return '天意弄人 · 命中合劫';
    default:
      return res;
  }
}

function resetD20() {
  if (!data) return;
  rolling.value = false; // 强制重置滚动状态，防止挂起
  (data as any).当前检定.结果 = '无';
  (data as any).当前检定.数值 = 0;
  store.save();
  setFeedback('命盘已洗，静候天启');
}

// D20 联动掷骰系统
const rolling = ref(false);
const displayDiceValue = ref(20);

async function startD20Roll(choice: any) {
  if (!data || rolling.value) return;
  rolling.value = true;

  // 模拟动画
  const interval = setInterval(() => {
    displayDiceValue.value = Math.floor(Math.random() * 20) + 1;
  }, 50);

  try {
    await new Promise(resolve => setTimeout(resolve, 1200));
    clearInterval(interval);
    const finalVal = Math.floor(Math.random() * 20) + 1;
    displayDiceValue.value = finalVal;

    await new Promise(resolve => setTimeout(resolve, 500));
    finishD20(finalVal, choice);
  } catch (e) {
    console.error('D20 Roll Error:', e);
  } finally {
    rolling.value = false;
  }
}

function finishD20(val: number, choice: any) {
  const check = (data as any).当前检定;
  check.数值 = val;

  // 计算加成
  let bonus = 0;
  if (choice) {
    bonus = (data as any).核心属性.属性[choice.attr] || 0;
  }
  check.加成 = bonus;

  const total = val + bonus;

  if (val === 20) check.结果 = '大成功';
  else if (val === 1) check.结果 = '大失败';
  else if (total >= (check.难度 || 10)) check.结果 = '成功';
  else check.结果 = '失败';

  store.save();
}

// 社交与组队逻辑
function isMember(name: string) {
  if (!data) return false;
  return (data as any).社交关系.队伍成员.includes(name);
}

function toggleTeamMember(name: string) {
  if (!data) return;
  const team = (data as any).社交关系.队伍成员;
  const index = team.indexOf(name);
  if (index > -1) {
    team.splice(index, 1);
    setFeedback(`已将【${name}】从队伍中请离`);
    if ((data as any).江湖经历) (data as any).江湖经历.最近动作 = `在状态栏将【${name}】请离出队伍`;
  } else {
    team.push(name);
    setFeedback(`成功邀请【${name}】共闯江湖！`);
    if ((data as any).江湖经历) (data as any).江湖经历.最近动作 = `在状态栏邀请【${name}】结伴同行`;
  }
  store.save();
}

// 自动重置逻辑：当判定描述变化时，说明进入了新回合或新任务，自动重置结果
watch(
  () => (data as any)?.当前检定?.描述,
  (newDesc, oldDesc) => {
    if (newDesc && newDesc !== '无' && newDesc !== oldDesc) {
      const check = (data as any).当前检定;
      check.结果 = '无';
      check.数值 = 0;
      check.加成 = 0;
      store.save(); // 确保重置状态也同步保存
    }
  },
);
</script>

<style scoped>
/* 组件级内部样式优化 */
.status-page {
  padding-bottom: 20px;
}

.item-grid-scroll {
  height: 400px;
  overflow-y: auto;
  padding-right: 10px;
  scrollbar-width: thin;
}

.slot-premium {
  background: white;
  border: 1px solid var(--glass-border);
  padding: 12px 18px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  transition: all 0.3s;
}
.slot-left {
  flex: 1;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}
.unequip-btn {
  margin-left: 10px;
  padding: 2px 8px;
  background: #eee;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 0.75rem;
  cursor: pointer;
}
.unequip-btn:hover {
  background: var(--vermilion);
  color: white;
  border-color: var(--vermilion);
}

.char-tags-row {
  margin-top: 25px;
  display: flex;
  gap: 15px;
}
.tag-wuxia {
  padding: 8px 15px;
  background: var(--paper-ivory);
  border: 1px solid var(--border-sepia);
  font-family: 'ZCOOL XiaoWei', serif;
  font-size: 0.95rem;
  box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1);
  color: #333;
}
.tag-wuxia.secondary {
  border-color: var(--vermilion);
  color: var(--vermilion);
  background: rgba(178, 34, 34, 0.05);
}

.check-subtitle {
  font-size: 0.85rem;
  color: #666;
  margin-top: 5px;
}

.check-result-container {
  margin-top: 15px;
}

.check-result-text {
  font-size: 1.5rem;
  font-weight: 900;
  text-align: center;
  font-family: 'ZCOOL XiaoWei', serif;
}
.check-result-text.成功 {
  color: var(--jade-light);
}
.check-result-text.失败 {
  color: #555;
}
.check-result-text.大成功 {
  color: var(--gold-leaf);
  text-shadow: 0 0 15px var(--gold-glow);
}
.check-result-text.大失败 {
  color: var(--vermilion);
  text-decoration: underline wavy;
}

.roll-trigger {
  width: 100%;
  margin-top: 10px;
}

.skill-slot-wide {
  background: white;
  border: 1px solid var(--glass-border);
  margin-bottom: 12px;
  padding: 14px 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  border-radius: 4px;
  transition: all 0.3s;
}

.skill-slot-wide:hover {
  border-color: var(--vermilion);
}

.choice-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 15px;
}

.choice-btn {
  background: white;
  border: 1px solid var(--border-sepia);
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'ZCOOL XiaoWei', serif;
  transition: all 0.2s;
  text-align: left;
  font-size: 0.95rem;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.05);
}

.choice-btn:hover {
  border-color: var(--vermilion);
  background: rgba(178, 34, 34, 0.05);
  transform: translateX(3px);
}

.choice-attr {
  color: var(--vermilion);
  font-weight: bold;
  font-size: 0.8rem;
  margin-right: 5px;
}

.check-heavenly-title {
  text-align: center;
  font-size: 0.8rem;
  color: #888;
  letter-spacing: 4px;
  margin-bottom: 8px;
}

.check-math {
  font-size: 0.9rem;
  font-weight: normal;
  opacity: 0.7;
  margin-left: 10px;
}

.retry-btn {
  width: 100px;
  margin: 15px auto 0;
  display: block;
}

.item-slot.is-martial {
  background: rgba(178, 34, 34, 0.03);
  border-color: rgba(178, 34, 34, 0.2);
}
.martial-tag {
  position: absolute;
  top: 2px;
  right: 2px;
  background: var(--vermilion);
  color: white;
  font-size: 0.6rem;
  padding: 1px 3px;
  border-radius: 2px;
}

.action-btn.danger {
  background: #555;
  color: #fff;
}
.action-btn.danger:hover {
  background: #b22222;
}

.action-feedback {
  margin-top: 10px;
  text-align: center;
  font-size: 0.85rem;
  color: var(--vermilion);
  font-family: 'ZCOOL XiaoWei', serif;
  background: rgba(178, 34, 34, 0.05);
  padding: 5px;
  border-radius: 4px;
}

.check-actions {
  display: flex;
  justify-content: center;
}

.friendship-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
}
.recruit-btn {
  padding: 2px 10px;
  font-size: 0.8rem;
}
.recruit-btn.dismiss {
  background: #666;
}
.recruit-btn.dismiss:hover {
  background: var(--vermilion);
}
</style>

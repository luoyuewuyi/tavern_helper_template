<template>
  <div class="opening-shell">
    <section class="panel hero-card">
      <div class="hero-copy">
        <div class="eyebrow">WESTERN FANTASY / ADVENTURE / SYSTEM</div>
        <h1>西幻异界冒险</h1>
        <p>华夏穿越西幻位面第三年。你是一名22岁的华夏孤儿，身上唯一的信物是一枚来历不明的龙凤玉佩。今天，你将在边锋镇注册成为冒险者。</p>
      </div>
      <div class="hero-tags">
        <span>冒险成长</span>
        <span>后宫攻略</span>
        <span>系统金手指</span>
      </div>
    </section>

    <section class="panel">
      <div class="field-grid">
        <label class="field"><span>姓名</span><input v-model.trim="form.姓名" type="text" maxlength="18" placeholder="留空则使用酒馆用户名" /></label>
        <label class="field">
          <span>性别</span>
          <select v-model="form.性别"><option v-for="item in 性别选项" :key="item" :value="item">{{ item }}</option></select>
        </label>
        <label class="field field-full">
          <span>开局附加说明（可选）</span>
          <textarea v-model.trim="form.开局说明" rows="4" maxlength="260" placeholder="例如：我希望角色更擅长社交而非战斗。留空则按默认设定开场。" />
        </label>
      </div>
    </section>

    <section class="panel summary-panel">
      <div class="status-row">
        <span>开局摘要</span>
        <strong>新注册冒险者</strong>
      </div>
      <div class="summary-grid">
        <div class="summary-card"><span>起始地点</span><strong>边锋镇</strong><p>华夏缓冲区最大冒险据点</p></div>
        <div class="summary-card"><span>初始资金</span><strong>30银币 + 500铜币</strong><p>积攒多年的盘缠</p></div>
        <div class="summary-card"><span>同行伙伴</span><strong>韩霄 · 万峰 · 顾承安</strong><p>发小和结拜兄弟</p></div>
      </div>
    </section>

    <section class="action-row">
      <button class="primary-button" type="button" @click="submitOpening">建档并开场</button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useDataStore } from './store';

const store = useDataStore();
const 性别选项 = ['男', '女'] as const;

const form = reactive({
  姓名: '',
  性别: '男' as '男' | '女',
  开局说明: '',
});

function submitOpening() {
  const name = form.姓名 || '{{user}}';
  updateVariablesWith((variables: any) => {
    const data = _.get(variables, 'stat_data', {});
    if (!data.主角) data.主角 = {};
    data.主角.姓名 = name;
    data.主角.性别 = form.性别;
    _.set(variables, 'stat_data', data);
  }, { type: 'message', message_id: getCurrentMessageId() });

  const openingText = form.开局说明.trim();
  if (openingText) {
    const escaped = openingText.replace(/\|/g, '\\|').replace(/\n/g, '\\n').replace(/"/g, '\\"');
    triggerSlash(`/echo severity=success 建档完成，正在进入异界……| /send ${escaped} | /trigger`);
  } else {
    triggerSlash('/echo severity=success 建档完成，正在进入异界……| /trigger');
  }
}
</script>

<style scoped lang="scss">
.opening-shell { width: min(760px, 100%); margin: 8px auto; padding: 16px; display: grid; gap: 14px; color: #efe4d3; background: radial-gradient(circle at top left, rgba(178, 112, 56, 0.22), transparent 28%), radial-gradient(circle at top right, rgba(120, 24, 24, 0.18), transparent 30%), linear-gradient(180deg, rgba(28, 20, 16, 0.98), rgba(11, 10, 12, 0.98)); border: 1px solid rgba(205, 156, 93, 0.24); border-radius: 24px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.36); font-family: Georgia, 'Times New Roman', serif; }
.panel { padding: 18px; border-radius: 18px; border: 1px solid rgba(255, 255, 255, 0.08); background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(186, 111, 41, 0.05)), rgba(255, 255, 255, 0.03); }
.hero-card, .status-row, .action-row { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; }
.hero-copy h1 { margin: 6px 0 8px; font-size: 32px; letter-spacing: 0.06em; }
.hero-copy p, .summary-card p { margin: 0; line-height: 1.6; color: rgba(239, 228, 211, 0.78); }
.eyebrow { font-size: 11px; letter-spacing: 0.28em; color: #d7a257; }
.hero-tags { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
.hero-tags span, .summary-card strong { color: #f5ddac; }
.hero-tags span { padding: 6px 10px; border-radius: 999px; border: 1px solid rgba(215, 162, 87, 0.24); background: rgba(215, 162, 87, 0.08); white-space: nowrap; }
.field-grid, .summary-grid { display: grid; gap: 12px; }
.field-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.summary-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.field { display: grid; gap: 6px; }
.field-full { grid-column: 1 / -1; }
.field span, .status-row span, .summary-card span { color: rgba(239, 228, 211, 0.72); font-size: 12px; }
.field input, .field select, .field textarea { width: 100%; min-width: 0; box-sizing: border-box; padding: 12px 13px; border: 1px solid rgba(211, 164, 99, 0.18); border-radius: 14px; background: linear-gradient(180deg, rgba(14, 14, 18, 0.94), rgba(26, 20, 17, 0.94)), rgba(0, 0, 0, 0.3); color: #f6eee0; font: inherit; }
.summary-card { padding: 14px; border-radius: 16px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); }
.primary-button { appearance: none; border-radius: 999px; min-height: 44px; padding: 0 24px; font: inherit; cursor: pointer; border: 0; color: #21140d; background: linear-gradient(135deg, #c58a41, #f0d8a4); width: 100%; font-size: 16px; }
.primary-button:hover { filter: brightness(1.1); }
.action-row { justify-content: center; }
@media (max-width: 760px) { .field-grid, .summary-grid { grid-template-columns: 1fr; } .hero-card, .status-row { flex-direction: column; } .hero-tags { justify-content: flex-start; } }
</style>

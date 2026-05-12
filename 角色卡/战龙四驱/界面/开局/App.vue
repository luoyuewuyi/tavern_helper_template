<template>
  <div class="opening-shell">
    <!-- 标题区 -->
    <section class="panel hero-card">
      <div class="hero-copy">
        <div class="eyebrow">MINI 4WD / RACING / DRAGON SOUL</div>
        <h1>战 龙 四 驱</h1>
        <p>赛道上翻涌的不光是速度，还有少年们不可磨灭的信念。迷你四驱车不仅仅是玩具——当赛手的意志与赛车共鸣时，龙魂便会觉醒。</p>
      </div>
      <div class="hero-tags">
        <span>🏎️ 热血竞技</span>
        <span>🐉 龙魂觉醒</span>
        <span>⚙️ 赛车研发</span>
      </div>
    </section>

    <!-- 用户信息输入 -->
    <section class="panel">
      <div class="section-title">📋 赛手档案</div>
      <div class="field-grid">
        <label class="field">
          <span>赛手名</span>
          <input v-model.trim="form.赛手名" type="text" maxlength="18" placeholder="留空则使用酒馆用户名" />
        </label>
        <label class="field">
          <span>性别</span>
          <select v-model="form.性别">
            <option v-for="item in 性别选项" :key="item" :value="item">{{ item }}</option>
          </select>
        </label>
        <label class="field">
          <span>年龄</span>
          <input v-model.trim="form.年龄" type="text" maxlength="4" placeholder="13" />
        </label>
        <label class="field">
          <span>初始身份</span>
          <select v-model="form.身份">
            <option v-for="item in 身份选项" :key="item" :value="item">{{ item }}</option>
          </select>
        </label>
        <label class="field field-full">
          <span>个人背景（可选）</span>
          <textarea v-model.trim="form.背景" rows="3" maxlength="300" placeholder="例如：从小跟着一位退役赛手学习四驱车改装……留空则由AI自动生成。" />
        </label>
      </div>
    </section>

    <!-- 开局摘要 -->
    <section class="panel summary-panel">
      <div class="section-title">📊 开局预览</div>
      <div class="summary-grid">
        <div class="summary-card">
          <span>起始地点</span>
          <strong>{{ 起始地点映射[form.身份] || '地方赛区' }}</strong>
          <p>{{ 地点描述映射[form.身份] || '即将踏上四驱车竞技之路' }}</p>
        </div>
        <div class="summary-card">
          <span>初始赛车</span>
          <strong>{{ 赛车映射[form.身份] || '待定' }}</strong>
          <p>你的第一辆战车</p>
        </div>
        <div class="summary-card">
          <span>技术等级</span>
          <strong>{{ 等级映射[form.身份] || 'D级' }}</strong>
          <p>你的当前水准</p>
        </div>
      </div>
    </section>

    <!-- 自定义开局说明 -->
    <section class="panel">
      <div class="section-title">✨ 自定义开局</div>
      <label class="field field-full">
        <span>开局场景描述（可选）</span>
        <textarea v-model.trim="form.开局场景" rows="4" maxlength="400" :placeholder="openingPlaceholder" />
      </label>
    </section>

    <!-- 提交按钮 -->
    <section class="action-row">
      <button class="primary-button" type="button" @click="submitOpening" :disabled="submitting">
        {{ submitting ? '正在启动引擎...' : '🚀 确认出发' }}
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

const openingPlaceholder = '例如：我在废弃的仓库里发现了一辆破旧的迷你四驱车，它的车壳上隐约刻着龙纹……\n\n留空则使用默认开场。此内容将直接触发AI回复，不保存到世界书。';

const 性别选项 = ['男', '女'] as const;
const 身份选项 = [
  '新人赛手',
  '赛车改装学徒',
  '俱乐部见习生',
  '自由赛手',
] as const;

const 起始地点映射: Record<string, string> = {
  '新人赛手': '地方赛区',
  '赛车改装学徒': '老师傅的改装工坊',
  '俱乐部见习生': '某俱乐部训练场',
  '自由赛手': '街头野赛赛道',
};

const 地点描述映射: Record<string, string> = {
  '新人赛手': '怀揣梦想的新手，即将参加第一场C组赛',
  '赛车改装学徒': '从改装入门，以技术立足赛场',
  '俱乐部见习生': '加入俱乐部从基层做起',
  '自由赛手': '不受束缚的独行侠',
};

const 赛车映射: Record<string, string> = {
  '新人赛手': '基础型四驱车（自选外观）',
  '赛车改装学徒': '师傅赠送的改装练习车',
  '俱乐部见习生': '俱乐部提供的训练用车',
  '自由赛手': '自行组装的街头战车',
};

const 等级映射: Record<string, string> = {
  '新人赛手': 'D级',
  '赛车改装学徒': 'C级',
  '俱乐部见习生': 'D级',
  '自由赛手': 'C级',
};

const form = reactive({
  赛手名: '',
  性别: '男' as '男' | '女',
  年龄: '',
  身份: '新人赛手' as string,
  背景: '',
  开局场景: '',
});

const submitting = ref(false);

async function submitOpening() {
  if (submitting.value) return;
  submitting.value = true;

  try {
    const name = form.赛手名 || '{{user}}';
    const age = form.年龄 || '13';

    // 构建用户设定文本写入世界书
    const lines = [
      `<user_setting>`,
      `{{user}}设定:`,
      `  赛手名: ${name}`,
      `  性别: ${form.性别}`,
      `  年龄: ${age}岁`,
      `  初始身份: ${form.身份}`,
      `  技术等级: ${等级映射[form.身份] || 'D级'}`,
      `  初始赛车: ${赛车映射[form.身份] || '基础型四驱车'}`,
      `  起始地点: ${起始地点映射[form.身份] || '地方赛区'}`,
    ];
    if (form.背景) {
      lines.push(`  个人背景: |-`);
      form.背景.split('\n').forEach(line => {
        lines.push(`    ${line}`);
      });
    }
    lines.push(`</user_setting>`);
    const content = lines.join('\n');

    // 获取角色卡的主世界书名称并写入用户设定条目
    const charWb = getCharWorldbookNames('current');
    const wbName = charWb.primary;
    if (wbName) {
      // 尝试更新已有的用户设定条目，如果没有则新增
      const entries = await getWorldbook(wbName);
      const existing = entries.find(e => e.name === '用户设定');
      if (existing) {
        await updateWorldbookWith(wbName, wb =>
          wb.map(e => e.name === '用户设定' ? { ...e, content, enabled: true } : e),
        );
      } else {
        await createWorldbookEntries(wbName, [{
          name: '用户设定',
          enabled: true,
          content,
          strategy: {
            type: 'constant',
            keys: [],
            keys_secondary: { logic: 'and_any', keys: [] },
            scan_depth: 'same_as_global',
          },
          position: {
            type: 'before_character_definition',
            role: 'system',
            depth: 0,
            order: 90,
          },
          recursion: {
            prevent_incoming: true,
            prevent_outgoing: true,
            delay_until: null,
          },
          probability: 100,
        }]);
      }
    }

    // 处理开局场景：直接触发AI回复
    const openingText = form.开局场景.trim();
    if (openingText) {
      const escaped = openingText.replace(/\|/g, '\\|').replace(/\n/g, '\\n').replace(/"/g, '\\"');
      triggerSlash(`/echo severity=success 赛手档案已建立，引擎启动中……| /send ${escaped} | /trigger`);
    } else {
      triggerSlash('/echo severity=success 赛手档案已建立，引擎启动中……| /trigger');
    }
  } catch (e) {
    console.error('开局提交失败:', e);
    submitting.value = false;
  }
}
</script>

<style scoped lang="scss">
.opening-shell {
  width: min(760px, 100%);
  margin: 8px auto;
  padding: 16px;
  display: grid;
  gap: 14px;
  color: #e8eaf0;
  background:
    radial-gradient(circle at top left, rgba(220, 60, 30, 0.15), transparent 32%),
    radial-gradient(circle at bottom right, rgba(30, 90, 200, 0.12), transparent 36%),
    linear-gradient(180deg, rgba(16, 14, 22, 0.98), rgba(10, 12, 18, 0.98));
  border: 1px solid rgba(220, 80, 40, 0.22);
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.42);
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
}

.panel {
  padding: 18px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(200, 80, 30, 0.04)),
    rgba(255, 255, 255, 0.02);
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 180, 90, 0.9);
  margin-bottom: 12px;
  letter-spacing: 0.06em;
}

.hero-card {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.hero-copy h1 {
  margin: 6px 0 8px;
  font-size: 34px;
  letter-spacing: 0.12em;
  background: linear-gradient(135deg, #ff6a3d, #ffc93c, #ff6a3d);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}

.hero-copy p {
  margin: 0;
  line-height: 1.7;
  color: rgba(232, 234, 240, 0.72);
  font-size: 14px;
}

.eyebrow {
  font-size: 11px;
  letter-spacing: 0.28em;
  color: #ff6a3d;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
  flex-shrink: 0;
}

.hero-tags span {
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 106, 61, 0.22);
  background: rgba(255, 106, 61, 0.08);
  white-space: nowrap;
  color: #ffc93c;
  font-size: 12px;
}

.field-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.field {
  display: grid;
  gap: 6px;
}

.field-full {
  grid-column: 1 / -1;
}

.field span {
  color: rgba(232, 234, 240, 0.65);
  font-size: 12px;
  letter-spacing: 0.04em;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 12px 13px;
  border: 1px solid rgba(255, 106, 61, 0.16);
  border-radius: 14px;
  background:
    linear-gradient(180deg, rgba(14, 14, 18, 0.95), rgba(22, 18, 16, 0.95)),
    rgba(0, 0, 0, 0.3);
  color: #f0e8dc;
  font: inherit;
  font-size: 14px;
  transition: border-color 0.2s;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-color: rgba(255, 106, 61, 0.5);
}

.field textarea {
  resize: vertical;
  line-height: 1.6;
}

.summary-panel .section-title {
  margin-bottom: 10px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.summary-card {
  padding: 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.summary-card span {
  color: rgba(232, 234, 240, 0.55);
  font-size: 11px;
  letter-spacing: 0.04em;
}

.summary-card strong {
  display: block;
  margin: 4px 0;
  color: #ffc93c;
  font-size: 14px;
}

.summary-card p {
  margin: 0;
  color: rgba(232, 234, 240, 0.5);
  font-size: 12px;
  line-height: 1.4;
}

.action-row {
  display: flex;
  justify-content: center;
}

.primary-button {
  appearance: none;
  border-radius: 999px;
  min-height: 48px;
  padding: 0 28px;
  font: inherit;
  cursor: pointer;
  border: 0;
  color: #1a0f08;
  background: linear-gradient(135deg, #ff6a3d, #ffc93c);
  width: 100%;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.06em;
  transition: filter 0.2s, transform 0.1s;
}

.primary-button:hover:not(:disabled) {
  filter: brightness(1.12);
  transform: translateY(-1px);
}

.primary-button:active:not(:disabled) {
  transform: translateY(0);
}

.primary-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 760px) {
  .field-grid,
  .summary-grid {
    grid-template-columns: 1fr;
  }
  .hero-card {
    flex-direction: column;
  }
  .hero-tags {
    justify-content: flex-start;
  }
}
</style>

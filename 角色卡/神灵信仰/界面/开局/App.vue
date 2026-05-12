<template>
  <div v-if="alreadyCreated" class="opening-shell collapsed-shell">
    <section class="panel compact-panel">
      <div class="status-row">
        <span>开局建档</span>
        <strong class="pass">已完成</strong>
      </div>
    </section>
  </div>

  <div v-else class="opening-shell">
    <section class="panel hero-card">
      <div>
        <h1>角色建档</h1>
        <p>这里只写基础角色信息。自定义开局不会进变量，只会作为开场输入发送给 AI。</p>
      </div>
    </section>

    <section class="panel">
      <div class="field-grid">
        <label class="field">
          <span>姓名</span>
          <input v-model.trim="form.姓名" type="text" maxlength="18" placeholder="{{user}}" />
        </label>
        <label class="field">
          <span>年龄</span>
          <input v-model.number="form.年龄" type="number" min="18" max="30" />
        </label>
        <label class="field field-full">
          <span>身份</span>
          <input v-model.trim="form.身份" type="text" maxlength="40" placeholder="乾国外交部外交官" />
        </label>
        <label class="field">
          <span>行事风格</span>
          <input v-model.trim="form.行事风格" type="text" maxlength="24" placeholder="克制审慎" />
        </label>
        <label class="field">
          <span>初始信仰倾向</span>
          <input v-model.trim="form.初始信仰倾向" type="text" maxlength="24" placeholder="福运未定" />
        </label>
        <label class="field">
          <span>初始焦点角色</span>
          <select v-model="form.当前焦点角色">
            <option v-for="item in 焦点角色选项" :key="item" :value="item">{{ item }}</option>
          </select>
        </label>
        <label class="field field-full">
          <span>自定义开局</span>
          <textarea v-model.trim="form.自定义开局" rows="5" maxlength="240" placeholder="留空则直接触发第一轮回复。" />
        </label>
      </div>
    </section>

    <section class="panel compact-panel">
      <div class="status-row">
        <span>变量检测</span>
        <strong :class="{ pass: validation.ok, fail: !validation.ok }">
          {{ validation.ok ? '通过' : '未通过' }}
        </strong>
      </div>
      <ul v-if="validation.errors.length" class="error-list">
        <li v-for="item in validation.errors" :key="item">{{ item }}</li>
      </ul>
    </section>

    <section class="action-row">
      <button class="secondary-button" type="button" @click="resetForm">恢复</button>
      <button class="primary-button" type="button" :disabled="!validation.ok" @click="submitOpening">创建并开场</button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { Schema } from '../../schema';
import { useDataStore } from './store';

const store = useDataStore();
const 焦点角色选项 = ['张建珍', '王群荣', '张素菲', '张宇', '张哲恺', '诺姆'] as const;

type 表单 = {
  姓名: string;
  年龄: number;
  身份: string;
  行事风格: string;
  初始信仰倾向: string;
  当前焦点角色: (typeof 焦点角色选项)[number];
  自定义开局: string;
};

function 转义Slash文本(value: string) {
  return value.replace(/\|/g, '\\|').replace(/\n/g, '\\n').replace(/"/g, '\\"');
}

function createFormFromStore(): 表单 {
  return {
    姓名: store.data.主角.姓名 === '{{user}}' ? '' : store.data.主角.姓名,
    年龄: store.data.主角.年龄,
    身份: store.data.主角.身份,
    行事风格: store.data.主角.行事风格,
    初始信仰倾向: store.data.主角.初始信仰倾向,
    当前焦点角色: 焦点角色选项.includes(store.data.当前焦点角色 as (typeof 焦点角色选项)[number])
      ? (store.data.当前焦点角色 as (typeof 焦点角色选项)[number])
      : '张建珍',
    自定义开局: '',
  };
}

const form = reactive<表单>(createFormFromStore());
const resolvedName = computed(() => form.姓名 || '{{user}}');
const alreadyCreated = computed(() => store.data.开局设置.已完成创建);

function buildCandidateState() {
  const nextData = _.cloneDeep(store.data);
  nextData.主角.姓名 = resolvedName.value;
  nextData.主角.年龄 = _.clamp(Number(form.年龄) || 20, 18, 30);
  nextData.主角.身份 = form.身份.trim() || '乾国外交部外交官';
  nextData.主角.行事风格 = form.行事风格.trim() || '克制审慎';
  nextData.主角.初始信仰倾向 = form.初始信仰倾向.trim() || '福运未定';
  nextData.开局设置.已完成创建 = true;
  nextData.当前焦点角色 = form.当前焦点角色;
  return nextData;
}

const validation = computed(() => {
  const errors: string[] = [];
  if (!form.身份.trim()) errors.push('身份不能为空。');

  const parsed = Schema.safeParse(buildCandidateState());
  if (!parsed.success) {
    parsed.error.issues.forEach(issue => {
      errors.push(`${issue.path.join('/')}: ${issue.message}`);
    });
  }

  return {
    ok: errors.length === 0,
    errors,
    data: parsed.success ? parsed.data : null,
  };
});

function resetForm() {
  Object.assign(form, createFormFromStore());
}

function submitOpening() {
  if (!validation.value.ok || !validation.value.data) return;

  updateVariablesWith(
    variables => {
      _.set(variables, 'stat_data', _.cloneDeep(validation.value.data));
    },
    {
      type: 'message',
      message_id: getCurrentMessageId(),
    },
  );

  const openingText = form.自定义开局.trim();
  if (openingText) {
    triggerSlash(`/echo severity=success 建档完成，正在进入第一幕……| /send ${转义Slash文本(openingText)} | /trigger`);
    return;
  }

  triggerSlash('/echo severity=success 建档完成，正在进入第一幕……| /trigger');
}
</script>

<style scoped lang="scss">
.opening-shell {
  width: min(680px, 100%);
  margin: 8px auto;
  padding: 14px;
  display: grid;
  gap: 14px;
  color: #f6efdf;
  background:
    radial-gradient(circle at top left, rgba(216, 175, 88, 0.16), transparent 24%),
    radial-gradient(circle at bottom right, rgba(129, 29, 29, 0.16), transparent 28%),
    linear-gradient(180deg, rgba(22, 16, 18, 0.98), rgba(10, 10, 14, 0.98));
  border: 1px solid rgba(229, 198, 124, 0.22);
  border-radius: 22px;
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.34);
  font-family: Georgia, 'Times New Roman', serif;
}

.panel {
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
}

.hero-card,
.action-row,
.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.hero-card h1 {
  margin: 0;
}

.hero-card p {
  margin: 6px 0 0;
  color: rgba(246, 239, 223, 0.76);
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.field {
  display: grid;
  gap: 6px;
}

.field span,
.status-row span {
  color: rgba(235, 222, 197, 0.78);
  font-size: 12px;
}

.field-full {
  grid-column: 1 / -1;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 11px 12px;
  color: #f6efdf;
  background: rgba(8, 10, 13, 0.78);
  border: 1px solid rgba(232, 198, 127, 0.18);
  border-radius: 12px;
  font: inherit;
}

.compact-panel {
  display: grid;
  gap: 10px;
}

.collapsed-shell {
  width: min(680px, 100%);
  padding-top: 6px;
  padding-bottom: 6px;
}

.pass {
  color: #9fdb9f;
}

.fail {
  color: #ffb5b5;
}

.error-list {
  margin: 0;
  padding-left: 18px;
  color: #ffcece;
}

.primary-button,
.secondary-button {
  appearance: none;
  border: 0;
  border-radius: 999px;
  min-height: 42px;
  padding: 0 18px;
  font: inherit;
  cursor: pointer;
}

.primary-button {
  color: #160f0f;
  background: linear-gradient(135deg, #d3b16a, #f2e3bf);
}

.primary-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.secondary-button {
  color: #f6efdf;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

@media (max-width: 760px) {
  .field-grid {
    grid-template-columns: 1fr;
  }

  .hero-card,
  .action-row,
  .status-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

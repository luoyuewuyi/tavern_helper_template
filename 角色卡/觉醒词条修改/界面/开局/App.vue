<template>
  <div class="entry-shell">
    <section class="entry-card">
      <div class="hero">
        <span class="eyebrow">关键词观察编辑系统</span>
        <h1>觉醒词条修改能力</h1>
        <p>先完成建档。学校、专业、时间和地点都由你自定义，系统只写入基础变量；剧情会按当前校园场景动态生成 NPC。</p>
      </div>

      <div class="panel-grid">
        <label class="field">
          <span>姓名</span>
          <input v-model.trim="form.姓名" type="text" placeholder="请输入主角姓名" />
        </label>
        <label class="field">
          <span>性别</span>
          <select v-model="form.性别">
            <option value="男">男</option>
            <option value="女">女</option>
            <option value="其他">其他</option>
          </select>
        </label>
        <label class="field">
          <span>年龄</span>
          <input v-model.number="form.年龄" type="number" min="18" max="30" />
        </label>
        <label class="field">
          <span>身高(cm)</span>
          <input v-model.number="form.身高" type="number" min="140" max="220" />
        </label>
        <label class="field">
          <span>学校名称</span>
          <input v-model.trim="form.学校名称" type="text" placeholder="如：南川大学 / 东海理工 / 你自定义的学校" />
        </label>
        <label class="field">
          <span>专业</span>
          <input v-model.trim="form.专业" type="text" placeholder="如：计算机、新闻、英语" />
        </label>
        <label class="field">
          <span>学院 / 院系</span>
          <input v-model.trim="form.学院" type="text" placeholder="如：信息学院 / 外国语学院" />
        </label>
        <label class="field">
          <span>宿舍</span>
          <input v-model.trim="form.宿舍" type="text" placeholder="如：三舍 402" />
        </label>
        <label class="field">
          <span>当前时间</span>
          <input v-model.trim="form.当前时间" type="text" placeholder="如：2026年9月开学第三天 上午 / 初冬晚自习后" />
        </label>
        <label class="field">
          <span>当前地点</span>
          <input v-model.trim="form.当前地点" type="text" placeholder="如：新生报到点 / 图书馆门口 / 操场看台" />
        </label>
      </div>

      <label class="field wide">
        <span>外形特点</span>
        <textarea v-model.trim="form.外形特点" rows="3" placeholder="身材、气质、穿搭、第一眼观感等" />
      </label>

      <label class="field wide">
        <span>自定义开局文本</span>
        <textarea
          v-model.trim="form.自定义开局"
          rows="6"
          placeholder="这里只会拼进首轮用户消息，例如你当下在做什么、为什么会来到这里、你想先观察怎样的人。"
        />
      </label>

      <div class="tips">
        <div>初始能力固定为 E级：必须接触、最多改3字、只能轻微改动情绪心情，遇到异类可直接看到其等级。</div>
        <div>升阶按当前等级进度结算；D级起还会额外卡异类修改条件，学校、专业、时间和地点都可自由设定。</div>
      </div>

      <div v-if="error" class="error-box">{{ error }}</div>

      <div class="actions">
        <button class="ghost" type="button" @click="resetForm">重置</button>
        <button class="primary" type="button" @click="submitEntry">进入剧情</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Schema } from '../../schema';

type Draft = {
  姓名: string;
  性别: '男' | '女' | '其他';
  年龄: number;
  身高: number;
  学校名称: string;
  专业: string;
  学院: string;
  宿舍: string;
  当前时间: string;
  当前地点: string;
  外形特点: string;
  自定义开局: string;
};

const defaultForm = (): Draft => ({
  姓名: '',
  性别: '男',
  年龄: 18,
  身高: 175,
  学校名称: '',
  专业: '',
  学院: '',
  宿舍: '',
  当前时间: '',
  当前地点: '',
  外形特点: '',
  自定义开局: '',
});

const form = reactive(defaultForm());
const error = ref('');

function resetForm() {
  Object.assign(form, defaultForm());
  error.value = '';
}

function validateForm() {
  if (!form.姓名 || !form.学校名称 || !form.专业 || !form.当前时间 || !form.当前地点 || !form.外形特点) {
    return '姓名、学校名称、专业、当前时间、当前地点和外形特点是必填项。';
  }
  if (!Number.isFinite(form.年龄) || form.年龄 < 18 || form.年龄 > 30) {
    return '年龄需要在 18 到 30 岁之间。';
  }
  if (!Number.isFinite(form.身高) || form.身高 < 140 || form.身高 > 220) {
    return '身高需要在 140 到 220 厘米之间。';
  }
  if (!form.自定义开局) {
    return '请至少写一段自定义开局文本，让剧情知道你想从什么状态切入。';
  }
  return '';
}

function buildInitialData() {
  const current = Schema.parse(
    _.get(getVariables({ type: 'message', message_id: getCurrentMessageId() }), 'stat_data', {}),
  );
  current.主角.姓名 = form.姓名;
  current.主角.性别 = form.性别;
  current.主角.年龄 = form.年龄;
  current.主角.身高 = form.身高;
  current.主角.学校名称 = form.学校名称;
  current.主角.专业 = form.专业;
  current.主角.学院 = form.学院 || '待设定';
  current.主角.宿舍 = form.宿舍 || '待分配';
  current.主角.外形特点 = form.外形特点;
  current.主角.当前目标 = '先在不暴露异常的前提下完成一次真正有效的关键词微调。';
  current.世界.当前阶段 = '能力觉醒';
  current.世界.当前时间 = form.当前时间;
  current.世界.当前地点 = form.当前地点;
  return Schema.parse(current);
}

function composePrompt() {
  return dedent`
  【角色建档已完成，请立即进入沉浸式剧情并沿用角色卡既有世界观与变量】
  【主角档案】
  姓名：${form.姓名}
  性别：${form.性别}
  年龄：${form.年龄}
  身高：${form.身高}cm
  学校名称：${form.学校名称}
  专业：${form.专业}
  学院：${form.学院 || '待定'}
  宿舍：${form.宿舍 || '待分配'}
  当前时间：${form.当前时间}
  当前地点：${form.当前地点}
  外形特点：${form.外形特点}

  【开局补充】
  ${form.自定义开局}

  【写作要求】
  直接从当前学校与当前时间对应的校园场景切入，立即让主角观察到人物词条与能力限制，并自然生成首批可持续观察的 NPC。
  若首轮出现异类，其等级标签必须被主角直接看见。
  `;
}

function escapeSend(str: string) {
  return str.replace(/\|/g, '\\|').replace(/\n/g, '\\n').replace(/"/g, '\\"');
}

async function submitEntry() {
  error.value = validateForm();
  if (error.value) {
    return;
  }

  try {
    const nextData = buildInitialData();
    updateVariablesWith(variables => _.set(variables, 'stat_data', nextData), {
      type: 'message',
      message_id: getCurrentMessageId(),
    });

    const command = `/echo severity=success 建档完成，正在进入当前校园剧情…… | /send ${escapeSend(composePrompt())} | /trigger`;
    triggerSlash(command);
  } catch (err) {
    error.value = err instanceof Error ? err.message : '建档失败，请检查输入后重试。';
  }
}
</script>

<style scoped lang="scss">
.entry-shell {
  min-height: 100vh;
  padding: 18px;
  background:
    linear-gradient(180deg, rgba(7, 13, 22, 0.9), rgba(15, 25, 44, 0.95)),
    radial-gradient(circle at top, rgba(124, 199, 255, 0.18), transparent 32%);
  color: #edf6ff;
  font-family: 'LXGW WenKai', 'Microsoft YaHei', sans-serif;
}

.entry-card {
  width: min(940px, 100%);
  margin: 0 auto;
  border-radius: 30px;
  border: 1px solid rgba(124, 199, 255, 0.25);
  background:
    linear-gradient(180deg, rgba(20, 31, 51, 0.94), rgba(14, 22, 36, 0.96)),
    radial-gradient(circle at top right, rgba(136, 255, 214, 0.15), transparent 28%);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
  padding: 24px;
}

.hero h1 {
  margin: 8px 0 12px;
  font-size: clamp(28px, 4vw, 44px);
}

.hero p {
  max-width: 720px;
  margin: 0;
  line-height: 1.8;
  color: rgba(237, 246, 255, 0.82);
}

.eyebrow {
  color: #88ffd6;
  letter-spacing: 0.22em;
  font-size: 12px;
}

.panel-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 22px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field span {
  color: #a9c5e4;
  font-size: 13px;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  border-radius: 18px;
  border: 1px solid rgba(124, 199, 255, 0.2);
  background: rgba(8, 14, 23, 0.68);
  color: #edf6ff;
  padding: 14px 16px;
  outline: none;
}

.wide {
  margin-top: 14px;
}

.tips {
  margin-top: 18px;
  display: grid;
  gap: 8px;
  color: #b8cadf;
  font-size: 13px;
}

.error-box {
  margin-top: 16px;
  border-radius: 16px;
  border: 1px solid rgba(255, 143, 143, 0.3);
  background: rgba(255, 143, 143, 0.08);
  color: #ffd5d5;
  padding: 12px 14px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.actions button {
  border-radius: 999px;
  padding: 12px 20px;
  cursor: pointer;
}

.ghost {
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.04);
  color: #edf6ff;
}

.primary {
  border: 1px solid rgba(136, 255, 214, 0.4);
  background: linear-gradient(90deg, rgba(124, 199, 255, 0.28), rgba(136, 255, 214, 0.26));
  color: #edf6ff;
}

@media (max-width: 720px) {
  .entry-shell {
    padding: 10px;
  }

  .entry-card {
    padding: 18px;
    border-radius: 22px;
  }

  .panel-grid {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }
}
</style>

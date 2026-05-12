<template>
  <div class="char-library">
    <!-- 已有角色列表 -->
    <div v-if="charNames.length > 0" class="char-list-section">
      <div class="section-title">📚 已有角色 ({{ charNames.length }})</div>
      <div class="char-list">
        <div
          v-for="name in charNames"
          :key="name"
          class="char-card"
          :class="{ active: store.data.当前NPC.姓名 === name }"
          @click="selectChar(name)"
        >
          <div class="char-info">
            <span class="char-name">{{ name }}</span>
            <span class="char-tags">
              {{ store.data.角色库[name]?.性别 }} · {{ store.data.角色库[name]?.种族 }} ·
              {{ store.data.角色库[name]?.表面身份 }}
            </span>
          </div>
          <div class="char-score">
            <span class="score-label">颜值</span>
            <span class="score-val">{{ store.data.角色库[name]?.颜值 }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="empty-hint">📭 角色库为空，使用下方表单创建第一个角色</div>

    <!-- 创建新角色 -->
    <div class="section-title create-title">🎨 创建新角色</div>
    <div class="form-hint">填写你想要的设定，留空字段由 AI 随机生成</div>

    <!-- 基础信息 -->
    <div class="form-section">
      <div class="form-label">📋 基础</div>
      <div class="form-grid">
        <div class="ff"><label>姓名</label><input v-model="form.姓名" placeholder="AI随机" /></div>
        <div class="ff">
          <label>性别</label>
          <select v-model="form.性别">
            <option value="">随机</option>
            <option>女</option>
            <option>男</option>
            <option>扶她</option>
          </select>
        </div>
        <div class="ff"><label>年龄</label><input v-model="form.年龄" placeholder="如22岁" /></div>
        <div class="ff"><label>种族</label><input v-model="form.种族" placeholder="人类/精灵..." /></div>
        <div class="ff"><label>表面身份</label><input v-model="form.表面身份" placeholder="冒险者..." /></div>
        <div class="ff"><label>隐藏身份</label><input v-model="form.隐藏身份" placeholder="间谍/暗杀者..." /></div>
        <div class="ff"><label>身高</label><input v-model="form.身高" placeholder="165cm" /></div>
      </div>
    </div>

    <!-- 外貌 -->
    <div class="form-section">
      <div class="form-label">✨ 外貌</div>
      <div class="form-grid">
        <div class="ff">
          <label>颜值</label>
          <select v-model="form.颜值范围">
            <option value="">随机</option>
            <option value="50-70">50-70</option>
            <option value="70-80">70-80</option>
            <option value="80-90">80-90</option>
            <option value="90-100">90-100</option>
          </select>
        </div>
        <div class="ff"><label>发色</label><input v-model="form.发色" placeholder="银白..." /></div>
        <div class="ff"><label>瞳色</label><input v-model="form.瞳色" placeholder="翠绿..." /></div>
        <div class="ff"><label>肤色</label><input v-model="form.肤色" placeholder="白皙..." /></div>
        <div class="ff">
          <label>脸型</label>
          <select v-model="form.脸型">
            <option value="">随机</option>
            <option>鹅蛋脸</option>
            <option>圆脸</option>
            <option>瓜子脸</option>
            <option>菱形脸</option>
            <option>方脸</option>
            <option>长方脸</option>
          </select>
        </div>
        <div class="ff">
          <label>眼型</label>
          <select v-model="form.眼型">
            <option value="">随机</option>
            <option>丹凤眼</option>
            <option>杏仁眼</option>
            <option>桃花眼</option>
            <option>圆眼</option>
            <option>狭长眼</option>
            <option>柳叶眼</option>
            <option>下垂眼</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 身材 -->
    <div class="form-section">
      <div class="form-label">📐 身材</div>
      <div class="form-grid">
        <div class="ff">
          <label>身材</label>
          <select v-model="form.身材类型">
            <option value="">随机</option>
            <option value="A型(梨型)">A梨型</option>
            <option value="V型(草莓型)">V草莓</option>
            <option value="O型(苹果型)">O苹果</option>
            <option value="H型(矩形)">H矩形</option>
            <option value="X型(沙漏型)">X沙漏</option>
          </select>
        </div>
        <div class="ff">
          <label>罩杯</label>
          <select v-model="form.罩杯">
            <option value="">随机</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
            <option>D</option>
            <option>E</option>
            <option>F</option>
            <option value="G+">G+</option>
          </select>
        </div>
        <div class="ff">
          <label>臀型</label>
          <select v-model="form.臀型">
            <option value="">随机</option>
            <option>蜜桃臀</option>
            <option>苹果臀</option>
            <option>方块臀</option>
            <option>倒三角臀</option>
            <option>梨形臀</option>
          </select>
        </div>
        <div class="ff">
          <label>胖瘦</label>
          <select v-model="form.胖瘦">
            <option value="">随机</option>
            <option>纤瘦</option>
            <option>苗条</option>
            <option>匀称</option>
            <option>丰满</option>
            <option>肥腴</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 性格 -->
    <div class="form-section">
      <div class="form-label">🎭 性格</div>
      <div class="form-grid">
        <div class="ff wide"><label>伪装性格</label><input v-model="form.伪装性格" placeholder="温柔+善良+大方" /></div>
        <div class="ff wide"><label>真实性格</label><input v-model="form.真实性格" placeholder="阴险+冷酷+贪婪" /></div>
        <div class="ff wide"><label>性癖</label><input v-model="form.性癖" placeholder="变态猎奇癖好..." /></div>
      </div>
    </div>

    <!-- 其他 -->
    <div class="form-section">
      <div class="form-label">📝 其他</div>
      <div class="form-grid">
        <div class="ff">
          <label>处女</label>
          <select v-model="form.处女">
            <option value="">随机</option>
            <option>是</option>
            <option>否</option>
          </select>
        </div>
        <div class="ff"><label>纹身</label><input v-model="form.纹身" placeholder="无/部位+图案" /></div>
        <div class="ff wide">
          <label>特殊要求</label><textarea v-model="form.备注" rows="2" placeholder="额外设定..."></textarea>
        </div>
      </div>
    </div>

    <!-- 按钮 -->
    <button class="gen-btn" :disabled="busy" @click="generateCustom">
      <template v-if="!busy">🎲 生成角色</template>
      <template v-else><span class="dot"></span> 生成中...</template>
    </button>
    <button class="rand-btn" :disabled="busy" @click="generateRandom">🎰 完全随机</button>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
const busy = ref(false);

// 角色列表（从角色库读取）
const charNames = computed(() => Object.keys(store.data.角色库));

// 切换当前NPC：从角色库复制完整数据到当前NPC
function selectChar(name: string) {
  const charData = store.data.角色库[name];
  if (charData) {
    Object.assign(store.data.当前NPC, charData);
  }
}

// 表单
const form = reactive({
  姓名: '',
  性别: '',
  年龄: '',
  种族: '',
  表面身份: '',
  隐藏身份: '',
  身高: '',
  颜值范围: '',
  发色: '',
  瞳色: '',
  肤色: '',
  脸型: '',
  眼型: '',
  身材类型: '',
  罩杯: '',
  臀型: '',
  胖瘦: '',
  伪装性格: '',
  真实性格: '',
  性癖: '',
  处女: '',
  纹身: '',
  备注: '',
});

function buildPrompt(): string {
  const parts: string[] = ['【生成新的角色】'];
  const specs: string[] = [];
  if (form.姓名) specs.push(`姓名：${form.姓名}`);
  if (form.性别) specs.push(`性别：${form.性别}`);
  if (form.年龄) specs.push(`年龄：${form.年龄}`);
  if (form.种族) specs.push(`种族：${form.种族}`);
  if (form.表面身份) specs.push(`表面身份：${form.表面身份}`);
  if (form.隐藏身份) specs.push(`隐藏身份：${form.隐藏身份}`);
  if (form.身高) specs.push(`身高：${form.身高}`);
  if (form.颜值范围) specs.push(`颜值范围：${form.颜值范围}分`);
  if (form.发色) specs.push(`发色：${form.发色}`);
  if (form.瞳色) specs.push(`瞳色：${form.瞳色}`);
  if (form.肤色) specs.push(`肤色：${form.肤色}`);
  if (form.脸型) specs.push(`脸型：${form.脸型}`);
  if (form.眼型) specs.push(`眼型：${form.眼型}`);
  if (form.身材类型) specs.push(`身材类型：${form.身材类型}`);
  if (form.罩杯) specs.push(`罩杯：${form.罩杯}`);
  if (form.臀型) specs.push(`臀型：${form.臀型}`);
  if (form.胖瘦) specs.push(`胖瘦：${form.胖瘦}`);
  if (form.伪装性格) specs.push(`伪装性格：${form.伪装性格}`);
  if (form.真实性格) specs.push(`真实性格：${form.真实性格}`);
  if (form.性癖) specs.push(`性癖：${form.性癖}`);
  if (form.处女) specs.push(`处女：${form.处女}`);
  if (form.纹身) specs.push(`纹身：${form.纹身}`);
  if (form.备注) specs.push(`特殊要求：${form.备注}`);
  if (specs.length > 0) {
    parts.push('角色设定要求：');
    parts.push(specs.join('；'));
    parts.push('其余未指定属性随机生成。生成后必须将角色完整数据写入「当前NPC」变量的各个字段。');
    parts.push('在正文中自然地让该角色出现在当前场景中，描写角色登场的情景。');
  } else {
    parts.push('随机生成一个完整角色。生成后必须将角色完整数据写入「当前NPC」变量的各个字段。');
    parts.push('在正文中自然地让该角色出现在当前场景中，描写角色登场的情景。');
  }
  return parts.join('\n');
}

// 将角色生成指令作为用户消息发送，触发 AI 正常回复
// AI 回复时会同时生成角色介绍正文 + UpdateVariable 写入当前NPC
// 已有的 VARIABLE_UPDATE_ENDED 监听器会自动同步到角色库
async function sendAsChat(prompt: string) {
  await createChatMessages([{ role: 'user', message: prompt }]);
  await triggerSlash('/trigger');
}

async function generateCustom() {
  busy.value = true;
  try {
    await sendAsChat(buildPrompt());
  } finally {
    busy.value = false;
  }
}

async function generateRandom() {
  busy.value = true;
  try {
    await sendAsChat(
      '【生成新的角色】\n随机生成一个完整角色。生成后必须将角色完整数据写入「当前NPC」变量的各个字段。\n在正文中自然地让该角色出现在当前场景中，描写角色登场的情景。',
    );
  } finally {
    busy.value = false;
  }
}
</script>

<style lang="scss" scoped>
.char-library {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--accent-purple);
  border-bottom: 1px solid var(--border-main);
  padding-bottom: 3px;
}

.create-title {
  margin-top: 6px;
}

/* 角色列表 */
.char-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.char-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-section);
  border: 1px solid var(--border-main);
  padding: 8px 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.char-card:hover {
  border-color: var(--accent-purple);
  transform: translateX(3px);
}

.char-card.active {
  border-color: var(--accent-gold);
  background: rgba(212, 160, 23, 0.1);
}

.char-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.char-name {
  font-weight: 700;
  font-size: 0.85rem;
}
.char-tags {
  font-size: 0.68rem;
  color: var(--text-dim);
}

.char-score {
  text-align: right;
}
.score-label {
  display: block;
  font-size: 0.6rem;
  color: var(--text-dim);
}
.score-val {
  font-weight: 700;
  font-size: 0.8rem;
  color: var(--accent-gold);
}

.empty-hint {
  text-align: center;
  padding: 12px;
  font-size: 0.78rem;
  color: var(--text-dim);
}

/* 创建表单 */
.form-hint {
  font-size: 0.68rem;
  color: var(--text-dim);
  text-align: center;
  padding: 3px;
  border: 1px dashed var(--border-main);
  background: rgba(155, 89, 182, 0.05);
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.form-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--accent-purple);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3px;
}

.ff {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.ff.wide {
  grid-column: 1 / -1;
}

.ff label {
  font-size: 0.6rem;
  color: var(--text-dim);
  font-weight: 600;
}

.ff input,
.ff select,
.ff textarea {
  background: var(--bg-section);
  border: 1px solid var(--border-main);
  padding: 4px 6px;
  color: var(--text-primary);
  font-family: var(--font-main);
  font-size: 0.72rem;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
}

.ff input:focus,
.ff select:focus,
.ff textarea:focus {
  border-color: var(--accent-purple);
}
.ff input::placeholder,
.ff textarea::placeholder {
  color: var(--text-dim);
  opacity: 0.6;
}
.ff textarea {
  resize: vertical;
  min-height: 32px;
}

.gen-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  background: linear-gradient(135deg, rgba(155, 89, 182, 0.3), rgba(107, 63, 160, 0.4));
  border: 1px solid var(--accent-purple);
  color: var(--text-primary);
  font-family: var(--font-main);
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.gen-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(155, 89, 182, 0.5), rgba(107, 63, 160, 0.55));
  transform: translateY(-1px);
}

.gen-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.rand-btn {
  padding: 7px;
  background: var(--bg-section);
  border: 1px dashed var(--border-main);
  color: var(--text-secondary);
  font-family: var(--font-main);
  font-size: 0.72rem;
  cursor: pointer;
  transition: all 0.2s;
}

.rand-btn:hover:not(:disabled) {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}
.rand-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: var(--accent-purple);
  border-radius: 50%;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(0.7);
  }
}

@media (max-width: 360px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .ff.wide {
    grid-column: 1;
  }
}
</style>

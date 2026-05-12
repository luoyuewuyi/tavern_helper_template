import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

type FormData = {
  name: string;
  gender: string;
  age: string;
  realm: string;
  era: string;
  customEra: string;
  background: string;
  start: string;
};

const ERAS = [
  '鸿蒙',
  '混沌',
  '洪荒初开',
  '龙汉大劫',
  '巫妖纪元',
  '封神纪元',
  '西游纪元',
  '历朝历代',
  '末法近世',
  '现代',
  '灵气复苏',
];
const GENDERS = ['男', '女', '无性', '先天神灵', '自定'];
const STAGES = ['凡境', '仙境', '道境'];
const REALMS = [
  { name: '凡人', stage: '凡境', subRealm: '初入' },
  { name: '炼体', stage: '凡境', subRealm: '皮肉' },
  { name: '练气', stage: '凡境', subRealm: '一层' },
  { name: '筑基', stage: '凡境', subRealm: '初期' },
  { name: '金丹', stage: '凡境', subRealm: '初期' },
  { name: '元婴', stage: '凡境', subRealm: '初期' },
  { name: '化神', stage: '凡境', subRealm: '初期' },
  { name: '炼虚', stage: '凡境', subRealm: '初期' },
  { name: '合体', stage: '凡境', subRealm: '初期' },
  { name: '大乘', stage: '凡境', subRealm: '初期' },
  { name: '渡劫', stage: '凡境', subRealm: '一劫' },
  { name: '人仙', stage: '仙境', subRealm: '初入' },
  { name: '地仙', stage: '仙境', subRealm: '初入' },
  { name: '天仙', stage: '仙境', subRealm: '初入' },
  { name: '真仙', stage: '仙境', subRealm: '初入' },
  { name: '玄仙', stage: '仙境', subRealm: '初入' },
  { name: '金仙', stage: '仙境', subRealm: '初入' },
  { name: '太乙金仙', stage: '仙境', subRealm: '初入' },
  { name: '大罗金仙', stage: '仙境', subRealm: '初入' },
  { name: '准圣', stage: '道境', subRealm: '初期' },
  { name: '混元金仙', stage: '道境', subRealm: '初入' },
  { name: '混元大罗金仙', stage: '道境', subRealm: '初入' },
  { name: '天道圣人', stage: '道境', subRealm: '初入' },
  { name: '混元无极', stage: '道境', subRealm: '初入' },
  { name: '鸿蒙道主', stage: '道境', subRealm: '初入' },
];

const INITIAL_FORM: FormData = {
  name: '',
  gender: '男',
  age: '',
  realm: '凡人',
  era: '',
  customEra: '',
  background: '',
  start: '',
};

function getHostWindow() {
  const current = globalThis as any;
  try {
    const parentWindow = current.parent;
    if (parentWindow && parentWindow !== current) return parentWindow as any;
  } catch {
    // Cross-frame access can be blocked; fall back to the local window.
  }
  return current;
}

function normalize(value: string, fallback: string) {
  return value.trim() || fallback;
}

function classifyEra(era: string) {
  if (ERAS.includes(era)) return era;
  if (/鸿蒙/.test(era)) return '鸿蒙';
  if (/混沌/.test(era)) return '混沌';
  if (/龙汉|龙凤|麒麟/.test(era)) return '龙汉大劫';
  if (/巫妖/.test(era)) return '巫妖纪元';
  if (/封神|殷商|西周/.test(era)) return '封神纪元';
  if (/西游|唐/.test(era)) return '西游纪元';
  if (/现代|都市/.test(era)) return '现代';
  if (/复苏/.test(era)) return '灵气复苏';
  if (/末法|近世|民国/.test(era)) return '末法近世';
  if (/秦|汉|魏|晋|隋|宋|元|明|清|王朝|历朝/.test(era)) return '历朝历代';
  return '洪荒初开';
}

function App() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const finalEra = normalize(formData.customEra, formData.era || '洪荒初开');
  const selectedRealm = REALMS.find(realm => realm.name === formData.realm) ?? REALMS[0];
  const finalData = useMemo(
    () => ({
      姓名: normalize(formData.name, '待定'),
      性别: formData.gender,
      年龄: normalize(formData.age, '待定'),
      起始境界: selectedRealm.name,
      岁月年代: finalEra,
      自定义背景: normalize(formData.background, '待定'),
      自定义开局: normalize(formData.start, '待定'),
      变量映射: {
        '主角.姓名': normalize(formData.name, '待定'),
        '主角.性别': formData.gender,
        '主角.年龄': normalize(formData.age, '待定'),
        '主角.自定义背景': normalize(formData.background, '待定'),
        '主角.自定义开局': normalize(formData.start, '待定'),
        '世界.当前纪元': classifyEra(finalEra),
        '世界.当前年代': finalEra,
        '修炼.大阶段': selectedRealm.stage,
        '修炼.境界': selectedRealm.name,
        '修炼.小境': selectedRealm.subRealm,
      },
    }),
    [finalEra, formData, selectedRealm],
  );

  const payload = `【开局界面提交】
\`\`\`json
${JSON.stringify(finalData, null, 2)}
\`\`\`
请根据以上开局数据正式开始《洪荒世界》。`;

  function buildInitialStatData() {
    return {
      世界: {
        当前纪元: finalData.变量映射['世界.当前纪元'],
        当前年代: finalData.变量映射['世界.当前年代'],
        当前时间: '开局',
        当前地点: '随开局生成',
        历史节点: '开局起航',
        节点进度: 0,
        天道强度: 30,
        灵气浓度:
          finalData.变量映射['世界.当前纪元'] === '现代' || finalData.变量映射['世界.当前纪元'] === '末法近世'
            ? 15
            : 80,
        劫气: 10,
        人道秩序:
          finalData.变量映射['世界.当前纪元'] === '现代' || finalData.变量映射['世界.当前纪元'] === '历朝历代' ? 60 : 0,
        科技秩序:
          finalData.变量映射['世界.当前纪元'] === '现代' || finalData.变量映射['世界.当前纪元'] === '灵气复苏' ? 80 : 0,
        大势偏移: 0,
        近期征兆: {},
        活跃事件: {
          开局起航: `依据开局界面进入${finalData.岁月年代}`,
        },
      },
      主角: {
        姓名: finalData.姓名,
        性别: finalData.性别,
        年龄: finalData.年龄,
        自定义背景: finalData.自定义背景,
        自定义开局: finalData.自定义开局,
        当前位置: '随开局生成',
        身份: '待开局确认',
        阵营: '未定',
        状态: {},
        关系: {},
      },
      修炼: {
        大阶段: finalData.变量映射['修炼.大阶段'],
        境界: finalData.变量映射['修炼.境界'],
        小境: finalData.变量映射['修炼.小境'],
        修为: 0,
        境界进度: 0,
        根基: 50,
        悟性: 50,
        肉身: 10,
        神魂: 10,
        灵力: finalData.变量映射['修炼.大阶段'] === '凡境' ? 0 : 100,
        功德: 0,
        业力: 0,
        气运: 0,
        心魔: 0,
        突破条件: {
          修为达标: false,
          根基达标: false,
          悟道契机: false,
          资源齐备: false,
          劫数已过: false,
        },
        瓶颈: '无',
      },
      功法: {
        主修: '无',
        运转状态: '未运转',
        功法库: {},
      },
      装备: {
        兵器: { 名称: '无', 品阶: '无', 状态: '未装备', 效果: '无' },
        防具: { 名称: '无', 品阶: '无', 状态: '未装备', 效果: '无' },
        法宝: { 名称: '无', 品阶: '无', 状态: '未装备', 效果: '无' },
        坐骑: { 名称: '无', 品阶: '无', 状态: '未装备', 效果: '无' },
        洞府: { 名称: '无', 品阶: '无', 状态: '未装备', 效果: '无' },
        随身世界: { 名称: '无', 品阶: '无', 状态: '未装备', 效果: '无' },
      },
      资源: {
        灵石: 0,
        功德点: 0,
        气运碎片: 0,
        丹药: {},
        材料: {},
        背包: {},
      },
    };
  }

  function validateInitialStatData(statData: any) {
    const issues: string[] = [];
    if (!ERAS.includes(statData.世界.当前纪元)) issues.push('年代不在允许纪元内');
    if (!GENDERS.includes(statData.主角.性别)) issues.push('性别不在预设内');
    if (!STAGES.includes(statData.修炼.大阶段)) issues.push('大阶段不合法');
    if (!REALMS.some(realm => realm.name === statData.修炼.境界 && realm.stage === statData.修炼.大阶段))
      issues.push('境界与大阶段不匹配');
    ['节点进度', '天道强度', '灵气浓度', '劫气', '人道秩序', '科技秩序'].forEach(key => {
      const value = statData.世界[key];
      if (typeof value !== 'number' || value < 0 || value > 100) issues.push(`${key}超出0~100`);
    });
    ['境界进度', '根基', '悟性', '心魔'].forEach(key => {
      const value = statData.修炼[key];
      if (typeof value !== 'number' || value < 0 || value > 100) issues.push(`${key}超出0~100`);
    });
    return issues;
  }

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setFormData(previous => ({ ...previous, [name]: value }));
  }

  function handleEraClick(era: string) {
    setFormData(previous => ({
      ...previous,
      era: previous.era === era ? '' : era,
      customEra: '',
    }));
  }

  function handleCustomEraChange(event: ChangeEvent<HTMLInputElement>) {
    setFormData(previous => ({
      ...previous,
      customEra: event.target.value,
      era: '',
    }));
  }

  async function startStory(event: FormEvent) {
    event.preventDefault();
    setError('');
    const statData = buildInitialStatData();
    const issues = validateInitialStatData(statData);
    if (issues.length > 0) {
      setError(issues.join('；'));
      return;
    }
    setSending(true);
    try {
      const host = getHostWindow();
      await host.createChatMessages([{ role: 'user', message: payload, data: { stat_data: statData } }]);
      await host.triggerSlash('/trigger');
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : '开局提交失败');
      setSending(false);
    }
  }

  return (
    <main className="hh-opening">
      <div className="hh-orbit hh-orbit-a" />
      <div className="hh-orbit hh-orbit-b" />
      <header className="hh-header">
        <h1>洪荒世界</h1>
        <p>Creation / Cultivation / Reincarnation</p>
      </header>

      <form className="hh-form" onSubmit={startStory}>
        <section className="hh-fields">
          <label>
            <span>姓名</span>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="留空由天定" />
          </label>
          <label>
            <span>年龄</span>
            <input name="age" value={formData.age} onChange={handleChange} placeholder="自定" />
          </label>
          <section className="hh-choice">
            <span>性别</span>
            <div className="hh-choice-grid">
              {GENDERS.map(gender => (
                <button
                  className={formData.gender === gender ? 'is-active' : ''}
                  key={gender}
                  onClick={() => setFormData(previous => ({ ...previous, gender }))}
                  type="button"
                >
                  {gender}
                </button>
              ))}
            </div>
          </section>
        </section>

        <section className="hh-era">
          <span className="hh-section-title">岁月年代</span>
          <div className="hh-era-grid">
            {ERAS.map(era => (
              <button
                className={formData.era === era ? 'is-active' : ''}
                key={era}
                onClick={() => handleEraClick(era)}
                type="button"
              >
                {era}
              </button>
            ))}
          </div>
          <input
            name="customEra"
            value={formData.customEra}
            onChange={handleCustomEraChange}
            placeholder="自定义年代"
          />
        </section>

        <section className="hh-textareas">
          <section className="hh-choice hh-realm">
            <span>起始境界</span>
            <div className="hh-choice-grid">
              {REALMS.map(realm => (
                <button
                  className={formData.realm === realm.name ? 'is-active' : ''}
                  key={realm.name}
                  onClick={() => setFormData(previous => ({ ...previous, realm: realm.name }))}
                  type="button"
                >
                  {realm.name}
                </button>
              ))}
            </div>
          </section>
          <label>
            <span>自定义背景</span>
            <textarea name="background" value={formData.background} onChange={handleChange} />
          </label>
          <label>
            <span>自定义开局</span>
            <textarea name="start" value={formData.start} onChange={handleChange} />
          </label>
        </section>

        {error && <div className="hh-error">{error}</div>}

        <button className="hh-primary" type="submit" disabled={sending}>
          {sending ? '起航中' : '踏入轮回'}
        </button>
      </form>
    </main>
  );
}

function mount() {
  const roots = document.querySelectorAll<HTMLElement>('[data-hh-opening-root]:not([data-hh-mounted])');
  if (roots.length === 0) return;

  roots.forEach(root => {
    root.dataset.hhMounted = 'true';
    createRoot(root).render(<App />);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount, { once: true });
} else {
  mount();
}

const observer = new MutationObserver(() => mount());
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

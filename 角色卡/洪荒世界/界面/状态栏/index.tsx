import './style.css';

type PlainRecord = Record<string, any>;

const EMPTY_VALUES = new Set(['', '无', '暂无', '待定', '未定', '开局未定', '随开局生成']);

function hostWindow(): any {
  try {
    if (globalThis.parent && globalThis.parent !== globalThis) {
      return globalThis.parent;
    }
  } catch {}
  return globalThis;
}

function hostWindows(): any[] {
  const windows: any[] = [];
  const add = (value: any) => {
    if (value && !windows.includes(value)) windows.push(value);
  };
  add(globalThis);
  try {
    add(globalThis.parent);
  } catch {}
  try {
    add(globalThis.top);
  } catch {}
  try {
    add(globalThis.parent?.parent);
  } catch {}
  return windows;
}

function mojibake(value: string) {
  try {
    const Decoder = globalThis.TextDecoder;
    const Encoder = globalThis.TextEncoder;
    if (!Decoder || !Encoder) return value;
    return new Decoder('gbk').decode(new Encoder().encode(value));
  } catch {
    return value;
  }
}

function segmentKeys(segment: string) {
  const garbled = mojibake(segment);
  return garbled === segment ? [segment] : [segment, garbled];
}

function byPath(source: any, path: string, fallback?: any) {
  let values = [source];
  for (const segment of path.split('.')) {
    const next: any[] = [];
    for (const value of values) {
      if (!value || typeof value !== 'object') continue;
      for (const key of segmentKeys(segment)) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          next.push(value[key]);
        }
      }
    }
    values = next;
    if (!values.length) return fallback;
  }
  return values.find(value => value !== undefined && value !== null) ?? fallback;
}

function isEmpty(value: any): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return EMPTY_VALUES.has(value.trim());
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

function text(value: any, fallback = '无') {
  if (value == null || value === '') return fallback;
  if (typeof value === 'boolean') return value ? '是' : '否';
  return String(value);
}

function entries(value: any): [string, any][] {
  if (!value || typeof value !== 'object') return [];
  return Object.entries(value).filter(([, item]) => !isEmpty(item));
}

function objectByPath(source: any, path: string) {
  const value = byPath(source, path, {});
  return value && typeof value === 'object' ? value : {};
}

function amount(value: any) {
  if (typeof value === 'number') return value;
  if (value && typeof value === 'object' && typeof value.数量 === 'number') return value.数量;
  const garbledAmount = mojibake('数量');
  if (value && typeof value === 'object' && typeof value[garbledAmount] === 'number') return value[garbledAmount];
  return undefined;
}

function prop(value: any, key: string, fallback?: any) {
  if (!value || typeof value !== 'object') return fallback;
  for (const candidate of segmentKeys(key)) {
    if (Object.prototype.hasOwnProperty.call(value, candidate)) return value[candidate];
  }
  return fallback;
}

function readStatData(): PlainRecord {
  const candidates: any[] = [];
  for (const host of hostWindows()) {
    try {
      if (typeof host.getVariables === 'function') {
        candidates.push(host.getVariables({ type: 'message' }));
        candidates.push(host.getVariables({ type: 'message', message_id: 'latest' }));
      }

      const lastId = typeof host.getLastMessageId === 'function' ? host.getLastMessageId() : undefined;
      if (typeof host.getVariables === 'function' && lastId !== undefined) {
        candidates.push(host.getVariables({ type: 'message', message_id: lastId }));
      }
      if (host.Mvu?.getMvuData && lastId !== undefined) {
        candidates.push(host.Mvu.getMvuData({ type: 'message', message_id: lastId }));
      }

      const currentId = typeof host.getCurrentMessageId === 'function' ? host.getCurrentMessageId() : undefined;
      if (typeof host.getVariables === 'function' && currentId !== undefined) {
        candidates.push(host.getVariables({ type: 'message', message_id: currentId }));
      }
      if (host.Mvu?.getMvuData && currentId !== undefined) {
        candidates.push(host.Mvu.getMvuData({ type: 'message', message_id: currentId }));
      }

      if (typeof host.getAllVariables === 'function') {
        candidates.push(host.getAllVariables());
      }
    } catch {
      // Try the next available window scope.
    }
  }
  for (const candidate of candidates) {
    const data = byPath(candidate, 'stat_data', {});
    if (!isEmpty(data)) return data;
  }
  return {};
}

function makeActionMessage(kind: string, target: string, count?: number, extra?: string) {
  const payload = {
    类型: kind,
    对象: target,
    ...(count !== undefined && count !== '' ? { 数量: count } : {}),
    ...(extra ? { 补充: extra } : {}),
  };
  return `【状态栏互动】\n\`\`\`json\n${JSON.stringify(payload, null, 2)}\n\`\`\``;
}

function create(tag: string, className?: string, content?: string) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content !== undefined) element.textContent = content;
  return element;
}

function button(label: string, onClick: () => void) {
  const element = create('button', 'hh-action', label) as HTMLButtonElement;
  element.type = 'button';
  element.addEventListener('click', onClick);
  return element;
}

function field(label: string, value: any) {
  if (isEmpty(value)) return undefined;
  const item = create('div', 'hh-item');
  item.append(create('span', 'hh-label', label), create('span', 'hh-value', text(value)));
  return item;
}

function card(title: string, child: HTMLElement) {
  const section = create('section', 'hh-card');
  section.append(create('h3', 'hh-card-title', title), child);
  return section;
}

function row(name: string, meta?: string, actions?: HTMLElement[]) {
  const item = create('div', 'hh-row');
  const main = create('div', 'hh-row-main');
  main.append(create('div', 'hh-row-name', name));
  if (meta) main.append(create('div', 'hh-row-meta', meta));
  item.append(main);
  if (actions?.length) {
    const actionBox = create('div', 'hh-actions');
    actionBox.append(...actions);
    item.append(actionBox);
  }
  return item;
}

function empty() {
  return create('div', 'hh-empty', '暂无数据');
}

async function sendAction(kind: string, target: string, count?: number, extra?: string) {
  if (!target) return;
  const host = hostWindow();
  try {
    if (typeof host.createChatMessages === 'function') {
      await host.createChatMessages([{ role: 'user', message: makeActionMessage(kind, target, count, extra) }]);
    }
    if (typeof host.triggerSlash === 'function') {
      await host.triggerSlash('/trigger');
    }
  } catch (error) {
    console.warn('[洪荒世界状态栏] action failed', error);
  }
}

const tabs = [
  ['overview', '主角'],
  ['world', '世界'],
  ['cultivation', '修炼'],
  ['techniques', '功法'],
  ['equipment', '装备'],
  ['resources', '资源'],
  ['relations', '因果'],
] as const;

function renderOverview(data: PlainRecord) {
  const panel = create('section', 'hh-panel');
  const grid = create('div', 'hh-grid');
  [
    field('姓名', byPath(data, '主角.姓名')),
    field('性别', byPath(data, '主角.性别')),
    field('年龄', byPath(data, '主角.年龄')),
    field('身份', byPath(data, '主角.身份')),
    field('阵营', byPath(data, '主角.阵营')),
    field('当前位置', byPath(data, '主角.当前位置')),
  ].filter(Boolean).forEach(item => grid.append(item!));
  panel.append(grid);

  const states = entries(objectByPath(data, '主角.状态'));
  if (states.length) {
    const list = create('div', 'hh-list');
    states.forEach(([name, value]) => list.append(row(name, text(value))));
    panel.append(card('关键状态', list));
  }
  return panel;
}

function renderWorld(data: PlainRecord) {
  const panel = create('section', 'hh-panel');
  const grid = create('div', 'hh-grid');
  [
    field('当前纪元', byPath(data, '世界.当前纪元')),
    field('当前年代', byPath(data, '世界.当前年代')),
    field('当前时间', byPath(data, '世界.当前时间')),
    field('当前地点', byPath(data, '世界.当前地点')),
    field('历史节点', byPath(data, '世界.历史节点')),
    field('节点阶段', byPath(data, '世界.$节点阶段')),
    field('世界格局', byPath(data, '世界.$世界格局')),
    field('节点进度', `${text(byPath(data, '世界.节点进度', 0))}%`),
    field('天道强度', `${text(byPath(data, '世界.天道强度', 0))}%`),
    field('灵气浓度', `${text(byPath(data, '世界.灵气浓度', 0))}%`),
    field('劫气', `${text(byPath(data, '世界.劫气', 0))}%`),
    field('人道秩序', `${text(byPath(data, '世界.人道秩序', 0))}%`),
    field('科技秩序', `${text(byPath(data, '世界.科技秩序', 0))}%`),
    field('大势偏移', byPath(data, '世界.大势偏移')),
  ].filter(Boolean).forEach(item => grid.append(item!));
  panel.append(grid);
  const omens = entries(objectByPath(data, '世界.近期征兆'));
  const events = entries(objectByPath(data, '世界.活跃事件'));
  if (omens.length) {
    const list = create('div', 'hh-list');
    omens.forEach(([name, value]) => list.append(row(name, text(value))));
    panel.append(card('近期征兆', list));
  }
  if (events.length) {
    const list = create('div', 'hh-list');
    events.forEach(([name, value]) => list.append(row(name, text(value))));
    panel.append(card('活跃事件', list));
  }
  return panel;
}

function renderCultivation(data: PlainRecord) {
  const panel = create('section', 'hh-panel');
  const realm = [byPath(data, '修炼.大阶段'), byPath(data, '修炼.境界'), byPath(data, '修炼.小境')]
    .filter(value => !isEmpty(value))
    .join(' · ');
  panel.append(
    card(
      '境界',
      row(
        realm || '未入道',
        `进度 ${text(byPath(data, '修炼.境界进度', 0))}% / 修为 ${text(byPath(data, '修炼.修为', 0))}`,
        [button('尝试突破', () => sendAction('尝试突破', byPath(data, '修炼.境界', '当前境界'), undefined, text(byPath(data, '修炼.$突破可行'))))],
      ),
    ),
  );
  const grid = create('div', 'hh-grid');
  ['根基', '悟性', '肉身', '神魂', '灵力', '心魔', '功德', '业力', '气运', '瓶颈', '$修炼阶段'].forEach(key => {
    const item = field(key, byPath(data, `修炼.${key}`));
    if (item) grid.append(item);
  });
  panel.append(grid);
  const conditions = entries(objectByPath(data, '修炼.突破条件'));
  if (conditions.length) {
    const list = create('div', 'hh-list');
    conditions.forEach(([name, value]) => list.append(row(name, text(value))));
    panel.append(card('突破条件', list));
  }
  return panel;
}

function renderTechniques(data: PlainRecord) {
  const panel = create('section', 'hh-panel');
  const current = byPath(data, '功法.主修');
  panel.append(
    card(
      '当前功法',
      row(
        text(current),
        `运转：${text(byPath(data, '功法.运转状态'))}`,
        isEmpty(current)
          ? []
          : [
              button('静修', () => sendAction('运转功法', current, undefined, '静修')),
              button('战斗运转', () => sendAction('运转功法', current, undefined, '战斗运转')),
              button('停转', () => sendAction('运转功法', current, undefined, '停止运转')),
            ],
      ),
    ),
  );

  const list = create('div', 'hh-list');
  const techniques = entries(objectByPath(data, '功法.功法库'));
  if (!techniques.length) list.append(empty());
  techniques.forEach(([name, value]) => {
    list.append(
      row(name, `品阶：${text(prop(value, '品阶'))} / 熟练度：${text(prop(value, '熟练度'))} / 效果：${text(prop(value, '效果'))}`, [
        button(prop(value, '当前装备') ? '设为主修' : '装备', () => sendAction('装备功法', name)),
      ]),
    );
  });
  panel.append(card('功法库', list));
  return panel;
}

function renderEquipment(data: PlainRecord) {
  const list = create('div', 'hh-list');
  const equipment = entries(objectByPath(data, '装备')).filter(([, value]) => !isEmpty(prop(value, '名称')));
  if (!equipment.length) list.append(empty());
  equipment.forEach(([slot, value]) => {
    list.append(
      row(`${slot}：${text(prop(value, '名称'))}`, `品阶：${text(prop(value, '品阶'))} / 状态：${text(prop(value, '状态'))} / 效果：${text(prop(value, '效果'))}`, [
        button('启用', () => sendAction('装备物品', prop(value, '名称'), undefined, slot)),
      ]),
    );
  });
  const panel = create('section', 'hh-panel');
  panel.append(list);
  return panel;
}

function renderResources(data: PlainRecord) {
  const panel = create('section', 'hh-panel');
  const list = create('div', 'hh-list');
  [
    ['灵石', byPath(data, '资源.灵石')],
    ['功德点', byPath(data, '资源.功德点')],
    ['气运碎片', byPath(data, '资源.气运碎片')],
  ]
    .filter(([, value]) => Number(value) > 0)
    .forEach(([name, value]) => list.append(row(String(name), `数量：${text(value)}`, [button('消耗', () => sendAction('使用资源', String(name), 1))])));

  const items = [
    ...entries(objectByPath(data, '资源.丹药')).map(([name, value]) => ({ type: '丹药', name, value })),
    ...entries(objectByPath(data, '资源.材料')).map(([name, value]) => ({ type: '材料', name, value })),
    ...entries(objectByPath(data, '资源.背包')).map(([name, value]) => ({ type: '背包', name, value })),
  ].filter(item => amount(item.value) === undefined || amount(item.value)! > 0);
  items.forEach(item => {
    const count = amount(item.value);
    list.append(
      row(`${item.type}：${item.name}`, [count !== undefined ? `数量：${count}` : '', text(prop(item.value, '描述'), '')].filter(Boolean).join(' / '), [
        button('使用', () => sendAction('使用道具', item.name, 1, item.type)),
      ]),
    );
  });
  if (!list.children.length) list.append(empty());
  panel.append(list);
  return panel;
}

function renderRelations(data: PlainRecord) {
  const list = create('div', 'hh-list');
  const relations = entries(objectByPath(data, '主角.关系'));
  if (!relations.length) list.append(empty());
  relations.forEach(([name, value]) => {
    list.append(row(name, `立场：${text(prop(value, '立场'))} / 亲近：${text(prop(value, '亲近'))} / 因果：${text(prop(value, '因果'))}`));
  });
  const panel = create('section', 'hh-panel');
  panel.append(list);
  return panel;
}

function renderBody(tab: string, data: PlainRecord) {
  switch (tab) {
    case 'world':
      return renderWorld(data);
    case 'cultivation':
      return renderCultivation(data);
    case 'techniques':
      return renderTechniques(data);
    case 'equipment':
      return renderEquipment(data);
    case 'resources':
      return renderResources(data);
    case 'relations':
      return renderRelations(data);
    default:
      return renderOverview(data);
  }
}

function mount(root: HTMLElement) {
  let activeTab = 'overview';
  let data = readStatData();
  let snapshot = JSON.stringify(data);

  const render = () => {
    root.replaceChildren();
    const app = create('main', 'hh-status');
    const name = text(byPath(data, '主角.姓名'), '无名之人');
    const realm = [byPath(data, '修炼.大阶段'), byPath(data, '修炼.境界'), byPath(data, '修炼.小境')]
      .filter(value => !isEmpty(value))
      .join(' · ');

    const head = create('header', 'hh-head');
    const title = create('div', 'hh-title');
    title.append(create('strong', '', name), create('span', '', [realm, byPath(data, '世界.当前地点')].filter(value => !isEmpty(value)).join(' / ') || '洪荒世界'));
    head.append(title, create('div', 'hh-pill', text(byPath(data, '世界.当前纪元'), '未入世')));

    const nav = create('nav', 'hh-tabs');
    tabs.forEach(([key, label]) => {
      const item = create('button', `hh-tab${activeTab === key ? ' is-active' : ''}`, label) as HTMLButtonElement;
      item.type = 'button';
      item.addEventListener('click', () => {
        activeTab = key;
        render();
      });
      nav.append(item);
    });

    app.append(head, nav, renderBody(activeTab, data));
    root.append(app);
  };

  const refresh = (force = false) => {
    const nextData = readStatData();
    const nextSnapshot = JSON.stringify(nextData);
    if (!force && nextSnapshot === snapshot) return;
    data = nextData;
    snapshot = nextSnapshot;
    render();
  };

  render();
  try {
    const waiter = hostWindow().waitGlobalInitialized;
    if (typeof waiter === 'function') waiter('Mvu').then(() => refresh(true)).catch(() => {});
  } catch {}
  for (const host of hostWindows()) {
    try {
      if (typeof host.eventOn === 'function' && host.Mvu?.events?.VARIABLE_UPDATE_ENDED) {
        host.eventOn(host.Mvu.events.VARIABLE_UPDATE_ENDED, () => refresh(true));
      }
      if (typeof host.eventOn === 'function' && host.tavern_events) {
        [
          host.tavern_events.MESSAGE_UPDATED,
          host.tavern_events.MESSAGE_EDITED,
          host.tavern_events.MESSAGE_RECEIVED,
          host.tavern_events.GENERATION_ENDED,
          host.tavern_events.CHARACTER_MESSAGE_RENDERED,
          host.tavern_events.CHAT_CHANGED,
        ]
          .filter(Boolean)
          .forEach(eventName => host.eventOn(eventName, () => refresh(true)));
      }
    } catch {
      // Event bridge is optional; polling below is the fallback.
    }
  }
  window.setInterval(() => refresh(), 800);
}

function boot() {
  const root = document.querySelector<HTMLElement>('[data-hh-status-root]');
  if (!root || root.dataset.hhMounted) return;
  root.dataset.hhMounted = 'true';
  mount(root);
}

boot();
new MutationObserver(boot).observe(document.body, { childList: true, subtree: true });

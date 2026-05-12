export const 周期状态列表 = ['经期', '经后', '排卵前', '排卵期', '黄体期'] as const;
export const 命令类型列表 = ['travel-region', 'travel-place', 'event', 'npc'] as const;
export const 成人强度列表 = ['保守', '柔和', '开放'] as const;
export const 清洁度列表 = ['严格', '正常', '宽松'] as const;
export const 法则项类型列表 = ['toggle', 'select', 'range'] as const;

type 周期状态 = (typeof 周期状态列表)[number];
type 命令类型 = (typeof 命令类型列表)[number];
type 成人强度 = (typeof 成人强度列表)[number];
type 清洁度 = (typeof 清洁度列表)[number];
type 法则项类型 = (typeof 法则项类型列表)[number];

interface 候选动作 {
  标签: string;
  描述: string;
  类型: string;
  目标: string;
  需要确认: boolean;
  命令类型: 命令类型;
}

interface 主角周期 {
  当前天数: number;
  周期长度: number;
  状态: 周期状态;
  身体感受: string;
}

interface 主角偏好 {
  外貌偏好: string;
  关系偏好: string;
  节奏偏好: string;
  禁忌摘要: string;
}

interface 地图区块 {
  名称: string;
  摘要: string;
  是否当前: boolean;
  目标: string;
}

interface 成员卡片 {
  姓名: string;
  种族: string;
  职业: string;
  外观摘要: string;
  好感: number;
  信任: number;
  吸引: number;
  边界尊重度: number;
  关系状态: string;
  当前评价: string;
  是否正式承诺: boolean;
  头像: string | null;
  目标: string;
}

interface 布尔法则项 {
  键: string;
  标签: string;
  描述: string;
  类型: 'toggle';
  值: boolean;
}

interface 选择法则项 {
  键: string;
  标签: string;
  描述: string;
  类型: 'select';
  值: string;
  选项: string[];
}

interface 滑块法则项 {
  键: string;
  标签: string;
  描述: string;
  类型: 'range';
  值: number;
  最小值: number;
  最大值: number;
  步长: number;
  单位: string;
}

type 法则项 = 布尔法则项 | 选择法则项 | 滑块法则项;

interface 法则分组 {
  名称: string;
  描述: string;
  项目: 法则项[];
}

interface 西幻状态 {
  场景: {
    标题: string;
    副标题: string;
    状态徽章: string[];
    候选动作: 候选动作[];
  };
  主角: {
    姓名: string;
    身份: string;
    头像: string | null;
    金钱: number;
    声望: number;
    体力: number;
    心情文本: string;
    欲望波动: number;
    实际接受度: number;
    周期: 主角周期;
    偏好摘要: 主角偏好;
  };
  地图: {
    当前区域: string;
    当前区域文案: string;
    已发现地区: 地图区块[];
  };
  地点: {
    名称: string;
    所属城镇: string;
    候选动作: 候选动作[];
  };
  成员: {
    列表: 成员卡片[];
  };
  法则: {
    分组: 法则分组[];
  };
}

const 默认法则设置 = {
  遭遇主动度: 30,
  成人内容强度: '保守' as 成人强度,
  允许高压追求: false,
  允许多人邀约: true,
  允许出轨题材: false,
  允许非传统地点事件: false,
  清洁度偏好: '严格' as 清洁度,
  偏好胸部互动: true,
  偏好后庭相关: true,
  偏好抹油氛围: false,
} as const;

function 归一化文本(value: unknown, fallback: string) {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return `${value}`;
  }
  return fallback;
}

function 归一化数字(value: unknown, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  if (Number.isFinite(parsed)) {
    return _.clamp(parsed, min, max);
  }
  return _.clamp(fallback, min, max);
}

function 归一化布尔(value: unknown, fallback: boolean) {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    if (['true', '1', 'yes', 'on'].includes(value.toLowerCase())) {
      return true;
    }
    if (['false', '0', 'no', 'off'].includes(value.toLowerCase())) {
      return false;
    }
  }
  return fallback;
}

function 归一化头像(value: unknown) {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }
  return null;
}

function 归一化命令类型(value: unknown, fallback: 命令类型): 命令类型 {
  const raw = `${value ?? fallback}`;
  if (命令类型列表.includes(raw as 命令类型)) {
    return raw as 命令类型;
  }
  if (raw.includes('region')) {
    return 'travel-region';
  }
  if (raw.includes('npc')) {
    return 'npc';
  }
  if (raw.includes('travel') || raw.includes('place')) {
    return 'travel-place';
  }
  return 'event';
}

function 构建法则分组(source?: Record<string, unknown>): 法则分组[] {
  const settings = source ?? {};

  return [
    {
      名称: '交互节奏',
      描述: '控制世界主动度、推进张力与场景调性。',
      项目: [
        {
          键: '遭遇主动度',
          标签: '遭遇主动度',
          描述: '值越高，世界越会主动抛出事件与人物接触机会。',
          类型: 'range',
          值: 归一化数字(settings.遭遇主动度, 默认法则设置.遭遇主动度, 0, 100),
          最小值: 0,
          最大值: 100,
          步长: 5,
          单位: '',
        },
        {
          键: '成人内容强度',
          标签: '成人内容强度',
          描述: '控制整体暧昧与成人表达的开放程度。',
          类型: 'select',
          值: 成人强度列表.includes(settings.成人内容强度 as 成人强度)
            ? (settings.成人内容强度 as string)
            : 默认法则设置.成人内容强度,
          选项: [...成人强度列表],
        },
        {
          键: '允许高压追求',
          标签: '允许高压追求',
          描述: '开启后，部分角色会更主动试探边界，但仍需遵守禁忌。',
          类型: 'toggle',
          值: 归一化布尔(settings.允许高压追求, 默认法则设置.允许高压追求),
        },
        {
          键: '允许非传统地点事件',
          标签: '允许非传统地点事件',
          描述: '允许在旅途中、公共场所或异常环境出现更强烈的互动事件。',
          类型: 'toggle',
          值: 归一化布尔(settings.允许非传统地点事件, 默认法则设置.允许非传统地点事件),
        },
      ],
    },
    {
      名称: '内容边界',
      描述: '约束高风险题材与关系边界的硬限制。',
      项目: [
        {
          键: '允许多人邀约',
          标签: '允许多人邀约',
          描述: '决定世界是否会抛出多人聚会、多人同行或多人邀约。',
          类型: 'toggle',
          值: 归一化布尔(settings.允许多人邀约, 默认法则设置.允许多人邀约),
        },
        {
          键: '允许出轨题材',
          标签: '允许出轨题材',
          描述: '关闭后，叙事不得主动构造出轨方向的推进与诱导。',
          类型: 'toggle',
          值: 归一化布尔(settings.允许出轨题材, 默认法则设置.允许出轨题材),
        },
        {
          键: '清洁度偏好',
          标签: '清洁度偏好',
          描述: '影响世界对卫生、体面与相关细节的描写倾向。',
          类型: 'select',
          值: 清洁度列表.includes(settings.清洁度偏好 as 清洁度)
            ? (settings.清洁度偏好 as string)
            : 默认法则设置.清洁度偏好,
          选项: [...清洁度列表],
        },
      ],
    },
    {
      名称: '具体偏好',
      描述: '决定细分偏好与允许出现的互动方向。',
      项目: [
        {
          键: '偏好胸部互动',
          标签: '偏好胸部互动',
          描述: '是否允许此类偏好被叙事作为正向加分项。',
          类型: 'toggle',
          值: 归一化布尔(settings.偏好胸部互动, 默认法则设置.偏好胸部互动),
        },
        {
          键: '偏好后庭相关',
          标签: '偏好后庭相关',
          描述: '关闭后，不得把相关内容作为正向推进选项。',
          类型: 'toggle',
          值: 归一化布尔(settings.偏好后庭相关, 默认法则设置.偏好后庭相关),
        },
        {
          键: '偏好抹油氛围',
          标签: '偏好抹油氛围',
          描述: '控制世界是否将这类氛围视为偏好方向之一。',
          类型: 'toggle',
          值: 归一化布尔(settings.偏好抹油氛围, 默认法则设置.偏好抹油氛围),
        },
      ],
    },
  ];
}

export const DefaultData: 西幻状态 = {
  场景: {
    标题: '初到潮汐关',
    副标题: '观察与收集线索，确认接下来要靠近的人与地点。',
    状态徽章: ['星辉历 472年 霜芽月 03日', '上午', '多云', '自由冒险者'],
    候选动作: [
      {
        标签: '调查旅店柜台',
        描述: '先接触旅店老板，摸清旧航图和本地消息来源。',
        类型: '推进事件',
        目标: '旅店柜台的旧航图',
        需要确认: false,
        命令类型: 'event',
      },
      {
        标签: '前往冒险者大厅',
        描述: '查看护送委托、临时招募和当地冒险者名录。',
        类型: '切换地点',
        目标: '冒险者大厅',
        需要确认: false,
        命令类型: 'travel-place',
      },
      {
        标签: '夜探旧码头',
        描述: '仅在开关允许后考虑接触夜班掮客与中央岛传闻。',
        类型: '高风险入口',
        目标: '潮汐关旧码头',
        需要确认: true,
        命令类型: 'travel-place',
      },
    ],
  },
  主角: {
    姓名: '未定旅人',
    身份: '初到潮汐关的自由冒险者',
    头像: null,
    金钱: 120,
    声望: 0,
    体力: 78,
    心情文本: '初来乍到，保持警惕。',
    欲望波动: 38,
    实际接受度: 24,
    周期: {
      当前天数: 6,
      周期长度: 28,
      状态: '经后',
      身体感受: '身体逐步恢复，精力正常，但仍偏好先观察环境。',
    },
    偏好摘要: {
      外貌偏好: '明显偏向外形出众、气质利落、干净体面的对象；对缺乏吸引力的人物天然冷淡。',
      关系偏好: '不强制绑定对象，更愿意在探索中筛选值得靠近的人。',
      节奏偏好: '喜欢自己决定推进节奏，允许被追求但不接受无理由越界。',
      禁忌摘要: '拒绝身体伤害、血腥、失控压迫；高风险题材必须保留明确选择权。',
    },
  },
  地图: {
    当前区域: '东大陆海东岸',
    当前区域文案: '港口、商路与旅店街密集交错的开局区域。',
    已发现地区: [
      {
        名称: '东大陆海东岸',
        摘要: '港口、商路与旅店街高度密集的开局区域。',
        是否当前: true,
        目标: '东大陆海东岸',
      },
      {
        名称: '潮汐关旧码头',
        摘要: '夜晚消息灵通，但鱼龙混杂。',
        是否当前: false,
        目标: '潮汐关旧码头',
      },
    ],
  },
  地点: {
    名称: '港口外环的旅店街',
    所属城镇: '潮汐关',
    候选动作: [
      {
        标签: '调查旅店柜台',
        描述: '先接触旅店老板，摸清旧航图和本地消息来源。',
        类型: '推进事件',
        目标: '旅店柜台的旧航图',
        需要确认: false,
        命令类型: 'event',
      },
      {
        标签: '前往冒险者大厅',
        描述: '查看护送委托、临时招募和当地冒险者名录。',
        类型: '切换地点',
        目标: '冒险者大厅',
        需要确认: false,
        命令类型: 'travel-place',
      },
      {
        标签: '夜探旧码头',
        描述: '仅在开关允许后考虑接触夜班掮客与中央岛传闻。',
        类型: '高风险入口',
        目标: '潮汐关旧码头',
        需要确认: true,
        命令类型: 'travel-place',
      },
    ],
  },
  成员: {
    列表: [
      {
        姓名: '伊瑟琳',
        种族: '人类',
        职业: '旅店经理',
        外观摘要: '深栗色长发总被收束得体，肩背挺直，笑意里总藏着一点审视。',
        好感: 26,
        信任: 18,
        吸引: 42,
        边界尊重度: 84,
        关系状态: '熟识',
        当前评价: '会先观察你的底线，再决定给你多少消息，但整体礼数周到。',
        是否正式承诺: false,
        头像: null,
        目标: '伊瑟琳',
      },
      {
        姓名: '莱昂',
        种族: '人类',
        职业: '冒险者大厅接待员',
        外观摘要: '总把披风扣得一丝不苟，说话很快，但眼神里并不冷漠。',
        好感: 14,
        信任: 22,
        吸引: 12,
        边界尊重度: 76,
        关系状态: '陌生',
        当前评价: '对你保持职业礼貌，愿意提供公开情报。',
        是否正式承诺: false,
        头像: null,
        目标: '莱昂',
      },
    ],
  },
  法则: {
    分组: 构建法则分组(),
  },
};

const 候选动作Schema = z.object({
  标签: z.string(),
  描述: z.string(),
  类型: z.string(),
  目标: z.string(),
  需要确认: z.boolean(),
  命令类型: z.enum(命令类型列表),
});

const 法则项Schema = z.discriminatedUnion('类型', [
  z.object({
    键: z.string(),
    标签: z.string(),
    描述: z.string(),
    类型: z.literal('toggle'),
    值: z.boolean(),
  }),
  z.object({
    键: z.string(),
    标签: z.string(),
    描述: z.string(),
    类型: z.literal('select'),
    值: z.string(),
    选项: z.array(z.string()).min(1),
  }),
  z.object({
    键: z.string(),
    标签: z.string(),
    描述: z.string(),
    类型: z.literal('range'),
    值: z.coerce.number(),
    最小值: z.coerce.number(),
    最大值: z.coerce.number(),
    步长: z.coerce.number(),
    单位: z.string(),
  }),
]);

export const Schema = z.object({
  场景: z.object({
    标题: z.string(),
    副标题: z.string(),
    状态徽章: z.array(z.string()),
    候选动作: z.array(候选动作Schema),
  }),
  主角: z.object({
    姓名: z.string(),
    身份: z.string(),
    头像: z.string().nullable(),
    金钱: z.coerce.number().transform(value => Math.max(0, value)),
    声望: z.coerce.number().transform(value => _.clamp(value, -100, 100)),
    体力: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
    心情文本: z.string(),
    欲望波动: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
    实际接受度: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
    周期: z.object({
      当前天数: z.coerce.number().transform(value => _.clamp(value, 1, 40)),
      周期长度: z.coerce.number().transform(value => _.clamp(value, 20, 40)),
      状态: z.enum(周期状态列表),
      身体感受: z.string(),
    }),
    偏好摘要: z.object({
      外貌偏好: z.string(),
      关系偏好: z.string(),
      节奏偏好: z.string(),
      禁忌摘要: z.string(),
    }),
  }),
  地图: z.object({
    当前区域: z.string(),
    当前区域文案: z.string(),
    已发现地区: z.array(
      z.object({
        名称: z.string(),
        摘要: z.string(),
        是否当前: z.boolean(),
        目标: z.string(),
      }),
    ),
  }),
  地点: z.object({
    名称: z.string(),
    所属城镇: z.string(),
    候选动作: z.array(候选动作Schema),
  }),
  成员: z.object({
    列表: z.array(
      z.object({
        姓名: z.string(),
        种族: z.string(),
        职业: z.string(),
        外观摘要: z.string(),
        好感: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
        信任: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
        吸引: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
        边界尊重度: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
        关系状态: z.string(),
        当前评价: z.string(),
        是否正式承诺: z.boolean(),
        头像: z.string().nullable(),
        目标: z.string(),
      }),
    ),
  }),
  法则: z.object({
    分组: z.array(
      z.object({
        名称: z.string(),
        描述: z.string(),
        项目: z.array(法则项Schema),
      }),
    ),
  }),
});

function 归一化候选动作(raw: unknown, fallback: 候选动作): 候选动作 {
  const data = _.isPlainObject(raw) ? raw : {};
  const 标签 = 归一化文本(data.标签, fallback.标签);
  const 目标 = 归一化文本(data.目标, fallback.目标 || 标签);

  return {
    标签,
    描述: 归一化文本(data.描述, fallback.描述),
    类型: 归一化文本(data.类型, fallback.类型),
    目标,
    需要确认: 归一化布尔(data.需要确认, fallback.需要确认),
    命令类型: 归一化命令类型(data.命令类型, fallback.命令类型),
  };
}

function 归一化候选动作列表(raw: unknown, fallback: 候选动作[]) {
  if (Array.isArray(raw)) {
    return raw.map((item, index) =>
      归一化候选动作(item, fallback[index] ?? fallback.at(-1) ?? _.cloneDeep(DefaultData.场景.候选动作[0])),
    );
  }

  if (_.isPlainObject(raw)) {
    return Object.entries(raw).map(([key, value], index) =>
      归一化候选动作(
        value,
        fallback[index] ?? {
          标签: key,
          描述: '等待新的场景推进。',
          类型: '推进事件',
          目标: key,
          需要确认: false,
          命令类型: 'event',
        },
      ),
    );
  }

  return _.cloneDeep(fallback);
}

function 归一化徽章(raw: unknown, fallback: string[]) {
  if (!Array.isArray(raw)) {
    return [...fallback];
  }

  const badges = raw
    .map(item => 归一化文本(item, ''))
    .filter(Boolean)
    .slice(0, 6);

  return badges.length > 0 ? badges : [...fallback];
}

function 归一化周期(raw: unknown, fallback: 主角周期): 主角周期 {
  const data = _.isPlainObject(raw) ? raw : {};
  const 状态 = 周期状态列表.includes(data.状态 as 周期状态) ? (data.状态 as 周期状态) : fallback.状态;

  return {
    当前天数: 归一化数字(data.当前天数, fallback.当前天数, 1, 40),
    周期长度: 归一化数字(data.周期长度, fallback.周期长度, 20, 40),
    状态,
    身体感受: 归一化文本(data.身体感受, fallback.身体感受),
  };
}

function 归一化偏好(raw: unknown, fallback: 主角偏好): 主角偏好 {
  const data = _.isPlainObject(raw) ? raw : {};
  return {
    外貌偏好: 归一化文本(data.外貌偏好, fallback.外貌偏好),
    关系偏好: 归一化文本(data.关系偏好, fallback.关系偏好),
    节奏偏好: 归一化文本(data.节奏偏好, fallback.节奏偏好),
    禁忌摘要: 归一化文本(data.禁忌摘要, fallback.禁忌摘要),
  };
}

function 归一化地区(raw: unknown, fallback: 地图区块): 地图区块 {
  const data = _.isPlainObject(raw) ? raw : {};
  return {
    名称: 归一化文本(data.名称, fallback.名称),
    摘要: 归一化文本(data.摘要, fallback.摘要),
    是否当前: 归一化布尔(data.是否当前, fallback.是否当前),
    目标: 归一化文本(data.目标, fallback.目标 || fallback.名称),
  };
}

function 归一化地区列表(raw: unknown, legacyRaw: unknown, 当前区域: string) {
  let regions: 地图区块[] = [];

  if (Array.isArray(raw)) {
    regions = raw.map((item, index) =>
      归一化地区(item, DefaultData.地图.已发现地区[index] ?? DefaultData.地图.已发现地区[0]),
    );
  } else if (_.isPlainObject(legacyRaw)) {
    regions = Object.entries(legacyRaw).map(([name, summary]) => ({
      名称: name,
      摘要: 归一化文本(summary, '新抵达的地区。'),
      是否当前: name === 当前区域,
      目标: name,
    }));
  } else if (_.isPlainObject(raw)) {
    regions = Object.entries(raw).map(([name, summary]) => ({
      名称: name,
      摘要: 归一化文本(summary, '新抵达的地区。'),
      是否当前: name === 当前区域,
      目标: name,
    }));
  }

  if (regions.length === 0) {
    regions = _.cloneDeep(DefaultData.地图.已发现地区);
  }

  if (!regions.some(region => region.是否当前)) {
    regions = regions.map(region => ({
      ...region,
      是否当前: region.名称 === 当前区域,
    }));
  }

  return regions;
}

function 归一化成员(raw: unknown, fallback: 成员卡片): 成员卡片 {
  const data = _.isPlainObject(raw) ? raw : {};
  const 姓名 = 归一化文本(data.姓名, fallback.姓名);

  return {
    姓名,
    种族: 归一化文本(data.种族, fallback.种族),
    职业: 归一化文本(data.职业, fallback.职业),
    外观摘要: 归一化文本(data.外观摘要, fallback.外观摘要),
    好感: 归一化数字(data.好感, fallback.好感, 0, 100),
    信任: 归一化数字(data.信任, fallback.信任, 0, 100),
    吸引: 归一化数字(data.吸引, fallback.吸引, 0, 100),
    边界尊重度: 归一化数字(data.边界尊重度, fallback.边界尊重度, 0, 100),
    关系状态: 归一化文本(data.关系状态, fallback.关系状态),
    当前评价: 归一化文本(data.当前评价, fallback.当前评价),
    是否正式承诺: 归一化布尔(data.是否正式承诺, fallback.是否正式承诺),
    头像: 归一化头像(data.头像),
    目标: 归一化文本(data.目标, 姓名),
  };
}

function 归一化成员列表(raw: unknown, legacyRaw: unknown) {
  if (Array.isArray(raw)) {
    return raw.map((item, index) =>
      归一化成员(item, DefaultData.成员.列表[index] ?? DefaultData.成员.列表[0]),
    );
  }

  if (_.isPlainObject(legacyRaw)) {
    const list = Object.entries(legacyRaw).map(([name, value], index) =>
      归一化成员(
        { 姓名: name, ...(value as Record<string, unknown>) },
        DefaultData.成员.列表[index] ?? DefaultData.成员.列表[0],
      ),
    );
    if (list.length > 0) {
      return list;
    }
  }

  return _.cloneDeep(DefaultData.成员.列表);
}

function 归一化法则项(raw: unknown, fallback: 法则项): 法则项 {
  const data = _.isPlainObject(raw) ? raw : {};
  const 类型 = 法则项类型列表.includes(data.类型 as 法则项类型) ? (data.类型 as 法则项类型) : fallback.类型;

  if (类型 === 'toggle') {
    return {
      ...fallback,
      类型,
      键: 归一化文本(data.键, fallback.键),
      标签: 归一化文本(data.标签, fallback.标签),
      描述: 归一化文本(data.描述, fallback.描述),
      值: 归一化布尔(data.值, fallback.值),
    };
  }

  if (类型 === 'select') {
    const options = Array.isArray(data.选项)
      ? data.选项.map(item => 归一化文本(item, '')).filter(Boolean)
      : fallback.选项;
    return {
      ...fallback,
      类型,
      键: 归一化文本(data.键, fallback.键),
      标签: 归一化文本(data.标签, fallback.标签),
      描述: 归一化文本(data.描述, fallback.描述),
      值: 归一化文本(data.值, fallback.值),
      选项: options.length > 0 ? options : fallback.选项,
    };
  }

  return {
    ...fallback,
    类型,
    键: 归一化文本(data.键, fallback.键),
    标签: 归一化文本(data.标签, fallback.标签),
    描述: 归一化文本(data.描述, fallback.描述),
    值: 归一化数字(data.值, fallback.值, fallback.最小值, fallback.最大值),
    最小值: 归一化数字(data.最小值, fallback.最小值, 0, 100),
    最大值: 归一化数字(data.最大值, fallback.最大值, 0, 100),
    步长: 归一化数字(data.步长, fallback.步长, 1, 20),
    单位: 归一化文本(data.单位, fallback.单位),
  };
}

function 归一化法则分组(raw: unknown, legacySettings?: Record<string, unknown>) {
  const fallbackGroups = 构建法则分组(legacySettings);
  const rawGroups = Array.isArray(raw) ? raw : [];

  return fallbackGroups.map((group, index) => {
    const rawGroup = _.isPlainObject(rawGroups[index]) ? (rawGroups[index] as Record<string, unknown>) : {};
    const rawItems = Array.isArray(rawGroup.项目) ? rawGroup.项目 : [];
    const itemMap = new Map<string, unknown>();

    rawItems.forEach(item => {
      if (_.isPlainObject(item) && typeof item.键 === 'string') {
        itemMap.set(item.键, item);
      }
    });

    return {
      名称: 归一化文本(rawGroup.名称, group.名称),
      描述: 归一化文本(rawGroup.描述, group.描述),
      项目: group.项目.map(item => 归一化法则项(itemMap.get(item.键) ?? null, item)),
    };
  });
}

export function normalizeStateData(raw?: unknown): 西幻状态 {
  const source = _.isPlainObject(raw) ? (raw as Record<string, unknown>) : {};
  const legacyWorld = _.isPlainObject(source.世界) ? (source.世界 as Record<string, unknown>) : {};
  const legacyEncounter = _.isPlainObject(source.遭遇) ? (source.遭遇 as Record<string, unknown>) : {};
  const 主角源 = _.isPlainObject(source.主角) ? (source.主角 as Record<string, unknown>) : {};
  const 地图源 = _.isPlainObject(source.地图) ? (source.地图 as Record<string, unknown>) : {};
  const 地点源 = _.isPlainObject(source.地点) ? (source.地点 as Record<string, unknown>) : {};
  const 成员源 = _.isPlainObject(source.成员) ? (source.成员 as Record<string, unknown>) : {};
  const 法则源 = _.isPlainObject(source.法则) ? (source.法则 as Record<string, unknown>) : {};
  const 场景源 = _.isPlainObject(source.场景) ? (source.场景 as Record<string, unknown>) : {};

  const 当前区域 = 归一化文本(
    地图源.当前区域 ?? legacyWorld.地区,
    DefaultData.地图.当前区域,
  );

  const legacyActions = legacyEncounter.候选动作;
  const state: 西幻状态 = {
    场景: {
      标题: 归一化文本(场景源.标题 ?? legacyEncounter.当前事件, DefaultData.场景.标题),
      副标题: 归一化文本(场景源.副标题 ?? legacyEncounter.事件阶段, DefaultData.场景.副标题),
      状态徽章: 归一化徽章(场景源.状态徽章, [
        归一化文本(legacyWorld.日期, DefaultData.场景.状态徽章[0]),
        归一化文本(legacyWorld.时段, DefaultData.场景.状态徽章[1]),
        归一化文本(legacyWorld.天气, DefaultData.场景.状态徽章[2]),
        归一化文本(主角源.身份, DefaultData.场景.状态徽章[3]),
      ]),
      候选动作: 归一化候选动作列表(场景源.候选动作 ?? legacyActions, DefaultData.场景.候选动作),
    },
    主角: {
      姓名: 归一化文本(主角源.姓名, DefaultData.主角.姓名),
      身份: 归一化文本(主角源.身份, DefaultData.主角.身份),
      头像: 归一化头像(主角源.头像),
      金钱: 归一化数字(主角源.金钱, DefaultData.主角.金钱, 0, 999999),
      声望: 归一化数字(主角源.声望, DefaultData.主角.声望, -100, 100),
      体力: 归一化数字(主角源.体力, DefaultData.主角.体力, 0, 100),
      心情文本: 归一化文本(主角源.心情文本 ?? 主角源.心情, DefaultData.主角.心情文本),
      欲望波动: 归一化数字(主角源.欲望波动, DefaultData.主角.欲望波动, 0, 100),
      实际接受度: 归一化数字(主角源.实际接受度, DefaultData.主角.实际接受度, 0, 100),
      周期: 归一化周期(主角源.周期 ?? 主角源.月经周期, DefaultData.主角.周期),
      偏好摘要: 归一化偏好(主角源.偏好摘要, DefaultData.主角.偏好摘要),
    },
    地图: {
      当前区域,
      当前区域文案: 归一化文本(
        地图源.当前区域文案 ?? _.get(source, ['名录', '已发现地区', 当前区域]),
        DefaultData.地图.当前区域文案,
      ),
      已发现地区: 归一化地区列表(地图源.已发现地区, _.get(source, ['名录', '已发现地区']), 当前区域),
    },
    地点: {
      名称: 归一化文本(地点源.名称 ?? legacyWorld.地点, DefaultData.地点.名称),
      所属城镇: 归一化文本(地点源.所属城镇 ?? legacyWorld.城镇, DefaultData.地点.所属城镇),
      候选动作: 归一化候选动作列表(地点源.候选动作 ?? legacyActions, DefaultData.地点.候选动作),
    },
    成员: {
      列表: 归一化成员列表(成员源.列表, source.关系),
    },
    法则: {
      分组: 归一化法则分组(法则源.分组, legacyWorld.法则开关 as Record<string, unknown> | undefined),
    },
  };

  const parsed = Schema.safeParse(state);
  return parsed.success ? parsed.data : Schema.parse(_.cloneDeep(DefaultData));
}

export type Schema = z.output<typeof Schema>;

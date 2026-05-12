// 碧蓝航线变量结构定义
// 包含自动计算逻辑：产量联动、耗油汇总、预警生成

// 舰种基础油耗映射表
const 油耗表: Record<string, number> = {
  驱逐舰: 8,
  轻型巡洋舰: 9,
  重型巡洋舰: 10,
  战列巡洋舰: 12,
  战列舰: 14,
  轻型航空母舰: 11,
  航空母舰: 13,
  潜艇: 7,
};

// ===== 子结构定义 =====

const 时间与天气Schema = z.object({
  日期: z.string(),
  季节: z.enum(['春季', '夏季', '秋季', '冬季']),
  时刻: z.string(),
  天气: z.string(),
});

const 待办事务项Schema = z.object({
  事项: z.string(),
  物资消耗: z.coerce.number().transform(v => Math.max(v, 0)),
  用油消耗: z.coerce.number().transform(v => Math.max(v, 0)),
  是否完成: z.boolean(),
});

const 议会事务Schema = z.object({
  待办事务: z.array(待办事务项Schema),
  下次中央议会天数: z.coerce.number().transform(v => Math.max(v, 0)),
});

const 委员Schema = z.object({
  姓名: z.string(),
  阵营: z.string(),
});

const 舰娘Schema = z.object({
  姓名: z.string(),
  舰种: z.string(),
});

const 舰队Schema = z
  .object({
    舰队名称: z.string(),
    成员: z.array(舰娘Schema),
  })
  .transform(data => {
    // 自动计算该舰队每季度耗油量
    const 舰队耗油 = data.成员.reduce((sum, m) => sum + (油耗表[m.舰种] ?? 0), 0);
    return { ...data, _舰队每季度耗油: 舰队耗油 };
  });

const 科研舰娘Schema = z.object({
  姓名: z.string(),
  舰种: z.string(),
  总研发时间: z.coerce.number(),
  剩余研发时间: z.coerce.number().transform(v => Math.max(v, 0)),
  研发消耗物资: z.coerce.number(),
});

const 已研发舰娘Schema = z.object({
  姓名: z.string(),
  舰种: z.string(),
});

// ===== 主结构定义 =====

export const Schema = z
  .object({
    时间与天气: 时间与天气Schema,

    议会事务: 议会事务Schema,

    常务委员会: z.array(委员Schema),

    秘书舰: z.array(委员Schema),

    油矿区: z
      .object({
        等级: z.coerce.number().transform(v => _.clamp(v, 1, 6)),
        _最高等级: z.literal(6).optional().default(6),
        _升级消耗物资: z.literal(600).optional().default(600),
      })
      .transform(data => ({
        ...data,
        _每季度产量: data.等级 * 100, // 初始100，每级+100
      })),

    产业区: z
      .object({
        等级: z.coerce.number().transform(v => _.clamp(v, 1, 6)),
        _最高等级: z.literal(6).optional().default(6),
        _升级消耗物资: z.literal(600).optional().default(600),
      })
      .transform(data => ({
        ...data,
        _每季度产量: data.等级 * 1000, // 初始1000，每级+1000
      })),

    船坞: z
      .object({
        等级: z.coerce.number().transform(v => _.clamp(v, 1, 5)),
        _最高等级: z.literal(5).optional().default(5),
        _升级消耗物资: z.literal(600).optional().default(600),
      })
      .transform(data => ({
        ...data,
        _水面舰队上限: data.等级 + 1, // 等级1→2，等级5→6（最多6支水面舰队）
        _水下舰队上限: data.等级, // 等级1→1，等级5→5（最多5支水下舰队）
      })),

    舰队: z
      .object({
        水面舰队: z.array(舰队Schema),
        水下舰队: z.array(舰队Schema),
      })
      .transform(data => {
        // 自动计算每季度总耗油量
        const 水面总耗油 = data.水面舰队.reduce((sum, f) => sum + f._舰队每季度耗油, 0);
        const 水下总耗油 = data.水下舰队.reduce((sum, f) => sum + f._舰队每季度耗油, 0);
        return {
          ...data,
          _每季度总耗油: 水面总耗油 + 水下总耗油,
        };
      }),

    研究中心: z
      .object({
        等级: z.coerce.number().transform(v => _.clamp(v, 1, 8)),
        _最高等级: z.literal(8).optional().default(8),
        _升级消耗物资: z.literal(600).optional().default(600),
      })
      .transform(data => ({
        ...data,
        _科技点: data.等级 * 10, // 初始10，每级+10
        _缩短研发月数: data.等级, // 每10科技点缩短1月，等级即月数
        _同时研发数量: 1 + Math.floor(data.等级 / 2), // 每20科技点+1，初始1
      })),

    科研: z.object({
      研发中: z.array(科研舰娘Schema),
      已研发: z.array(已研发舰娘Schema),
    }),

    仓储中心: z.object({
      特殊用油: z.coerce.number().transform(v => Math.max(v, 0)),
      物资: z.coerce.number().transform(v => Math.max(v, 0)),
    }),

    预警: z.array(z.string()),
  })
  .transform(data => {
    // ===== 预警系统自动生成 =====
    const 预警列表: string[] = [];

    // 计算待完成事务总消耗
    const 未完成事务 = data.议会事务.待办事务.filter(t => !t.是否完成);
    const 事务总物资 = 未完成事务.reduce((sum, t) => sum + t.物资消耗, 0);
    const 事务总用油 = 未完成事务.reduce((sum, t) => sum + t.用油消耗, 0);

    // 计算科研总消耗
    const 科研总物资 = data.科研.研发中.reduce((sum, r) => sum + r.研发消耗物资, 0);

    // 计算舰队每季度耗油
    const 每季度总耗油 = data.舰队._每季度总耗油;

    // 当用油不足以覆盖 事务用油 + 每季度舰队耗油
    if (data.仓储中心.特殊用油 < 事务总用油 + 每季度总耗油) {
      预警列表.push('用油告急');
    }

    // 当物资不足以覆盖 事务物资 + 科研物资
    if (data.仓储中心.物资 < 事务总物资 + 科研总物资) {
      预警列表.push('物资告急');
    }

    return { ...data, 预警: 预警列表.length > 0 ? 预警列表 : data.预警 };
  });

export type Schema = z.output<typeof Schema>;

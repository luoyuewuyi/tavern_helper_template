export const Schema = z
  .object({
    世界: z
      .object({
        当前纪元: z
          .enum([
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
          ])
          .prefault('洪荒初开'),
        当前年代: z.string().prefault('洪荒初开，万族立世之前'),
        当前时间: z.string().prefault('开局未定'),
        当前地点: z.string().prefault('开局未定'),
        历史节点: z.string().prefault('未定节点'),
        节点进度: z.coerce.number().prefault(0),
        天道强度: z.coerce.number().prefault(30),
        灵气浓度: z.coerce.number().prefault(80),
        劫气: z.coerce.number().prefault(10),
        人道秩序: z.coerce.number().prefault(0),
        科技秩序: z.coerce.number().prefault(0),
        大势偏移: z.coerce.number().prefault(0),
        近期征兆: z.record(z.string().describe('征兆名'), z.string()).prefault({}),
        活跃事件: z.record(z.string().describe('事件名'), z.string()).prefault({}),
      })
      .prefault({})
      .transform(data => {
        const 节点进度 = _.clamp(data.节点进度, 0, 100);
        const 天道强度 = _.clamp(data.天道强度, 0, 100);
        const 灵气浓度 = _.clamp(data.灵气浓度, 0, 100);
        const 劫气 = _.clamp(data.劫气, 0, 100);
        const 人道秩序 = _.clamp(data.人道秩序, 0, 100);
        const 科技秩序 = _.clamp(data.科技秩序, 0, 100);
        const 大势偏移 = _.clamp(data.大势偏移, -100, 100);
        const $节点阶段 =
          节点进度 < 20 ? '伏笔期' : 节点进度 < 45 ? '显兆期' : 节点进度 < 70 ? '扩散期' : 节点进度 < 95 ? '临界期' : '更替期';
        const $世界格局 =
          data.当前纪元 === '鸿蒙' || data.当前纪元 === '混沌'
            ? '天地未定'
            : data.当前纪元.includes('洪荒') || data.当前纪元.includes('龙汉') || data.当前纪元.includes('巫妖')
              ? '先天神魔并立'
              : data.当前纪元.includes('封神') || data.当前纪元.includes('西游')
                ? '天庭地府成制'
                : data.当前纪元 === '现代' || data.当前纪元 === '末法近世'
                  ? '灵脉隐没'
                  : data.当前纪元 === '灵气复苏'
                    ? '新旧秩序冲突'
                    : '人道王朝轮转';
        return { ...data, 节点进度, 天道强度, 灵气浓度, 劫气, 人道秩序, 科技秩序, 大势偏移, $节点阶段, $世界格局 };
      }),

    主角: z
      .object({
        姓名: z.string().prefault('待定'),
        性别: z.string().prefault('待定'),
        年龄: z.string().prefault('待定'),
        自定义背景: z.string().prefault('待定'),
        自定义开局: z.string().prefault('待定'),
        当前位置: z.string().prefault('随开局生成'),
        身份: z.string().prefault('无名修行者'),
        阵营: z.string().prefault('未定'),
        状态: z.record(z.string().describe('状态名'), z.string()).prefault({}),
        关系: z
          .record(
            z.string().describe('对象名'),
            z.object({
              立场: z.string().prefault('未定'),
              亲近: z.coerce.number().prefault(0),
              因果: z.string().prefault('暂无'),
            }),
          )
          .prefault({}),
      })
      .prefault({})
      .transform(data => ({
        ...data,
        关系: _.mapValues(data.关系, item => ({ ...item, 亲近: _.clamp(item.亲近, -100, 100) })),
      })),

    修炼: z
      .object({
        大阶段: z.enum(['凡境', '仙境', '道境']).prefault('凡境'),
        境界: z.string().prefault('凡人'),
        小境: z.string().prefault('初入'),
        修为: z.coerce.number().prefault(0),
        境界进度: z.coerce.number().prefault(0),
        根基: z.coerce.number().prefault(50),
        悟性: z.coerce.number().prefault(50),
        肉身: z.coerce.number().prefault(10),
        神魂: z.coerce.number().prefault(10),
        灵力: z.coerce.number().prefault(0),
        功德: z.coerce.number().prefault(0),
        业力: z.coerce.number().prefault(0),
        气运: z.coerce.number().prefault(0),
        心魔: z.coerce.number().prefault(0),
        突破条件: z
          .object({
            修为达标: z.boolean().prefault(false),
            根基达标: z.boolean().prefault(false),
            悟道契机: z.boolean().prefault(false),
            资源齐备: z.boolean().prefault(false),
            劫数已过: z.boolean().prefault(false),
          })
          .prefault({}),
        瓶颈: z.string().prefault('无'),
      })
      .prefault({})
      .transform(data => {
        const 修为 = Math.max(0, data.修为);
        const 境界进度 = _.clamp(data.境界进度, 0, 100);
        const 根基 = _.clamp(data.根基, 0, 100);
        const 悟性 = _.clamp(data.悟性, 0, 100);
        const 肉身 = _.clamp(data.肉身, 0, 1000000);
        const 神魂 = _.clamp(data.神魂, 0, 1000000);
        const 灵力 = _.clamp(data.灵力, 0, 1000000);
        const 功德 = _.clamp(data.功德, 0, 1000000);
        const 业力 = _.clamp(data.业力, 0, 1000000);
        const 气运 = _.clamp(data.气运, -1000000, 1000000);
        const 心魔 = _.clamp(data.心魔, 0, 100);
        const 条件数 = _.filter(data.突破条件, Boolean).length;
        const $突破可行 = 条件数 >= 4 && 境界进度 >= 90 && 心魔 < 70;
        const $修炼阶段 = data.大阶段 === '凡境' ? '由凡入道' : data.大阶段 === '仙境' ? '超凡登仙' : '证道执道';
        return { ...data, 修为, 境界进度, 根基, 悟性, 肉身, 神魂, 灵力, 功德, 业力, 气运, 心魔, $突破可行, $修炼阶段 };
      }),

    功法: z
      .object({
        主修: z.string().prefault('无'),
        运转状态: z.enum(['未运转', '静修', '战斗运转', '闭关', '走火入魔']).prefault('未运转'),
        功法库: z
          .record(
            z.string().describe('功法名'),
            z.object({
              品阶: z.string().prefault('未定'),
              熟练度: z.coerce.number().prefault(0),
              当前装备: z.boolean().prefault(false),
              效果: z.string().prefault('未定'),
              代价: z.string().prefault('未定'),
            }),
          )
          .prefault({}),
      })
      .prefault({})
      .transform(data => ({
        ...data,
        功法库: _.mapValues(data.功法库, item => ({ ...item, 熟练度: _.clamp(item.熟练度, 0, 100) })),
      })),

    装备: z
      .record(
        z.enum(['兵器', '防具', '法宝', '坐骑', '洞府', '随身世界']),
        z.object({
          名称: z.string().prefault('无'),
          品阶: z.string().prefault('无'),
          状态: z.string().prefault('未装备'),
          效果: z.string().prefault('无'),
        }),
      )
      .prefault({ 兵器: {}, 防具: {}, 法宝: {}, 坐骑: {}, 洞府: {}, 随身世界: {} }),

    资源: z
      .object({
        灵石: z.coerce.number().prefault(0),
        功德点: z.coerce.number().prefault(0),
        气运碎片: z.coerce.number().prefault(0),
        丹药: z.record(z.string().describe('丹药名'), z.coerce.number()).prefault({}),
        材料: z.record(z.string().describe('材料名'), z.coerce.number()).prefault({}),
        背包: z
          .record(
            z.string().describe('物品名'),
            z.object({
              数量: z.coerce.number().prefault(1),
              描述: z.string().prefault(''),
            }),
          )
          .prefault({}),
      })
      .prefault({})
      .transform(data => ({
        ...data,
        灵石: Math.max(0, data.灵石),
        功德点: Math.max(0, data.功德点),
        气运碎片: Math.max(0, data.气运碎片),
        丹药: _.pickBy(data.丹药, value => value > 0),
        材料: _.pickBy(data.材料, value => value > 0),
        背包: _.pickBy(data.背包, item => item.数量 > 0),
      })),
  })
  .prefault({});

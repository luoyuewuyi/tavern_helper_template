import _ from 'lodash';
import { z } from 'zod';

const factionNames = [
  '刘备集团',
  '曹操集团',
  '孙吴',
  '汉室',
  '河北袁系残部',
  '荆益地方',
  '雍凉西北',
  '世家门阀',
] as const;

const clampPercentage = (value: number) => _.clamp(value, 0, 100);
const trimRecord = <T extends Record<string, unknown>>(value: T | undefined, limit: number) =>
  _(value ?? {})
    .entries()
    .takeRight(limit)
    .fromPairs()
    .value() as T;
const trimStringList = (value: string[] | undefined, limit: number) =>
  _(value ?? [])
    .map(item => `${item}`.trim())
    .filter(Boolean)
    .uniq()
    .take(limit)
    .value();

const defaultFactionState = {
  态度: '观望',
  关注度: 30,
  依赖度: 20,
  戒备度: 30,
  可借势度: 40,
  渗透度: 8,
  绑定度: 6,
  牵引筹码: '暂无',
  当前判断: '暂无定评',
  已受影响事件: {},
};

const defaultFactions = {
  刘备集团: { ...defaultFactionState, 态度: '试探', 可借势度: 60 },
  曹操集团: { ...defaultFactionState, 态度: '警惕', 关注度: 50, 戒备度: 58 },
  孙吴: { ...defaultFactionState, 关注度: 24, 可借势度: 35 },
  汉室: { ...defaultFactionState, 态度: '拉拢', 依赖度: 22, 可借势度: 52 },
  河北袁系残部: { ...defaultFactionState, 态度: '试探', 关注度: 42, 可借势度: 68 },
  荆益地方: { ...defaultFactionState, 关注度: 28, 可借势度: 56 },
  雍凉西北: { ...defaultFactionState, 关注度: 22, 可借势度: 54 },
  世家门阀: { ...defaultFactionState, 态度: '试探', 关注度: 38, 戒备度: 46, 可借势度: 62 },
};

const defaultCoreFigure = {
  所属势力: '刘备集团',
  人物定位: '战局关键人物',
  立场: '观望',
  对user认知: '尚无明确认知',
  短期诉求: '等待更多信息',
  接触层级: '尚未深接',
  关系热度: 20,
  注意度: 20,
  影响权重: 30,
  当前判断: '暂无定论',
  风险判定: '低',
  可触发联动: {},
  已受影响事件: {},
};

const defaultCoreFigures = {
  刘备: {
    ...defaultCoreFigure,
    所属势力: '刘备集团',
    人物定位: '战后接盘的主心骨',
    立场: '重整战后秩序',
    注意度: 42,
    影响权重: 88,
    风险判定: '中',
  },
  陈曦: {
    ...defaultCoreFigure,
    所属势力: '刘备集团',
    人物定位: '决定刘备系用人节奏的中枢',
    立场: '审势用人',
    注意度: 50,
    影响权重: 92,
    风险判定: '中',
  },
  曹操: {
    ...defaultCoreFigure,
    所属势力: '曹操集团',
    人物定位: '中原战后秩序的主动塑形者',
    立场: '主动试探',
    注意度: 58,
    影响权重: 95,
    风险判定: '高',
  },
  荀彧: {
    ...defaultCoreFigure,
    所属势力: '曹操集团',
    人物定位: '曹营秩序与名分判断的校准器',
    立场: '以秩序为先',
    注意度: 45,
    影响权重: 84,
    风险判定: '中',
  },
  郭嘉: {
    ...defaultCoreFigure,
    所属势力: '曹操集团',
    人物定位: '最擅长把异数拿来做局的谋主',
    立场: '偏向利用',
    注意度: 54,
    影响权重: 86,
    风险判定: '高',
  },
  刘协: {
    ...defaultCoreFigure,
    所属势力: '汉室',
    人物定位: '名分与诏令的稀缺支点',
    立场: '求存借势',
    注意度: 36,
    影响权重: 72,
    风险判定: '中',
  },
  袁谭: {
    ...defaultCoreFigure,
    所属势力: '河北袁系残部',
    人物定位: '河北残部能否续火的表层主轴',
    立场: '自救翻盘',
    注意度: 41,
    影响权重: 78,
    风险判定: '中',
  },
  审配: {
    ...defaultCoreFigure,
    所属势力: '河北袁系残部',
    人物定位: '河北残部的强硬筛选与守底线者',
    立场: '守旧强硬',
    注意度: 47,
    影响权重: 80,
    风险判定: '高',
  },
};

export const Schema = z.object({
  世界: z
    .object({
      当前时间: z
        .object({
          纪年: z.string().prefault('建安年间'),
          季节: z.enum(['春', '夏', '秋', '冬']).prefault('秋'),
          节点: z.string().prefault('袁刘大战甫定'),
          时段: z.string().prefault('深夜'),
        })
        .prefault({}),
      当前地点: z
        .object({
          大域: z.string().prefault('河北与中原之间'),
          州郡: z.string().prefault('冀州南缘'),
          场景: z.string().prefault('战后驿站'),
        })
        .prefault({}),
      主线阶段: z.string().prefault('袁刘大战余烬'),
      天下风向: z.string().prefault('河北残火未熄，中原诸方重排'),
      天命波动: z.coerce.number().transform(clampPercentage).prefault(60),
      战后余震: z.coerce.number().transform(clampPercentage).prefault(75),
      即时风险: z.string().prefault('曹操耳目正在追索战后异动'),
      即时机会: z.string().prefault('战后权力空窗让新下注者变得值钱'),
      地缘热区: z
        .record(
          z.string().describe('热区名'),
          z.object({
            热度: z.coerce.number().transform(clampPercentage).prefault(50),
            说明: z.string().prefault('暂无'),
            牵涉势力: z.string().prefault('全局'),
          }),
        )
        .transform(value => trimRecord(value, 6))
        .prefault({}),
      公开大事记: z
        .record(
          z.string().describe('事件名'),
          z.object({
            摘要: z.string().prefault('暂无摘要'),
            影响范围: z.string().prefault('局部'),
            热度: z.coerce.number().transform(clampPercentage).prefault(50),
            公开度: z.coerce.number().transform(clampPercentage).prefault(50),
          }),
        )
        .transform(value => trimRecord(value, 10))
        .prefault({}),
    })
    .prefault({}),
  玩家: z
    .object({
      身份自述: z.string().prefault('待玩家自由书写'),
      公开身份: z.string().prefault('战后乱局中的陌生人'),
      隐藏身份: z.string().prefault('尚未揭示'),
      天赋: z.string().prefault('未显'),
      性格: z.string().prefault('未定'),
      行事风格: z.string().prefault('观势试探'),
      能力侧重: z.string().prefault('谋略与情报'),
      立场倾向: z.string().prefault('暂不公开站队'),
      发展阶段: z.string().prefault('乱局微尘'),
      公开名望: z.coerce.number().transform(clampPercentage).prefault(12),
      隐秘资本: z
        .object({
          情报: z.coerce.number().transform(clampPercentage).prefault(36),
          人脉: z.coerce.number().transform(clampPercentage).prefault(24),
          资源: z.coerce.number().transform(clampPercentage).prefault(20),
          武力: z.coerce.number().transform(clampPercentage).prefault(18),
          天命因子: z.coerce.number().transform(clampPercentage).prefault(28),
        })
        .prefault({}),
      个人底盘: z
        .object({
          情报网: z.coerce.number().transform(clampPercentage).prefault(18),
          可调用人手: z.coerce.number().transform(clampPercentage).prefault(8),
          资金调度: z.coerce.number().transform(clampPercentage).prefault(12),
          据点: z.coerce.number().transform(clampPercentage).prefault(5),
          盟约筹码: z.coerce.number().transform(clampPercentage).prefault(10),
        })
        .prefault({}),
      当前诉求: z.string().prefault('先活下去，再决定向谁下注'),
      阵营履历: z
        .record(
          z.enum(factionNames),
          z.object({
            接触层级: z.string().prefault('只闻其名'),
            恩义: z.coerce.number().transform(clampPercentage).prefault(0),
            嫌隙: z.coerce.number().transform(clampPercentage).prefault(0),
            渗透成果: z.string().prefault('暂无'),
          }),
        )
        .prefault({
          刘备集团: { 接触层级: '尚未入局', 恩义: 0, 嫌隙: 0, 渗透成果: '暂无' },
          曹操集团: { 接触层级: '尚未入局', 恩义: 0, 嫌隙: 0, 渗透成果: '暂无' },
          孙吴: { 接触层级: '未建立接触', 恩义: 0, 嫌隙: 0, 渗透成果: '暂无' },
          汉室: { 接触层级: '仅在朝野情报中', 恩义: 0, 嫌隙: 0, 渗透成果: '暂无' },
          河北袁系残部: { 接触层级: '待接触', 恩义: 0, 嫌隙: 0, 渗透成果: '暂无' },
          荆益地方: { 接触层级: '未建立接触', 恩义: 0, 嫌隙: 0, 渗透成果: '暂无' },
          雍凉西北: { 接触层级: '未建立接触', 恩义: 0, 嫌隙: 0, 渗透成果: '暂无' },
          世家门阀: { 接触层级: '已被侧记', 恩义: 0, 嫌隙: 0, 渗透成果: '暂无' },
        }),
      行动痕迹: z
        .record(
          z.string().describe('行动名'),
          z.object({
            描述: z.string().prefault('暂无'),
            影响阵营: z.string().prefault('未定'),
            隐蔽度: z.coerce.number().transform(clampPercentage).prefault(50),
            时间标签: z.string().prefault('当前'),
          }),
        )
        .transform(value => trimRecord(value, 10))
        .prefault({}),
      阶段履历: z
        .record(
          z.string().describe('阶段名'),
          z.object({
            摘要: z.string().prefault('暂无'),
            收获: z.string().prefault('暂无'),
            代价: z.string().prefault('暂无'),
          }),
        )
        .transform(value => trimRecord(value, 12))
        .prefault({}),
      被谁注意: z
        .record(z.string().describe('对象'), z.string())
        .transform(value => trimRecord(value, 8))
        .prefault({}),
      被谁怀疑: z
        .record(z.string().describe('对象'), z.string())
        .transform(value => trimRecord(value, 8))
        .prefault({}),
      被谁忌惮: z
        .record(z.string().describe('对象'), z.string())
        .transform(value => trimRecord(value, 8))
        .prefault({}),
    })
    .prefault({}),
  势力: z
    .record(
      z.enum(factionNames),
      z.object({
        态度: z.string().prefault('观望'),
        关注度: z.coerce.number().transform(clampPercentage).prefault(30),
        依赖度: z.coerce.number().transform(clampPercentage).prefault(20),
        戒备度: z.coerce.number().transform(clampPercentage).prefault(30),
        可借势度: z.coerce.number().transform(clampPercentage).prefault(40),
        渗透度: z.coerce.number().transform(clampPercentage).prefault(8),
        绑定度: z.coerce.number().transform(clampPercentage).prefault(6),
        牵引筹码: z.string().prefault('暂无'),
        当前判断: z.string().prefault('暂无定评'),
        已受影响事件: z
          .record(z.string().describe('事件名'), z.string())
          .transform(value => trimRecord(value, 6))
          .prefault({}),
      }),
    )
    .prefault(defaultFactions),
  人物专区: z
    .object({
      当前焦点: z
        .array(z.string())
        .transform(value => trimStringList(value, 8))
        .prefault(['刘备', '陈曦', '曹操', '荀彧', '郭嘉', '刘协', '袁谭', '审配']),
    })
    .prefault({}),
  核心人物: z
    .record(
      z.string().describe('人物名'),
      z.object({
        所属势力: z.string().prefault('刘备集团'),
        人物定位: z.string().prefault('战局关键人物'),
        立场: z.string().prefault('观望'),
        对user认知: z.string().prefault('尚无明确认知'),
        短期诉求: z.string().prefault('等待更多信息'),
        接触层级: z.string().prefault('尚未深接'),
        关系热度: z.coerce.number().transform(clampPercentage).prefault(20),
        注意度: z.coerce.number().transform(clampPercentage).prefault(20),
        影响权重: z.coerce.number().transform(clampPercentage).prefault(30),
        当前判断: z.string().prefault('暂无定论'),
        风险判定: z.string().prefault('低'),
        可触发联动: z
          .record(z.string().describe('联动名'), z.string())
          .transform(value => trimRecord(value, 6))
          .prefault({}),
        已受影响事件: z
          .record(z.string().describe('事件名'), z.string())
          .transform(value => trimRecord(value, 6))
          .prefault({}),
      }),
    )
    .transform(value => trimRecord(value, 24))
    .prefault(defaultCoreFigures),
  蝴蝶效应: z
    .object({
      活跃链路: z
        .record(
          z.string().describe('链路名'),
          z.object({
            触发源: z.string().prefault('暂无'),
            直接影响: z.string().prefault('暂无'),
            二级传导: z.string().prefault('暂无'),
            公开度: z.coerce.number().transform(clampPercentage).prefault(50),
            热度: z.coerce.number().transform(clampPercentage).prefault(50),
            失效条件: z.string().prefault('被更大事件覆盖'),
            已兑现后果: z.string().prefault('尚未兑现'),
            涉及势力: z
              .record(z.string().describe('势力名'), z.string())
              .transform(value => trimRecord(value, 4))
              .prefault({}),
          }),
        )
        .transform(value => trimRecord(value, 8))
        .prefault({}),
      已兑现链路: z
        .record(
          z.string().describe('历史链路名'),
          z.object({
            触发源: z.string().prefault('暂无'),
            直接影响: z.string().prefault('暂无'),
            二级传导: z.string().prefault('暂无'),
            公开度: z.coerce.number().transform(clampPercentage).prefault(50),
            热度: z.coerce.number().transform(clampPercentage).prefault(50),
            失效条件: z.string().prefault('已归档'),
            已兑现后果: z.string().prefault('已兑现'),
            涉及势力: z
              .record(z.string().describe('势力名'), z.string())
              .transform(value => trimRecord(value, 4))
              .prefault({}),
          }),
        )
        .transform(value => trimRecord(value, 12))
        .prefault({}),
      近期涟漪: z.string().prefault('尚无足以改写原轨迹的蝴蝶涟漪'),
    })
    .prefault({}),
  _派生: z
    .object({
      身份标签: z.record(z.enum(['出身', '手段', '外显']), z.string()).prefault({
        出身: '游士未明',
        手段: '观势试探',
        外显: '待显',
      }),
      阵营偏向: z.string().prefault('未显'),
      权谋风格: z.string().prefault('审势缓进'),
      风险画像: z.string().prefault('待观察'),
      行动节奏: z.string().prefault('试探开局'),
      影响力摘要: z.string().prefault('尚未形成跨阵营影响'),
      身份摘要: z.string().prefault('玩家尚未写明自身来历'),
      风险热区: z
        .record(z.string().describe('热区名'), z.string())
        .transform(value => trimRecord(value, 4))
        .prefault({}),
    })
    .prefault({}),
});

export type Schema = z.output<typeof Schema>;

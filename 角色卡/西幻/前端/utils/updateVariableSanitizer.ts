import { DefaultData } from '../../schema';
import { SessionHostCommandType, WestFantasyState } from '../types';

interface JsonPatchOperation {
  op: string;
  path: string;
  from?: string;
  value?: unknown;
  [key: string]: unknown;
}

function trimText(value: unknown, fallback = '') {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return `${value}`;
  }

  return fallback;
}

function clampNumber(value: unknown, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  if (Number.isFinite(parsed)) {
    return _.clamp(parsed, min, max);
  }

  return _.clamp(fallback, min, max);
}

function normalizeBoolean(value: unknown, fallback: boolean) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) {
      return true;
    }

    if (['false', '0', 'no', 'off'].includes(normalized)) {
      return false;
    }
  }

  return fallback;
}

function extractTagBlock(source: string, tag: string) {
  const matcher = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = source.match(matcher);
  return match?.[1]?.trim() ?? null;
}

function normalizePatchPath(rawPath: string) {
  const trimmed = rawPath.trim();
  if (!trimmed) {
    return '';
  }

  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  if (normalized === '/stat_data') {
    return '';
  }

  if (normalized.startsWith('/stat_data/')) {
    return normalized.slice('/stat_data'.length);
  }

  return normalized;
}

function isAllowedPath(path: string) {
  const roots = ['/场景', '/主角', '/地图', '/地点', '/成员', '/法则'];
  return roots.some(root => path === root || path.startsWith(`${root}/`));
}

function inferCommandType(label: string, fallback: SessionHostCommandType): SessionHostCommandType {
  if (/(搭话|交谈|攀谈|询问|拜访|接触|商量)/.test(label)) {
    return 'npc';
  }

  if (/(前往|赶往|返回|启程|动身|前去|去往)/.test(label) && /(地区|区域|大陆|边境|海岸)/.test(label)) {
    return 'travel-region';
  }

  if (/(前往|赶往|返回|启程|动身|前去|去往|入住|夜探)/.test(label)) {
    return 'travel-place';
  }

  return fallback;
}

function normalizeActionItem(
  raw: unknown,
  fallback: WestFantasyState['场景']['候选动作'][number],
): WestFantasyState['场景']['候选动作'][number] {
  if (typeof raw === 'string') {
    const label = trimText(raw, fallback.标签);
    const commandType = inferCommandType(label, fallback.命令类型);
    const target = label.replace(/^(前往|赶往|返回|启程|动身|前去|去往)/, '').trim() || label;

    return {
      标签: label,
      描述: `执行「${label}」并推进当前局势。`,
      类型: commandType === 'event' ? '推进事件' : '切换地点',
      目标: target,
      需要确认: /夜探|潜入|危险|高风险|赌/.test(label),
      命令类型: commandType,
    };
  }

  const data = _.isPlainObject(raw) ? (raw as Record<string, unknown>) : {};
  const label = trimText(data.标签 ?? data.label ?? data.名称 ?? data.name, fallback.标签);
  const commandType = inferCommandType(trimText(data.命令类型, fallback.命令类型), fallback.命令类型);

  return {
    标签: label,
    描述: trimText(data.描述 ?? data.description ?? data.说明, fallback.描述),
    类型: trimText(data.类型 ?? data.type, commandType === 'event' ? fallback.类型 : '切换地点'),
    目标: trimText(data.目标 ?? data.target ?? data.对象, label || fallback.目标),
    需要确认: normalizeBoolean(data.需要确认 ?? data.requiresConfirm, fallback.需要确认),
    命令类型: inferCommandType(label, commandType),
  };
}

function normalizeActionList(
  raw: unknown,
  fallback: WestFantasyState['场景']['候选动作'],
): WestFantasyState['场景']['候选动作'] {
  if (Array.isArray(raw)) {
    return raw.map((item, index) =>
      normalizeActionItem(item, fallback[index] ?? fallback.at(-1) ?? DefaultData.场景.候选动作[0]),
    );
  }

  if (_.isPlainObject(raw)) {
    return Object.entries(raw).map(([key, value], index) =>
      normalizeActionItem(
        _.isPlainObject(value) ? value : { 标签: key, 描述: value },
        fallback[index] ?? fallback.at(-1) ?? DefaultData.场景.候选动作[0],
      ),
    );
  }

  return _.cloneDeep(fallback);
}

function createNeutralMember(name: string) {
  const fallback = _.cloneDeep(DefaultData.成员.列表[0]);
  return {
    ...fallback,
    姓名: name || '未命名对象',
    种族: '未知',
    职业: '未知',
    外观摘要: '对方的外貌与气质还有待继续观察。',
    好感: 0,
    信任: 0,
    吸引: 0,
    边界尊重度: 70,
    关系状态: '陌生',
    当前评价: '初次接触，有待观察。',
    是否正式承诺: false,
    头像: null,
    目标: name || '未命名对象',
  };
}

function normalizeMemberCard(
  raw: unknown,
  fallback?: WestFantasyState['成员']['列表'][number],
): WestFantasyState['成员']['列表'][number] {
  const data = _.isPlainObject(raw) ? (raw as Record<string, unknown>) : {};
  const name = trimText(data.姓名 ?? data.name, fallback?.姓名 ?? '未命名对象');
  const base = fallback ? _.cloneDeep(fallback) : createNeutralMember(name);
  const summary = trimText(data.外观摘要 ?? data.外貌印象, base.外观摘要);
  const currentEvaluation = [
    trimText(data.当前评价, ''),
    trimText(data.对主角第一态度, ''),
    trimText(data.所属势力, '') ? `所属势力：${trimText(data.所属势力, '')}` : '',
    trimText(data.可提供价值, '') ? `可提供价值：${trimText(data.可提供价值, '')}` : '',
  ]
    .filter(Boolean)
    .join('；');

  return {
    姓名: name,
    种族: trimText(data.种族, base.种族),
    职业: trimText(data.职业, base.职业),
    外观摘要: summary,
    好感: clampNumber(data.好感, base.好感, 0, 100),
    信任: clampNumber(data.信任, base.信任, 0, 100),
    吸引: clampNumber(data.吸引, base.吸引, 0, 100),
    边界尊重度: clampNumber(data.边界尊重度, base.边界尊重度, 0, 100),
    关系状态: trimText(data.关系状态, base.关系状态),
    当前评价: trimText(currentEvaluation, base.当前评价),
    是否正式承诺: normalizeBoolean(data.是否正式承诺, base.是否正式承诺),
    头像: trimText(data.头像) || null,
    目标: trimText(data.目标, name),
  };
}

function normalizeMemberValue(
  raw: unknown,
  fallback: WestFantasyState['成员']['列表'],
): WestFantasyState['成员']['列表'] | WestFantasyState['成员']['列表'][number] {
  if (Array.isArray(raw)) {
    return raw.map((item, index) => normalizeMemberCard(item, fallback[index]));
  }

  return normalizeMemberCard(raw, fallback.at(-1));
}

export function sanitizeUpdateVariableBlock(rawUpdate: string | null, currentState: WestFantasyState) {
  if (!rawUpdate) {
    return null;
  }

  const analysis = extractTagBlock(rawUpdate, 'Analysis');
  const jsonPatchSource = extractTagBlock(rawUpdate, 'JSONPatch') ?? rawUpdate.trim();

  let operations: unknown;
  try {
    operations = JSON.parse(jsonPatchSource);
  } catch {
    return rawUpdate;
  }

  if (!Array.isArray(operations)) {
    return rawUpdate;
  }

  let mirroredSceneActions: WestFantasyState['场景']['候选动作'] | null = null;
  let mirroredLocationActions: WestFantasyState['地点']['候选动作'] | null = null;
  let hasSceneActionPatch = false;
  let hasLocationActionPatch = false;

  const sanitizedOps = operations.flatMap(operation => {
    if (!_.isPlainObject(operation) || typeof operation.op !== 'string' || typeof operation.path !== 'string') {
      return [];
    }

    const nextOp: JsonPatchOperation = _.cloneDeep(operation as JsonPatchOperation);
    nextOp.path = normalizePatchPath(nextOp.path);

    if (!nextOp.path || !isAllowedPath(nextOp.path)) {
      return [];
    }

    if (typeof nextOp.from === 'string') {
      nextOp.from = normalizePatchPath(nextOp.from);
    }

    if ((nextOp.path === '/场景/候选动作' || nextOp.path === '/地点/候选动作') && 'value' in nextOp) {
      const fallback = nextOp.path === '/场景/候选动作' ? currentState.场景.候选动作 : currentState.地点.候选动作;
      const normalizedActions = normalizeActionList(nextOp.value, fallback);
      nextOp.value = normalizedActions;

      if (nextOp.path === '/场景/候选动作') {
        hasSceneActionPatch = true;
        mirroredLocationActions = normalizedActions;
      } else {
        hasLocationActionPatch = true;
        mirroredSceneActions = normalizedActions;
      }
    }

    if (/^\/成员\/列表(?:\/(?:-|\d+))?$/.test(nextOp.path) && 'value' in nextOp) {
      nextOp.value = normalizeMemberValue(nextOp.value, currentState.成员.列表);
    }

    return [nextOp];
  });

  if (mirroredSceneActions && !hasSceneActionPatch) {
    sanitizedOps.push({
      op: 'replace',
      path: '/场景/候选动作',
      value: mirroredSceneActions,
    });
  }

  if (mirroredLocationActions && !hasLocationActionPatch) {
    sanitizedOps.push({
      op: 'replace',
      path: '/地点/候选动作',
      value: mirroredLocationActions,
    });
  }

  if (sanitizedOps.length === 0) {
    return null;
  }

  const blocks = [];
  if (analysis) {
    blocks.push(`<Analysis>\n${analysis}\n</Analysis>`);
  }
  blocks.push(`<JSONPatch>\n${JSON.stringify(sanitizedOps, null, 2)}\n</JSONPatch>`);
  return blocks.join('\n\n');
}

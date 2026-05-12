import * as YAML from 'yaml';
import { DefaultData, normalizeStateData } from '../../schema';
import { OpeningFormData } from '../types';
import { buildAssistantMessage, SESSION_HOST_MARKER } from './messageParser';
import { ensureLatestSessionHostAnchor } from './sessionHost';
import { getLatestMvuData } from './variableReader';

function buildDiscoveredRegions(currentRegion: string, description: string) {
  const regions = _.cloneDeep(DefaultData.地图.已发现地区).map(region => ({
    ...region,
    是否当前: false,
  }));

  const current = regions.find(region => region.名称 === currentRegion || region.目标 === currentRegion);
  if (current) {
    current.名称 = currentRegion;
    current.目标 = currentRegion;
    current.摘要 = description;
    current.是否当前 = true;
  } else {
    regions.unshift({
      名称: currentRegion,
      摘要: description,
      是否当前: true,
      目标: currentRegion,
    });
  }

  return regions;
}

export function createOpeningFormData(source = DefaultData): OpeningFormData {
  return {
    主角: {
      姓名: source.主角.姓名,
      身份: source.主角.身份,
      头像: source.主角.头像 ?? '',
      心情文本: source.主角.心情文本,
    },
  };
}

export function createOpeningState(form: OpeningFormData) {
  return normalizeStateData({
    ..._.cloneDeep(DefaultData),
    场景: {
      标题: `初到${DefaultData.地点.所属城镇}`,
      副标题: `在${DefaultData.地点.名称}落脚，先判断可接触的人、情报与下一步去向。`,
      状态徽章: [
        DefaultData.场景.状态徽章[0],
        DefaultData.场景.状态徽章[1],
        DefaultData.地图.当前区域,
        form.主角.身份,
      ],
      候选动作: _.cloneDeep(DefaultData.地点.候选动作),
    },
    主角: {
      ..._.cloneDeep(DefaultData.主角),
      ...form.主角,
      头像: form.主角.头像.trim() || null,
    },
    地图: {
      当前区域: DefaultData.地图.当前区域,
      当前区域文案: DefaultData.地图.当前区域文案,
      已发现地区: buildDiscoveredRegions(DefaultData.地图.当前区域, DefaultData.地图.当前区域文案),
    },
  });
}

async function getCurrentWorldbookName() {
  const worldbooks = getCharWorldbookNames('current');
  return worldbooks.primary;
}

export async function updateInitvarWorldbookEntry(state: ReturnType<typeof createOpeningState>) {
  const worldbookName = await getCurrentWorldbookName();
  if (!worldbookName) {
    throw new Error('当前角色未绑定世界书，无法写回 initvar');
  }

  const nextContent = YAML.stringify(state).trim();
  const worldbook = await getWorldbook(worldbookName);

  if (!worldbook.some(entry => entry.name === '[initvar]变量初始化勿开')) {
    await createWorldbookEntries(
      worldbookName,
      [
        {
          name: '[initvar]变量初始化勿开',
          enabled: false,
          strategy: {
            type: 'constant',
            keys: [],
            keys_secondary: { logic: 'and_any', keys: [] },
            scan_depth: 'same_as_global',
          },
          position: {
            type: 'before_character_definition',
            role: 'system',
            depth: 0,
            order: 14720,
          },
          content: nextContent,
          probability: 100,
          recursion: {
            prevent_incoming: true,
            prevent_outgoing: true,
            delay_until: null,
          },
          effect: {
            sticky: null,
            cooldown: null,
            delay: null,
          },
        },
      ],
      { render: 'immediate' },
    );
    return;
  }

  await updateWorldbookWith(
    worldbookName,
    worldbook =>
      worldbook.map(entry =>
        entry.name === '[initvar]变量初始化勿开' ? { ...entry, content: nextContent } : entry,
      ),
    { render: 'immediate' },
  );
}

export function buildOpeningStoryMessage(state: ReturnType<typeof createOpeningState>) {
  const options = state.地点.候选动作.map(action => action.标签);
  const maintext = `${state.主角.姓名}以“${state.主角.身份}”的身份抵达${state.地点.所属城镇}，在${state.地点.名称}短暂停步。${state.地图.当前区域文案}先一步映入眼帘，而${state.主角.心情文本}让她没有急着暴露底牌。她身上还带着 ${state.主角.金钱} 枚钱币、${state.主角.体力} 点体力与一份尚未展开的欲望波动，眼下最重要的是先摸清这座城镇最值得接近的人和地方。`;
  const sum = `${state.主角.姓名}抵达${state.地点.所属城镇}，在${state.地点.名称}准备展开第一轮探索。`;

  return buildAssistantMessage({
    maintext,
    options,
    sum,
  });
}

export async function createOpeningStoryMessage(state: ReturnType<typeof createOpeningState>) {
  const openingMessage = buildOpeningStoryMessage(state);
  const lastMessageId = getLastMessageId();
  const seed = {
    ...getLatestMvuData(),
    stat_data: _.cloneDeep(state),
  };
  const openingMessageId = lastMessageId + 1;
  const sessionHostMessageId = lastMessageId + 2;

  await createChatMessages(
    [
      {
        role: 'assistant',
        message: openingMessage,
        data: seed,
        is_hidden: true,
      },
      {
        role: 'assistant',
        message: SESSION_HOST_MARKER,
        data: seed,
      },
    ],
    { refresh: 'none' },
  );

  await Mvu.replaceMvuData(seed, { type: 'message', message_id: openingMessageId });
  await Mvu.replaceMvuData(seed, { type: 'message', message_id: sessionHostMessageId });
  await ensureLatestSessionHostAnchor();

  return openingMessage;
}

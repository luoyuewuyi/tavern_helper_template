import { DefaultData, normalizeStateData } from '../../schema';
import { NarrativeMessage, WestFantasyState } from '../types';
import { isSessionHostAnchorMessage, parseAssistantMessage, parseUserDisplayMessage } from './messageParser';

function buildFallbackMvuData() {
  return {
    initialized_lorebooks: {},
    stat_data: _.cloneDeep(DefaultData),
  } as Mvu.MvuData;
}

export function createNormalizedMvuData(source = getLatestMvuData()) {
  const next = _.cloneDeep(source);
  next.stat_data = normalizeStateData(next.stat_data);
  return next;
}

export function getLatestMvuData() {
  try {
    const latest = Mvu.getMvuData({ type: 'message', message_id: 'latest' });
    if (_.isPlainObject(latest)) {
      return _.cloneDeep(latest);
    }
  } catch {
    //
  }

  return buildFallbackMvuData();
}

export function readLatestState() {
  return createNormalizedMvuData().stat_data as WestFantasyState;
}

export function readNarrativeMessages() {
  const lastMessageId = getLastMessageId();
  if (lastMessageId < 0) {
    return [] as NarrativeMessage[];
  }

  return getChatMessages(`0-${lastMessageId}`, {
    hide_state: 'all',
    role: 'all',
  })
    .filter(
      message =>
        (message.role === 'assistant' || message.role === 'user') && !isSessionHostAnchorMessage(message.message),
    )
    .map(message => {
      if (message.role === 'assistant') {
        const parsed = parseAssistantMessage(message.message);
        return {
          id: message.message_id,
          role: 'assistant' as const,
          display: parsed.maintext,
          raw: message.message,
          options: parsed.options,
          sum: parsed.sum,
        };
      }

      return {
        id: message.message_id,
        role: 'user' as const,
        display: parseUserDisplayMessage(message.message),
        raw: message.message,
        options: [],
        sum: null,
      };
    });
}

export async function patchLatestState(mutator: (draft: WestFantasyState) => void) {
  const next = createNormalizedMvuData();
  const draft = _.cloneDeep(next.stat_data) as WestFantasyState;

  mutator(draft);
  next.stat_data = normalizeStateData(draft);

  await Mvu.replaceMvuData(next, { type: 'message', message_id: 'latest' });
  return next.stat_data as WestFantasyState;
}

export async function repairLatestMvuData() {
  if (getLastMessageId() < 0) {
    return _.cloneDeep(DefaultData);
  }

  const latest = getLatestMvuData();
  const normalized = createNormalizedMvuData(latest);

  if (!_.isEqual(latest.stat_data, normalized.stat_data)) {
    await Mvu.replaceMvuData(normalized, { type: 'message', message_id: 'latest' });
  }

  return normalized.stat_data as WestFantasyState;
}

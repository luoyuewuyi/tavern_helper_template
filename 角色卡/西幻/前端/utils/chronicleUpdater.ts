import { isSessionHostAnchorMessage, parseAssistantMessage } from './messageParser';

const CHRONICLE_ENTRY_NAME = '编年史';

function buildChronicleEntry() {
  return {
    name: CHRONICLE_ENTRY_NAME,
    enabled: true,
    strategy: {
      type: 'constant' as const,
      keys: [],
      keys_secondary: { logic: 'and_any' as const, keys: [] },
      scan_depth: 'same_as_global' as const,
    },
    position: {
      type: 'at_depth' as const,
      role: 'system' as const,
      depth: 2,
      order: 14720,
    },
    content: '1. 冒险尚未开始。',
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
  };
}

async function getCurrentWorldbookName() {
  const worldbooks = getCharWorldbookNames('current');
  return worldbooks.primary;
}

async function ensureChronicleEntry(worldbookName: string) {
  const worldbook = await getWorldbook(worldbookName);
  if (worldbook.some(entry => entry.name === CHRONICLE_ENTRY_NAME)) {
    return;
  }

  await createWorldbookEntries(worldbookName, [buildChronicleEntry()], { render: 'immediate' });
}

function rewriteChronicle(content: string, floor: number, sum: string) {
  const lines = content
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .filter(line => {
      const match = line.match(/^(\d+)\.\s+/);
      return !match || Number(match[1]) < floor;
    });

  lines.push(`${floor}. ${sum}`);
  return lines.join('\n');
}

export async function checkAndUpdateChronicle(limitFloor = getLastMessageId()) {
  const worldbookName = await getCurrentWorldbookName();
  if (!worldbookName || limitFloor < 1) {
    return false;
  }

  await ensureChronicleEntry(worldbookName);

  const assistantMessages = getChatMessages(`1-${limitFloor}`, {
    role: 'assistant',
    hide_state: 'all',
  });

  const latestSummary = [...assistantMessages]
    .reverse()
    .filter(message => !isSessionHostAnchorMessage(message.message))
    .map(message => ({
      floor: message.message_id,
      sum: parseAssistantMessage(message.message).sum,
    }))
    .find(item => item.sum);

  if (!latestSummary?.sum) {
    return false;
  }

  await updateWorldbookWith(
    worldbookName,
    worldbook =>
      worldbook.map(entry =>
        entry.name === CHRONICLE_ENTRY_NAME
          ? { ...entry, content: rewriteChronicle(entry.content ?? '', latestSummary.floor, latestSummary.sum) }
          : entry,
      ),
    { render: 'immediate' },
  );

  return true;
}

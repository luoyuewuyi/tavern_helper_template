import 'https://testingcf.jsdelivr.net/gh/MagicalAstrogy/MagVarUpdate/artifact/bundle.js';

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

const keywordGroups = {
  出身: [
    { label: '世家门阀', words: ['世家', '门阀', '高门', '宗族', '士族'] },
    { label: '寒门游士', words: ['寒门', '布衣', '游士', '流民', '漂泊'] },
    { label: '军旅行伍', words: ['军', '校尉', '部曲', '士卒', '骑兵', '行伍'] },
    { label: '方术异人', words: ['方士', '术', '卜', '星', '异人', '祭', '天赋'] },
    { label: '商旅游说', words: ['商', '行脚', '客商', '游说', '说客'] },
    { label: '官场掾吏', words: ['官', '主簿', '掾', '侍中', '郡吏', '县吏'] },
  ],
  手段: [
    { label: '暗线操盘', words: ['布局', '借刀', '潜伏', '算计', '诡', '谋'] },
    { label: '仁义怀柔', words: ['仁', '义', '救', '庇护', '宽厚', '安抚'] },
    { label: '正面压进', words: ['强攻', '刚烈', '正面', '硬碰', '杀伐', '冲阵'] },
    { label: '审势缓进', words: ['谨慎', '稳', '忍', '缓', '审势', '观望'] },
    { label: '游说连横', words: ['游说', '合纵', '连横', '谈判', '盟约', '说服'] },
  ],
  外显: [
    { label: '锋芒初露', words: ['狂', '傲', '锋', '烈', '强势'] },
    { label: '深藏不露', words: ['藏', '低调', '隐', '伪装', '谨慎'] },
    { label: '异士之相', words: ['异', '怪', '天命', '星象', '命格'] },
  ],
};

const figureFactionMap: Record<string, (typeof factionNames)[number]> = {
  刘备: '刘备集团',
  陈曦: '刘备集团',
  关羽: '刘备集团',
  曹操: '曹操集团',
  荀彧: '曹操集团',
  郭嘉: '曹操集团',
  孙策: '孙吴',
  周瑜: '孙吴',
  刘协: '汉室',
  袁谭: '河北袁系残部',
  审配: '河北袁系残部',
  刘表: '荆益地方',
  刘璋: '荆益地方',
  马腾: '雍凉西北',
  韩遂: '雍凉西北',
  陈群: '世家门阀',
};

const factionRegionMap: Record<(typeof factionNames)[number], { name: string; desc: string }> = {
  刘备集团: { name: '河北北线', desc: '刘备战后接盘与北线军政收束' },
  曹操集团: { name: '许都中枢', desc: '曹操集团正在通过朝局与耳目重建节奏' },
  孙吴: { name: '江东外盘', desc: '孙吴持续观察中原风向并评估介入窗口' },
  汉室: { name: '汉廷朝局', desc: '汉室会尝试把新变量纳入名分与诏令体系' },
  河北袁系残部: { name: '冀青残脉', desc: '袁系旧部与败军仍在寻找翻盘或自保之路' },
  荆益地方: { name: '荆益观局', desc: '荆州与益州在观望中原重新站队的速度' },
  雍凉西北: { name: '雍凉边线', desc: '边地军需、交易与外援路线具备可利用价值' },
  世家门阀: { name: '士林门第', desc: '门阀网络会优先通过署掾、宴饮和婚盟试探你' },
};

const clamp = (value: unknown, min = 0, max = 100) => _.clamp(_.toNumber(value) || 0, min, max);
const trimRecord = <T extends Record<string, unknown>>(value: T | undefined, limit: number) =>
  _(value ?? {})
    .entries()
    .takeRight(limit)
    .fromPairs()
    .value() as T;
const summarizeIdentity = (value: string) => {
  const text = _.trim(value || '待玩家自由书写');
  return text.length > 34 ? `${text.slice(0, 34)}...` : text;
};

const pickKeywordLabel = (text: string, group: Array<{ label: string; words: string[] }>, fallback: string) => {
  for (const item of group) {
    if (item.words.some(word => text.includes(word))) {
      return item.label;
    }
  }
  return fallback;
};

const getTopFaction = (factions: Record<string, any>, score: (value: any) => number) =>
  _(factions)
    .entries()
    .maxBy(([, value]) => score(value))
    .value();

const getPlayerStage = (data: Record<string, any>) => {
  const publicFame = clamp(_.get(data, '玩家.公开名望'));
  const hiddenCapital =
    clamp(_.get(data, '玩家.隐秘资本.情报')) +
    clamp(_.get(data, '玩家.隐秘资本.人脉')) +
    clamp(_.get(data, '玩家.隐秘资本.资源')) +
    clamp(_.get(data, '玩家.隐秘资本.武力')) +
    clamp(_.get(data, '玩家.隐秘资本.天命因子'));
  const foundation =
    clamp(_.get(data, '玩家.个人底盘.情报网')) +
    clamp(_.get(data, '玩家.个人底盘.可调用人手')) +
    clamp(_.get(data, '玩家.个人底盘.资金调度')) +
    clamp(_.get(data, '玩家.个人底盘.据点')) +
    clamp(_.get(data, '玩家.个人底盘.盟约筹码'));
  const actionCount = Object.keys(_.get(data, '玩家.行动痕迹', {})).length;
  const stageScore = publicFame * 0.35 + hiddenCapital * 0.1 + foundation * 0.22 + actionCount * 6;

  if (stageScore >= 88) {
    return '一方异数';
  }
  if (stageScore >= 66) {
    return '棋局暗钉';
  }
  if (stageScore >= 46) {
    return '可借之人';
  }
  if (stageScore >= 28) {
    return '立足棋盘';
  }
  return '乱局微尘';
};

const updateDerivedTags = (data: Record<string, any>) => {
  const player = _.get(data, '玩家', {});
  const factions = _.get(data, '势力', {});
  const fullText = [player.身份自述, player.天赋, player.性格, player.行事风格, player.能力侧重].join(' ');
  const birth = pickKeywordLabel(fullText, keywordGroups.出身, '游士未明');
  const method = pickKeywordLabel(fullText, keywordGroups.手段, '观势试探');
  const outward = pickKeywordLabel(fullText, keywordGroups.外显, '待显');
  const leverageFaction = getTopFaction(
    factions,
    value => clamp(value?.可借势度) + clamp(value?.依赖度) - clamp(value?.戒备度),
  );
  const threatFaction = getTopFaction(factions, value => clamp(value?.戒备度) + clamp(value?.关注度));
  const publicFame = clamp(player.公开名望);
  const hiddenCapital =
    clamp(_.get(player, '隐秘资本.情报')) +
    clamp(_.get(player, '隐秘资本.人脉')) +
    clamp(_.get(player, '隐秘资本.资源')) +
    clamp(_.get(player, '隐秘资本.武力')) +
    clamp(_.get(player, '隐秘资本.天命因子'));
  let riskProfile = '待观察';
  if (publicFame >= 65) {
    riskProfile = '锋芒在外';
  } else if (hiddenCapital >= 220 && publicFame <= 30) {
    riskProfile = '潜行异数';
  } else if ((threatFaction?.[1]?.戒备度 ?? 0) >= 70) {
    riskProfile = '被重点盯防';
  } else if ((leverageFaction?.[1]?.可借势度 ?? 0) >= 70) {
    riskProfile = '各方争取';
  }

  const actionCount = Object.keys(_.get(player, '行动痕迹', {})).length;
  const pace = actionCount >= 6 ? '连锁推进' : actionCount >= 3 ? '稳步试探' : '试探开局';
  const leverageName = leverageFaction?.[0] ?? '未显';
  const threatName = threatFaction?.[0] ?? '未显';

  _.set(data, '_派生.身份标签.出身', birth);
  _.set(data, '_派生.身份标签.手段', method);
  _.set(data, '_派生.身份标签.外显', outward);
  _.set(data, '_派生.阵营偏向', leverageName);
  _.set(data, '_派生.权谋风格', method);
  _.set(data, '_派生.风险画像', riskProfile);
  _.set(data, '_派生.行动节奏', pace);
  _.set(
    data,
    '_派生.影响力摘要',
    `${_.get(data, '玩家.发展阶段', '乱局微尘')} / ${leverageName}最容易被借势，${threatName}对你最警惕`,
  );
  _.set(data, '_派生.身份摘要', summarizeIdentity(player.身份自述));

  const riskZones: Record<string, string> = {};
  _(factions)
    .entries()
    .orderBy(([, value]) => clamp(value?.戒备度) + clamp(value?.关注度), 'desc')
    .take(4)
    .forEach(([name, value]) => {
      riskZones[name] = `${clamp(value?.戒备度)}/${clamp(value?.关注度)}`;
    });
  _.set(data, '_派生.风险热区', riskZones);
};

const syncLongTermPlayer = (data: Record<string, any>) => {
  const player = _.get(data, '玩家', {});
  ['情报网', '可调用人手', '资金调度', '据点', '盟约筹码'].forEach(field => {
    _.set(player, `个人底盘.${field}`, clamp(_.get(player, `个人底盘.${field}`)));
  });

  const stage = getPlayerStage(data);
  _.set(player, '发展阶段', stage);
  _.set(player, '阵营履历', trimRecord(_.get(player, '阵营履历', {}), 8));
  _.set(player, '阶段履历', trimRecord(_.get(player, '阶段履历', {}), 12));
};

const syncFigureViews = (data: Record<string, any>, oldData: Record<string, any>) => {
  const factions = _.get(data, '势力', {});
  const identitySummary = _.get(data, '_派生.身份摘要', '未明异数');
  const method = _.get(data, '_派生.权谋风格', '观势试探');

  Object.entries(_.get(data, '核心人物', {})).forEach(([name, figure]) => {
    const factionName = figureFactionMap[name] ?? _.get(figure, '所属势力', '刘备集团');
    const faction = _.get(factions, factionName, {});
    const oldHeat = clamp(_.get(oldData, `核心人物.${name}.关系热度`, _.get(figure, '关系热度', 20)));
    const oldNotice = clamp(_.get(oldData, `核心人物.${name}.注意度`, _.get(figure, '注意度', 20)));
    const targetHeat = clamp(
      Math.round(35 + clamp(faction.依赖度) * 0.35 + clamp(faction.可借势度) * 0.2 - clamp(faction.戒备度) * 0.15),
    );
    const targetNotice = clamp(
      Math.round(
        clamp(faction.关注度) * 0.65 + clamp(faction.戒备度) * 0.2 + clamp(_.get(data, '玩家.公开名望')) * 0.15,
      ),
    );
    const nextHeat = _.clamp(targetHeat, oldHeat - 12, oldHeat + 12);
    const nextNotice = _.clamp(targetNotice, oldNotice - 18, oldNotice + 18);
    const threatScore = clamp(faction.戒备度) + clamp(faction.关注度) - clamp(faction.依赖度);
    const riskLabel = threatScore >= 120 ? '极高' : threatScore >= 90 ? '高' : threatScore >= 60 ? '中' : '低';
    const contactLevel =
      nextNotice >= 75
        ? '可入核心局'
        : nextNotice >= 58
          ? '可直接会面'
          : nextNotice >= 42
            ? '可传话试探'
            : nextNotice >= 24
              ? '留名建档'
              : '只闻其名';

    _.set(data, `核心人物.${name}.所属势力`, factionName);
    _.set(data, `核心人物.${name}.接触层级`, contactLevel);
    _.set(data, `核心人物.${name}.关系热度`, nextHeat);
    _.set(data, `核心人物.${name}.注意度`, nextNotice);
    _.set(
      data,
      `核心人物.${name}.当前判断`,
      `${_.get(faction, '态度', '观望')} / ${_.get(faction, '当前判断', '暂无定评')}`,
    );
    _.set(data, `核心人物.${name}.风险判定`, riskLabel);
    _.set(
      data,
      `核心人物.${name}.对user认知`,
      `${identitySummary}；偏向${method}，当前被视作${riskLabel === '低' ? '可接触变量' : '高潜在变数'}`,
    );
    _.set(data, `核心人物.${name}.可触发联动`, trimRecord(_.get(data, `核心人物.${name}.可触发联动`, {}), 6));
    _.set(data, `核心人物.${name}.已受影响事件`, trimRecord(_.get(data, `核心人物.${name}.已受影响事件`, {}), 6));
  });
};

const syncPlayerExposure = (data: Record<string, any>) => {
  const attention: Record<string, string> = {};
  const suspicion: Record<string, string> = {};
  const dread: Record<string, string> = {};

  Object.entries(_.get(data, '势力', {})).forEach(([name, value]) => {
    const focus = clamp(_.get(value, '关注度'));
    const guard = clamp(_.get(value, '戒备度'));
    const leverage = clamp(_.get(value, '可借势度'));
    const reliance = clamp(_.get(value, '依赖度'));
    if (focus >= 45) {
      attention[name] = `关注度 ${focus}`;
    }
    if (guard >= 55) {
      suspicion[name] = `戒备度 ${guard}`;
    }
    if (guard >= 70 || (leverage >= 65 && reliance >= 45)) {
      dread[name] = `视为高价值且难控变量`;
    }
  });

  Object.entries(_.get(data, '核心人物', {})).forEach(([name, value]) => {
    const notice = clamp(_.get(value, '注意度'));
    const risk = `${_.get(value, '风险判定', '低')}`;
    if (notice >= 58) {
      attention[name] = `注意度 ${notice}`;
    }
    if (risk === '高' || risk === '极高') {
      suspicion[name] = `${risk}风险`;
    }
    if (risk === '极高') {
      dread[name] = '已进入其底线判断';
    }
  });

  _.set(data, '玩家.被谁注意', trimRecord(attention, 8));
  _.set(data, '玩家.被谁怀疑', trimRecord(suspicion, 8));
  _.set(data, '玩家.被谁忌惮', trimRecord(dread, 8));
  _.set(data, '玩家.行动痕迹', trimRecord(_.get(data, '玩家.行动痕迹', {}), 10));
};

const syncFactionHistory = (data: Record<string, any>) => {
  const history = _.get(data, '玩家.阵营履历', {});
  Object.entries(_.get(data, '势力', {})).forEach(([name, value]) => {
    const contactLevel =
      clamp(_.get(value, '渗透度')) >= 70
        ? '已入核心'
        : clamp(_.get(value, '渗透度')) >= 45
          ? '已有稳定触角'
          : clamp(_.get(value, '关注度')) >= 35
            ? '建立观察接触'
            : '只闻其名';
    _.set(history, `${name}.接触层级`, contactLevel);
    _.set(history, `${name}.恩义`, clamp(_.get(history, `${name}.恩义`)));
    _.set(history, `${name}.嫌隙`, clamp(_.get(history, `${name}.嫌隙`)));
    _.set(history, `${name}.渗透成果`, _.get(value, '牵引筹码', '暂无'));
  });
  _.set(data, '玩家.阵营履历', history);
};

const syncButterflyChains = (data: Record<string, any>) => {
  const active = _.get(data, '蝴蝶效应.活跃链路', {});
  const resolved = { ..._.get(data, '蝴蝶效应.已兑现链路', {}) } as Record<string, unknown>;
  const nextActive: Record<string, unknown> = {};

  Object.entries(active).forEach(([name, value]) => {
    const heat = clamp(_.get(value, '热度'));
    const settled = `${_.get(value, '已兑现后果', '尚未兑现')}` !== '尚未兑现';
    if (settled || heat <= 15) {
      resolved[name] = value;
      return;
    }
    nextActive[name] = value;
  });

  _.set(data, '蝴蝶效应.活跃链路', trimRecord(nextActive, 8));
  _.set(data, '蝴蝶效应.已兑现链路', trimRecord(resolved, 12));

  const rippleText = _(nextActive)
    .entries()
    .orderBy(([, value]) => clamp(_.get(value, '热度')), 'desc')
    .take(2)
    .map(([name, value]) => `${name}:${_.get(value, '直接影响', '暂无')}`)
    .join(' / ');

  _.set(data, '蝴蝶效应.近期涟漪', rippleText || '尚无足以改写原轨迹的蝴蝶涟漪');
};

const syncWorldView = (data: Record<string, any>, oldData: Record<string, any>) => {
  const factions = _.get(data, '势力', {});
  const leverageFaction = getTopFaction(factions, value => clamp(value?.可借势度));
  const guardFaction = getTopFaction(factions, value => clamp(value?.戒备度));
  const attentionFaction = getTopFaction(factions, value => clamp(value?.关注度));
  const activeHeat =
    _(data)
      .get('蝴蝶效应.活跃链路', {})
      .values()
      .map(item => clamp(_.get(item, '热度')))
      .mean() || 0;
  const avgGuard =
    _(factions)
      .values()
      .map(item => clamp(_.get(item, '戒备度')))
      .mean() || 0;
  const avgAttention =
    _(factions)
      .values()
      .map(item => clamp(_.get(item, '关注度')))
      .mean() || 0;
  const oldWave = clamp(_.get(oldData, '世界.天命波动', _.get(data, '世界.天命波动', 60)));
  const oldAftershock = clamp(_.get(oldData, '世界.战后余震', _.get(data, '世界.战后余震', 75)));
  const targetWave = clamp(
    Math.round(
      avgAttention * 0.35 + (leverageFaction ? clamp(leverageFaction[1].可借势度) * 0.25 : 0) + activeHeat * 0.4,
    ),
  );
  const targetAftershock = clamp(Math.round(avgGuard * 0.55 + avgAttention * 0.25 + activeHeat * 0.2));

  _.set(data, '世界.天命波动', _.clamp(targetWave, oldWave - 8, oldWave + 8));
  _.set(data, '世界.战后余震', _.clamp(targetAftershock, oldAftershock - 10, oldAftershock + 10));
  _.set(
    data,
    '世界.天下风向',
    `${leverageFaction?.[0] ?? '无'}最具可借势空间，${guardFaction?.[0] ?? '无'}警惕最重，战后余烬仍在逼迫各方重新下注`,
  );
  _.set(
    data,
    '世界.即时机会',
    `${leverageFaction?.[0] ?? '暂无'}对你释放的可借势度最高，可围绕“${_.get(leverageFaction, '[1].当前判断', '暂无定评')}”切入`,
  );
  _.set(
    data,
    '世界.即时风险',
    `${guardFaction?.[0] ?? '暂无'}的戒备与${attentionFaction?.[0] ?? '无'}的关注正在叠加，继续试探会更容易触发反制`,
  );
  const hotspots: Record<string, { 热度: number; 说明: string; 牵涉势力: string }> = {};
  _(factions)
    .entries()
    .orderBy(([, value]) => clamp(value?.关注度) + clamp(value?.戒备度) + clamp(value?.可借势度) * 0.5, 'desc')
    .take(4)
    .forEach(([name, value]) => {
      const region = factionRegionMap[name as keyof typeof factionRegionMap];
      hotspots[region.name] = {
        热度: clamp(
          Math.round(clamp(value?.关注度) * 0.45 + clamp(value?.戒备度) * 0.3 + clamp(value?.可借势度) * 0.25),
        ),
        说明: region.desc,
        牵涉势力: name,
      };
    });
  _.set(data, '世界.地缘热区', trimRecord(hotspots, 6));
  _.set(data, '世界.公开大事记', trimRecord(_.get(data, '世界.公开大事记', {}), 10));
};

$(async () => {
  await waitGlobalInitialized('Mvu');

  eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (variables, oldVariables) => {
    const data = _.get(variables, 'stat_data');
    const oldData = _.get(oldVariables, 'stat_data', {});
    if (_.isNil(data)) {
      return;
    }

    Object.values(_.get(data, '势力', {})).forEach((value: any) => {
      _.set(value, '关注度', clamp(_.get(value, '关注度')));
      _.set(value, '依赖度', clamp(_.get(value, '依赖度')));
      _.set(value, '戒备度', clamp(_.get(value, '戒备度')));
      _.set(value, '可借势度', clamp(_.get(value, '可借势度')));
      _.set(value, '渗透度', clamp(_.get(value, '渗透度')));
      _.set(value, '绑定度', clamp(_.get(value, '绑定度')));
      _.set(value, '已受影响事件', trimRecord(_.get(value, '已受影响事件', {}), 6));
    });

    syncLongTermPlayer(data);
    updateDerivedTags(data);
    syncFigureViews(data, oldData);
    syncPlayerExposure(data);
    syncFactionHistory(data);
    syncButterflyChains(data);
    syncWorldView(data, oldData);
  });
});

const deriveStage = (value: number) =>
  value < 20 ? '疏冷观察' : value < 40 ? '藏尾试探' : value < 60 ? '软化靠近' : value < 80 ? '缠尾依恋' : '眷巢贴身';

const seasonActivityMap = {
  春: '春困',
  夏: '盛夏活跃',
  秋: '秋缓',
  冬: '冬日寻暖',
} as const;

const contactMap = {
  疏冷观察: '不可触碰',
  藏尾试探: '可近身',
  软化靠近: '可牵手',
  缠尾依恋: '可依偎',
  眷巢贴身: '可缠抱',
} as const;

const deriveState = (stage: string, season: string, time: string, molt: string) => {
  if (season === '冬' && time === '深夜') {
    return '冬眠贴贴';
  }
  if (stage === '疏冷观察') {
    return '警惕';
  }
  if (stage === '藏尾试探') {
    return '试探';
  }
  if (stage === '软化靠近') {
    return '依恋';
  }
  if (stage === '缠尾依恋') {
    return molt === '蜕皮前' ? '依恋' : '缠宠';
  }
  return '冬眠贴贴';
};

$(async () => {
  await waitGlobalInitialized('Mvu');

  eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (variables, old_variables) => {
    const data = _.get(variables, 'stat_data');
    if (_.isNil(data)) {
      return;
    }

    const old_affection = _.clamp(_.toNumber(_.get(old_variables, 'stat_data.白荔.好感度', 0)), 0, 100);
    const raw_affection = _.clamp(_.toNumber(_.get(data, '白荔.好感度', 0)), 0, 100);
    const affection =
      raw_affection > old_affection
        ? _.clamp(raw_affection, old_affection, old_affection + 2)
        : _.clamp(raw_affection, old_affection - 6, old_affection);
    const season = _.get(data, '世界.季节', '春');
    const time = _.get(data, '世界.时段', '晨间');
    const molt = _.get(data, '白荔.蜕皮阶段', '稳定期');
    const stage = deriveStage(affection);

    _.set(data, '白荔.好感度', affection);
    _.set(data, '白荔.$好感阶段', stage);
    _.set(data, '白荔.季节活性', seasonActivityMap[season as keyof typeof seasonActivityMap] ?? '春困');
    _.set(data, '白荔.亲密接触', contactMap[stage as keyof typeof contactMap] ?? '可近身');
    _.set(data, '白荔.当前状态', deriveState(stage, season, time, molt));
    _.update(data, '白荔.收藏', value => _(value ?? {}).entries().takeRight(8).fromPairs().value());
  });
});

import { variableOption } from '../context';

export type StatData = Record<string, unknown>;

export async function readInitialStatData(): Promise<StatData> {
  await waitGlobalInitialized('Mvu');
  const initialData = Mvu.getMvuData(variableOption);
  const statData = _.cloneDeep(_.get(initialData, 'stat_data'));

  if (!_.isPlainObject(statData)) {
    throw new Error('0 层没有可用的 stat_data；检查禁用的 [initvar]、Schema 注册和 MVU 引擎。');
  }
  return statData as StatData;
}

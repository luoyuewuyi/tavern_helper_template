import { Schema } from '../../schema';

// 属性加点和升级逻辑脚本
// 监听变量更新事件，处理升级时属性点分配和资源上限联动
$(() => {
  errorCatched(async () => {
    await waitGlobalInitialized('Mvu');

    eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (new_variables: any, old_variables: any) => {
      const new_data = Schema.parse(_.get(new_variables, 'stat_data'));
      const old_data = Schema.parse(_.get(old_variables, 'stat_data'));

      // 检测升级：经验值达到上限
      if (new_data.主角.经验值 >= new_data.主角.经验上限) {
        // 升级处理
        const overflow = new_data.主角.经验值 - new_data.主角.经验上限;
        _.set(new_variables, 'stat_data.主角.等级', new_data.主角.等级 + 1);
        _.set(new_variables, 'stat_data.主角.经验值', Math.max(overflow, 0));
        _.set(new_variables, 'stat_data.主角.经验上限', Math.ceil(new_data.主角.经验上限 * 1.5));
        _.set(new_variables, 'stat_data.主角.可用属性点', new_data.主角.可用属性点 + 3);

        toastr.success(`升级了！当前等级: ${new_data.主角.等级 + 1}，获得3点属性点`);
      }

      // 体质变化时同步HP上限
      const new_con = new_data.主角.六维属性.体质?.数值 ?? 0;
      const old_con = old_data.主角.六维属性.体质?.数值 ?? 0;
      if (new_con !== old_con) {
        const hp_change = (new_con - old_con) * 5;
        _.update(new_variables, 'stat_data.主角.HP上限', (v: number) => Math.max(v + hp_change, 1));
        // 如果是增加体质，同步恢复HP
        if (hp_change > 0) {
          _.update(new_variables, 'stat_data.主角.HP', (v: number) => v + hp_change);
        }
      }

      // 智力变化时同步法力上限
      const new_int = new_data.主角.六维属性.智力?.数值 ?? 0;
      const old_int = old_data.主角.六维属性.智力?.数值 ?? 0;
      if (new_int !== old_int) {
        const mp_change = (new_int - old_int) * 3;
        _.update(new_variables, 'stat_data.主角.法力上限', (v: number) => Math.max(v + mp_change, 1));
        if (mp_change > 0) {
          _.update(new_variables, 'stat_data.主角.法力值', (v: number) => v + mp_change);
        }
      }

      // HP 不能超过上限
      const hp = _.get(new_variables, 'stat_data.主角.HP');
      const hp_max = _.get(new_variables, 'stat_data.主角.HP上限');
      if (hp > hp_max) {
        _.set(new_variables, 'stat_data.主角.HP', hp_max);
      }

      // 法力值不能超过上限
      const mp = _.get(new_variables, 'stat_data.主角.法力值');
      const mp_max = _.get(new_variables, 'stat_data.主角.法力上限');
      if (mp > mp_max) {
        _.set(new_variables, 'stat_data.主角.法力值', mp_max);
      }
    });

    console.info('[无限流] 属性加点脚本已加载');
  })();
});

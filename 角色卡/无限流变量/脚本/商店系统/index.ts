import { Schema } from '../../schema';

// 商店系统脚本
// 监听变量更新事件，处理商品库存归零清除和积分保护
$(() => {
  errorCatched(async () => {
    await waitGlobalInitialized('Mvu');

    eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (new_variables: any) => {
      const data = Schema.parse(_.get(new_variables, 'stat_data'));

      // 确保空间积分不为负数
      if (data.主角.空间积分 < 0) {
        _.set(new_variables, 'stat_data.主角.空间积分', 0);
      }

      // 清除库存为0的商品（schema 的 transform 已处理，此处做双重保障）
      const shopItems = _.get(new_variables, 'stat_data.商店.商品列表');
      if (shopItems && typeof shopItems === 'object') {
        Object.entries(shopItems).forEach(([name, item]: [string, any]) => {
          if (item && item.库存 <= 0) {
            _.unset(new_variables, `stat_data.商店.商品列表.${name}`);
          }
        });
      }

      // 清除数量为0的背包物品（schema 的 transform 已处理，此处做双重保障）
      const backpack = _.get(new_variables, 'stat_data.主角.背包');
      if (backpack && typeof backpack === 'object') {
        Object.entries(backpack).forEach(([name, item]: [string, any]) => {
          if (item && item.数量 <= 0) {
            _.unset(new_variables, `stat_data.主角.背包.${name}`);
          }
        });
      }
    });

    console.info('[无限流] 商店系统脚本已加载');
  })();
});

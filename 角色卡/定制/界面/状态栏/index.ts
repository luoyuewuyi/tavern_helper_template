import { waitUntil } from 'async-wait-until';
import App from './App.vue';
import './global.css';

$(async () => {
  await waitGlobalInitialized('Mvu');
  await waitUntil(() => _.has(getVariables({ type: 'message' }), 'stat_data'));

  // 监听变量更新，自动将当前NPC数据同步到角色库
  eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, variables => {
    const npc = _.get(variables, 'stat_data.当前NPC');
    if (npc && npc.姓名 && npc.姓名 !== '无') {
      // 以姓名为键，将当前NPC完整数据存入角色库
      _.set(variables, `stat_data.角色库.${npc.姓名}`, _.cloneDeep(npc));
    }
  });

  createApp(App).use(createPinia()).mount('#app');
});

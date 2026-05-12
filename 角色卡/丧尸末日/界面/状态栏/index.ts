import { waitUntil } from 'async-wait-until';
import App from './App.vue';
import './global.css';
import { useMessageQueue } from './useMessageQueue';

$(async () => {
  await waitGlobalInitialized('Mvu');
  await waitUntil(() => _.has(getVariables({ type: 'message' }), 'stat_data'));

  const app = createApp(App).use(createPinia());
  app.mount('#app');

  // 初始化消息队列监听
  const { setupMessageQueueListener } = useMessageQueue();
  setupMessageQueueListener();
});

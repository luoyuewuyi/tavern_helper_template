import { waitUntil } from 'async-wait-until';
import App from './App.vue';
import './global.scss';

$(async () => {
  // 等待消息渲染完成，解析当前楼层消息中的状态数据
  await waitUntil(() => {
    const msg_id = getCurrentMessageId();
    if (msg_id === undefined) return false;
    const msgs = getChatMessages(msg_id);
    return msgs && msgs.length > 0 && msgs[0].message?.includes('<status_data>');
  }, { timeout: 10000 });

  createApp(App).use(createPinia()).mount('#app');
});

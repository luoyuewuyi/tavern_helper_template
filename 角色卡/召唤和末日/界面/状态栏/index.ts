import { waitUntil } from 'async-wait-until';
import App from './App.vue';
import './global.css';

function resolveMessageVariables() {
  const messageId = getCurrentMessageId();
  if (messageId === undefined || messageId === 'latest') {
    return getVariables({ type: 'message' });
  }
  return getVariables({ type: 'message', message_id: messageId });
}

$(async () => {
  await waitGlobalInitialized('Mvu');
  await waitUntil(() => _.has(resolveMessageVariables(), 'stat_data'));

  createApp(App).use(createPinia()).mount('#app');
});

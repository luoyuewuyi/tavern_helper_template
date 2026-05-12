import { waitUntil } from 'async-wait-until';
import { createApp } from 'vue';
import App from './App.vue';
import './global.css';

$(async () => {
  await waitUntil(() => typeof getCurrentMessageId === 'function' && typeof getChatMessages === 'function');
  createApp(App).mount('#app');
});

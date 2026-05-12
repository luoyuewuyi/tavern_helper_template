import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';

$(async () => {
  await waitGlobalInitialized('Mvu');
  createApp(App).use(createPinia()).mount('#app');
});

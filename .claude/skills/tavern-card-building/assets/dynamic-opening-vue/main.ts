import App from './App.vue';
import { installIframeHeightSync } from './lifecycle/iframe-height';
import './global.css';

$(
  errorCatched(async () => {
    await waitGlobalInitialized('Mvu');

    const app = createApp(App).use(createPinia());
    app.mount('#app');
    await nextTick();

    const heightSync = installIframeHeightSync();
    $(window).one('pagehide', () => {
      heightSync.destroy();
      app.unmount();
    });
  }),
);

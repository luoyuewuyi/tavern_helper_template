import { waitUntil } from 'async-wait-until';
import App from './App.vue';
import { variableOption } from './context';
import { installIframeHeightSync } from './iframe-height';
import './global.css';

$(
  errorCatched(async () => {
    await waitGlobalInitialized('Mvu');
    await waitUntil(() => _.has(getVariables(variableOption), 'stat_data'));

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

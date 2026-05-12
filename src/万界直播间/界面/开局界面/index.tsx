import { waitUntil } from 'async-wait-until';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

$(async () => {
  await waitGlobalInitialized('Mvu');
  await waitUntil(() => _.has(getVariables({ type: 'message' }), 'stat_data'));
  createRoot(document.getElementById('root')!).render(<App />);
});

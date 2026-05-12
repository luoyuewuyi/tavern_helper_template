import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

function bootstrap() {
  console.info('[西幻前端构建]', __TAVERN_HELPER_BUILD_ID__);
  const container = document.getElementById('root');
  if (!container) {
    throw new Error('西幻前端未找到挂载节点 #root');
  }

  createRoot(container).render(<App />);
}

bootstrap();

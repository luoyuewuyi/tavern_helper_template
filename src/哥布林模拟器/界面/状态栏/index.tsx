import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import StatusPanel, { StatusData } from './StatusPanel';
import { parseIncomingStatusMessage, readInitialStatusData } from './statusData';
import '../index.css';

function App() {
  const [data, setData] = useState<StatusData | null>(null);
  useEffect(() => {
    const initialData = readInitialStatusData();
    if (initialData) setData(initialData);

    const h = (e: MessageEvent) => {
      const nextData = parseIncomingStatusMessage(e.data);
      if (nextData) setData(nextData);
    };
    window.addEventListener('message', h);

    const timer = window.setInterval(() => {
      const nextData = readInitialStatusData();
      if (nextData) {
        setData(nextData);
        window.clearInterval(timer);
      }
    }, 500);

    return () => {
      window.removeEventListener('message', h);
      window.clearInterval(timer);
    };
  }, []);
  if (!data) return <div style={{ background: '#0a0f0d', color: '#9cb38c', padding: '40px', textAlign: 'center', fontFamily: 'serif', fontSize: '14px' }}>等待状态数据...</div>;
  return <StatusPanel data={data} />;
}
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);

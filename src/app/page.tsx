'use client';

import { useState, useEffect } from 'react';
import WidgetPreview from './components/WidgetPreview';
import WidgetForm from './components/WidgetForm';

export default function Home() {
  const [widgetParams, setWidgetParams] = useState({
    username: '',
    showHeader: true,
    showCounters: true,
    photoCount: 6
  });
  const [widgetUrl, setWidgetUrl] = useState('');

  useEffect(() => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      username: widgetParams.username,
      showHeader: widgetParams.showHeader.toString(),
      showCounters: widgetParams.showCounters.toString(),
      photoCount: widgetParams.photoCount.toString()
    });
    setWidgetUrl(`${baseUrl}/widget/${widgetParams.username}?${params}`);
  }, [widgetParams]);

  const embedCode = `<iframe src="${widgetUrl}" width="100%" height="400" frameborder="0"></iframe>`;

  return (
    <main className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-8">Instagram Widget Generator</h1>
      
      <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-white shadow-md rounded-lg p-8 space-y-8 lg:space-y-0 lg:space-x-8">
        <div className="w-full lg:w-1/2 space-y-4">
          <WidgetForm widgetParams={widgetParams} setWidgetParams={setWidgetParams} />
          
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Embed Code:</h2>
            <textarea
              value={embedCode}
              readOnly
              className="p-2 border rounded w-full h-24"
            ></textarea>
            <h3 className="text-sm text-gray-500 mt-2">Just embed url:</h3>
            <textarea
              value={widgetUrl}
              readOnly
              className="p-2 border rounded w-full h-24"></textarea>
          </div>
        </div>
        
        <div className="w-full lg:w-1/2">
          <WidgetPreview widgetUrl={widgetUrl} />
        </div>
      </div>
    </main>
  );
}

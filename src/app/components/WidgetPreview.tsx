import React from 'react';

interface WidgetPreviewProps {
  widgetUrl: string;
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ widgetUrl }) => {
  return (
    <div className="w-full">
      <iframe src={widgetUrl} width="100%" height="400" frameBorder="0" className="rounded-lg shadow-lg"></iframe>
    </div>
  );
};

export default WidgetPreview;

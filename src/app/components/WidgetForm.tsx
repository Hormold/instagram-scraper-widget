import React, { useCallback, useState, useEffect } from 'react';

interface WidgetParams {
  username: string;
  showHeader: boolean;
  showCounters: boolean;
  photoCount: number;
}

interface WidgetFormProps {
  widgetParams: WidgetParams;
  setWidgetParams: React.Dispatch<React.SetStateAction<WidgetParams>>;
}

export default function WidgetForm({ widgetParams, setWidgetParams }: WidgetFormProps) {
  const [localParams, setLocalParams] = useState(widgetParams);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLocalParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSetWidgetParams = useCallback(
    debounce((newParams: WidgetParams) => setWidgetParams(newParams), 500),
    []
  );

  useEffect(() => {
    debouncedSetWidgetParams(localParams);
  }, [localParams, debouncedSetWidgetParams]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 font-medium text-gray-700">Instagram Username:</label>
        <input
          type="text"
          name="username"
          value={localParams.username}
          onChange={handleInputChange}
          className="p-2 border rounded w-full"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700">
          <input
            type="checkbox"
            name="showHeader"
            checked={localParams.showHeader}
            onChange={handleInputChange}
            className="mr-2"
          />
          Show Header
        </label>
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700">
          <input
            type="checkbox"
            name="showCounters"
            checked={localParams.showCounters}
            onChange={handleInputChange}
            className="mr-2"
          />
          Show Counters
        </label>
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700">Number of Photos:</label>
        <input
          type="number"
          name="photoCount"
          value={localParams.photoCount}
          onChange={handleInputChange}
          min="1"
          max="12"
          className="p-2 border rounded w-full"
        />
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { getFigmaEnv } from '@/lib/env';

export default function FigmaTest() {
  const [figmaData, setFigmaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { apiKey, fileKey, nodeId } = getFigmaEnv();

  useEffect(() => {
    async function fetchFigmaData() {
      if (!apiKey || !fileKey) {
        setError('Figma API key or file key is missing');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://api.figma.com/v1/files/${fileKey}?depth=1`, {
          headers: {
            'X-Figma-Token': apiKey,
          },
        });

        if (!response.ok) {
          throw new Error(`Figma API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setFigmaData(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch Figma data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    }

    fetchFigmaData();
  }, [apiKey, fileKey]);

  if (loading) return <div className="p-4">Loading Figma data...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!figmaData) return <div className="p-4">No Figma data available</div>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Figma Integration Test</h2>

      <div className="space-y-2">
        <p>
          <strong>File Name:</strong> {figmaData.name}
        </p>
        <p>
          <strong>Last Modified:</strong> {new Date(figmaData.lastModified).toLocaleString()}
        </p>
        <p>
          <strong>Version:</strong> {figmaData.version}
        </p>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-medium">Environment Variables Status:</h3>
        <ul className="list-disc pl-5 mt-2">
          <li className={apiKey ? 'text-green-600' : 'text-red-600'}>
            API Key: {apiKey ? '✓ Available' : '✗ Missing'}
          </li>
          <li className={fileKey ? 'text-green-600' : 'text-red-600'}>
            File Key: {fileKey ? '✓ Available' : '✗ Missing'}
          </li>
          <li className={nodeId ? 'text-green-600' : 'text-red-600'}>
            Node ID: {nodeId ? '✓ Available' : '✗ Missing'}
          </li>
        </ul>
      </div>
    </div>
  );
}

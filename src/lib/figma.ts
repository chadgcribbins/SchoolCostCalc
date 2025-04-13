import { getFigmaEnv } from './env';

/**
 * Figma API utilities
 */

/**
 * Get data from Figma file
 */
export async function getFigmaFile() {
  const { apiKey, fileKey } = getFigmaEnv();

  if (!apiKey || !fileKey) {
    throw new Error('Figma API key or file key is missing');
  }

  try {
    const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
      headers: {
        'X-Figma-Token': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Figma API request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch Figma file:', error);
    throw error;
  }
}

/**
 * Get specific node from Figma file
 */
export async function getFigmaNode(nodeId?: string) {
  const { apiKey, fileKey, nodeId: defaultNodeId } = getFigmaEnv();
  const nodeIdToUse = nodeId || defaultNodeId;

  if (!apiKey || !fileKey || !nodeIdToUse) {
    throw new Error('Figma API key, file key, or node ID is missing');
  }

  try {
    const response = await fetch(
      `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeIdToUse}`,
      {
        headers: {
          'X-Figma-Token': apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Figma API request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch Figma node:', error);
    throw error;
  }
}

/**
 * Get styles from Figma file
 */
export async function getFigmaStyles() {
  const { apiKey, fileKey } = getFigmaEnv();

  if (!apiKey || !fileKey) {
    throw new Error('Figma API key or file key is missing');
  }

  try {
    const response = await fetch(`https://api.figma.com/v1/files/${fileKey}/styles`, {
      headers: {
        'X-Figma-Token': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Figma API request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch Figma styles:', error);
    throw error;
  }
}

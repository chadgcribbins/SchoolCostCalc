/**
 * Environment variables utility
 * This ensures type safety and validation for environment variables
 */

// Environment variables for Figma API
interface EnvVariables {
  FIGMA_API_KEY: string;
  FIGMA_FILE_KEY: string;
  FIGMA_NODE_ID: string;
}

// Safely mask sensitive information for logs or debugging
export function maskSensitiveValue(value: string | undefined): string {
  if (!value) return 'undefined';
  if (value.length <= 8) return '****';

  // Show first 4 and last 4 characters only
  return `${value.substring(0, 4)}...${value.substring(value.length - 4)}`;
}

/**
 * Get environment variables with validation
 */
export function getEnv(): EnvVariables {
  const figmaApiKey = process.env.NEXT_PUBLIC_FIGMA_API_KEY;
  const figmaFileKey = process.env.NEXT_PUBLIC_FIGMA_FILE_KEY;
  const figmaNodeId = process.env.NEXT_PUBLIC_FIGMA_NODE_ID;

  // Validate required environment variables
  if (!figmaApiKey) {
    console.warn('NEXT_PUBLIC_FIGMA_API_KEY is not defined in .env file');
  }

  if (!figmaFileKey) {
    console.warn('NEXT_PUBLIC_FIGMA_FILE_KEY is not defined in .env file');
  }

  if (!figmaNodeId) {
    console.warn('NEXT_PUBLIC_FIGMA_NODE_ID is not defined in .env file');
  }

  return {
    FIGMA_API_KEY: figmaApiKey || '',
    FIGMA_FILE_KEY: figmaFileKey || '',
    FIGMA_NODE_ID: figmaNodeId || '',
  };
}

/**
 * Get Figma environment variables
 * This is the preferred way to access Figma-related environment variables
 */
export function getFigmaEnv() {
  const env = getEnv();

  return {
    apiKey: env.FIGMA_API_KEY,
    fileKey: env.FIGMA_FILE_KEY,
    nodeId: env.FIGMA_NODE_ID,
  };
}

/**
 * Check if all required Figma environment variables are available
 */
export function hasFigmaEnv(): boolean {
  const { apiKey, fileKey, nodeId } = getFigmaEnv();
  return Boolean(apiKey && fileKey && nodeId);
}

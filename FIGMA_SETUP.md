# Figma Integration Setup

This document explains how to set up and maintain the Figma design system integration for this project.

## Environment Variables

The project requires the following environment variables to access the Figma design system:

```
NEXT_PUBLIC_FIGMA_API_KEY=your_figma_api_key_here
NEXT_PUBLIC_FIGMA_FILE_KEY=your_figma_file_key_here
NEXT_PUBLIC_FIGMA_NODE_ID=your_figma_node_id_here
```

### How to Get These Values

1. **FIGMA_API_KEY**:

   - Go to your Figma account settings
   - Navigate to the Personal Access Tokens section
   - Create a new token with a descriptive name for this project
   - Copy the token value (it will only be shown once)

2. **FIGMA_FILE_KEY**:

   - This is the ID in your Figma URL: `https://www.figma.com/file/{FILE_KEY}/filename`
   - For this project, contact the team lead to get the current file key for the design system

3. **FIGMA_NODE_ID**:
   - This is the node-id parameter in your Figma URL: `?node-id={NODE_ID}`
   - Contact the team lead to get the current node ID for the design components

## Setting Up Environment Variables

1. Create a `.env` file in the root of the project
2. Add the above environment variables with your actual values
3. Restart the development server to apply the changes

## Maintaining the Integration

When updating the Figma design system or changing the reference file, make sure to:

1. Update the `.env` file with the new file key and/or node ID
2. Document any design system changes in the project documentation
3. Share the updated `.env` values with the team (securely, not in version control)

## Using the Figma Utilities

The project includes utility functions to access the Figma API:

```typescript
// Get Figma environment variables
import { getFigmaEnv } from './lib/env';

// Get Figma file data
import { getFigmaFile, getFigmaNode, getFigmaStyles } from './lib/figma';
```

## Troubleshooting

- If you see warnings about missing environment variables, check that your `.env` file exists and has the correct values
- If API calls fail, verify that your API key has permissions to access the design file
- Remember that the `.env` file is excluded from version control for security reasons

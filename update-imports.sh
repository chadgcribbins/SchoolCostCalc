#!/bin/bash

# This script updates import paths to use standardized component locations
# We'll standardize on using the src/components/ directory (not calculator/)

# Ensure working directory is project root
cd "$(dirname "$0")"

# Show what we're doing
echo "Updating import paths to use standardized component locations..."

# Find TypeScript files recursively
find src -type f -name "*.tsx" -o -name "*.ts" | while read -r file; do
  # Update imports from calculator/ to root components/
  sed -i '' 's|@/components/calculator/|@/components/|g' "$file"
  
  echo "Updated: $file"
done

echo "Completed import path updates" 
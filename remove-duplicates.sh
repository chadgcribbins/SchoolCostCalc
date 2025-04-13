#!/bin/bash

# Create a backup directory for calculator components
mkdir -p archive/calculator-backup

# Move duplicate calculator components to the backup directory
echo "Moving duplicate components from src/components/calculator/ to archive/calculator-backup/..."

# List of files to move
calculator_files=(
  "src/components/calculator/MainCalculator.tsx"
  "src/components/calculator/CostCustomizationPanel.tsx"
  "src/components/calculator/CostSummary.tsx"
  "src/components/calculator/FamilyMembersPanel.tsx"
  "src/components/calculator/VisualizationPanel.tsx"
  "src/components/calculator/YearlyProjection.tsx"
)

# Move each file, preserving the directory structure
for file in "${calculator_files[@]}"; do
  if [ -f "$file" ]; then
    # Create the backup filename
    backup_file="archive/calculator-backup/$(basename "$file")"
    
    # Move the file
    mv "$file" "$backup_file"
    echo "Moved: $file → $backup_file"
  else
    echo "Warning: $file not found"
  fi
done

# Check if calculator directory is now empty and remove it if so
if [ -d "src/components/calculator" ] && [ -z "$(ls -A src/components/calculator)" ]; then
  rmdir "src/components/calculator"
  echo "Removed empty directory: src/components/calculator/"
fi

echo "Duplicate components cleanup completed!" 
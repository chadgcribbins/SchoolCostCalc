#!/bin/bash

# Create backup directory
mkdir -p archive/backup

# Move outdated JS files to backup
mv src/App.js archive/backup/
mv src/CostCustomizationPanel.js archive/backup/
mv src/CostSummary.js archive/backup/
mv src/FamilyMembersPanel.js archive/backup/
mv src/index.js archive/backup/
mv src/MainCalculator.js archive/backup/
mv src/real-schools-data.js archive/backup/
mv src/VisualizationPanel.js archive/backup/
mv src/YearlyProjection.js archive/backup/

# Show success message
echo "Moved outdated JS files to archive/backup/" 
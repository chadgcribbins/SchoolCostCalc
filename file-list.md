# Portugal School Calculator - Complete File List

This document provides a comprehensive list of all files in the project, organized by directory.

## Root Directory

- `package.json` - Project dependencies and scripts
- `tailwind.config.js` - Tailwind CSS configuration
- `README.md` - Project overview and documentation
- `INSTALLATION_GUIDE.md` - Step-by-step setup instructions
- `SVG_TO_IMAGE.md` - Instructions for converting SVG files to PNG/ICO
- `FILE_LIST.md` - This file

## Public Directory (`public/`)

- `index.html` - Main HTML template
- `favicon.svg` - Source SVG for the favicon
- `favicon.ico` - Favicon for browser tabs (convert from SVG)
- `logo.svg` - Source SVG for the app logo
- `logo192.png` - Small app icon (convert from SVG)
- `logo512.png` - Large app icon (convert from SVG)
- `manifest.json` - PWA manifest file
- `robots.txt` - Search engine crawler instructions

## Source Directory (`src/`)

### Main App Files

- `index.js` - Application entry point
- `App.js` - Root React component
- `index.css` - Global styles including Tailwind CSS imports

### Core Components

- `MainCalculator.js` - Main component with state and calculations
- `real-schools-data.js` - Data for Portuguese international schools

### Feature Components

- `CostCustomizationPanel.js` - For customizing school costs and inflation settings
- `FamilyMembersPanel.js` - For managing family members
- `YearlyProjection.js` - Year-by-year cost projection
- `CostSummary.js` - Summary of total costs
- `VisualizationPanel.js` - Charts and visualizations

## Installation Process

1. Set up the directory structure following this file list
2. Install dependencies using `npm install`
3. Convert SVG files to the required formats
4. Start the development server with `npm start`

See `INSTALLATION_GUIDE.md` for detailed setup instructions.

## Notes

- The `updated-main-calculator.js` file should be renamed to `MainCalculator.js` before use
- SVG files need to be converted to their respective formats as described in `SVG_TO_IMAGE.md`
- All React components are designed to work together with proper prop passing

# Portugal School Calculator - Installation Guide

This guide will help you set up and run the Portugal School Calculator project on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Git](https://git-scm.com/) (for cloning the repository)

## Installation Steps

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/portugal-school-calculator.git
cd portugal-school-calculator
```

### 2. Create Project Structure

Create a new React project or use the files provided in the existing directory structure. The project should have the following structure:

```
portugal-school-calculator/
├── public/
│   ├── index.html
│   ├── favicon.ico (convert from favicon.svg)
│   ├── favicon.svg
│   ├── logo.svg
│   ├── logo192.png (convert from logo.svg)
│   ├── logo512.png (convert from logo.svg)
│   ├── manifest.json
│   ├── robots.txt
├── src/
│   ├── App.js
│   ├── index.js
│   ├── index.css
│   ├── CostCustomizationPanel.js
│   ├── CostSummary.js
│   ├── FamilyMembersPanel.js
│   ├── MainCalculator.js (or use updated-main-calculator.js)
│   ├── VisualizationPanel.js
│   ├── YearlyProjection.js
│   ├── real-schools-data.js
├── package.json
├── tailwind.config.js
├── README.md
```

### 3. Install Dependencies

Install the required dependencies:

```bash
npm install
```

This will install React, Recharts, Tailwind CSS, and other dependencies required for the application.

### 4. Configure Tailwind CSS

If Tailwind CSS isn't already set up, you'll need to configure it:

```bash
npx tailwindcss init -p
```

Make sure your `tailwind.config.js` file looks like the one provided in this repository.

### 5. Update Component Names

Make sure the import statements in your components match the actual filenames. If you're using the updated main calculator, rename it:

```bash
mv src/updated-main-calculator.js src/MainCalculator.js
```

### 6. Handle Image Files

The project includes SVG files that need to be converted to the appropriate formats:

1. Convert `favicon.svg` to `favicon.ico` for the browser tab icon
2. Convert `logo.svg` to `logo192.png` and `logo512.png` for PWA support

See the `SVG_TO_IMAGE.md` file for detailed instructions on converting these files.

Alternatively, you can use the SVG files directly by updating the references in `index.html` and `manifest.json`.

### 7. Start the Development Server

Start the development server to run the application:

```bash
npm start
```

This will start the application at [http://localhost:3000](http://localhost:3000) (or another port if 3000 is in use).

## Troubleshooting

### Issue: Component Not Found

If you receive an error that a component cannot be found, check:

1. That all component files are in the correct directory
2. That import statements use the correct case (e.g., `import VisualizationPanel from './VisualizationPanel'`)
3. That all component names match between files

### Issue: Tailwind CSS Styles Not Applying

If Tailwind CSS styles are not being applied:

1. Check that your `tailwind.config.js` file contains the correct content paths
2. Make sure your `index.css` includes the Tailwind CSS directives

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

3. Ensure you've installed PostCSS and autoprefixer

### Issue: Chart Libraries Not Working

If the charts are not rendering correctly:

1. Check that you've installed Recharts: `npm install recharts`
2. Make sure all chart component imports are correct
3. Verify that the data being passed to the charts is in the correct format

## Customizing the Application

### Adding New Schools

To add new schools to the calculator:

1. Edit the `real-schools-data.js` file
2. Add a new school object following the existing pattern
3. The application will automatically include the new school in all calculations and visualizations

### Modifying Default Values

To change default values:

1. Edit the default values in the main calculator component 
2. Update the `formatSchoolData` function if necessary

## Deploying to Production

When you're ready to deploy your application:

1. Build the application:

```bash
npm run build
```

2. The production files will be in the `build` directory
3. Upload these files to your web server or hosting platform

## Need Help?

If you encounter any issues not covered in this guide:

1. Check the React documentation: [https://reactjs.org/docs/getting-started.html](https://reactjs.org/docs/getting-started.html)
2. Refer to the Recharts documentation: [https://recharts.org/en-US/](https://recharts.org/en-US/)
3. Visit the Tailwind CSS documentation: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

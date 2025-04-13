# Portugal School Cost Calculator

A responsive web application to help families project and plan for international school education costs in Portugal.

## Features and good stuff

- Calculate projected costs for multiple children
- Compare costs between different schools
- Visualize expenses over time
- Customize optional costs (lunch, transport, uniform, etc.)
- Apply inflation and currency conversion

## Development Setup

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/SchoolCostCalc.git
   cd SchoolCostCalc
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### VSCode Setup

For the best development experience, install the recommended extensions:

- Tailwind CSS IntelliSense
- ESLint
- Prettier

These extensions will be suggested automatically when you open the project in VSCode.

## Project Structure

- `/src/app` - Next.js app router pages
- `/src/components` - Reusable React components
- `/src/components/ui` - UI components based on Shadcn UI
- `/src/data` - Data sources and models
- `/src/lib` - Utility functions and helpers

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Shadcn UI components

## Component Structure

The application is built using the following components:

1. **MainCalculator.js**: The main component that handles state management and calculations
2. **CostCustomizationPanel.js**: Allows customization of school costs and inflation settings
3. **FamilyMembersPanel.js**: For adding and managing family members
4. **YearlyProjection.js**: Provides a detailed year-by-year cost projection
5. **VisualizationPanel.js**: Interactive charts and visualizations of costs
6. **CostSummary.js**: Summary of total costs across all schools

## Usage

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/portugal-school-calculator.git
cd portugal-school-calculator
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file and add your actual values. See [Figma Integration Setup](./FIGMA_SETUP.md) for details on obtaining these values.

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000` or another available port.

### Using the Calculator

1. Add family members and set their ages
2. Customize school costs if needed
3. Enable/disable optional costs
4. View the cost summary and yearly projections
5. Explore different visualizations to understand the cost breakdown

## Customization

The calculator comes pre-loaded with sample data for three international schools. You can customize this data by:

1. Modifying the default school data in `MainCalculator.js`
2. Adjusting the inflation rate and cost parameters
3. Adding new schools through the UI

## Design System

The application uses the Flowbite design system. To access the design components:

1. Ensure you have the required environment variables set up (see above)
2. Visit `/figma-test` route to verify the connection to the Figma API
3. Refer to [Figma Integration Setup](./FIGMA_SETUP.md) for more details

## License

MIT

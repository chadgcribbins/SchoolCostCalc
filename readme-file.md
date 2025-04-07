# Portugal International School Cost Calculator

A comprehensive React application to help families estimate and compare the costs of international schools in Portugal over multiple years.

## Features

- Compare multiple schools with detailed cost breakdowns
- Add and customize family members
- Set custom costs and inflation rates
- View yearly projections with detailed breakdowns
- Visualize costs through interactive charts

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

3. Start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`.

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

## License

MIT
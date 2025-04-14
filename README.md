# Portugal School Cost Calculator

A responsive web application to help families project and plan for international school education costs in Portugal.

**Live Demo**: [school-cost-calc.vercel.app](https://school-cost-calc.vercel.app)

**Project Status**: Version 1.0.0 - April 2025 (Stable release with core features implemented)

## Features

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
   git clone https://github.com/chadgcribbins/SchoolCostCalc.git
   cd SchoolCostCalc
   ```

2. Install dependencies

   ```bash
   npm install --legacy-peer-deps
   ```

3. Set up environment variables

   ```bash
   cp .env.example .env.local
   ```

   Add the required environment variables (see [Installation Guide](./INSTALLATION_GUIDE.md) for details)

4. Start the development server

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

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
- Chart.js for data visualization

## Component Structure

The application is built using the following components:

1. **MainCalculator**: The main component that handles state management and calculations
2. **CostCustomizationPanel**: Allows customization of school costs and inflation settings
3. **FamilyMembersPanel**: For adding and managing family members
4. **YearlyProjection**: Provides a detailed year-by-year cost projection
5. **VisualizationPanel**: Interactive charts and visualizations of costs
6. **CostSummary**: Summary of total costs across all schools

## Deployment

This project is deployed on Vercel. For deployment instructions and troubleshooting, see the [Deployment Guide](./DEPLOYMENT.md).

## Future Roadmap

Planned enhancements for future versions are detailed in our [Roadmap](./ROADMAP.md), including:

- User accounts and saved configurations
- Additional international schools in Portugal
- Tax implications calculator
- Mobile app version
- Printable reports
- Multi-language support (Portuguese/English)

## Documentation

For complete project documentation, see [DOCUMENTATION.md](./DOCUMENTATION.md).

Key documentation includes:

- [Project Status](./PROJECT_STATUS.md) - Current implementation details and research findings
- [Research](./RESEARCH.md) - Comprehensive 10-year cost analysis for Portuguese schools
- [Installation Guide](./INSTALLATION_GUIDE.md) - Detailed setup instructions
- [Deployment Guide](./DEPLOYMENT.md) - Deployment instructions and lessons learned
- [Figma Integration](./FIGMA_SETUP.md) - Setting up Figma API integration

## License

MIT

# SchoolCostCalc: Project Status (v1.0.0)

## Project Overview

SchoolCostCalc is a financial planning application designed to help families project and compare the costs of private international education in Portugal over a 10-year period. The application provides comprehensive cost modeling for three prominent international schools in the Lisbon area:

- The Lisboan International School
- TASIS Portugal
- Saint Dominic's International School

## Current Implementation

The current implementation includes:

### Core Components

- **Family Members Panel**: Add, edit, and remove family members with customizable ages and graduation years
- **School Cost Customization**: Adjust tuition rates, fees, and inflation settings
- **Yearly Projection**: Interactive visualization of costs over time with detailed breakdowns
- **Data Visualization**: Bar chart and line chart representations of cost data

### Detailed Functionality

- **Individual School Cost Models**:

  - One-time enrollment fees
  - Annual tuition fees with grade-based adjustments
  - Mandatory recurring fees
  - Optional costs (lunch, transport, uniforms, etc.)
  - Applicable sibling discounts

- **Cost Projection Framework**:

  - Year-by-year breakdown
  - Children's grade progression tracking
  - Inflation adjustments (3% annual default)
  - Family total calculations across all children

- **Comparative Analysis**:
  - Total 10-year cost comparison
  - Year-by-year cost comparison
  - Mandatory vs. optional cost breakdowns
  - Payment schedule impact analysis

## Research Findings

The comprehensive research phase yielded several important insights:

1. **Significant Cost Variation**: Total 10-year costs vary substantially between schools:

   - The Lisboan: Approximately €360,000 plus one-time fees
   - TASIS Portugal: Approximately €430,000 plus one-time fees
   - Saint Dominic's: Approximately €525,000 plus one-time fees

2. **Sibling Discount Impact**: Schools with sibling discounts (TASIS and Saint Dominic's) can provide substantial savings for multi-child families.

3. **Hidden Costs Matter**: While TASIS has higher baseline tuition, its all-inclusive approach (covering lunch, activities, etc.) may offset apparent price differences.

4. **Fee Structure Differences**: Schools differ significantly in how fees are structured:
   - One-time vs. recurring fees
   - Included vs. separate optional costs
   - Grade-based tuition increases

## Technical Implementation

- **Frontend**: React with TypeScript, using Next.js App Router
- **UI Components**: Shadcn UI/Radix UI with Tailwind CSS
- **Data Visualization**: Chart.js with React integration
- **State Management**: React Context API with custom hooks
- **Deployment**: Vercel with custom configuration
- **Code Structure**: Modular components with clear separation of concerns

## Known Limitations

1. **Data Persistence**: Currently no data storage between sessions
2. **Limited Schools**: Only three pre-configured schools are available
3. **Fixed Inflation**: While adjustable, the inflation model is simplistic
4. **Currency Options**: Limited to EUR/GBP conversion

## Next Steps

See [ROADMAP.md](./ROADMAP.md) for planned future enhancements and development timeline.

## References

The application incorporates data from various authoritative sources including:

1. The Lisboan School Fees 2025/26
2. TASIS Portugal Tuition & Fees 2025/26
3. Saint Dominic's International School Fees 2024–2025
4. Average Cost of Private School Transport in Lisbon
5. Typical Uniform Costs in Portugal
6. IB Program Cost Components

Full research documentation is available in [RESEARCH.md](./RESEARCH.md).

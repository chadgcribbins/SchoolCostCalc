# Portugal School Cost Calculator - Implementation Roadmap

## Project Summary

SchoolCostCalc provides a comprehensive analysis of 10-year private international education costs in Portugal (2025-2035). The research phase is complete with detailed analysis for three schools in Lisbon (The Lisboan, TASIS Portugal, and Saint Dominic's), including fee structures, sibling discounts, and projected costs with inflation.

### Projected Web Application Functionality

- **Family Configuration**: Input children's details, ages, and expected grade progression
- **Cost Customization**: Toggle optional costs and adjust inflation assumptions
- **Financial Planning**: Project costs with tax implications and risk scenario modeling
- **Currency Settings**: EUR/GBP with adjustable exchange rate
- **Visualizations**: Interactive charts showing cost breakdowns and comparisons

### Core Features (To Be Implemented)

- Comparison of one-time fees, mandatory costs, and optional costs across schools
- Visualization of total costs and year-by-year projections
- Analysis of cost factors including sibling discounts and included services
- Modeling of alternative scenarios and risk factors
- Integration of relevant tax implications

## Technical Implementation Plan

### Application Architecture

The application will be built as a React application with the following component structure:

1. **MainCalculator**: The core component that handles state management and calculations

   - Maintains the primary state for the calculator
   - Coordinates data flow between child components
   - Handles the primary calculation logic

2. **CostCustomizationPanel**: For customizing school costs and inflation settings

   - Controls for adjusting tuition rates
   - Inflation rate configuration
   - Fee structure customization
   - Risk factor adjustments

3. **FamilyMembersPanel**: For adding and managing family members

   - Add/edit/remove children
   - Set ages and grade levels
   - Configure enrollment periods
   - Visualize grade progression over time

4. **YearlyProjection**: Detailed year-by-year cost projection

   - Tabular view of costs by year
   - Breakdown by child and school
   - Toggle between payment periods (annual/term/monthly)
   - Integration with grade progression table

5. **VisualizationPanel**: Interactive charts and visualizations

   - Multiple chart types for different analyses
   - Interactive elements for exploring data
   - Scenario comparison visualizations
   - Risk impact charting

6. **CostSummary**: Summary of total costs across all schools

   - High-level comparison of total costs
   - Side-by-side school comparison
   - One-time vs. recurring cost breakdown
   - Tax implications calculator

7. **ScenarioPlanner**: For modeling alternative scenarios
   - Early withdrawal modeling
   - School transfer calculator
   - Additional child impact analysis
   - Public vs. private comparison

### Technical Requirements

- **Frontend**: React with TypeScript for type safety
- **UI Components**: Shadcn UI/Radix UI with Tailwind CSS
- **Data Visualization**: React-chartjs-2 for interactive charts
- **State Management**: React Context API for global state
- **Form Handling**: React Hook Form with Zod validation
- **Build/Deploy**: Next.js App Router framework

### Development Environment

- Node.js (v18+)
- npm or pnpm for package management
- Local development server with hot reloading

## Enhancement Roadmap

### Phase 1: Basic Application Setup & Core Functionality

_Target: Implement the foundational application with basic functionality_

1. **Project Initialization**

   - Set up Next.js with TypeScript
   - Configure Tailwind CSS and Shadcn UI
   - Establish component structure and routing

2. **Data Model Implementation**

   - Define types for schools, costs, and family members
   - Create utilities for calculations
   - Implement base state management
   - Design grade progression matrix

3. **Core Components**

   - Build MainCalculator with basic state
   - Implement FamilyMembersPanel with grade tracking
   - Create comprehensive CostSummary

4. **Basic Visualization**
   - Set up Chart.js integration
   - Implement basic comparison charts
   - Add tabular data views
   - Display grade progression

### Phase 2: Cost Customization & Financial Models

_Target: Allow users to fine-tune all financial inputs for more accurate projections_

1. **Base Tuition and Fee Adjustment**

   - Input fields for each grade level's tuition at each school
   - Implementation of registration and recurring fees
   - Validation to prevent unrealistic values

2. **Inflation and Risk Modeling**

   - Implement inflation rate controls (default 3%, range 0-10%)
   - Add risk factor toggles based on research findings
   - Create visual indicators showing impact over time
   - Save/load functionality for different risk scenarios

3. **Tax Implication Calculator**

   - Integration of Portuguese education tax deductions
   - Toggle for resident vs. non-resident tax status
   - Corporate structure considerations
   - Annual tax benefit visualization

4. **Sibling Discount Implementation**
   - Accurate modeling of each school's sibling discount policy
   - Dynamic calculation based on number of enrolled children
   - Visual indicators of discount impact

### Phase 3: Enhanced Data Visualization

_Target: Provide deeper insights through more sophisticated visualizations_

1. **Cost Breakdown Charts**

   - Stacked bar chart showing mandatory vs. optional vs. one-time fees
   - Pie charts displaying proportion of different cost categories
   - School-by-school breakdown of where money goes

2. **Time-Based Visualizations**

   - Cumulative cost graph showing spending over the 10-year period
   - Annual cost comparison with highlighted milestone years
   - Grade progression overlay with cost implications

3. **Child-Specific Views**

   - Per-child cost breakdown
   - Visual timeline of each child's education journey
   - Indication of grade transitions and key educational milestones

4. **Interactive Chart Features**
   - Tooltips with detailed information on hover
   - Ability to toggle data series on/off
   - Options to change chart types based on user preference

### Phase 4: Alternative Scenario Planning

_Target: Help parents explore different educational and financial scenarios_

1. **Early Withdrawal Calculator**

   - Modeling of partial enrollment periods
   - Application of school-specific withdrawal policies
   - Visualization of cost differences

2. **School Transfer Simulator**

   - Impact analysis of moving between schools
   - New registration fees calculation
   - Comparison of before/after costs

3. **Additional Child Planning**

   - Project costs of having another child enter the system
   - Sibling discount recalculation
   - Timeline adjustments for family planning

4. **Public vs. Private Comparison**
   - Cost difference calculator
   - Long-term financial impact analysis
   - Consideration of supplementary education costs

### Phase 5: Financial Planning Tools

_Target: Help parents plan how to manage education expenses_

1. **Scholarship and Financial Aid Integration**

   - Merit scholarship calculator
   - Corporate education allowance modeling
   - Income-based financial aid estimation

2. **Education Savings Calculator**

   - Required monthly savings calculator
   - Investment growth projections
   - Tax-advantaged savings options

3. **Payment Plan Optimizer**

   - Monthly vs. term vs. annual payment comparison
   - Interest calculation for payment plans
   - Future payment schedule generator

4. **Budget Impact Analysis**
   - Percentage of household income required
   - Comparison to other major expenses
   - "Affordability calculator" based on income inputs

### Phase 6: Advanced Features & Optimizations

_Target: Add specialized features and improve overall experience_

1. **Data Import/Export**

   - Export calculations to PDF/Excel
   - Save configurations for future reference
   - Import custom fee structures

2. **Mobile Optimization**

   - Responsive design improvements
   - Touch-friendly controls
   - Simplified views for small screens

3. **Currency Management**

   - Real-time exchange rate integration
   - Currency risk modeling
   - Multi-currency reporting

4. **UX Enhancements**
   - Animations for transitions between views
   - Contextual help throughout the interface
   - User onboarding tutorial

## Component Interactions

The application components will interact as follows:

```
MainCalculator
├── FamilyMembersPanel
│   ├── FamilyMember (multiple instances)
│   └── GradeProgressionTable
├── CostCustomizationPanel
│   ├── SchoolSelector
│   ├── TuitionEditor
│   ├── InflationControl
│   └── RiskFactorAdjustment
├── YearlyProjection
│   └── YearCostRow (multiple instances)
├── VisualizationPanel
│   ├── CostComparisonChart
│   ├── TimelineChart
│   └── BreakdownChart
├── CostSummary
│   ├── SchoolComparison
│   ├── TotalCostDisplay
│   └── TaxBenefitCalculator
└── ScenarioPlanner
    ├── EarlyWithdrawalCalculator
    ├── SchoolTransferSimulator
    ├── AdditionalChildPlanner
    └── PublicPrivateComparison
```

## Implementation Notes

- Each phase should be implemented sequentially, with testing between phases
- Focus on maintaining performance even as features are added
- Ensure all calculations reflect the actual cost structures of each school
- Document all assumptions made in calculations
- Incorporate risk factors and alternative scenarios throughout the application
- Present tax implications clearly with appropriate disclaimers

## Data Sources

The calculator comes pre-loaded with thoroughly researched data from:

1. Official school fee structures for 2024-2025/2025-2026
2. Documented sibling discount policies
3. Published information on optional costs
4. IB and other curriculum-specific fees
5. Portuguese tax regulations concerning education expenses

## Customization Options

Users will be able to customize:

1. Family configuration (children's ages, grades, enrollment periods)
2. Optional cost selections (lunch, transport, uniforms, activities)
3. Inflation rate assumptions (default 3%)
4. Risk factor probabilities
5. Tax status and implications
6. Alternative scenarios for comparison

## Future Enhancement Possibilities

1. **Additional Schools**: Expand to include more international and private schools in Portugal
2. **Regional Comparison**: Add schools from other regions of Portugal
3. **Curriculum-Specific Analysis**: Deeper comparison of IB vs. British vs. American curricula costs
4. **University Transition Planning**: Integration with university cost projections
5. **Multi-Country Comparison**: For expat families considering multiple countries

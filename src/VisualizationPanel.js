import React from 'react';
import { LineChart, BarChart, PieChart, Cell, Line, Bar, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const VisualizationPanel = ({ 
  schoolsData, 
  familyCosts, 
  years, 
  formatCurrency, 
  currentYear,
  activeTab,
  setActiveTab
}) => {
  // Prepare data for annual cost comparison chart
  const annualCostData = years.map(year => {
    const yearData = { year };
    
    Object.keys(schoolsData).forEach(schoolId => {
      const yearCosts = familyCosts[schoolId].yearly[year];
      if (yearCosts) {
        yearData[schoolId] = yearCosts.total + (year === years[0] ? familyCosts[schoolId].oneTime.total : 0);
        yearData[`${schoolId}Label`] = formatCurrency(yearData[schoolId]);
      } else {
        yearData[schoolId] = 0;
        yearData[`${schoolId}Label`] = 'N/A';
      }
    });
    
    return yearData;
  });
  
  // Prepare data for cost breakdown pie charts
  const prepareCostBreakdownData = (schoolId) => {
    const totalCosts = {
      baseTuition: 0,
      yearlyEnrollmentFee: 0,
      lunch: 0,
      transport: 0,
      uniform: 0,
      afterSchool: 0,
      registration: familyCosts[schoolId].oneTime.total // One-time registration fee
    };
    
    // Sum up all costs across all years
    Object.keys(familyCosts[schoolId].yearly).forEach(year => {
      const breakdown = familyCosts[schoolId].yearly[year].breakdown;
      
      totalCosts.baseTuition += breakdown.baseTuition;
      totalCosts.yearlyEnrollmentFee += breakdown.yearlyEnrollmentFee;
      totalCosts.lunch += breakdown.lunch;
      totalCosts.transport += breakdown.transport;
      totalCosts.uniform += breakdown.uniform;
      totalCosts.afterSchool += breakdown.afterSchool;
    });
    
    // Convert to array format for chart
    return [
      { name: 'Base Tuition', value: totalCosts.baseTuition },
      { name: 'Yearly Enrollment', value: totalCosts.yearlyEnrollmentFee },
      { name: 'Registration/Capital', value: totalCosts.registration },
      { name: 'Lunch', value: totalCosts.lunch },
      { name: 'Transport', value: totalCosts.transport },
      { name: 'Uniform', value: totalCosts.uniform },
      { name: 'After School', value: totalCosts.afterSchool },
    ].filter(item => item.value > 0); // Remove zero-value items
  };

  // Colors for the charts
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];
  
  // Prepare cumulative cost data
  const cumulativeCostData = [];
  const cumulativeTotals = {};
  
  Object.keys(schoolsData).forEach(schoolId => {
    cumulativeTotals[schoolId] = 0;
  });
  
  years.forEach(year => {
    const yearData = { year };
    
    Object.keys(schoolsData).forEach(schoolId => {
      const yearCosts = familyCosts[schoolId].yearly[year];
      
      if (yearCosts) {
        // Add one-time costs in the first year
        const yearTotal = yearCosts.total + (year === years[0] ? familyCosts[schoolId].oneTime.total : 0);
        cumulativeTotals[schoolId] += yearTotal;
        yearData[schoolId] = cumulativeTotals[schoolId];
        yearData[`${schoolId}Label`] = formatCurrency(cumulativeTotals[schoolId]);
      } else {
        yearData[schoolId] = cumulativeTotals[schoolId];
        yearData[`${schoolId}Label`] = formatCurrency(cumulativeTotals[schoolId]);
      }
    });
    
    cumulativeCostData.push(yearData);
  });
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Visualizations</h2>
      
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="mb-4">
          <div className="flex border-b">
            <button 
              className={`py-2 px-4 ${activeTab === 'comparison' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('comparison')}
            >
              Annual Comparison
            </button>
            <button 
              className={`py-2 px-4 ${activeTab === 'cumulative' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('cumulative')}
            >
              Cumulative Costs
            </button>
            <button 
              className={`py-2 px-4 ${activeTab === 'breakdown' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('breakdown')}
            >
              Cost Breakdown
            </button>
          </div>
        </div>
        
        <div className="h-96">
          {activeTab === 'comparison' && (
            <div className="h-full">
              <h3 className="text-lg font-medium mb-2">Annual Cost Comparison</h3>
              <div className="mt-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={annualCostData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [formatCurrency(value), schoolsData[name]?.name || name]}
                      labelFormatter={(label) => `Year: ${label}`}
                    />
                    <Legend />
                    {Object.keys(schoolsData).map((schoolId, index) => (
                      <Bar 
                        key={schoolId}
                        dataKey={schoolId}
                        name={schoolsData[schoolId].name}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          
          {activeTab === 'cumulative' && (
            <div className="h-full">
              <h3 className="text-lg font-medium mb-2">Cumulative Costs Over Time</h3>
              <div className="mt-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={cumulativeCostData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [formatCurrency(value), schoolsData[name]?.name || name]}
                      labelFormatter={(label) => `Year: ${label}`}
                    />
                    <Legend />
                    {Object.keys(schoolsData).map((schoolId, index) => (
                      <Line 
                        key={schoolId}
                        type="monotone"
                        dataKey={schoolId}
                        name={schoolsData[schoolId].name}
                        stroke={colors[index % colors.length]}
                        activeDot={{ r: 8 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          
          {activeTab === 'breakdown' && (
            <div className="h-full">
              <h3 className="text-lg font-medium mb-2">Cost Breakdown by Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 h-80">
                {Object.keys(schoolsData).map((schoolId, index) => (
                  <div key={schoolId} className="h-full">
                    <h4 className="text-center font-medium mb-2">{schoolsData[schoolId].name}</h4>
                    <ResponsiveContainer width="100%" height="90%">
                      <PieChart>
                        <Pie
                          data={prepareCostBreakdownData(schoolId)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {prepareCostBreakdownData(schoolId).map((entry, i) => (
                            <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualizationPanel;
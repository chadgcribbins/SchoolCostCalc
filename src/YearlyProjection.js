import React from 'react';

const YearlyProjection = ({
  schoolsData,
  familyCosts,
  years,
  formatCurrency,
  useCustomCosts,
  yearlyCustomCosts,
  setYearlyCustomCosts,
  getYearlyCost,
  calculateInflatedCost,
  expandedYear,
  setExpandedYear,
  expandedSchool,
  setExpandedSchool,
  customSchoolsData
}) => {
  // Toggle expanded year/school for detailed view
  const toggleYearDetail = (year, schoolId) => {
    if (expandedYear === year && expandedSchool === schoolId) {
      setExpandedYear(null);
      setExpandedSchool(null);
    } else {
      setExpandedYear(year);
      setExpandedSchool(schoolId);
      
      // Initialize yearly custom costs if not already set
      if (useCustomCosts && (!yearlyCustomCosts[year] || !yearlyCustomCosts[year][schoolId])) {
        const school = customSchoolsData[schoolId];
        const initialCosts = {
          baseTuition: calculateInflatedCost(school.baseTuition, year),
          yearlyEnrollmentFee: calculateInflatedCost(school.yearlyEnrollmentFee, year),
          lunch: calculateInflatedCost(school.lunch, year),
          transport: calculateInflatedCost(school.transport, year),
          uniform: calculateInflatedCost(school.uniform, year),
          afterSchool: calculateInflatedCost(school.afterSchool, year)
        };
        
        setYearlyCustomCosts(prev => ({
          ...prev,
          [year]: {
            ...(prev[year] || {}),
            [schoolId]: initialCosts
          }
        }));
      }
    }
  };

  // Handler for updating yearly custom costs
  const updateYearlyCustomCost = (year, schoolId, costType, value) => {
    setYearlyCustomCosts(prev => ({
      ...prev,
      [year]: {
        ...(prev[year] || {}),
        [schoolId]: {
          ...(prev[year]?.[schoolId] || {}),
          [costType]: parseFloat(value) || 0
        }
      }
    }));
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Year-by-Year Projection</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-blue-100">
              <th className="py-2 px-3 text-left">Year</th>
              {Object.keys(schoolsData).map(schoolId => (
                <th key={schoolId} className="py-2 px-3 text-center">
                  {schoolsData[schoolId].name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {years.map(year => (
              <React.Fragment key={year}>
                <tr className="border-t hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium">{year}</td>
                  {Object.keys(schoolsData).map(schoolId => (
                    <td
                      key={`${year}-${schoolId}`}
                      className="py-2 px-3 text-center cursor-pointer"
                      onClick={() => toggleYearDetail(year, schoolId)}
                    >
                      {familyCosts[schoolId].yearly[year] ? (
                        <>
                          {formatCurrency(familyCosts[schoolId].yearly[year].total)}
                          <div className="text-xs text-gray-500">
                            Click to {expandedYear === year && expandedSchool === schoolId ? 'collapse' : 'expand'}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                  ))}
                </tr>
                
                {/* Expanded Detail Row - FIXED! */}
                {expandedYear === year && expandedSchool && (
                  <tr className="bg-blue-50">
                    <td colSpan={Object.keys(schoolsData).length + 1} className="py-3 px-4">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <h3 className="font-bold text-lg mb-2">
                          {schoolsData[expandedSchool].name} - {year} Detailed Costs
                        </h3>
                        
                        {useCustomCosts && (
                          <div className="mb-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                            <h4 className="font-semibold mb-2">Customize Yearly Costs</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-sm">Base Tuition</label>
                                <input 
                                  type="number" 
                                  value={yearlyCustomCosts[year]?.[expandedSchool]?.baseTuition || 
                                    getYearlyCost(expandedSchool, year, 'baseTuition')}
                                  onChange={(e) => updateYearlyCustomCost(
                                    year, expandedSchool, 'baseTuition', e.target.value
                                  )}
                                  className="border rounded p-1 w-full"
                                />
                              </div>
                              <div>
                                <label className="block text-sm">Enrollment Fee</label>
                                <input 
                                  type="number" 
                                  value={yearlyCustomCosts[year]?.[expandedSchool]?.yearlyEnrollmentFee || 
                                    getYearlyCost(expandedSchool, year, 'yearlyEnrollmentFee')}
                                  onChange={(e) => updateYearlyCustomCost(
                                    year, expandedSchool, 'yearlyEnrollmentFee', e.target.value
                                  )}
                                  className="border rounded p-1 w-full"
                                />
                              </div>
                              <div>
                                <label className="block text-sm">Lunch</label>
                                <input 
                                  type="number" 
                                  value={yearlyCustomCosts[year]?.[expandedSchool]?.lunch || 
                                    getYearlyCost(expandedSchool, year, 'lunch')}
                                  onChange={(e) => updateYearlyCustomCost(
                                    year, expandedSchool, 'lunch', e.target.value
                                  )}
                                  className="border rounded p-1 w-full"
                                />
                              </div>
                              <div>
                                <label className="block text-sm">Transport</label>
                                <input 
                                  type="number" 
                                  value={yearlyCustomCosts[year]?.[expandedSchool]?.transport || 
                                    getYearlyCost(expandedSchool, year, 'transport')}
                                  onChange={(e) => updateYearlyCustomCost(
                                    year, expandedSchool, 'transport', e.target.value
                                  )}
                                  className="border rounded p-1 w-full"
                                />
                              </div>
                              <div>
                                <label className="block text-sm">Uniform</label>
                                <input 
                                  type="number" 
                                  value={yearlyCustomCosts[year]?.[expandedSchool]?.uniform || 
                                    getYearlyCost(expandedSchool, year, 'uniform')}
                                  onChange={(e) => updateYearlyCustomCost(
                                    year, expandedSchool, 'uniform', e.target.value
                                  )}
                                  className="border rounded p-1 w-full"
                                />
                              </div>
                              <div>
                                <label className="block text-sm">After School</label>
                                <input 
                                  type="number" 
                                  value={yearlyCustomCosts[year]?.[expandedSchool]?.afterSchool || 
                                    getYearlyCost(expandedSchool, year, 'afterSchool')}
                                  onChange={(e) => updateYearlyCustomCost(
                                    year, expandedSchool, 'afterSchool', e.target.value
                                  )}
                                  className="border rounded p-1 w-full"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="p-2 border text-left">Cost Category</th>
                                <th className="p-2 border text-right">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="p-2 border">Base Tuition</td>
                                <td className="p-2 border text-right">
                                  {formatCurrency(familyCosts[expandedSchool].yearly[year].breakdown.baseTuition)}
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 border">Yearly Enrollment Fee</td>
                                <td className="p-2 border text-right">
                                  {formatCurrency(familyCosts[expandedSchool].yearly[year].breakdown.yearlyEnrollmentFee)}
                                </td>
                              </tr>
                              {familyCosts[expandedSchool].yearly[year].breakdown.lunch > 0 && (
                                <tr>
                                  <td className="p-2 border">Lunch</td>
                                  <td className="p-2 border text-right">
                                    {formatCurrency(familyCosts[expandedSchool].yearly[year].breakdown.lunch)}
                                  </td>
                                </tr>
                              )}
                              {familyCosts[expandedSchool].yearly[year].breakdown.transport > 0 && (
                                <tr>
                                  <td className="p-2 border">Transport</td>
                                  <td className="p-2 border text-right">
                                    {formatCurrency(familyCosts[expandedSchool].yearly[year].breakdown.transport)}
                                  </td>
                                </tr>
                              )}
                              {familyCosts[expandedSchool].yearly[year].breakdown.uniform > 0 && (
                                <tr>
                                  <td className="p-2 border">Uniform</td>
                                  <td className="p-2 border text-right">
                                    {formatCurrency(familyCosts[expandedSchool].yearly[year].breakdown.uniform)}
                                  </td>
                                </tr>
                              )}
                              {familyCosts[expandedSchool].yearly[year].breakdown.afterSchool > 0 && (
                                <tr>
                                  <td className="p-2 border">After School Activities</td>
                                  <td className="p-2 border text-right">
                                    {formatCurrency(familyCosts[expandedSchool].yearly[year].breakdown.afterSchool)}
                                  </td>
                                </tr>
                              )}
                              {year === years[0] && (
                                <tr>
                                  <td className="p-2 border">Registration Fee (One-time)</td>
                                  <td className="p-2 border text-right">
                                    {formatCurrency(familyCosts[expandedSchool].oneTime.registrationFee)}
                                  </td>
                                </tr>
                              )}
                              <tr className="bg-blue-50 font-semibold">
                                <td className="p-2 border">Total for {year}</td>
                                <td className="p-2 border text-right">
                                  {formatCurrency(
                                    familyCosts[expandedSchool].yearly[year].total + 
                                    (year === years[0] ? familyCosts[expandedSchool].oneTime.total : 0)
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default YearlyProjection;
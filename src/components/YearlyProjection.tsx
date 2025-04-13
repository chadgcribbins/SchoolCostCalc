import React, { useRef, useEffect, useState } from 'react';
import { FamilyCosts, FormattedSchoolData, FamilyMember } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register Chart.js components
console.log('Registering Chart.js components');
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface YearlyProjectionProps {
  familyCosts: FamilyCosts;
  schoolsData: Record<string, FormattedSchoolData>;
  formatCurrency: (amount: number) => string;
  years: number[];
  familyMembers: FamilyMember[];
  expandedYear: number | null;
  setExpandedYear: (year: number | null) => void;
  expandedSchool: string | null;
  setExpandedSchool: (schoolId: string | null) => void;
}

const YearlyProjection = ({
  familyCosts,
  schoolsData,
  formatCurrency,
  years,
  familyMembers,
  expandedYear,
  setExpandedYear,
  expandedSchool,
  setExpandedSchool,
}: YearlyProjectionProps) => {
  const schoolIds = Object.keys(familyCosts.bySchool);
  const barChartRef = useRef<any>(null);
  const lineChartRef = useRef<any>(null);
  const [chartType, setChartType] = useState<'bar' | 'line'>('line');

  // Debug props on mount
  useEffect(() => {
    console.log('YearlyProjection mounted with props:', {
      schoolIds,
      familyMembers,
      years,
      familyCosts: Object.keys(familyCosts.bySchool).length > 0,
    });
  }, []);

  // Get totals by year
  const getTotalByYear = (schoolId: string) => {
    const totalsByYear: Record<number, number> = {};
    const costs = familyCosts.bySchool[schoolId];

    // Calculate total cost per year
    Object.values(costs.byStudent).forEach(student => {
      Object.entries(student.yearly).forEach(([yearStr, yearCosts]) => {
        const year = parseInt(yearStr);
        if (!totalsByYear[year]) totalsByYear[year] = 0;
        totalsByYear[year] += yearCosts.total;
      });
    });

    // Add registration fees to first year
    const firstYear = years[0];
    totalsByYear[firstYear] = (totalsByYear[firstYear] || 0) + costs.totalOneTime;

    return totalsByYear;
  };

  // Get which members are in school for each year
  const getMembersInSchoolByYear = () => {
    const membersByYear: Record<number, FamilyMember[]> = {};

    years.forEach(year => {
      membersByYear[year] = familyMembers.filter(member => year <= member.graduationYear);
    });

    return membersByYear;
  };

  const membersByYear = getMembersInSchoolByYear();

  // Toggle expansion of details for a year
  const toggleYearExpansion = (year: number) => {
    if (expandedYear === year) {
      setExpandedYear(null);
    } else {
      setExpandedYear(year);
      if (expandedSchool === null && schoolIds.length > 0) {
        setExpandedSchool(schoolIds[0]);
      }
    }
  };

  // Toggle expansion of details for a school
  const toggleSchoolExpansion = (schoolId: string) => {
    setExpandedSchool(expandedSchool === schoolId ? null : schoolId);
  };

  // Helper function to get school color with alpha
  const getSchoolColor = (schoolId: string, alpha = 0.7) => {
    const colorMap: Record<string, string> = {
      lisboan: `rgba(53, 162, 235, ${alpha})`,
      tasis: `rgba(255, 99, 132, ${alpha})`,
      stDominics: `rgba(75, 192, 192, ${alpha})`,
      primaryyears: `rgba(255, 159, 64, ${alpha})`,
      carlucci: `rgba(153, 102, 255, ${alpha})`,
      parkschool: `rgba(255, 205, 86, ${alpha})`,
    };

    return colorMap[schoolId] || `rgba(180, 180, 180, ${alpha})`;
  };

  // Prepare data for the stacked bar chart
  const prepareYearlyBarData = () => {
    const datasets = schoolIds.map(schoolId => {
      const totalsByYear = getTotalByYear(schoolId);

      return {
        label: schoolsData[schoolId].name.split(' ')[0],
        data: years.map(year => totalsByYear[year] || 0),
        backgroundColor: getSchoolColor(schoolId),
        borderColor: getSchoolColor(schoolId, 1),
        borderWidth: 1,
      };
    });

    const data = {
      labels: years.map(year => year.toString()),
      datasets,
    };

    console.log('Chart data prepared:', data);
    return data;
  };

  // Options for the stacked bar chart
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: function (this: any, value: number) {
            return formatCurrency(value);
          } as any,
        },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        titleColor: 'rgba(255, 255, 255, 1)',
        bodyColor: 'rgba(255, 255, 255, 1)',
        padding: 12,
        displayColors: true,
        boxWidth: 10,
        boxHeight: 10,
        boxPadding: 3,
        usePointStyle: false,
        callbacks: {
          label: function (context: any) {
            // Only show the school name and value, no total
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${formatCurrency(value)}`;
          },
          // Remove the title that shows the total
          title: function (context: any) {
            return context[0].label;
          },
        },
      },
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'white',
          boxWidth: 14,
          boxHeight: 14,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
      title: {
        display: true,
        text: 'School Costs Per Year',
        font: {
          size: 16,
          weight: 'bold' as const,
          family: "'Inter', sans-serif",
        },
        color: 'white',
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    animation: {
      duration: 1000,
    },
  };

  // Prepare data for line chart
  const prepareYearlyLineData = () => {
    const datasets = schoolIds.map(schoolId => {
      const totalsByYear = getTotalByYear(schoolId);

      return {
        label: schoolsData[schoolId].name.split(' ')[0],
        data: years.map(year => totalsByYear[year] || 0),
        backgroundColor: getSchoolColor(schoolId),
        borderColor: getSchoolColor(schoolId, 1),
        borderWidth: 2,
        tension: 0.2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: false,
      };
    });

    const data = {
      labels: years.map(year => year.toString()),
      datasets,
    };

    console.log('Line chart data prepared:', data);
    return data;
  };

  // Line chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: function (this: any, value: number) {
            return formatCurrency(value);
          } as any,
        },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        titleColor: 'rgba(255, 255, 255, 1)',
        bodyColor: 'rgba(255, 255, 255, 1)',
        padding: 12,
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${formatCurrency(value)}`;
          },
        },
      },
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'white',
          boxWidth: 14,
          boxHeight: 14,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
      title: {
        display: true,
        text: 'Yearly Cost Projection',
        font: {
          size: 16,
          weight: 'bold' as const,
          family: "'Inter', sans-serif",
        },
        color: 'white',
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    animation: {
      duration: 1000,
    },
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-lg font-semibold text-white">Grade Progression</h3>
          <div className="h-1 w-1 rounded-full bg-gray-600"></div>
          <span className="text-sm text-gray-400 font-medium">Student grade levels by year</span>
        </div>
        <div className="overflow-x-auto bg-gray-900 rounded-lg border border-gray-800 shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-800 bg-gray-950 p-3 text-left font-medium text-gray-300">
                  Child
                </th>
                {years.map(year => (
                  <th
                    key={year}
                    className="border-b border-gray-800 bg-gray-950 p-3 text-center min-w-20 font-medium text-gray-300"
                  >
                    {year}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {familyMembers.map(member => (
                <tr key={member.id}>
                  <td className="p-3 font-medium text-white">{member.name}</td>
                  {years.map(year => {
                    const isInSchool = year <= member.graduationYear;
                    const gradeLevel = isInSchool ? member.age - 5 + (year - years[0]) : null;

                    return (
                      <td
                        key={year}
                        className={`p-3 text-center ${!isInSchool ? 'bg-gray-900 text-gray-500' : 'text-gray-300'}`}
                      >
                        {isInSchool ? `Grade ${gradeLevel}` : 'Graduated'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-lg font-semibold text-white">Year-by-Year Costs</h3>
          <div className="h-1 w-1 rounded-full bg-gray-600"></div>
          <span className="text-sm text-gray-400 font-medium">Click on a year to see details</span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-800 mb-8 shadow-md">
          <table className="w-full border-collapse bg-gray-900">
            <thead>
              <tr>
                <th className="border-b border-gray-800 bg-gray-950 p-3 text-left font-medium text-gray-300">
                  Year
                </th>
                <th className="border-b border-gray-800 bg-gray-950 p-3 text-left font-medium text-gray-300">
                  Students
                </th>
                {schoolIds.map(schoolId => (
                  <th
                    key={schoolId}
                    className="border-b border-gray-800 bg-gray-950 p-3 text-right font-medium text-gray-300"
                  >
                    <div className="flex items-center justify-end gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: getSchoolColor(schoolId),
                          border: '1px solid rgba(255,255,255,0.2)',
                        }}
                      ></div>
                      {schoolsData[schoolId].name.split(' ')[0]}
                    </div>
                  </th>
                ))}
                <th className="border-b border-gray-800 bg-gray-950 p-3 text-right font-medium text-gray-300 w-28">
                  Total
                </th>
                <th className="border-b border-gray-800 bg-gray-950 p-3 text-center font-medium text-gray-300 w-20">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {years.map(year => {
                const isExpanded = expandedYear === year;
                const totals: Record<string, number> = {};
                let yearTotal = 0;

                schoolIds.forEach(schoolId => {
                  const schoolYearTotal = getTotalByYear(schoolId)[year] || 0;
                  totals[schoolId] = schoolYearTotal;
                  yearTotal += schoolYearTotal;
                });

                return (
                  <React.Fragment key={year}>
                    <tr
                      className={`hover:bg-gray-800 ${isExpanded ? 'bg-gray-800' : ''}`}
                      onClick={() => toggleYearExpansion(year)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td
                        className={`p-3 font-medium ${isExpanded ? 'text-blue-400' : 'text-white'}`}
                      >
                        {year}
                      </td>
                      <td className="p-3 text-gray-300">
                        {membersByYear[year].length}
                        {membersByYear[year].length === 1 ? ' child' : ' children'}
                      </td>
                      {schoolIds.map(schoolId => (
                        <td key={schoolId} className="p-3 text-right font-medium text-gray-300">
                          {formatCurrency(totals[schoolId])}
                        </td>
                      ))}
                      <td className="p-3 text-right font-bold text-blue-400">
                        {formatCurrency(yearTotal)}
                      </td>
                      <td className="p-3 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`text-gray-400 h-7 w-7 p-0 rounded-full ${isExpanded ? 'bg-gray-700' : ''}`}
                          onClick={e => {
                            e.stopPropagation();
                            toggleYearExpansion(year);
                          }}
                        >
                          {isExpanded ? '▲' : '▼'}
                        </Button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={schoolIds.length + 4} className="p-0 border-b border-gray-700">
                          <div className="p-5 bg-gray-850">
                            <div className="mb-5">
                              <h4 className="font-semibold mb-3 text-gray-300">
                                Children in school this year:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {membersByYear[year].map(member => {
                                  const ageForYear = member.age + (year - years[0]);
                                  const gradeLevel = ageForYear - 5;

                                  return (
                                    <span
                                      key={member.id}
                                      className="px-3 py-1 bg-gray-700 text-blue-300 rounded-full text-sm"
                                    >
                                      {member.name} (Age {ageForYear}, Grade {gradeLevel})
                                    </span>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="mt-6">
                              <div className="flex space-x-2 mb-4">
                                {schoolIds.map(schoolId => (
                                  <Button
                                    key={schoolId}
                                    variant={expandedSchool === schoolId ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => toggleSchoolExpansion(schoolId)}
                                    className={expandedSchool === schoolId ? 'font-medium' : ''}
                                  >
                                    {schoolsData[schoolId].name.split(' ')[0]}
                                  </Button>
                                ))}
                              </div>

                              {expandedSchool && (
                                <div className="mt-4 border border-gray-700 rounded-lg p-5 bg-gray-850">
                                  <h4 className="font-semibold mb-4 text-gray-200">
                                    {schoolsData[expandedSchool].name} - {year} Breakdown
                                  </h4>

                                  <div className="space-y-6">
                                    {membersByYear[year].map(member => {
                                      const studentCosts =
                                        familyCosts.bySchool[expandedSchool].byStudent[member.id];
                                      const yearCosts = studentCosts.yearly[year];

                                      if (!yearCosts) return null;

                                      return (
                                        <div
                                          key={member.id}
                                          className="border-b border-gray-700 pb-5"
                                        >
                                          <h5 className="font-medium mb-3 text-lg text-white">
                                            {member.name}
                                          </h5>

                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-gray-900 border border-gray-700 rounded">
                                              <div className="p-3 bg-gray-800 border-b border-gray-700 font-medium text-gray-300 uppercase text-xs tracking-wide">
                                                Mandatory Costs
                                              </div>
                                              <table className="w-full text-sm">
                                                <tbody>
                                                  <tr className="border-b border-gray-800">
                                                    <td className="py-2 px-3 text-gray-300">
                                                      Base Tuition
                                                    </td>
                                                    <td className="py-2 px-3 text-right font-medium text-gray-200">
                                                      {formatCurrency(
                                                        yearCosts.breakdown.baseTuition
                                                      )}
                                                    </td>
                                                  </tr>
                                                  <tr className="border-b border-gray-800">
                                                    <td className="py-2 px-3 text-gray-300">
                                                      Enrollment Fee
                                                    </td>
                                                    <td className="py-2 px-3 text-right font-medium text-gray-200">
                                                      {formatCurrency(
                                                        yearCosts.breakdown.yearlyEnrollmentFee
                                                      )}
                                                    </td>
                                                  </tr>
                                                  {year === years[0] &&
                                                    studentCosts.oneTime.registrationFee > 0 && (
                                                      <tr className="border-b border-gray-800">
                                                        <td className="py-2 px-3 text-gray-300">
                                                          Registration Fee
                                                        </td>
                                                        <td className="py-2 px-3 text-right font-medium text-gray-200">
                                                          {formatCurrency(
                                                            studentCosts.oneTime.registrationFee
                                                          )}
                                                        </td>
                                                      </tr>
                                                    )}
                                                  <tr className="bg-gray-800">
                                                    <td className="py-2 px-3 font-medium text-gray-200">
                                                      Subtotal
                                                    </td>
                                                    <td className="py-2 px-3 text-right font-medium text-gray-200">
                                                      {formatCurrency(
                                                        yearCosts.mandatory +
                                                          (year === years[0]
                                                            ? studentCosts.totalOneTime
                                                            : 0)
                                                      )}
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </div>

                                            <div className="bg-gray-900 border border-gray-700 rounded">
                                              <div className="p-3 bg-gray-800 border-b border-gray-700 font-medium text-gray-300 uppercase text-xs tracking-wide">
                                                Optional Costs
                                              </div>
                                              <table className="w-full text-sm">
                                                <tbody>
                                                  {yearCosts.breakdown.lunch > 0 && (
                                                    <tr className="border-b border-gray-800">
                                                      <td className="py-2 px-3 text-gray-300">
                                                        Lunch
                                                      </td>
                                                      <td className="py-2 px-3 text-right font-medium text-gray-200">
                                                        {formatCurrency(yearCosts.breakdown.lunch)}
                                                      </td>
                                                    </tr>
                                                  )}
                                                  {yearCosts.breakdown.transport > 0 && (
                                                    <tr className="border-b border-gray-800">
                                                      <td className="py-2 px-3 text-gray-300">
                                                        Transport
                                                      </td>
                                                      <td className="py-2 px-3 text-right font-medium text-gray-200">
                                                        {formatCurrency(
                                                          yearCosts.breakdown.transport
                                                        )}
                                                      </td>
                                                    </tr>
                                                  )}
                                                  {yearCosts.breakdown.uniform > 0 && (
                                                    <tr className="border-b border-gray-800">
                                                      <td className="py-2 px-3 text-gray-300">
                                                        Uniform
                                                      </td>
                                                      <td className="py-2 px-3 text-right font-medium text-gray-200">
                                                        {formatCurrency(
                                                          yearCosts.breakdown.uniform
                                                        )}
                                                      </td>
                                                    </tr>
                                                  )}
                                                  {yearCosts.breakdown.afterSchool > 0 && (
                                                    <tr className="border-b border-gray-800">
                                                      <td className="py-2 px-3 text-gray-300">
                                                        After School
                                                      </td>
                                                      <td className="py-2 px-3 text-right font-medium text-gray-200">
                                                        {formatCurrency(
                                                          yearCosts.breakdown.afterSchool
                                                        )}
                                                      </td>
                                                    </tr>
                                                  )}
                                                  <tr className="bg-gray-800">
                                                    <td className="py-2 px-3 font-medium text-gray-200">
                                                      Subtotal
                                                    </td>
                                                    <td className="py-2 px-3 text-right font-medium text-gray-200">
                                                      {formatCurrency(yearCosts.optional)}
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                          </div>

                                          <table className="w-full mt-4 text-sm border border-blue-800 bg-blue-950 rounded">
                                            <tbody>
                                              <tr>
                                                <td className="p-3 font-bold text-blue-200">
                                                  Total for {member.name} in {year}
                                                </td>
                                                <td className="p-3 text-right font-bold text-blue-200">
                                                  {formatCurrency(
                                                    yearCosts.total +
                                                      (year === years[0]
                                                        ? studentCosts.totalOneTime
                                                        : 0)
                                                  )}
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                      );
                                    })}

                                    <table className="w-full text-sm border border-blue-800 bg-blue-900 rounded">
                                      <tbody>
                                        <tr>
                                          <td className="p-3 font-bold text-lg text-blue-100">
                                            Total for {schoolsData[expandedSchool].name} in {year}
                                          </td>
                                          <td className="p-3 text-right font-bold text-lg text-blue-100">
                                            {formatCurrency(
                                              getTotalByYear(expandedSchool)[year] || 0
                                            )}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default YearlyProjection;

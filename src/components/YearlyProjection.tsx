import React from 'react';
import { FamilyCosts, FormattedSchoolData, FamilyMember } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Grade Progression</h3>
        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-200 bg-gray-50 p-3 text-left font-medium text-gray-600">
                  Child
                </th>
                {years.map(year => (
                  <th
                    key={year}
                    className="border-b border-gray-200 bg-gray-50 p-3 text-center min-w-20 font-medium text-gray-600"
                  >
                    {year}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {familyMembers.map(member => (
                <tr key={member.id}>
                  <td className="p-3 font-medium">{member.name}</td>
                  {years.map(year => {
                    const isInSchool = year <= member.graduationYear;
                    const gradeLevel = isInSchool ? member.age - 5 + (year - years[0]) : null;

                    return (
                      <td
                        key={year}
                        className={`p-3 text-center ${!isInSchool ? 'bg-gray-50 text-gray-400' : ''}`}
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
        <h3 className="text-lg font-semibold mb-3">Year-by-Year Costs</h3>

        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-200 bg-blue-50 p-3 text-left font-medium text-gray-700">
                  Year
                </th>
                <th className="border-b border-gray-200 bg-blue-50 p-3 text-left font-medium text-gray-700">
                  Students
                </th>
                {schoolIds.map(schoolId => (
                  <th
                    key={schoolId}
                    className="border-b border-gray-200 bg-blue-50 p-3 text-right font-medium text-gray-700"
                  >
                    {schoolsData[schoolId].name.split(' ')[0]}
                  </th>
                ))}
                <th className="border-b border-gray-200 bg-blue-50 p-3 text-center font-medium text-gray-700 w-20">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {years.map(year => {
                const isExpanded = expandedYear === year;
                const totals: Record<string, number> = {};
                schoolIds.forEach(schoolId => {
                  totals[schoolId] = getTotalByYear(schoolId)[year] || 0;
                });

                return (
                  <React.Fragment key={year}>
                    <tr
                      className={`hover:bg-gray-50 ${isExpanded ? 'bg-blue-50' : ''}`}
                      onClick={() => toggleYearExpansion(year)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td className={`p-3 font-medium ${isExpanded ? 'text-blue-600' : ''}`}>
                        {year}
                      </td>
                      <td className="p-3 text-gray-600">
                        {membersByYear[year].length}
                        {membersByYear[year].length === 1 ? ' child' : ' children'}
                      </td>
                      {schoolIds.map(schoolId => (
                        <td key={schoolId} className="p-3 text-right font-bold">
                          {formatCurrency(totals[schoolId])}
                        </td>
                      ))}
                      <td className="p-3 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 h-7 w-7 p-0 rounded-full"
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
                        <td colSpan={schoolIds.length + 3} className="p-0 border-b">
                          <div className="p-5 bg-gray-50">
                            <div className="mb-5">
                              <h4 className="font-semibold mb-3 text-gray-700">
                                Children in school this year:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {membersByYear[year].map(member => (
                                  <span
                                    key={member.id}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                  >
                                    {member.name} (Age {member.age + (year - years[0])})
                                  </span>
                                ))}
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
                                <div className="mt-4 border rounded-lg p-5 bg-white">
                                  <h4 className="font-semibold mb-4 text-gray-800">
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
                                          className="border-b border-gray-200 pb-5"
                                        >
                                          <h5 className="font-medium mb-3 text-lg">
                                            {member.name}
                                          </h5>

                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-white border border-gray-200 rounded">
                                              <div className="p-3 bg-gray-50 border-b font-medium text-gray-600 uppercase text-xs tracking-wide">
                                                Mandatory Costs
                                              </div>
                                              <table className="w-full text-sm">
                                                <tbody>
                                                  <tr className="border-b border-gray-100">
                                                    <td className="py-2 px-3">Base Tuition</td>
                                                    <td className="py-2 px-3 text-right font-medium">
                                                      {formatCurrency(
                                                        yearCosts.breakdown.baseTuition
                                                      )}
                                                    </td>
                                                  </tr>
                                                  <tr className="border-b border-gray-100">
                                                    <td className="py-2 px-3">Enrollment Fee</td>
                                                    <td className="py-2 px-3 text-right font-medium">
                                                      {formatCurrency(
                                                        yearCosts.breakdown.yearlyEnrollmentFee
                                                      )}
                                                    </td>
                                                  </tr>
                                                  {year === years[0] &&
                                                    studentCosts.oneTime.registrationFee > 0 && (
                                                      <tr className="border-b border-gray-100">
                                                        <td className="py-2 px-3">
                                                          Registration Fee
                                                        </td>
                                                        <td className="py-2 px-3 text-right font-medium">
                                                          {formatCurrency(
                                                            studentCosts.oneTime.registrationFee
                                                          )}
                                                        </td>
                                                      </tr>
                                                    )}
                                                  <tr className="bg-gray-50">
                                                    <td className="py-2 px-3 font-medium">
                                                      Subtotal
                                                    </td>
                                                    <td className="py-2 px-3 text-right font-medium">
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

                                            <div className="bg-white border border-gray-200 rounded">
                                              <div className="p-3 bg-gray-50 border-b font-medium text-gray-600 uppercase text-xs tracking-wide">
                                                Optional Costs
                                              </div>
                                              <table className="w-full text-sm">
                                                <tbody>
                                                  {yearCosts.breakdown.lunch > 0 && (
                                                    <tr className="border-b border-gray-100">
                                                      <td className="py-2 px-3">Lunch</td>
                                                      <td className="py-2 px-3 text-right font-medium">
                                                        {formatCurrency(yearCosts.breakdown.lunch)}
                                                      </td>
                                                    </tr>
                                                  )}
                                                  {yearCosts.breakdown.transport > 0 && (
                                                    <tr className="border-b border-gray-100">
                                                      <td className="py-2 px-3">Transport</td>
                                                      <td className="py-2 px-3 text-right font-medium">
                                                        {formatCurrency(
                                                          yearCosts.breakdown.transport
                                                        )}
                                                      </td>
                                                    </tr>
                                                  )}
                                                  {yearCosts.breakdown.uniform > 0 && (
                                                    <tr className="border-b border-gray-100">
                                                      <td className="py-2 px-3">Uniform</td>
                                                      <td className="py-2 px-3 text-right font-medium">
                                                        {formatCurrency(
                                                          yearCosts.breakdown.uniform
                                                        )}
                                                      </td>
                                                    </tr>
                                                  )}
                                                  {yearCosts.breakdown.afterSchool > 0 && (
                                                    <tr className="border-b border-gray-100">
                                                      <td className="py-2 px-3">After School</td>
                                                      <td className="py-2 px-3 text-right font-medium">
                                                        {formatCurrency(
                                                          yearCosts.breakdown.afterSchool
                                                        )}
                                                      </td>
                                                    </tr>
                                                  )}
                                                  <tr className="bg-gray-50">
                                                    <td className="py-2 px-3 font-medium">
                                                      Subtotal
                                                    </td>
                                                    <td className="py-2 px-3 text-right font-medium">
                                                      {formatCurrency(yearCosts.optional)}
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                          </div>

                                          <table className="w-full mt-4 text-sm border bg-blue-50 rounded">
                                            <tbody>
                                              <tr>
                                                <td className="p-3 font-bold">
                                                  Total for {member.name} in {year}
                                                </td>
                                                <td className="p-3 text-right font-bold">
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

                                    <table className="w-full text-sm border bg-blue-100 rounded">
                                      <tbody>
                                        <tr>
                                          <td className="p-3 font-bold text-lg">
                                            Total for {schoolsData[expandedSchool].name} in {year}
                                          </td>
                                          <td className="p-3 text-right font-bold text-lg">
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

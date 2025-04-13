import React from 'react';
import { FamilyCosts, FormattedSchoolData, FamilyMember } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

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
        <h3 className="text-lg font-semibold mb-3 text-white">Grade Progression</h3>
        <div className="overflow-x-auto rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Child</TableHead>
                {years.map(year => (
                  <TableHead key={year} className="text-center min-w-20">
                    {year}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {familyMembers.map(member => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  {years.map(year => {
                    const isInSchool = year <= member.graduationYear;
                    const gradeLevel = isInSchool ? member.age - 5 + (year - years[0]) : null;

                    return (
                      <TableCell
                        key={year}
                        className={`text-center ${!isInSchool ? 'text-gray-400' : ''}`}
                      >
                        {isInSchool ? `Grade ${gradeLevel}` : 'Graduated'}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-white">Year-by-Year Costs</h3>

        <div className="overflow-x-auto rounded-lg mb-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead>Students</TableHead>
                {schoolIds.map(schoolId => (
                  <TableHead key={schoolId} className="text-right">
                    {schoolsData[schoolId].name.split(' ')[0]}
                  </TableHead>
                ))}
                <TableHead className="text-center w-20">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {years.map(year => {
                const isExpanded = expandedYear === year;
                const totals: Record<string, number> = {};
                schoolIds.forEach(schoolId => {
                  totals[schoolId] = getTotalByYear(schoolId)[year] || 0;
                });

                return (
                  <React.Fragment key={year}>
                    <TableRow
                      className={`hover:bg-gray-700/50 ${isExpanded ? 'bg-gray-700' : ''}`}
                      onClick={() => toggleYearExpansion(year)}
                      style={{ cursor: 'pointer' }}
                    >
                      <TableCell className={`font-medium ${isExpanded ? 'text-blue-400' : ''}`}>
                        {year}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {membersByYear[year].length}
                        {membersByYear[year].length === 1 ? ' child' : ' children'}
                      </TableCell>
                      {schoolIds.map(schoolId => (
                        <TableCell key={schoolId} className="text-right font-bold">
                          {formatCurrency(totals[schoolId])}
                        </TableCell>
                      ))}
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-300 h-7 w-7 p-0 rounded-full"
                          onClick={e => {
                            e.stopPropagation();
                            toggleYearExpansion(year);
                          }}
                        >
                          {isExpanded ? '▲' : '▼'}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow>
                        <TableCell
                          colSpan={schoolIds.length + 3}
                          className="p-0 border-b border-gray-700"
                        >
                          <div className="p-5 bg-gray-800">
                            <div className="mb-5">
                              <h4 className="font-semibold mb-3 text-gray-200">
                                Children in school this year:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {membersByYear[year].map(member => (
                                  <span
                                    key={member.id}
                                    className="px-3 py-1 bg-blue-900 text-blue-100 rounded-full text-sm"
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
                                <div className="mt-4 border border-gray-700 rounded-lg p-5 bg-gray-800">
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
                                          <h5 className="font-medium mb-3 text-lg text-gray-200">
                                            {member.name}
                                          </h5>

                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-gray-900 border border-gray-700 rounded-lg">
                                              <div className="p-3 bg-gray-800 border-b border-gray-700 font-medium text-gray-300 uppercase text-xs tracking-wide">
                                                Mandatory Costs
                                              </div>
                                              <Table>
                                                <TableBody>
                                                  <TableRow>
                                                    <TableCell>Base Tuition</TableCell>
                                                    <TableCell className="text-right font-medium">
                                                      {formatCurrency(
                                                        yearCosts.breakdown.baseTuition
                                                      )}
                                                    </TableCell>
                                                  </TableRow>
                                                  <TableRow>
                                                    <TableCell>Enrollment Fee</TableCell>
                                                    <TableCell className="text-right font-medium">
                                                      {formatCurrency(
                                                        yearCosts.breakdown.yearlyEnrollmentFee
                                                      )}
                                                    </TableCell>
                                                  </TableRow>
                                                  {year === years[0] &&
                                                    studentCosts.oneTime.registrationFee > 0 && (
                                                      <TableRow>
                                                        <TableCell>Registration Fee</TableCell>
                                                        <TableCell className="text-right font-medium">
                                                          {formatCurrency(
                                                            studentCosts.oneTime.registrationFee
                                                          )}
                                                        </TableCell>
                                                      </TableRow>
                                                    )}
                                                  <TableRow className="bg-gray-800">
                                                    <TableCell className="font-medium">
                                                      Subtotal
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium">
                                                      {formatCurrency(
                                                        yearCosts.mandatory +
                                                          (year === years[0]
                                                            ? studentCosts.totalOneTime
                                                            : 0)
                                                      )}
                                                    </TableCell>
                                                  </TableRow>
                                                </TableBody>
                                              </Table>
                                            </div>

                                            <div className="bg-gray-900 border border-gray-700 rounded-lg">
                                              <div className="p-3 bg-gray-800 border-b border-gray-700 font-medium text-gray-300 uppercase text-xs tracking-wide">
                                                Optional Costs
                                              </div>
                                              <Table>
                                                <TableBody>
                                                  {yearCosts.breakdown.lunch > 0 && (
                                                    <TableRow>
                                                      <TableCell>Lunch</TableCell>
                                                      <TableCell className="text-right font-medium">
                                                        {formatCurrency(yearCosts.breakdown.lunch)}
                                                      </TableCell>
                                                    </TableRow>
                                                  )}
                                                  {yearCosts.breakdown.transport > 0 && (
                                                    <TableRow>
                                                      <TableCell>Transport</TableCell>
                                                      <TableCell className="text-right font-medium">
                                                        {formatCurrency(
                                                          yearCosts.breakdown.transport
                                                        )}
                                                      </TableCell>
                                                    </TableRow>
                                                  )}
                                                  {yearCosts.breakdown.uniform > 0 && (
                                                    <TableRow>
                                                      <TableCell>Uniform</TableCell>
                                                      <TableCell className="text-right font-medium">
                                                        {formatCurrency(
                                                          yearCosts.breakdown.uniform
                                                        )}
                                                      </TableCell>
                                                    </TableRow>
                                                  )}
                                                  {yearCosts.breakdown.afterSchool > 0 && (
                                                    <TableRow>
                                                      <TableCell>After School</TableCell>
                                                      <TableCell className="text-right font-medium">
                                                        {formatCurrency(
                                                          yearCosts.breakdown.afterSchool
                                                        )}
                                                      </TableCell>
                                                    </TableRow>
                                                  )}
                                                  <TableRow className="bg-gray-800">
                                                    <TableCell className="font-medium">
                                                      Subtotal
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium">
                                                      {formatCurrency(yearCosts.optional)}
                                                    </TableCell>
                                                  </TableRow>
                                                </TableBody>
                                              </Table>
                                            </div>
                                          </div>

                                          <div className="w-full mt-4 p-3 bg-blue-900 text-blue-100 rounded-lg">
                                            <div className="flex justify-between">
                                              <div className="font-bold">
                                                Total for {member.name} in {year}
                                              </div>
                                              <div className="font-bold">
                                                {formatCurrency(
                                                  yearCosts.total +
                                                    (year === years[0]
                                                      ? studentCosts.totalOneTime
                                                      : 0)
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}

                                    <div className="w-full p-3 bg-blue-800 text-blue-100 rounded-lg">
                                      <div className="flex justify-between">
                                        <div className="font-bold text-lg">
                                          Total for {schoolsData[expandedSchool].name} in {year}
                                        </div>
                                        <div className="font-bold text-lg">
                                          {formatCurrency(
                                            getTotalByYear(expandedSchool)[year] || 0
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default YearlyProjection;

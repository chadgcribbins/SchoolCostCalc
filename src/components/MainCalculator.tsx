'use client';

import { useState } from 'react';
import { FamilyMember, FormattedSchoolData, FamilyCosts, StudentCosts, YearlyCost } from '@/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CostCustomizationPanel from '@/components/CostCustomizationPanel';
import FamilyMembersPanel from '@/components/FamilyMembersPanel';
import YearlyProjection from '@/components/YearlyProjection';
import VisualizationPanel from '@/components/VisualizationPanel';
import CostSummary from '@/components/CostSummary';
import realSchoolsData from '@/data/real-schools-data';
import { Grid } from '@/components/ui/grid';

const MainCalculator = () => {
  // Convert real school data to the format needed by the calculator
  const formatSchoolData = () => {
    const formattedData: Record<string, FormattedSchoolData> = {};

    Object.keys(realSchoolsData).forEach(schoolKey => {
      const school = realSchoolsData[schoolKey];

      formattedData[schoolKey] = {
        name: school.name,
        baseTuition: school.baseTuition,
        registrationFee: school.registrationFee + school.applicationFee, // Combine application and registration
        yearlyEnrollmentFee: school.yearlyEnrollmentFee,
        lunch: school.lunch,
        transport: school.transport,
        uniform: school.uniform,
        afterSchool: school.afterSchool,
        url: school.url,
        feesUrl: school.feesUrl,
        siblingDiscount: typeof school.siblingDiscount === 'number' ? school.siblingDiscount : 0,
        includesLunch: school.includesLunch || false,
      };
    });

    return formattedData;
  };

  // Default school data
  const defaultSchoolsData = formatSchoolData();

  // Core state variables
  const [schoolsData] = useState(defaultSchoolsData);
  const [customSchoolsData, setCustomSchoolsData] = useState<Record<string, FormattedSchoolData>>({
    ...defaultSchoolsData,
  });
  const [useCustomCosts, setUseCustomCosts] = useState(false);
  const [currency, setCurrency] = useState('EUR');
  const [exchangeRate] = useState(0.835); // EUR to GBP as of April 2025
  const [inflationRate, setInflationRate] = useState(2.5);
  const [applyInflation, setApplyInflation] = useState(true);
  const [yearlyCustomCosts, setYearlyCustomCosts] = useState<Record<string, any>>({});
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const [expandedSchool, setExpandedSchool] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('cost-summary');

  // Family members state (initially set up with three children based on research doc)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: 1,
      name: 'Mayāḥ',
      age: 13,
      graduationYear: 2030,
      includeOptionalCosts: { lunch: true, transport: true, uniform: true, afterSchool: false },
    },
    {
      id: 2,
      name: 'Saßin',
      age: 10,
      graduationYear: 2033,
      includeOptionalCosts: { lunch: true, transport: true, uniform: true, afterSchool: false },
    },
    {
      id: 3,
      name: 'Eschęr',
      age: 8,
      graduationYear: 2035,
      includeOptionalCosts: { lunch: true, transport: true, uniform: true, afterSchool: false },
    },
  ]);

  // Optional costs toggles
  const [includeLunch, setIncludeLunch] = useState(true);
  const [includeTransport, setIncludeTransport] = useState(true);
  const [includeUniform, setIncludeUniform] = useState(true);
  const [includeAfterSchool, setIncludeAfterSchool] = useState(false);

  // Get current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    const symbol = currency === 'EUR' ? '€' : '£';
    const value = currency === 'EUR' ? amount : amount * exchangeRate;
    return `${symbol}${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  // Helper function to calculate inflated cost
  const calculateInflatedCost = (baseAmount: number, year: number) => {
    if (!applyInflation) return baseAmount;
    const yearDiff = year - currentYear;
    return baseAmount * Math.pow(1 + inflationRate / 100, yearDiff);
  };

  // Function to get yearly cost for a school and year
  const getYearlyCost = (schoolId: string, year: number, costType: keyof FormattedSchoolData) => {
    // Get the correct data based on user preference
    const schoolData = useCustomCosts ? customSchoolsData[schoolId] : schoolsData[schoolId];

    // Return the cost with inflation applied
    return calculateInflatedCost(schoolData[costType] as number, year);
  };

  // Function to apply sibling discounts based on school policy
  const applySiblingDiscount = (schoolId: string, tuition: number, childIndex: number) => {
    const school = realSchoolsData[schoolId];
    if (!school) return tuition;

    if (typeof school.siblingDiscount === 'number') {
      return childIndex === 0 ? tuition : tuition * (1 - school.siblingDiscount / 100);
    }

    if (!school.siblingDiscount) return tuition;

    // If it's the first child, no discount
    if (childIndex === 0) return tuition;

    // For second child
    if (childIndex === 1 && school.siblingDiscount.second) {
      return tuition * (1 - school.siblingDiscount.second / 100);
    }

    // For third child
    if (childIndex === 2 && school.siblingDiscount.third) {
      return tuition * (1 - school.siblingDiscount.third / 100);
    }

    // For fourth child (if applicable)
    if (childIndex === 3 && school.siblingDiscount.fourth) {
      return tuition * (1 - school.siblingDiscount.fourth / 100);
    }

    return tuition;
  };

  // Function to calculate costs for a student
  const calculateStudentCosts = (
    student: FamilyMember,
    schoolId: string,
    studentIndex = 0
  ): StudentCosts => {
    const costs: StudentCosts = {
      mandatory: {},
      optional: {},
      oneTime: {},
      yearly: {},
      totalMandatory: 0,
      totalOptional: 0,
      totalOneTime: 0,
      grandTotal: 0,
    };

    const yearlyTotal: Record<number, YearlyCost> = {};
    const school = useCustomCosts ? customSchoolsData[schoolId] : schoolsData[schoolId];
    let totalMandatory = 0;
    let totalOptional = 0;
    let totalOneTime = 0;

    // Registration fee (one-time)
    costs.oneTime.registrationFee = school.registrationFee;
    totalOneTime += school.registrationFee;

    // Calculate yearly costs from student age until graduation
    for (const year of years) {
      if (year > student.graduationYear) break;

      let baseTuition = getYearlyCost(schoolId, year, 'baseTuition');

      // Apply sibling discount if applicable
      baseTuition = applySiblingDiscount(schoolId, baseTuition, studentIndex);

      const yearlyEnrollmentFee = getYearlyCost(schoolId, year, 'yearlyEnrollmentFee');
      const yearlyMandatory = baseTuition + yearlyEnrollmentFee;

      let yearlyOptional = 0;
      let lunchCost = 0;
      let transportCost = 0;
      let uniformCost = 0;
      let afterSchoolCost = 0;

      // Optional costs
      if (student.includeOptionalCosts.lunch && includeLunch) {
        // Check if lunch is included in tuition for this school
        const schoolInfo = realSchoolsData[schoolId];
        if (!schoolInfo || !schoolInfo.includesLunch) {
          lunchCost = getYearlyCost(schoolId, year, 'lunch');
          yearlyOptional += lunchCost;
        }
      }

      if (student.includeOptionalCosts.transport && includeTransport) {
        transportCost = getYearlyCost(schoolId, year, 'transport');
        yearlyOptional += transportCost;
      }

      if (student.includeOptionalCosts.uniform && includeUniform) {
        uniformCost = getYearlyCost(schoolId, year, 'uniform');
        yearlyOptional += uniformCost;
      }

      if (student.includeOptionalCosts.afterSchool && includeAfterSchool) {
        afterSchoolCost = getYearlyCost(schoolId, year, 'afterSchool');
        yearlyOptional += afterSchoolCost;
      }

      totalMandatory += yearlyMandatory;
      totalOptional += yearlyOptional;

      yearlyTotal[year] = {
        mandatory: yearlyMandatory,
        optional: yearlyOptional,
        total: yearlyMandatory + yearlyOptional,
        breakdown: {
          baseTuition: baseTuition,
          yearlyEnrollmentFee: yearlyEnrollmentFee,
          lunch: lunchCost,
          transport: transportCost,
          uniform: uniformCost,
          afterSchool: afterSchoolCost,
        },
      };
    }

    costs.yearly = yearlyTotal;
    costs.totalMandatory = totalMandatory;
    costs.totalOptional = totalOptional;
    costs.totalOneTime = totalOneTime;
    costs.grandTotal = totalMandatory + totalOptional + totalOneTime;

    return costs;
  };

  // Function to calculate costs for the entire family
  const calculateFamilyCosts = (): FamilyCosts => {
    const familyCosts: FamilyCosts = {
      bySchool: {},
    };

    // For each school
    Object.keys(schoolsData).forEach(schoolId => {
      familyCosts.bySchool[schoolId] = {
        byStudent: {},
        totalMandatory: 0,
        totalOptional: 0,
        totalOneTime: 0,
        grandTotal: 0,
      };

      // For each family member
      familyMembers.forEach((member, index) => {
        const studentCosts = calculateStudentCosts(member, schoolId, index);

        familyCosts.bySchool[schoolId].byStudent[member.id] = studentCosts;
        familyCosts.bySchool[schoolId].totalMandatory += studentCosts.totalMandatory;
        familyCosts.bySchool[schoolId].totalOptional += studentCosts.totalOptional;
        familyCosts.bySchool[schoolId].totalOneTime += studentCosts.totalOneTime;
        familyCosts.bySchool[schoolId].grandTotal += studentCosts.grandTotal;
      });
    });

    return familyCosts;
  };

  // Reset custom data to default
  const resetCustomData = () => {
    setCustomSchoolsData({ ...defaultSchoolsData });
    setYearlyCustomCosts({});
  };

  // Function to handle updating the custom school data
  const handleUpdateCustomSchoolData = (
    schoolId: string,
    field: keyof FormattedSchoolData,
    value: number
  ) => {
    setCustomSchoolsData(prevData => ({
      ...prevData,
      [schoolId]: {
        ...prevData[schoolId],
        [field]: value,
      },
    }));
  };

  // Calculate all costs
  const familyCosts = calculateFamilyCosts();

  return (
    <Grid cols={1} gap="lg">
      <Tabs
        defaultValue="cost-summary"
        className="space-y-4"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cost-summary">Cost Summary</TabsTrigger>
          <TabsTrigger value="family">Family Members</TabsTrigger>
          <TabsTrigger value="customize">Customize Costs</TabsTrigger>
          <TabsTrigger value="projection">Yearly Projection</TabsTrigger>
        </TabsList>

        <TabsContent
          value="family"
          className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700"
        >
          <FamilyMembersPanel
            familyMembers={familyMembers}
            setFamilyMembers={setFamilyMembers}
            years={years}
            currentYear={currentYear}
          />
        </TabsContent>

        <TabsContent
          value="customize"
          className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700"
        >
          <CostCustomizationPanel
            schoolsData={customSchoolsData}
            useCustomCosts={useCustomCosts}
            setUseCustomCosts={setUseCustomCosts}
            updateSchoolData={handleUpdateCustomSchoolData}
            currency={currency}
            setCurrency={setCurrency}
            exchangeRate={exchangeRate}
            formatCurrency={formatCurrency}
            resetCustomData={resetCustomData}
            includeLunch={includeLunch}
            setIncludeLunch={setIncludeLunch}
            includeTransport={includeTransport}
            setIncludeTransport={setIncludeTransport}
            includeUniform={includeUniform}
            setIncludeUniform={setIncludeUniform}
            includeAfterSchool={includeAfterSchool}
            setIncludeAfterSchool={setIncludeAfterSchool}
            inflationRate={inflationRate}
            setInflationRate={setInflationRate}
            applyInflation={applyInflation}
            setApplyInflation={setApplyInflation}
          />
        </TabsContent>

        <TabsContent
          value="cost-summary"
          className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700"
        >
          <CostSummary
            familyCosts={familyCosts}
            schoolsData={schoolsData}
            formatCurrency={formatCurrency}
            familyMembers={familyMembers}
            setActiveTab={setActiveTab}
            years={years}
            currentYear={currentYear}
          />
        </TabsContent>

        <TabsContent
          value="projection"
          className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700"
        >
          <YearlyProjection
            familyCosts={familyCosts}
            schoolsData={schoolsData}
            formatCurrency={formatCurrency}
            years={years}
            familyMembers={familyMembers}
            expandedYear={expandedYear}
            setExpandedYear={setExpandedYear}
            expandedSchool={expandedSchool}
            setExpandedSchool={setExpandedSchool}
          />
        </TabsContent>
      </Tabs>
    </Grid>
  );
};

export default MainCalculator;

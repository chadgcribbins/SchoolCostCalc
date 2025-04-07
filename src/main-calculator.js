import React, { useState } from 'react';
import CostCustomizationPanel from './CostCustomizationPanel';
import FamilyMembersPanel from './FamilyMembersPanel';
import YearlyProjection from './YearlyProjection';
import VisualizationPanel from './VisualizationPanel';
import CostSummary from './CostSummary';

const PortugalSchoolCalculator = () => {
  // Default school data
  const defaultSchoolsData = {
    schoolA: {
      name: "International School A",
      baseTuition: 15800,
      registrationFee: 3500,
      yearlyEnrollmentFee: 350,
      lunch: 1650,
      transport: 2200,
      uniform: 550,
      afterSchool: 1200
    },
    schoolB: {
      name: "International School B",
      baseTuition: 17250,
      registrationFee: 3200,
      yearlyEnrollmentFee: 250,
      lunch: 1800,
      transport: 2400,
      uniform: 650,
      afterSchool: 1400
    },
    schoolC: {
      name: "International School C",
      baseTuition: 14500,
      registrationFee: 2800,
      yearlyEnrollmentFee: 300,
      lunch: 1500,
      transport: 2000,
      uniform: 450,
      afterSchool: 1100
    }
  };

  // Core state variables
  const [schoolsData, setSchoolsData] = useState(defaultSchoolsData);
  const [customSchoolsData, setCustomSchoolsData] = useState({...defaultSchoolsData});
  const [useCustomCosts, setUseCustomCosts] = useState(false);
  const [currency, setCurrency] = useState('EUR');
  const [exchangeRate] = useState(0.85); // EUR to GBP
  const [inflationRate, setInflationRate] = useState(2.5);
  const [applyInflation, setApplyInflation] = useState(true);
  const [yearlyCustomCosts, setYearlyCustomCosts] = useState({});
  const [expandedYear, setExpandedYear] = useState(null);
  const [expandedSchool, setExpandedSchool] = useState(null);
  const [activeTab, setActiveTab] = useState('comparison');

  // Family members state
  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: "Child 1", age: 8, graduationYear: 2032, includeOptionalCosts: { lunch: true, transport: true, uniform: true, afterSchool: false } }
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
  const formatCurrency = (amount) => {
    const symbol = currency === 'EUR' ? '€' : '£';
    const value = currency === 'EUR' ? amount : amount * exchangeRate;
    return `${symbol}${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  // Helper function to calculate inflated cost
  const calculateInflatedCost = (baseAmount, year) => {
    if (!applyInflation) return baseAmount;
    const yearDiff = year - currentYear;
    return baseAmount * Math.pow(1 + inflationRate/100, yearDiff);
  };

  // Function to get yearly cost for a school and year
  const getYearlyCost = (schoolId, year, costType) => {
    // Check if there's a custom yearly cost
    if (yearlyCustomCosts[year] && yearlyCustomCosts[year][schoolId] && 
        yearlyCustomCosts[year][schoolId][costType] !== undefined) {
      return yearlyCustomCosts[year][schoolId][costType];
    }
    
    // Otherwise calculate with inflation
    const baseData = useCustomCosts ? customSchoolsData[schoolId] : schoolsData[schoolId];
    return calculateInflatedCost(baseData[costType], year);
  };

  // Function to calculate costs for a student
  const calculateStudentCosts = (student, schoolId) => {
    const costs = { mandatory: {}, optional: {}, oneTime: {}, yearly: {} };
    const yearlyTotal = {};
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
      
      const baseTuition = getYearlyCost(schoolId, year, 'baseTuition');
      const yearlyEnrollmentFee = getYearlyCost(schoolId, year, 'yearlyEnrollmentFee');
      const yearlyMandatory = baseTuition + yearlyEnrollmentFee;
      
      let yearlyOptional = 0;
      let lunchCost = 0;
      let transportCost = 0;
      let uniformCost = 0;
      let afterSchoolCost = 0;
      
      // Optional costs
      if (student.includeOptionalCosts.lunch && includeLunch) {
        lunchCost = getYearlyCost(schoolId, year, 'lunch');
        yearlyOptional += lunchCost;
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
          afterSchool: afterSchoolCost
        }
      };
    }
    
    costs.mandatory.total = totalMandatory;
    costs.optional.total = totalOptional;
    costs.oneTime.total = totalOneTime;
    costs.grandTotal = totalMandatory + totalOptional + totalOneTime;
    costs.yearly = yearlyTotal;
    
    return costs;
  };

  // Calculate total costs for all family members
  const calculateFamilyCosts = () => {
    const familyCosts = {};
    
    Object.keys(schoolsData).forEach(schoolId => {
      const schoolCosts = {
        mandatory: { total: 0 },
        optional: { total: 0 },
        oneTime: { total: 0 },
        grandTotal: 0,
        yearly: {}
      };
      
      familyMembers.forEach(member => {
        const memberCosts = calculateStudentCosts(member, schoolId);
        
        schoolCosts.mandatory.total += memberCosts.mandatory.total;
        schoolCosts.optional.total += memberCosts.optional.total;
        schoolCosts.oneTime.total += memberCosts.oneTime.total;
        schoolCosts.grandTotal += memberCosts.grandTotal;
        
        // Combine yearly costs
        Object.keys(memberCosts.yearly).forEach(year => {
          if (!schoolCosts.yearly[year]) {
            schoolCosts.yearly[year] = {
              mandatory: 0,
              optional: 0,
              total: 0,
              breakdown: {
                baseTuition: 0,
                yearlyEnrollmentFee: 0,
                lunch: 0,
                transport: 0,
                uniform: 0,
                afterSchool: 0
              }
            };
          }
          
          schoolCosts.yearly[year].mandatory += memberCosts.yearly[year].mandatory;
          schoolCosts.yearly[year].optional += memberCosts.yearly[year].optional;
          schoolCosts.yearly[year].total += memberCosts.yearly[year].total;
          
          // Add breakdown details
          schoolCosts.yearly[year].breakdown.baseTuition += memberCosts.yearly[year].breakdown.baseTuition;
          schoolCosts.yearly[year].breakdown.yearlyEnrollmentFee += memberCosts.yearly[year].breakdown.yearlyEnrollmentFee;
          schoolCosts.yearly[year].breakdown.lunch += memberCosts.yearly[year].breakdown.lunch;
          schoolCosts.yearly[year].breakdown.transport += memberCosts.yearly[year].breakdown.transport;
          schoolCosts.yearly[year].breakdown.uniform += memberCosts.yearly[year].breakdown.uniform;
          schoolCosts.yearly[year].breakdown.afterSchool += memberCosts.yearly[year].breakdown.afterSchool;
        });
      });
      
      familyCosts[schoolId] = schoolCosts;
    });
    
    return familyCosts;
  };
  
  const familyCosts = calculateFamilyCosts();

  // Reset all custom data to defaults
  const resetCustomData = () => {
    setCustomSchoolsData({...defaultSchoolsData});
    setYearlyCustomCosts({});
    setInflationRate(2.5);
    setUseCustomCosts(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Portugal School Cost Calculator</h1>
      
      {/* Settings Panel */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Calculator Settings</h2>
          <div className="flex space-x-4">
            <div>
              <label className="mr-2 font-medium">Currency:</label>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className="border rounded p-1"
              >
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>
        
        <CostCustomizationPanel 
          schoolsData={schoolsData}
          setSchoolsData={setSchoolsData}
          customSchoolsData={customSchoolsData}
          setCustomSchoolsData={setCustomSchoolsData}
          useCustomCosts={useCustomCosts}
          setUseCustomCosts={setUseCustomCosts}
          inflationRate={inflationRate}
          setInflationRate={setInflationRate}
          applyInflation={applyInflation}
          setApplyInflation={setApplyInflation}
          resetCustomData={resetCustomData}
        />
        
        {/* Optional Costs Toggles */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Optional Costs</h3>
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center">
              <input 
                type="checkbox" 
                checked={includeLunch} 
                onChange={() => setIncludeLunch(!includeLunch)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2">Lunch</span>
            </label>
            <label className="inline-flex items-center">
              <input 
                type="checkbox" 
                checked={includeTransport} 
                onChange={() => setIncludeTransport(!includeTransport)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2">Transport</span>
            </label>
            <label className="inline-flex items-center">
              <input 
                type="checkbox" 
                checked={includeUniform} 
                onChange={() => setIncludeUniform(!includeUniform)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2">Uniform</span>
            </label>
            <label className="inline-flex items-center">
              <input 
                type="checkbox" 
                checked={includeAfterSchool} 
                onChange={() => setIncludeAfterSchool(!includeAfterSchool)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2">After School Activities</span>
            </label>
          </div>
        </div>
      </div>
      
      <FamilyMembersPanel 
        familyMembers={familyMembers}
        setFamilyMembers={setFamilyMembers}
        includeLunch={includeLunch}
        includeTransport={includeTransport}
        includeUniform={includeUniform}
        includeAfterSchool={includeAfterSchool}
        currentYear={currentYear}
      />
      
      <CostSummary 
        schoolsData={schoolsData}
        familyCosts={familyCosts}
        formatCurrency={formatCurrency}
      />
      
      <YearlyProjection 
        schoolsData={schoolsData}
        familyCosts={familyCosts}
        years={years}
        formatCurrency={formatCurrency}
        useCustomCosts={useCustomCosts}
        yearlyCustomCosts={yearlyCustomCosts}
        setYearlyCustomCosts={setYearlyCustomCosts}
        getYearlyCost={getYearlyCost}
        calculateInflatedCost={calculateInflatedCost}
        expandedYear={expandedYear}
        setExpandedYear={setExpandedYear}
        expandedSchool={expandedSchool}
        setExpandedSchool={setExpandedSchool}
        customSchoolsData={customSchoolsData}
      />
      
      <VisualizationPanel 
        schoolsData={schoolsData}
        familyCosts={familyCosts}
        years={years}
        formatCurrency={formatCurrency}
        currentYear={currentYear}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

export default PortugalSchoolCalculator;
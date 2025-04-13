import { ChangeEvent, useState } from 'react';
import { FormattedSchoolData } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface CostCustomizationPanelProps {
  schoolsData: Record<string, FormattedSchoolData>;
  useCustomCosts: boolean;
  setUseCustomCosts: (value: boolean) => void;
  updateSchoolData: (schoolId: string, field: keyof FormattedSchoolData, value: number) => void;
  currency: string;
  setCurrency: (value: string) => void;
  exchangeRate: number;
  formatCurrency: (amount: number) => string;
  resetCustomData: () => void;
  includeLunch: boolean;
  setIncludeLunch: (value: boolean) => void;
  includeTransport: boolean;
  setIncludeTransport: (value: boolean) => void;
  includeUniform: boolean;
  setIncludeUniform: (value: boolean) => void;
  includeAfterSchool: boolean;
  setIncludeAfterSchool: (value: boolean) => void;
  inflationRate: number;
  setInflationRate: (value: number) => void;
  applyInflation: boolean;
  setApplyInflation: (value: boolean) => void;
}

const CostCustomizationPanel = ({
  schoolsData,
  useCustomCosts,
  setUseCustomCosts,
  updateSchoolData,
  currency,
  setCurrency,
  exchangeRate,
  formatCurrency,
  resetCustomData,
  includeLunch,
  setIncludeLunch,
  includeTransport,
  setIncludeTransport,
  includeUniform,
  setIncludeUniform,
  includeAfterSchool,
  setIncludeAfterSchool,
  inflationRate,
  setInflationRate,
  applyInflation,
  setApplyInflation,
}: CostCustomizationPanelProps) => {
  const [activeSchoolTab, setActiveSchoolTab] = useState(Object.keys(schoolsData)[0]);

  const handleNumberChange = (
    e: ChangeEvent<HTMLInputElement>,
    schoolId: string,
    field: keyof FormattedSchoolData
  ) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      updateSchoolData(schoolId, field, value);
    }
  };

  const handleInflationRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 20) {
      setInflationRate(value);
    }
  };

  return (
    <Card className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Cost Customization</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Optional Costs</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-lunch"
                checked={includeLunch}
                onCheckedChange={checked => setIncludeLunch(checked === true)}
              />
              <label
                htmlFor="include-lunch"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include Lunch
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-transport"
                checked={includeTransport}
                onCheckedChange={checked => setIncludeTransport(checked === true)}
              />
              <label
                htmlFor="include-transport"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include Transport
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-uniform"
                checked={includeUniform}
                onCheckedChange={checked => setIncludeUniform(checked === true)}
              />
              <label
                htmlFor="include-uniform"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include Uniform
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-after-school"
                checked={includeAfterSchool}
                onCheckedChange={checked => setIncludeAfterSchool(checked === true)}
              />
              <label
                htmlFor="include-after-school"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include After School
              </label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Financial Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Exchange rate: 1 EUR = {exchangeRate} GBP
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Inflation Rate (%)</label>
              <input
                type="number"
                min="0"
                max="20"
                step="0.1"
                value={inflationRate}
                onChange={handleInflationRateChange}
                disabled={!applyInflation}
                className={`w-full px-3 py-2 border rounded ${!applyInflation ? 'opacity-50' : ''}`}
              />
            </div>

            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="apply-inflation"
                  checked={applyInflation}
                  onCheckedChange={checked => setApplyInflation(checked === true)}
                />
                <label
                  htmlFor="apply-inflation"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Apply Inflation
                </label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Custom School Costs</h3>
            <div className="flex space-x-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="use-custom-costs"
                  checked={useCustomCosts}
                  onCheckedChange={checked => setUseCustomCosts(checked === true)}
                />
                <label
                  htmlFor="use-custom-costs"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Use Custom Costs
                </label>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={resetCustomData}
                disabled={!useCustomCosts}
              >
                Reset
              </Button>
            </div>
          </div>

          <Tabs value={activeSchoolTab} onValueChange={setActiveSchoolTab} className="w-full">
            <TabsList className="mb-4 flex overflow-auto">
              {Object.keys(schoolsData).map(schoolId => (
                <TabsTrigger key={schoolId} value={schoolId} className="whitespace-nowrap">
                  {schoolsData[schoolId].name.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.keys(schoolsData).map(schoolId => (
              <TabsContent key={schoolId} value={schoolId} className="space-y-4">
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${!useCustomCosts ? 'opacity-50' : ''}`}
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">Base Tuition</label>
                    <div className="flex items-center">
                      <span className="mr-2">{currency === 'EUR' ? '€' : '£'}</span>
                      <input
                        type="number"
                        min="0"
                        value={schoolsData[schoolId].baseTuition}
                        onChange={e => handleNumberChange(e, schoolId, 'baseTuition')}
                        disabled={!useCustomCosts}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Registration Fee</label>
                    <div className="flex items-center">
                      <span className="mr-2">{currency === 'EUR' ? '€' : '£'}</span>
                      <input
                        type="number"
                        min="0"
                        value={schoolsData[schoolId].registrationFee}
                        onChange={e => handleNumberChange(e, schoolId, 'registrationFee')}
                        disabled={!useCustomCosts}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Yearly Enrollment Fee</label>
                    <div className="flex items-center">
                      <span className="mr-2">{currency === 'EUR' ? '€' : '£'}</span>
                      <input
                        type="number"
                        min="0"
                        value={schoolsData[schoolId].yearlyEnrollmentFee}
                        onChange={e => handleNumberChange(e, schoolId, 'yearlyEnrollmentFee')}
                        disabled={!useCustomCosts}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Sibling Discount (%)</label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={schoolsData[schoolId].siblingDiscount}
                        onChange={e => handleNumberChange(e, schoolId, 'siblingDiscount')}
                        disabled={!useCustomCosts}
                        className="w-full px-3 py-2 border rounded"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Lunch (Yearly)</label>
                    <div className="flex items-center">
                      <span className="mr-2">{currency === 'EUR' ? '€' : '£'}</span>
                      <input
                        type="number"
                        min="0"
                        value={schoolsData[schoolId].lunch}
                        onChange={e => handleNumberChange(e, schoolId, 'lunch')}
                        disabled={!useCustomCosts || schoolsData[schoolId].includesLunch}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    {schoolsData[schoolId].includesLunch && (
                      <p className="mt-1 text-xs text-green-600">Included in tuition</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Transport (Yearly)</label>
                    <div className="flex items-center">
                      <span className="mr-2">{currency === 'EUR' ? '€' : '£'}</span>
                      <input
                        type="number"
                        min="0"
                        value={schoolsData[schoolId].transport}
                        onChange={e => handleNumberChange(e, schoolId, 'transport')}
                        disabled={!useCustomCosts}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Uniform (Yearly)</label>
                    <div className="flex items-center">
                      <span className="mr-2">{currency === 'EUR' ? '€' : '£'}</span>
                      <input
                        type="number"
                        min="0"
                        value={schoolsData[schoolId].uniform}
                        onChange={e => handleNumberChange(e, schoolId, 'uniform')}
                        disabled={!useCustomCosts}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">After School (Yearly)</label>
                    <div className="flex items-center">
                      <span className="mr-2">{currency === 'EUR' ? '€' : '£'}</span>
                      <input
                        type="number"
                        min="0"
                        value={schoolsData[schoolId].afterSchool}
                        onChange={e => handleNumberChange(e, schoolId, 'afterSchool')}
                        disabled={!useCustomCosts}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </Card>
  );
};

export default CostCustomizationPanel;

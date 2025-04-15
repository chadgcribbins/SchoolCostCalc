'use client';

import { ChangeEvent, useState } from 'react';
import { FormattedSchoolData } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Grid } from '@/components/ui/grid';

interface CostCustomizationPanelProps {
  schoolsData: Record<string, FormattedSchoolData>;
  customSchoolsData: Record<string, FormattedSchoolData>;
  useCustomCosts: boolean;
  setUseCustomCosts: (value: boolean) => void;
  handleUpdateCustomSchoolData: (
    schoolId: string,
    field: keyof FormattedSchoolData,
    value: number
  ) => void;
  resetCustomData: () => void;
  inflationRate: number;
  setInflationRate: (value: number) => void;
  applyInflation: boolean;
  setApplyInflation: (value: boolean) => void;
  currency: string;
  setCurrency: (value: string) => void;
  exchangeRate: number;
}

const CostCustomizationPanel = ({
  schoolsData,
  customSchoolsData,
  useCustomCosts,
  setUseCustomCosts,
  handleUpdateCustomSchoolData: updateSchoolData,
  resetCustomData,
  inflationRate,
  setInflationRate,
  applyInflation,
  setApplyInflation,
  currency,
  setCurrency,
  exchangeRate,
}: CostCustomizationPanelProps) => {
  const [activeSchool, setActiveSchool] = useState<string | null>(null);

  // Local state for optional costs since they're no longer passed as props
  const [includeLunch, setIncludeLunch] = useState(true);
  const [includeTransport, setIncludeTransport] = useState(true);
  const [includeUniform, setIncludeUniform] = useState(true);
  const [includeAfterSchool, setIncludeAfterSchool] = useState(false);

  // Define a simple formatCurrency function since it's no longer passed as a prop
  const formatCurrency = (amount: number) => {
    const symbol = currency === 'EUR' ? '€' : '£';
    const value = currency === 'EUR' ? amount : amount * exchangeRate;
    return `${symbol}${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

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

  const handleInflationRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 20) {
      setInflationRate(value);
    }
  };

  return (
    <Card className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700 text-white">
      <Grid cols={1} gap="lg">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Optional Costs</h3>
          <Grid cols={2} mdCols={4} gap="md">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-lunch"
                checked={includeLunch}
                onCheckedChange={checked => setIncludeLunch(checked === true)}
                className="border-gray-600 data-[state=checked]:bg-blue-600"
              />
              <Label
                htmlFor="include-lunch"
                className="text-sm font-medium leading-none text-gray-300"
              >
                Include Lunch
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-transport"
                checked={includeTransport}
                onCheckedChange={checked => setIncludeTransport(checked === true)}
                className="border-gray-600 data-[state=checked]:bg-blue-600"
              />
              <Label
                htmlFor="include-transport"
                className="text-sm font-medium leading-none text-gray-300"
              >
                Include Transport
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-uniform"
                checked={includeUniform}
                onCheckedChange={checked => setIncludeUniform(checked === true)}
                className="border-gray-600 data-[state=checked]:bg-blue-600"
              />
              <Label
                htmlFor="include-uniform"
                className="text-sm font-medium leading-none text-gray-300"
              >
                Include Uniform
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-after-school"
                checked={includeAfterSchool}
                onCheckedChange={checked => setIncludeAfterSchool(checked === true)}
                className="border-gray-600 data-[state=checked]:bg-blue-600"
              />
              <Label
                htmlFor="include-after-school"
                className="text-sm font-medium leading-none text-gray-300"
              >
                Include After School
              </Label>
            </div>
          </Grid>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Financial Settings</h3>
          <Grid cols={1} mdCols={3} gap="md">
            <div>
              <Label className="block text-sm font-medium mb-1 text-gray-300">Currency</Label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
              <p className="mt-1 text-xs text-gray-400">
                Exchange rate: 1 EUR = {exchangeRate} GBP
              </p>
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1 text-gray-300">
                Inflation Rate (%)
              </Label>
              <input
                type="number"
                min="0"
                max="20"
                step="0.1"
                value={inflationRate}
                onChange={handleInflationRateChange}
                disabled={!applyInflation}
                className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${!applyInflation ? 'opacity-50' : ''}`}
              />
            </div>

            <div className="flex items-center mt-7">
              <div className="flex items-center space-x-2">
                <Switch
                  id="apply-inflation"
                  checked={applyInflation}
                  onCheckedChange={setApplyInflation}
                  className="data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor="apply-inflation" className="text-gray-300">
                  Apply inflation to future costs
                </Label>
              </div>
            </div>
          </Grid>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Custom School Costs</h3>
            <div className="flex items-center space-x-2">
              <Switch
                id="use-custom-costs"
                checked={useCustomCosts}
                onCheckedChange={setUseCustomCosts}
                className="data-[state=checked]:bg-blue-600"
              />
              <Label htmlFor="use-custom-costs" className="text-gray-300">
                Use custom costs
              </Label>
            </div>
          </div>

          {useCustomCosts && (
            <Grid cols={1} gap="md">
              <div className="flex flex-wrap gap-2">
                {Object.keys(schoolsData).map(schoolId => (
                  <Button
                    key={schoolId}
                    variant={activeSchool === schoolId ? 'default' : 'outline'}
                    onClick={() => setActiveSchool(schoolId)}
                    className={`text-sm ${activeSchool === schoolId ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}`}
                  >
                    {schoolsData[schoolId].name}
                  </Button>
                ))}
              </div>

              {activeSchool && (
                <div className="mt-4 p-4 border border-gray-700 rounded-lg bg-gray-750">
                  <h4 className="font-medium mb-3 text-white">
                    {schoolsData[activeSchool].name} Costs
                  </h4>

                  <Grid cols={1} mdCols={2} lgCols={3} gap="md">
                    <div>
                      <Label className="block text-sm mb-1 text-gray-300">Base Tuition</Label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={schoolsData[activeSchool].baseTuition}
                        onChange={e =>
                          updateSchoolData(activeSchool, 'baseTuition', parseInt(e.target.value))
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <Label className="block text-sm mb-1 text-gray-300">Registration Fee</Label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={schoolsData[activeSchool].registrationFee}
                        onChange={e =>
                          updateSchoolData(
                            activeSchool,
                            'registrationFee',
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <Label className="block text-sm mb-1 text-gray-300">
                        Enrollment Fee (Yearly)
                      </Label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={schoolsData[activeSchool].yearlyEnrollmentFee}
                        onChange={e =>
                          updateSchoolData(
                            activeSchool,
                            'yearlyEnrollmentFee',
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <Label className="block text-sm mb-1 text-gray-300">Lunch (Yearly)</Label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={schoolsData[activeSchool].lunch}
                        onChange={e =>
                          updateSchoolData(activeSchool, 'lunch', parseInt(e.target.value))
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <Label className="block text-sm mb-1 text-gray-300">Transport (Yearly)</Label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={schoolsData[activeSchool].transport}
                        onChange={e =>
                          updateSchoolData(activeSchool, 'transport', parseInt(e.target.value))
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <Label className="block text-sm mb-1 text-gray-300">Uniform (Yearly)</Label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={schoolsData[activeSchool].uniform}
                        onChange={e =>
                          updateSchoolData(activeSchool, 'uniform', parseInt(e.target.value))
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <Label className="block text-sm mb-1 text-gray-300">
                        After School (Yearly)
                      </Label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={schoolsData[activeSchool].afterSchool}
                        onChange={e =>
                          updateSchoolData(activeSchool, 'afterSchool', parseInt(e.target.value))
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </Grid>
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  onClick={resetCustomData}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Reset Custom Data
                </Button>
              </div>
            </Grid>
          )}
        </div>
      </Grid>
    </Card>
  );
};

export default CostCustomizationPanel;

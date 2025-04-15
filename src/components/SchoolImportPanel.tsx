'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Grid } from '@/components/ui/grid';
import { SchoolData, FormattedSchoolData } from '@/types';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';
import realSchoolsData from '@/data/real-schools-data';

interface SchoolImportPanelProps {
  onImportSchool: (school: SchoolData) => void;
  loadedSchools?: Record<string, FormattedSchoolData>;
}

const SchoolImportPanel = ({ onImportSchool, loadedSchools = {} }: SchoolImportPanelProps) => {
  const [url, setUrl] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [manualEntryMode, setManualEntryMode] = useState(false);
  const [showLoadedSchools, setShowLoadedSchools] = useState(true);
  const [expandedSchoolId, setExpandedSchoolId] = useState<string | null>(null);
  const [showGradeTuition, setShowGradeTuition] = useState(false);

  // State for manual grade tuition entries
  const [gradeTuitions, setGradeTuitions] = useState<Record<string, number>>({
    'Grade 1': 0,
    'Grade 2': 0,
    'Grade 3': 0,
    'Grade 4': 0,
    'Grade 5': 0,
    'Grade 6': 0,
    'Grade 7': 0,
    'Grade 8': 0,
    'Grade 9': 0,
    'Grade 10': 0,
    'Grade 11': 0,
    'Grade 12': 0,
  });

  const [manualSchoolData, setManualSchoolData] = useState<Partial<SchoolData>>({
    name: '',
    baseTuition: 0,
    registrationFee: 0,
    applicationFee: 0,
    yearlyEnrollmentFee: 0,
    lunch: 0,
    transport: 0,
    uniform: 0,
    afterSchool: 0,
    url: '',
    feesUrl: '',
    siblingDiscount: 0,
    includesLunch: false,
    tuitionByGrade: {},
  });

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return `€${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSchoolNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSchoolName(e.target.value);
  };

  const toggleGradeTuition = () => {
    setShowGradeTuition(!showGradeTuition);
  };

  const handleGradeTuitionChange = (grade: string, value: number) => {
    setGradeTuitions(prev => ({
      ...prev,
      [grade]: value,
    }));

    // Update the tuitionByGrade in manualSchoolData
    setManualSchoolData(prev => ({
      ...prev,
      tuitionByGrade: {
        ...prev.tuitionByGrade,
        [grade]: value,
      },
    }));

    // Calculate average for baseTuition
    const gradeValues = Object.values({ ...gradeTuitions, [grade]: value }).filter(val => val > 0);
    if (gradeValues.length > 0) {
      const average = gradeValues.reduce((sum, val) => sum + val, 0) / gradeValues.length;
      setManualSchoolData(prev => ({
        ...prev,
        baseTuition: Math.round(average),
      }));
    }
  };

  const handleImport = async () => {
    if (!url || !schoolName) {
      setErrorMessage('Please provide both a school name and URL');
      setImportStatus('error');
      return;
    }

    try {
      setImportStatus('loading');
      setErrorMessage('');

      // In a real implementation, this would call an API endpoint
      // that would scrape the school's website for fee information
      // For now, simulate the API call with a timeout
      setTimeout(() => {
        // This is mock data - in a real implementation this would come from the API
        const mockSchoolData: SchoolData = {
          name: schoolName,
          baseTuition: 18000, // Default values
          registrationFee: 5000,
          applicationFee: 500,
          yearlyEnrollmentFee: 0,
          lunch: 1000,
          transport: 3000,
          uniform: 300,
          afterSchool: 500,
          url: url,
          feesUrl: url,
          siblingDiscount: 0,
          includesLunch: false,
          tuitionByGrade: {
            'Grade 1': 16000,
            'Grade 2': 16000,
            'Grade 3': 17000,
            'Grade 4': 17000,
            'Grade 5': 17000,
            'Grade 6': 18000,
            'Grade 7': 18000,
            'Grade 8': 18000,
            'Grade 9': 19000,
            'Grade 10': 19000,
            'Grade 11': 20000,
            'Grade 12': 20000,
          },
        };

        // Generate a unique school ID based on the name
        const schoolId = schoolName.toLowerCase().replace(/\s+/g, '_');

        // Call the parent component's callback with the imported school data
        onImportSchool({
          ...mockSchoolData,
          id: schoolId, // In a real implementation, we'd add this to the SchoolData type
        } as SchoolData);

        setImportStatus('success');
      }, 2000);
    } catch (error) {
      setImportStatus('error');
      setErrorMessage('Failed to import school data: ' + (error as Error).message);
    }
  };

  const toggleManualEntry = () => {
    setManualEntryMode(!manualEntryMode);
  };

  const handleManualDataChange = (field: keyof SchoolData, value: any) => {
    setManualSchoolData({
      ...manualSchoolData,
      [field]: value,
    });
  };

  const handleManualSubmit = () => {
    if (!manualSchoolData.name) {
      setErrorMessage('School name is required');
      setImportStatus('error');
      return;
    }

    // Generate a unique school ID based on the name
    const schoolId = manualSchoolData.name.toLowerCase().replace(/\s+/g, '_');

    // Create default tuition by grade if not provided or use the entered grade values
    let tuitionByGrade: Record<string, number> = {};
    const enteredGrades = Object.entries(gradeTuitions).filter(([_, value]) => value > 0);

    if (enteredGrades.length > 0) {
      // Use the manually entered grade tuitions
      tuitionByGrade = enteredGrades.reduce(
        (acc, [grade, value]) => {
          acc[grade] = value;
          return acc;
        },
        {} as Record<string, number>
      );
    } else if (Object.keys(manualSchoolData.tuitionByGrade || {}).length > 0) {
      // Use the existing tuitionByGrade if it has values
      tuitionByGrade = manualSchoolData.tuitionByGrade as Record<string, number>;
    } else {
      // Default to base tuition for key grades if nothing was entered
      tuitionByGrade = {
        'Grade 1': manualSchoolData.baseTuition || 0,
        'Grade 6': manualSchoolData.baseTuition || 0,
        'Grade 9': manualSchoolData.baseTuition || 0,
        'Grade 12': manualSchoolData.baseTuition || 0,
      };
    }

    // Create the school data and explicitly cast it to SchoolData to satisfy TypeScript
    const schoolData = {
      name: manualSchoolData.name || '',
      baseTuition: manualSchoolData.baseTuition || 0,
      registrationFee: manualSchoolData.registrationFee || 0,
      applicationFee: manualSchoolData.applicationFee || 0,
      yearlyEnrollmentFee: manualSchoolData.yearlyEnrollmentFee || 0,
      lunch: manualSchoolData.lunch || 0,
      transport: manualSchoolData.transport || 0,
      uniform: manualSchoolData.uniform || 0,
      afterSchool: manualSchoolData.afterSchool || 0,
      url: manualSchoolData.url || '',
      feesUrl: manualSchoolData.feesUrl || '',
      siblingDiscount: Number(manualSchoolData.siblingDiscount) || 0,
      includesLunch: manualSchoolData.includesLunch || false,
      tuitionByGrade: tuitionByGrade,
      id: schoolId,
    } as SchoolData;

    onImportSchool(schoolData);
    setImportStatus('success');
  };

  // Helper function to find the original school data to access tuitionByGrade
  const findOriginalSchoolData = (schoolId: string): SchoolData | undefined => {
    // Check in realSchoolsData first
    if (realSchoolsData[schoolId]) {
      return realSchoolsData[schoolId];
    }

    // For custom schools, we need to reconstruct tuition data
    // We know it's a custom school if it's not in realSchoolsData
    if (!realSchoolsData[schoolId] && loadedSchools[schoolId]) {
      // This is a custom school, we'll create a pseudo SchoolData object
      const formattedSchool = loadedSchools[schoolId];

      // Check if this school was recently added through custom import
      // by looking for it in the original school data of the parent component
      // For now, we'll use a simple approach with what we have available
      return {
        name: formattedSchool.name,
        baseTuition: formattedSchool.baseTuition,
        registrationFee: formattedSchool.registrationFee,
        applicationFee: 0, // This is combined in the FormattedSchoolData
        yearlyEnrollmentFee: formattedSchool.yearlyEnrollmentFee,
        lunch: formattedSchool.lunch,
        transport: formattedSchool.transport,
        uniform: formattedSchool.uniform,
        afterSchool: formattedSchool.afterSchool,
        url: formattedSchool.url,
        feesUrl: formattedSchool.feesUrl,
        siblingDiscount: formattedSchool.siblingDiscount,
        includesLunch: formattedSchool.includesLunch,
        // For custom schools, we'll check if it's in the mock data from handleImport
        tuitionByGrade:
          schoolId === manualSchoolData.name?.toLowerCase().replace(/\s+/g, '_')
            ? (manualSchoolData.tuitionByGrade as Record<string, number>)
            : {
                'Grade 1': formattedSchool.baseTuition,
                'Grade 6': formattedSchool.baseTuition,
                'Grade 9': formattedSchool.baseTuition,
                'Grade 12': formattedSchool.baseTuition,
              },
      } as SchoolData;
    }

    // When not found in real data or loadedSchools, return undefined
    return undefined;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Add New School</h2>

      <div className="flex space-x-4 mb-4">
        <Button
          variant={manualEntryMode ? 'outline' : 'default'}
          onClick={() => setManualEntryMode(false)}
        >
          Import from URL
        </Button>
        <Button
          variant={manualEntryMode ? 'default' : 'outline'}
          onClick={() => setManualEntryMode(true)}
        >
          Manual Entry
        </Button>
      </div>

      {!manualEntryMode ? (
        <Card className="p-6">
          <p className="mb-4 text-gray-600">
            Enter a school website URL and we&apos;ll attempt to extract fee information. Note: This
            feature works best with Portuguese international schools that have structured fee pages.
          </p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="schoolName">School Name</Label>
              <Input
                id="schoolName"
                value={schoolName}
                onChange={handleSchoolNameChange}
                placeholder="E.g., International School of Lisbon"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="url">School Fees URL</Label>
              <Input
                id="url"
                value={url}
                onChange={handleUrlChange}
                placeholder="https://school.edu/fees"
                className="mt-1"
              />
            </div>

            <Button onClick={handleImport} disabled={importStatus === 'loading'} className="w-full">
              {importStatus === 'loading' ? 'Importing...' : 'Import School Data'}
            </Button>

            {importStatus === 'error' && <div className="text-red-500 mt-2">{errorMessage}</div>}

            {importStatus === 'success' && (
              <div className="text-green-500 mt-2">School data imported successfully!</div>
            )}
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <p className="mb-4 text-gray-600">Manually enter school fee information.</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="manual-name">School Name</Label>
              <Input
                id="manual-name"
                value={manualSchoolData.name}
                onChange={e => handleManualDataChange('name', e.target.value)}
                placeholder="School Name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="manual-url">School Website</Label>
              <Input
                id="manual-url"
                value={manualSchoolData.url}
                onChange={e => handleManualDataChange('url', e.target.value)}
                placeholder="https://school.edu"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="manual-tuition">
                Base Tuition (€)
                <span className="text-xs text-gray-400 ml-1">(Average across grades)</span>
              </Label>
              <Input
                id="manual-tuition"
                type="number"
                value={manualSchoolData.baseTuition || ''}
                onChange={e => handleManualDataChange('baseTuition', Number(e.target.value))}
                placeholder="18000"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="manual-registration">Registration Fee (€)</Label>
              <Input
                id="manual-registration"
                type="number"
                value={manualSchoolData.registrationFee || ''}
                onChange={e => handleManualDataChange('registrationFee', Number(e.target.value))}
                placeholder="5000"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="manual-application">Application Fee (€)</Label>
              <Input
                id="manual-application"
                type="number"
                value={manualSchoolData.applicationFee || ''}
                onChange={e => handleManualDataChange('applicationFee', Number(e.target.value))}
                placeholder="500"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="manual-yearly">Yearly Enrollment Fee (€)</Label>
              <Input
                id="manual-yearly"
                type="number"
                value={manualSchoolData.yearlyEnrollmentFee || ''}
                onChange={e =>
                  handleManualDataChange('yearlyEnrollmentFee', Number(e.target.value))
                }
                placeholder="0"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="manual-lunch">Lunch Cost (€)</Label>
              <Input
                id="manual-lunch"
                type="number"
                value={manualSchoolData.lunch || ''}
                onChange={e => handleManualDataChange('lunch', Number(e.target.value))}
                placeholder="1000"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="manual-transport">Transport Cost (€)</Label>
              <Input
                id="manual-transport"
                type="number"
                value={manualSchoolData.transport || ''}
                onChange={e => handleManualDataChange('transport', Number(e.target.value))}
                placeholder="3000"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="manual-uniform">Uniform Cost (€)</Label>
              <Input
                id="manual-uniform"
                type="number"
                value={manualSchoolData.uniform || ''}
                onChange={e => handleManualDataChange('uniform', Number(e.target.value))}
                placeholder="300"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="manual-afterSchool">After School Activities (€)</Label>
              <Input
                id="manual-afterSchool"
                type="number"
                value={manualSchoolData.afterSchool || ''}
                onChange={e => handleManualDataChange('afterSchool', Number(e.target.value))}
                placeholder="500"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="manual-siblingDiscount">Sibling Discount (%)</Label>
              <Input
                id="manual-siblingDiscount"
                type="number"
                value={
                  typeof manualSchoolData.siblingDiscount === 'number'
                    ? manualSchoolData.siblingDiscount
                    : 0
                }
                onChange={e => handleManualDataChange('siblingDiscount', Number(e.target.value))}
                placeholder="0"
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-2 mt-6">
              <input
                type="checkbox"
                id="manual-includesLunch"
                checked={manualSchoolData.includesLunch || false}
                onChange={e => handleManualDataChange('includesLunch', e.target.checked)}
              />
              <Label htmlFor="manual-includesLunch">Lunch included in tuition</Label>
            </div>
          </div>

          {/* Grade-specific tuition inputs */}
          <div className="mt-6">
            <div
              className="flex justify-between items-center cursor-pointer mb-2"
              onClick={toggleGradeTuition}
            >
              <h4 className="text-md font-medium">Grade-Specific Tuition</h4>
              <Button variant="outline" size="sm">
                {showGradeTuition ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
            </div>

            {showGradeTuition && (
              <div className="p-4 border border-gray-700 rounded-lg">
                <p className="text-sm text-gray-400 mb-3">
                  Enter tuition amounts for specific grades. The base tuition above will be
                  calculated as an average of these values.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {Object.keys(gradeTuitions).map(grade => (
                    <div key={grade}>
                      <Label htmlFor={`grade-${grade}`} className="text-xs">
                        {grade}
                      </Label>
                      <Input
                        id={`grade-${grade}`}
                        type="number"
                        value={gradeTuitions[grade] || ''}
                        onChange={e => handleGradeTuitionChange(grade, Number(e.target.value))}
                        placeholder="0"
                        className="mt-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button onClick={handleManualSubmit} className="w-full mt-6">
            Add School
          </Button>

          {importStatus === 'error' && <div className="text-red-500 mt-2">{errorMessage}</div>}

          {importStatus === 'success' && (
            <div className="text-green-500 mt-2">School data added successfully!</div>
          )}
        </Card>
      )}

      {/* Current Schools Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Currently Loaded Schools</h3>
          <Button variant="outline" onClick={() => setShowLoadedSchools(!showLoadedSchools)}>
            {showLoadedSchools ? 'Hide' : 'Show'} Schools
          </Button>
        </div>

        {showLoadedSchools && (
          <div className="space-y-4">
            {Object.keys(loadedSchools).length === 0 ? (
              <Card className="p-4 bg-gray-700">
                <p className="text-gray-400">No schools loaded yet.</p>
              </Card>
            ) : (
              Object.entries(loadedSchools).map(([schoolId, school]) => {
                const originalSchool = findOriginalSchoolData(schoolId);
                const hasGradeTuition =
                  originalSchool &&
                  originalSchool.tuitionByGrade &&
                  Object.keys(originalSchool.tuitionByGrade).length > 0;

                return (
                  <Card key={schoolId} className="p-4 hover:bg-gray-700/50 transition-colors">
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-semibold">{school.name}</h4>
                        {school.includesLunch && (
                          <Badge variant="primary" size="sm">
                            Lunch Included
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Base Tuition:
                            {hasGradeTuition && <span className="text-xs ml-1">(avg.)</span>}
                          </span>
                          <span className="font-medium">{formatCurrency(school.baseTuition)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Registration Fee:</span>
                          <span className="font-medium">
                            {formatCurrency(school.registrationFee)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Yearly Enrollment:</span>
                          <span className="font-medium">
                            {formatCurrency(school.yearlyEnrollmentFee)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Sibling Discount:</span>
                          <span className="font-medium">{school.siblingDiscount}%</span>
                        </div>
                      </div>

                      {/* Grade-specific tuition section */}
                      {hasGradeTuition && (
                        <div className="mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-sm text-blue-400 p-0 h-auto flex items-center"
                            onClick={() =>
                              setExpandedSchoolId(expandedSchoolId === schoolId ? null : schoolId)
                            }
                          >
                            {expandedSchoolId === schoolId ? (
                              <>
                                <ChevronUp size={14} className="mr-1" /> Hide tuition by grade
                              </>
                            ) : (
                              <>
                                <ChevronDown size={14} className="mr-1" /> Show tuition by grade
                              </>
                            )}
                          </Button>

                          {expandedSchoolId === schoolId && originalSchool && (
                            <div className="mt-2 p-3 bg-gray-800 rounded-md border border-gray-700">
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                {Object.entries(originalSchool.tuitionByGrade).map(
                                  ([grade, amount]) => (
                                    <div key={grade} className="flex justify-between">
                                      <span className="text-gray-400">{grade}:</span>
                                      <span className="font-medium">{formatCurrency(amount)}</span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-2 pt-2 border-t border-gray-700">
                        <h5 className="text-sm font-medium mb-2">Optional Costs</h5>
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          <div className="flex flex-col">
                            <span className="text-gray-400">Lunch</span>
                            <span className="font-medium">
                              {school.includesLunch ? 'Included' : formatCurrency(school.lunch)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-400">Transport</span>
                            <span className="font-medium">{formatCurrency(school.transport)}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-400">Uniform</span>
                            <span className="font-medium">{formatCurrency(school.uniform)}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-400">After School</span>
                            <span className="font-medium">
                              {formatCurrency(school.afterSchool)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {school.url && (
                        <div className="mt-2 text-sm">
                          <a
                            href={school.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            Visit School Website →
                          </a>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolImportPanel;

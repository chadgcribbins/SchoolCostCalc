import React, { useState } from 'react';

const CostCustomizationPanel = ({
  schoolsData,
  setSchoolsData,
  customSchoolsData,
  setCustomSchoolsData,
  useCustomCosts,
  setUseCustomCosts,
  inflationRate,
  setInflationRate,
  applyInflation,
  setApplyInflation,
  resetCustomData,
}) => {
  // New school form state
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolUrl, setNewSchoolUrl] = useState('');
  const [newSchoolFeesUrl, setNewSchoolFeesUrl] = useState('');
  const [addingNewSchool, setAddingNewSchool] = useState(false);

  // Handler for updating custom school data
  const updateCustomSchoolData = (schoolId, field, value) => {
    setCustomSchoolsData({
      ...customSchoolsData,
      [schoolId]: {
        ...customSchoolsData[schoolId],
        [field]: parseFloat(value) || 0,
      },
    });
  };

  // Add a new school
  const addNewSchool = () => {
    if (!newSchoolName) return;

    // Generate a unique schoolId
    let schoolIndex = 0;
    let schoolId = '';

    do {
      schoolIndex++;
      schoolId = `custom${schoolIndex}`;
    } while (schoolsData[schoolId]); // Ensure the ID doesn't exist

    const newSchool = {
      name: newSchoolName,
      baseTuition: 15000, // Default values
      registrationFee: 3000,
      yearlyEnrollmentFee: 300,
      lunch: 1600,
      transport: 2100,
      uniform: 500,
      afterSchool: 1200,
      url: newSchoolUrl,
      feesUrl: newSchoolFeesUrl,
      isCustom: true,
    };

    setSchoolsData({
      ...schoolsData,
      [schoolId]: newSchool,
    });

    setCustomSchoolsData({
      ...customSchoolsData,
      [schoolId]: newSchool,
    });

    // Reset form
    setNewSchoolName('');
    setNewSchoolUrl('');
    setNewSchoolFeesUrl('');
    setAddingNewSchool(false);
  };

  // Remove a school
  const removeSchool = schoolId => {
    const updatedSchoolsData = { ...schoolsData };
    delete updatedSchoolsData[schoolId];

    const updatedCustomSchoolsData = { ...customSchoolsData };
    delete updatedCustomSchoolsData[schoolId];

    setSchoolsData(updatedSchoolsData);
    setCustomSchoolsData(updatedCustomSchoolsData);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center mb-2">
        <h3 className="text-lg font-medium">Cost Customization</h3>
        <div className="ml-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={useCustomCosts}
              onChange={() => setUseCustomCosts(!useCustomCosts)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Use Custom Costs</span>
          </label>
        </div>
        <button
          onClick={resetCustomData}
          className="ml-4 bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded text-sm"
        >
          Reset to Defaults
        </button>
      </div>

      {useCustomCosts && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          {/* Inflation Rate Slider */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label className="font-medium">Inflation Rate: {inflationRate}%</label>
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={applyInflation}
                    onChange={() => setApplyInflation(!applyInflation)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm">Apply Inflation</span>
                </label>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={inflationRate}
              onChange={e => setInflationRate(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>5%</span>
              <span>10%</span>
            </div>
          </div>

          {/* Base Tuition Customization */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {Object.keys(schoolsData).map(schoolId => (
              <div key={schoolId} className="border p-3 rounded">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold">{schoolsData[schoolId].name}</h4>
                  {schoolsData[schoolId].isCustom && (
                    <button
                      onClick={() => removeSchool(schoolId)}
                      className="text-red-500 text-sm hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm">Base Tuition</label>
                    <input
                      type="number"
                      value={customSchoolsData[schoolId].baseTuition}
                      onChange={e =>
                        updateCustomSchoolData(schoolId, 'baseTuition', e.target.value)
                      }
                      className="border rounded p-1 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Registration Fee</label>
                    <input
                      type="number"
                      value={customSchoolsData[schoolId].registrationFee}
                      onChange={e =>
                        updateCustomSchoolData(schoolId, 'registrationFee', e.target.value)
                      }
                      className="border rounded p-1 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Yearly Enrollment</label>
                    <input
                      type="number"
                      value={customSchoolsData[schoolId].yearlyEnrollmentFee}
                      onChange={e =>
                        updateCustomSchoolData(schoolId, 'yearlyEnrollmentFee', e.target.value)
                      }
                      className="border rounded p-1 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Lunch</label>
                    <input
                      type="number"
                      value={customSchoolsData[schoolId].lunch}
                      onChange={e => updateCustomSchoolData(schoolId, 'lunch', e.target.value)}
                      className="border rounded p-1 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Transport</label>
                    <input
                      type="number"
                      value={customSchoolsData[schoolId].transport}
                      onChange={e => updateCustomSchoolData(schoolId, 'transport', e.target.value)}
                      className="border rounded p-1 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Uniform</label>
                    <input
                      type="number"
                      value={customSchoolsData[schoolId].uniform}
                      onChange={e => updateCustomSchoolData(schoolId, 'uniform', e.target.value)}
                      className="border rounded p-1 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">After School</label>
                    <input
                      type="number"
                      value={customSchoolsData[schoolId].afterSchool}
                      onChange={e =>
                        updateCustomSchoolData(schoolId, 'afterSchool', e.target.value)
                      }
                      className="border rounded p-1 w-full"
                    />
                  </div>
                  {(schoolsData[schoolId].url || schoolsData[schoolId].feesUrl) && (
                    <div className="col-span-2 mt-2 text-sm">
                      {schoolsData[schoolId].url && (
                        <div>
                          <a
                            href={schoolsData[schoolId].url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Visit School Website
                          </a>
                        </div>
                      )}
                      {schoolsData[schoolId].feesUrl && (
                        <div>
                          <a
                            href={schoolsData[schoolId].feesUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Fees Page
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Add New School Button */}
            {!addingNewSchool ? (
              <div
                className="border border-dashed p-3 rounded flex items-center justify-center cursor-pointer hover:bg-blue-50"
                onClick={() => setAddingNewSchool(true)}
              >
                <span className="text-blue-600">+ Add New School</span>
              </div>
            ) : (
              <div className="border p-3 rounded bg-blue-50">
                <h4 className="font-bold mb-2">New School</h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm">School Name *</label>
                    <input
                      type="text"
                      value={newSchoolName}
                      onChange={e => setNewSchoolName(e.target.value)}
                      className="border rounded p-1 w-full"
                      placeholder="Enter school name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">School Website URL</label>
                    <input
                      type="text"
                      value={newSchoolUrl}
                      onChange={e => setNewSchoolUrl(e.target.value)}
                      className="border rounded p-1 w-full"
                      placeholder="https://www.school.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Fees Page URL</label>
                    <input
                      type="text"
                      value={newSchoolFeesUrl}
                      onChange={e => setNewSchoolFeesUrl(e.target.value)}
                      className="border rounded p-1 w-full"
                      placeholder="https://www.school.com/fees"
                    />
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={addNewSchool}
                      disabled={!newSchoolName}
                      className={`px-3 py-1 rounded ${newSchoolName ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                      Add School
                    </button>
                    <button
                      onClick={() => setAddingNewSchool(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CostCustomizationPanel;

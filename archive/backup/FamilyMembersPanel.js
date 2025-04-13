import React from 'react';

const FamilyMembersPanel = ({
  familyMembers,
  setFamilyMembers,
  includeLunch,
  includeTransport,
  includeUniform,
  includeAfterSchool,
  currentYear,
}) => {
  // Handler for adding a new family member
  const addFamilyMember = () => {
    const newId = familyMembers.length > 0 ? Math.max(...familyMembers.map(m => m.id)) + 1 : 1;

    setFamilyMembers([
      ...familyMembers,
      {
        id: newId,
        name: `Child ${newId}`,
        age: 6,
        graduationYear: currentYear + 12,
        includeOptionalCosts: {
          lunch: includeLunch,
          transport: includeTransport,
          uniform: includeUniform,
          afterSchool: includeAfterSchool,
        },
      },
    ]);
  };

  // Handler for removing a family member
  const removeFamilyMember = id => {
    setFamilyMembers(familyMembers.filter(member => member.id !== id));
  };

  // Handler for updating a family member
  const updateFamilyMember = (id, field, value) => {
    setFamilyMembers(
      familyMembers.map(member => {
        if (member.id === id) {
          if (field.startsWith('includeOptionalCosts.')) {
            const costType = field.split('.')[1];
            return {
              ...member,
              includeOptionalCosts: {
                ...member.includeOptionalCosts,
                [costType]: value,
              },
            };
          }
          return { ...member, [field]: value };
        }
        return member;
      })
    );
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Family Members</h2>
        <button
          onClick={addFamilyMember}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add Family Member
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-blue-100">
              <th className="py-2 px-3 text-left">Name</th>
              <th className="py-2 px-3 text-left">Age</th>
              <th className="py-2 px-3 text-left">Graduation Year</th>
              <th className="py-2 px-3 text-left">Optional Costs</th>
              <th className="py-2 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {familyMembers.map(member => (
              <tr key={member.id} className="border-t">
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={member.name}
                    onChange={e => updateFamilyMember(member.id, 'name', e.target.value)}
                    className="border rounded p-1 w-full"
                  />
                </td>
                <td className="py-2 px-3">
                  <input
                    type="number"
                    value={member.age}
                    min="3"
                    max="18"
                    onChange={e => updateFamilyMember(member.id, 'age', parseInt(e.target.value))}
                    className="border rounded p-1 w-20"
                  />
                </td>
                <td className="py-2 px-3">
                  <input
                    type="number"
                    value={member.graduationYear}
                    min={currentYear}
                    onChange={e =>
                      updateFamilyMember(member.id, 'graduationYear', parseInt(e.target.value))
                    }
                    className="border rounded p-1 w-24"
                  />
                </td>
                <td className="py-2 px-3">
                  <div className="flex flex-wrap gap-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={member.includeOptionalCosts.lunch}
                        onChange={e =>
                          updateFamilyMember(
                            member.id,
                            'includeOptionalCosts.lunch',
                            e.target.checked
                          )
                        }
                        disabled={!includeLunch}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="ml-1 text-sm">Lunch</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={member.includeOptionalCosts.transport}
                        onChange={e =>
                          updateFamilyMember(
                            member.id,
                            'includeOptionalCosts.transport',
                            e.target.checked
                          )
                        }
                        disabled={!includeTransport}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="ml-1 text-sm">Transport</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={member.includeOptionalCosts.uniform}
                        onChange={e =>
                          updateFamilyMember(
                            member.id,
                            'includeOptionalCosts.uniform',
                            e.target.checked
                          )
                        }
                        disabled={!includeUniform}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="ml-1 text-sm">Uniform</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={member.includeOptionalCosts.afterSchool}
                        onChange={e =>
                          updateFamilyMember(
                            member.id,
                            'includeOptionalCosts.afterSchool',
                            e.target.checked
                          )
                        }
                        disabled={!includeAfterSchool}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="ml-1 text-sm">After School</span>
                    </label>
                  </div>
                </td>
                <td className="py-2 px-3 text-center">
                  <button
                    onClick={() => removeFamilyMember(member.id)}
                    className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded text-sm"
                    disabled={familyMembers.length <= 1}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FamilyMembersPanel;

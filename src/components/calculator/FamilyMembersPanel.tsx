import { useState } from 'react';
import { FamilyMember } from '@/types';
import { Button } from '@/components/ui/button';

interface FamilyMembersPanelProps {
  familyMembers: FamilyMember[];
  setFamilyMembers: React.Dispatch<React.SetStateAction<FamilyMember[]>>;
  years: number[];
  currentYear: number;
}

const FamilyMembersPanel = ({
  familyMembers,
  setFamilyMembers,
  years,
  currentYear,
}: FamilyMembersPanelProps) => {
  const [newMember, setNewMember] = useState<Omit<FamilyMember, 'id'>>({
    name: '',
    age: 5,
    graduationYear: currentYear + 13, // Default graduation year based on age
    includeOptionalCosts: { lunch: true, transport: true, uniform: true, afterSchool: false },
  });

  const addFamilyMember = () => {
    if (newMember.name.trim() === '') return;

    const newId = Math.max(0, ...familyMembers.map(m => m.id)) + 1;

    setFamilyMembers([
      ...familyMembers,
      {
        ...newMember,
        id: newId,
      },
    ]);

    // Reset the form
    setNewMember({
      name: '',
      age: 5,
      graduationYear: currentYear + 13,
      includeOptionalCosts: { lunch: true, transport: true, uniform: true, afterSchool: false },
    });
  };

  const removeFamilyMember = (id: number) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== id));
  };

  const updateFamilyMember = (id: number, field: keyof FamilyMember, value: any) => {
    setFamilyMembers(
      familyMembers.map(member => {
        if (member.id === id) {
          if (field === 'age' && typeof value === 'number') {
            // Update graduation year when age changes
            const gradeLevel = value - 5; // Approximate grade level based on age
            const yearsToGraduation = 12 - gradeLevel; // Assuming 12 years of school
            const graduationYear = Math.max(currentYear, currentYear + yearsToGraduation);

            return {
              ...member,
              [field]: value,
              graduationYear,
            };
          }

          return {
            ...member,
            [field]: value,
          };
        }
        return member;
      })
    );
  };

  const updateOptionalCost = (
    id: number,
    costType: keyof FamilyMember['includeOptionalCosts'],
    value: boolean
  ) => {
    setFamilyMembers(
      familyMembers.map(member => {
        if (member.id === id) {
          return {
            ...member,
            includeOptionalCosts: {
              ...member.includeOptionalCosts,
              [costType]: value,
            },
          };
        }
        return member;
      })
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addFamilyMember();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Family Members</h2>

      <div className="mb-6">
        <table className="w-full mb-4">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Age</th>
              <th className="text-left py-2">Graduation</th>
              <th className="text-left py-2">Optional Costs</th>
              <th className="text-left py-2"></th>
            </tr>
          </thead>
          <tbody>
            {familyMembers.map(member => (
              <tr key={member.id} className="border-b border-gray-100">
                <td className="py-3">
                  <input
                    type="text"
                    value={member.name}
                    onChange={e => updateFamilyMember(member.id, 'name', e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="py-3">
                  <input
                    type="number"
                    min="1"
                    max="18"
                    value={member.age}
                    onChange={e => updateFamilyMember(member.id, 'age', parseInt(e.target.value))}
                    className="w-16 px-2 py-1 border rounded"
                  />
                </td>
                <td className="py-3">
                  <select
                    value={member.graduationYear}
                    onChange={e =>
                      updateFamilyMember(member.id, 'graduationYear', parseInt(e.target.value))
                    }
                    className="px-2 py-1 border rounded"
                  >
                    {years
                      .concat(Array.from({ length: 8 }, (_, i) => currentYear + 10 + i))
                      .map(year => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                  </select>
                </td>
                <td className="py-3">
                  <div className="flex space-x-2 text-xs">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={member.includeOptionalCosts.lunch}
                        onChange={e => updateOptionalCost(member.id, 'lunch', e.target.checked)}
                        className="mr-1"
                      />
                      Lunch
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={member.includeOptionalCosts.transport}
                        onChange={e => updateOptionalCost(member.id, 'transport', e.target.checked)}
                        className="mr-1"
                      />
                      Transport
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={member.includeOptionalCosts.uniform}
                        onChange={e => updateOptionalCost(member.id, 'uniform', e.target.checked)}
                        className="mr-1"
                      />
                      Uniform
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={member.includeOptionalCosts.afterSchool}
                        onChange={e =>
                          updateOptionalCost(member.id, 'afterSchool', e.target.checked)
                        }
                        className="mr-1"
                      />
                      After School
                    </label>
                  </div>
                </td>
                <td className="py-3 text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFamilyMember(member.id)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-3">Add Family Member</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={newMember.name}
              onChange={e => setNewMember({ ...newMember, name: e.target.value })}
              onKeyPress={handleKeyPress}
              placeholder="Child's name"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input
              type="number"
              min="1"
              max="18"
              value={newMember.age}
              onChange={e =>
                setNewMember({
                  ...newMember,
                  age: parseInt(e.target.value),
                  graduationYear: currentYear + Math.max(1, 12 - (parseInt(e.target.value) - 5)),
                })
              }
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Graduation Year</label>
            <select
              value={newMember.graduationYear}
              onChange={e =>
                setNewMember({ ...newMember, graduationYear: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 border rounded"
            >
              {years.concat(Array.from({ length: 8 }, (_, i) => currentYear + 10 + i)).map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex space-x-4 mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newMember.includeOptionalCosts.lunch}
              onChange={e =>
                setNewMember({
                  ...newMember,
                  includeOptionalCosts: {
                    ...newMember.includeOptionalCosts,
                    lunch: e.target.checked,
                  },
                })
              }
              className="mr-2"
            />
            Include Lunch
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newMember.includeOptionalCosts.transport}
              onChange={e =>
                setNewMember({
                  ...newMember,
                  includeOptionalCosts: {
                    ...newMember.includeOptionalCosts,
                    transport: e.target.checked,
                  },
                })
              }
              className="mr-2"
            />
            Include Transport
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newMember.includeOptionalCosts.uniform}
              onChange={e =>
                setNewMember({
                  ...newMember,
                  includeOptionalCosts: {
                    ...newMember.includeOptionalCosts,
                    uniform: e.target.checked,
                  },
                })
              }
              className="mr-2"
            />
            Include Uniform
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newMember.includeOptionalCosts.afterSchool}
              onChange={e =>
                setNewMember({
                  ...newMember,
                  includeOptionalCosts: {
                    ...newMember.includeOptionalCosts,
                    afterSchool: e.target.checked,
                  },
                })
              }
              className="mr-2"
            />
            Include After School Activities
          </label>
        </div>

        <Button onClick={addFamilyMember}>Add Family Member</Button>
      </div>
    </div>
  );
};

export default FamilyMembersPanel;

'use client';

import { useState } from 'react';
import { FamilyMember } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Grid } from '@/components/ui/grid';
import { Card } from '@/components/ui/card';

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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState<FamilyMember>({
    id: Date.now(),
    name: '',
    age: 10,
    graduationYear: currentYear + 7,
    includeOptionalCosts: {
      lunch: true,
      transport: true,
      uniform: true,
      afterSchool: false,
    },
  });

  const addFamilyMember = () => {
    if (newMember.name.trim()) {
      setFamilyMembers(prev => [
        ...prev,
        {
          ...newMember,
          id: Date.now(), // Ensure unique ID
        },
      ]);

      // Reset form for next add
      setNewMember({
        id: Date.now(),
        name: '',
        age: 10,
        graduationYear: currentYear + 7,
        includeOptionalCosts: {
          lunch: true,
          transport: true,
          uniform: true,
          afterSchool: false,
        },
      });

      // Close the dialog
      setIsAddDialogOpen(false);
    }
  };

  const removeFamilyMember = (id: number) => {
    setFamilyMembers(prev => prev.filter(member => member.id !== id));
  };

  const updateFamilyMember = (id: number, field: keyof FamilyMember, value: any) => {
    setFamilyMembers(prev =>
      prev.map(member => {
        if (member.id === id) {
          const updatedMember = { ...member, [field]: value };

          // If age is updated, estimate graduation year
          if (field === 'age') {
            // Estimate graduation year based on child's age
            // Assuming child starts at age 5/6 and graduates after 12 years
            const yearsToGraduation = Math.max(1, 12 - (value - 5));
            updatedMember.graduationYear = currentYear + yearsToGraduation;
          }

          return updatedMember;
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
    setFamilyMembers(prev =>
      prev.map(member => {
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Family Members</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add Family Member</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Add Family Member</DialogTitle>
            </DialogHeader>
            <Grid cols={1} gap="md">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-gray-300">
                  Name
                </Label>
                <input
                  id="name"
                  type="text"
                  value={newMember.name}
                  onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                  onKeyPress={handleKeyPress}
                  placeholder="Child's name"
                  className="col-span-3 w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="age" className="text-right text-gray-300">
                  Age
                </Label>
                <input
                  id="age"
                  type="number"
                  min="1"
                  max="18"
                  value={newMember.age}
                  onChange={e =>
                    setNewMember({
                      ...newMember,
                      age: parseInt(e.target.value),
                      graduationYear:
                        currentYear + Math.max(1, 12 - (parseInt(e.target.value) - 5)),
                    })
                  }
                  className="col-span-3 w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="graduation" className="text-right text-gray-300">
                  Graduation Year
                </Label>
                <select
                  id="graduation"
                  value={newMember.graduationYear}
                  onChange={e =>
                    setNewMember({ ...newMember, graduationYear: parseInt(e.target.value) })
                  }
                  className="col-span-3 w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  {years
                    .concat(Array.from({ length: 8 }, (_, i) => currentYear + 10 + i))
                    .map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right text-gray-300">Optional Costs</Label>
                <div className="col-span-3 grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="new-lunch"
                      checked={newMember.includeOptionalCosts.lunch}
                      onCheckedChange={checked =>
                        setNewMember({
                          ...newMember,
                          includeOptionalCosts: {
                            ...newMember.includeOptionalCosts,
                            lunch: checked === true,
                          },
                        })
                      }
                      className="border-gray-600 data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor="new-lunch" className="text-gray-300">
                      Include Lunch
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="new-transport"
                      checked={newMember.includeOptionalCosts.transport}
                      onCheckedChange={checked =>
                        setNewMember({
                          ...newMember,
                          includeOptionalCosts: {
                            ...newMember.includeOptionalCosts,
                            transport: checked === true,
                          },
                        })
                      }
                      className="border-gray-600 data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor="new-transport" className="text-gray-300">
                      Include Transport
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="new-uniform"
                      checked={newMember.includeOptionalCosts.uniform}
                      onCheckedChange={checked =>
                        setNewMember({
                          ...newMember,
                          includeOptionalCosts: {
                            ...newMember.includeOptionalCosts,
                            uniform: checked === true,
                          },
                        })
                      }
                      className="border-gray-600 data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor="new-uniform" className="text-gray-300">
                      Include Uniform
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="new-after-school"
                      checked={newMember.includeOptionalCosts.afterSchool}
                      onCheckedChange={checked =>
                        setNewMember({
                          ...newMember,
                          includeOptionalCosts: {
                            ...newMember.includeOptionalCosts,
                            afterSchool: checked === true,
                          },
                        })
                      }
                      className="border-gray-600 data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor="new-after-school" className="text-gray-300">
                      Include After School
                    </Label>
                  </div>
                </div>
              </div>
            </Grid>
            <div className="flex justify-end mt-6 gap-2">
              <Button
                variant="secondary"
                onClick={() => setIsAddDialogOpen(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={addFamilyMember}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add Family Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {familyMembers.length > 0 ? (
        <Card className="bg-gray-800 rounded-lg overflow-hidden mb-6 border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-4 bg-gray-900 font-medium text-white">Name</th>
                  <th className="text-left p-4 bg-gray-900 font-medium text-white">Age</th>
                  <th className="text-left p-4 bg-gray-900 font-medium text-white">
                    Graduation Year
                  </th>
                  <th className="text-left p-4 bg-gray-900 font-medium text-white">
                    Optional Costs
                  </th>
                  <th className="text-right p-4 bg-gray-900 font-medium text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {familyMembers.map(member => (
                  <tr key={member.id} className="hover:bg-gray-750">
                    <td className="p-4">
                      <input
                        type="text"
                        value={member.name}
                        onChange={e => updateFamilyMember(member.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        min="1"
                        max="18"
                        value={member.age}
                        onChange={e =>
                          updateFamilyMember(member.id, 'age', parseInt(e.target.value))
                        }
                        className="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-4">
                      <select
                        value={member.graduationYear}
                        onChange={e =>
                          updateFamilyMember(member.id, 'graduationYear', parseInt(e.target.value))
                        }
                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                    <td className="p-4">
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`lunch-${member.id}`}
                            checked={member.includeOptionalCosts.lunch}
                            onCheckedChange={checked =>
                              updateOptionalCost(member.id, 'lunch', checked === true)
                            }
                            className="border-gray-600 data-[state=checked]:bg-blue-600"
                          />
                          <Label htmlFor={`lunch-${member.id}`} className="text-sm text-gray-300">
                            Lunch
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`transport-${member.id}`}
                            checked={member.includeOptionalCosts.transport}
                            onCheckedChange={checked =>
                              updateOptionalCost(member.id, 'transport', checked === true)
                            }
                            className="border-gray-600 data-[state=checked]:bg-blue-600"
                          />
                          <Label
                            htmlFor={`transport-${member.id}`}
                            className="text-sm text-gray-300"
                          >
                            Transport
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`uniform-${member.id}`}
                            checked={member.includeOptionalCosts.uniform}
                            onCheckedChange={checked =>
                              updateOptionalCost(member.id, 'uniform', checked === true)
                            }
                            className="border-gray-600 data-[state=checked]:bg-blue-600"
                          />
                          <Label htmlFor={`uniform-${member.id}`} className="text-sm text-gray-300">
                            Uniform
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`after-school-${member.id}`}
                            checked={member.includeOptionalCosts.afterSchool}
                            onCheckedChange={checked =>
                              updateOptionalCost(member.id, 'afterSchool', checked === true)
                            }
                            className="border-gray-600 data-[state=checked]:bg-blue-600"
                          />
                          <Label
                            htmlFor={`after-school-${member.id}`}
                            className="text-sm text-gray-300"
                          >
                            After School
                          </Label>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        onClick={() => removeFamilyMember(member.id)}
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="bg-gray-800 border border-gray-700 text-gray-200 p-6 rounded-lg text-center mb-6">
          <p className="text-lg font-medium">No family members added yet</p>
          <p className="mt-2 text-gray-400">Add family members to calculate education costs</p>
        </div>
      )}

      <div className="text-sm text-gray-400">
        <p>Note: Graduation year is estimated based on the child's current age.</p>
        <p>
          Children typically start school at 5-6 years old and graduate after 12 years of education.
        </p>
      </div>
    </div>
  );
};

export default FamilyMembersPanel;

import { FamilyCosts, FormattedSchoolData } from '@/types';
import { Card } from '@/components/ui/card';

interface CostSummaryProps {
  familyCosts: FamilyCosts;
  schoolsData: Record<string, FormattedSchoolData>;
  formatCurrency: (amount: number) => string;
}

const CostSummary = ({ familyCosts, schoolsData, formatCurrency }: CostSummaryProps) => {
  const schools = Object.keys(familyCosts.bySchool);

  // Find school with lowest total cost
  let lowestCostSchool = schools[0];
  let lowestCost = familyCosts.bySchool[schools[0]]?.grandTotal || 0;

  schools.forEach(schoolId => {
    const totalCost = familyCosts.bySchool[schoolId].grandTotal;
    if (totalCost < lowestCost) {
      lowestCost = totalCost;
      lowestCostSchool = schoolId;
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {schools.map(schoolId => {
        const school = schoolsData[schoolId];
        const costs = familyCosts.bySchool[schoolId];
        const isLowestCost = schoolId === lowestCostSchool;

        return (
          <Card
            key={schoolId}
            className={`p-4 border ${isLowestCost ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold">{school.name}</h3>
              {isLowestCost && (
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  Best Value
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">One-time fees:</span>
                <span className="font-medium">{formatCurrency(costs.totalOneTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mandatory costs:</span>
                <span className="font-medium">{formatCurrency(costs.totalMandatory)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Optional costs:</span>
                <span className="font-medium">{formatCurrency(costs.totalOptional)}</span>
              </div>
              <div className="pt-2 border-t flex justify-between">
                <span className="font-bold">Total 10-year cost:</span>
                <span className="font-bold text-lg">{formatCurrency(costs.grandTotal)}</span>
              </div>
            </div>

            <div className="mt-4 text-sm">
              <p>
                <span className="font-semibold">Includes:</span>
                {school.includesLunch ? ' Lunch,' : ''} Tuition, Registration
              </p>

              {school.siblingDiscount > 0 && (
                <p className="mt-1">
                  <span className="font-semibold">Sibling discount:</span> {school.siblingDiscount}%
                </p>
              )}
            </div>

            <div className="mt-4">
              <a
                href={school.feesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                View official fees structure
              </a>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default CostSummary;

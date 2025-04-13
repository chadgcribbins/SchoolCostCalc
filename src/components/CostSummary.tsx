import { FamilyCosts, FormattedSchoolData } from '@/types';
import { Grid } from '@/components/ui/grid';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    <Grid cols={1} mdCols={3} gap="md">
      {schools.map(schoolId => {
        const school = schoolsData[schoolId];
        const costs = familyCosts.bySchool[schoolId];
        const isLowestCost = schoolId === lowestCostSchool;

        return (
          <Card
            key={schoolId}
            className={`border rounded-lg shadow-sm overflow-hidden ${isLowestCost ? 'border-green-500' : 'border-gray-200'}`}
          >
            <div className={`p-4 ${isLowestCost ? 'bg-green-50' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-semibold">{school.name}</h3>
                {isLowestCost && (
                  <Badge className="bg-green-100 text-green-800 border-green-300">Best Value</Badge>
                )}
              </div>
              <a
                href={school.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                School Website
              </a>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Mandatory Costs:</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(costs.totalMandatory)}
                  </span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Optional Costs:</span>
                  <span className="text-sm font-medium">{formatCurrency(costs.totalOptional)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">One-time Fees:</span>
                  <span className="text-sm font-medium">{formatCurrency(costs.totalOneTime)}</span>
                </div>
              </div>

              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="font-semibold">Total Cost:</span>
                <span className="font-bold text-lg">{formatCurrency(costs.grandTotal)}</span>
              </div>
            </div>
          </Card>
        );
      })}
    </Grid>
  );
};

export default CostSummary;

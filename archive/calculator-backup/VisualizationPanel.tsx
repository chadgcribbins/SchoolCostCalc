import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { FormattedSchoolData, FamilyCosts } from '@/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface VisualizationPanelProps {
  familyCosts: FamilyCosts;
  schoolsData: Record<string, FormattedSchoolData>;
  formatCurrency: (amount: number) => string;
  years: number[];
  currentYear: number;
}

const VisualizationPanel = ({
  familyCosts,
  schoolsData,
  formatCurrency,
  years,
  currentYear,
}: VisualizationPanelProps) => {
  const [chartType, setChartType] = useState('totalCost');

  const schoolIds = Object.keys(familyCosts.bySchool);
  const schoolNames = schoolIds.map(id => schoolsData[id].name.split(' ')[0]);

  // Prepare data for total cost comparison
  const totalCostData = {
    labels: schoolNames,
    datasets: [
      {
        label: 'Mandatory Costs',
        data: schoolIds.map(id => Math.round(familyCosts.bySchool[id].totalMandatory / 1000)),
        backgroundColor: 'rgba(53, 162, 235, 0.7)',
      },
      {
        label: 'Optional Costs',
        data: schoolIds.map(id => Math.round(familyCosts.bySchool[id].totalOptional / 1000)),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      },
      {
        label: 'One-time Fees',
        data: schoolIds.map(id => Math.round(familyCosts.bySchool[id].totalOneTime / 1000)),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
      },
    ],
  };

  // Prepare data for yearly cost comparison
  const yearlyLabels = years.map(year => year.toString());

  const yearlyDatasets = schoolIds.map(schoolId => {
    const totalsByYear: Record<number, number> = {};
    const school = schoolsData[schoolId];

    // Calculate total cost per year
    Object.values(familyCosts.bySchool[schoolId].byStudent).forEach(student => {
      Object.entries(student.yearly).forEach(([yearStr, costs]) => {
        const year = parseInt(yearStr);
        if (!totalsByYear[year]) totalsByYear[year] = 0;
        totalsByYear[year] += costs.total;
      });
    });

    // Add one-time costs to first year
    totalsByYear[currentYear] =
      (totalsByYear[currentYear] || 0) + familyCosts.bySchool[schoolId].totalOneTime;

    return {
      label: school.name.split(' ')[0],
      data: years.map(year => Math.round(totalsByYear[year] || 0) / 1000),
      borderColor: getSchoolColor(schoolId),
      backgroundColor: getSchoolColor(schoolId, 0.1),
      borderWidth: 2,
      tension: 0.1,
    };
  });

  const yearlyData = {
    labels: yearlyLabels,
    datasets: yearlyDatasets,
  };

  // Prepare data for cost breakdown
  const prepareCostBreakdownData = (schoolId: string) => {
    const costs = familyCosts.bySchool[schoolId];
    const oneTimeFees = costs.totalOneTime;
    const tuition = costs.totalMandatory - 0; // Subtract other mandatory costs if needed in the future
    const lunch = schoolIds.map(id =>
      Object.values(familyCosts.bySchool[id].byStudent).reduce(
        (total, student) =>
          total +
          Object.values(student.yearly).reduce((sum, cost) => sum + cost.breakdown.lunch, 0),
        0
      )
    )[schoolIds.indexOf(schoolId)];

    const transport = schoolIds.map(id =>
      Object.values(familyCosts.bySchool[id].byStudent).reduce(
        (total, student) =>
          total +
          Object.values(student.yearly).reduce((sum, cost) => sum + cost.breakdown.transport, 0),
        0
      )
    )[schoolIds.indexOf(schoolId)];

    const uniform = schoolIds.map(id =>
      Object.values(familyCosts.bySchool[id].byStudent).reduce(
        (total, student) =>
          total +
          Object.values(student.yearly).reduce((sum, cost) => sum + cost.breakdown.uniform, 0),
        0
      )
    )[schoolIds.indexOf(schoolId)];

    const afterSchool = schoolIds.map(id =>
      Object.values(familyCosts.bySchool[id].byStudent).reduce(
        (total, student) =>
          total +
          Object.values(student.yearly).reduce((sum, cost) => sum + cost.breakdown.afterSchool, 0),
        0
      )
    )[schoolIds.indexOf(schoolId)];

    return {
      labels: ['Tuition', 'Registration Fees', 'Lunch', 'Transport', 'Uniform', 'After School'],
      datasets: [
        {
          data: [
            Math.round(tuition / 1000),
            Math.round(oneTimeFees / 1000),
            Math.round(lunch / 1000),
            Math.round(transport / 1000),
            Math.round(uniform / 1000),
            Math.round(afterSchool / 1000),
          ],
          backgroundColor: [
            'rgba(53, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 205, 86, 0.7)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const [selectedSchool, setSelectedSchool] = useState(schoolIds[0]);
  const costBreakdownData = prepareCostBreakdownData(selectedSchool);

  // Helper function to get a consistent color for each school
  function getSchoolColor(schoolId: string, alpha = 0.7): string {
    const colorMap: Record<string, string> = {
      lisboan: `rgba(53, 162, 235, ${alpha})`,
      tasis: `rgba(255, 99, 132, ${alpha})`,
      stDominics: `rgba(75, 192, 192, ${alpha})`,
    };

    return colorMap[schoolId] || `rgba(180, 180, 180, ${alpha})`;
  }

  // Options for bar chart
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '10-Year Education Costs by School (in €1,000s)',
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += `€${context.parsed.y}k`;
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Cost (€1,000s)',
        },
      },
    },
  };

  // Options for line chart
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Yearly Education Costs (in €1,000s)',
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += `€${context.parsed.y}k`;
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Cost (€1,000s)',
        },
      },
    },
  };

  // Options for pie chart
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Cost Breakdown by Category (in €1,000s)',
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value * 100) / total);
            return `${label}: €${value}k (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Cost Visualization</h2>

        <div className="mb-4">
          <Tabs value={chartType} onValueChange={setChartType}>
            <TabsList className="mb-4">
              <TabsTrigger value="totalCost">Total Cost Comparison</TabsTrigger>
              <TabsTrigger value="yearlyTrend">Yearly Cost Trend</TabsTrigger>
              <TabsTrigger value="costBreakdown">Cost Breakdown</TabsTrigger>
            </TabsList>

            <TabsContent value="totalCost">
              <div className="h-96">
                <Bar data={totalCostData} options={barOptions} />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>
                  This chart shows the total 10-year cost broken down by mandatory, optional, and
                  one-time fees.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="yearlyTrend">
              <div className="h-96">
                <Line data={yearlyData} options={lineOptions} />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>
                  This chart shows year-by-year costs across all schools, including one-time fees in
                  the first year.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="costBreakdown">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Select School</label>
                <select
                  value={selectedSchool}
                  onChange={e => setSelectedSchool(e.target.value)}
                  className="w-full md:w-64 px-3 py-2 border rounded"
                >
                  {schoolIds.map(id => (
                    <option key={id} value={id}>
                      {schoolsData[id].name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="h-96">
                <Pie data={costBreakdownData} options={pieOptions} />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>
                  This chart shows how costs are distributed across different categories for the
                  selected school.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Cost Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2">School</th>
                <th className="text-right p-2">One-time Fees</th>
                <th className="text-right p-2">Mandatory Costs</th>
                <th className="text-right p-2">Optional Costs</th>
                <th className="text-right p-2">Total 10-year Cost</th>
              </tr>
            </thead>
            <tbody>
              {schoolIds.map(schoolId => {
                const costs = familyCosts.bySchool[schoolId];
                return (
                  <tr key={schoolId} className="border-b border-gray-200">
                    <td className="p-2">{schoolsData[schoolId].name}</td>
                    <td className="text-right p-2">{formatCurrency(costs.totalOneTime)}</td>
                    <td className="text-right p-2">{formatCurrency(costs.totalMandatory)}</td>
                    <td className="text-right p-2">{formatCurrency(costs.totalOptional)}</td>
                    <td className="font-bold text-right p-2">{formatCurrency(costs.grandTotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VisualizationPanel;

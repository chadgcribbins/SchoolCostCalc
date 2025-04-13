import { useState, useEffect } from 'react';
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
import { Section } from '@/components/ui/section';
import { Badge } from '@/components/ui/badge';
import { FormLabel } from '@/components/ui/form';

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
  const schoolIds = Object.keys(familyCosts.bySchool);
  const schoolNames = schoolIds.map(id => schoolsData[id].name.split(' ')[0]);

  // Configure dark mode for Chart.js
  useEffect(() => {
    // Set the chart.js defaults to use dark mode colors
    ChartJS.defaults.color = '#e5e7eb'; // text color
    ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.1)'; // border colors
    ChartJS.defaults.backgroundColor = 'rgba(255, 255, 255, 0.1)'; // background colors
  }, []);

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

  // Options for bar chart with dark mode
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
      },
      title: {
        display: true,
        text: '10-Year Education Costs by School (in €1,000s)',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        color: 'rgba(255, 255, 255, 0.9)',
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
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Cost in €1,000s',
          color: 'rgba(255, 255, 255, 0.7)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
  };

  // Options for line chart with dark mode
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
      },
      title: {
        display: true,
        text: 'Yearly Education Costs by School (in €1,000s)',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        color: 'rgba(255, 255, 255, 0.9)',
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
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cost in €1,000s',
          color: 'rgba(255, 255, 255, 0.7)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
  };

  // Options for pie chart with dark mode
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
      },
      title: {
        display: true,
        text: `Cost Breakdown for ${schoolsData[selectedSchool]?.name || ''} (in €1,000s)`,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        color: 'rgba(255, 255, 255, 0.9)',
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += `€${context.parsed}k`;
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="space-y-10">
      <Section
        title="Total Cost Comparison"
        description="View the total 10-year costs for each school broken down by category."
        className="border border-gray-700 rounded-lg p-6 shadow-md bg-gray-800"
      >
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="primary">Mandatory</Badge>
          <Badge variant="success">Optional</Badge>
          <Badge variant="danger">One-time</Badge>
        </div>
        <div className="h-96 bg-gray-900 p-4 rounded-lg">
          <Bar data={totalCostData} options={barOptions} />
        </div>
        <p className="mt-4 text-sm text-gray-300">
          This chart shows the total 10-year cost broken down by mandatory, optional, and one-time
          fees.
        </p>
      </Section>

      <Section
        title="Yearly Cost Trend"
        description="Compare how costs evolve over time for each school."
        className="border border-gray-700 rounded-lg p-6 shadow-md bg-gray-800"
      >
        <div className="flex items-center gap-2 mb-3">
          {schoolIds.map(id => (
            <Badge
              key={id}
              style={{
                backgroundColor: getSchoolColor(id, 0.2),
                color: getSchoolColor(id)
                  .replace(/[^,]+,[^,]+,[^,]+,/g, '')
                  .replace(')', ''),
              }}
            >
              {schoolsData[id].name.split(' ')[0]}
            </Badge>
          ))}
        </div>
        <div className="h-96 bg-gray-900 p-4 rounded-lg">
          <Line data={yearlyData} options={lineOptions} />
        </div>
        <p className="mt-4 text-sm text-gray-300">
          This chart shows the yearly cost for each school over the 10-year period.
        </p>
      </Section>

      <Section
        title="Cost Breakdown by Category"
        description="Explore the distribution of costs for each school by category."
        className="border border-gray-700 rounded-lg p-6 shadow-md bg-gray-800"
      >
        <div className="mb-6">
          <FormLabel htmlFor="school-select" className="mb-2 text-gray-300">
            Select School:
          </FormLabel>
          <select
            id="school-select"
            value={selectedSchool}
            onChange={e => setSelectedSchool(e.target.value)}
            className="w-full md:w-auto px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
          >
            {schoolIds.map(id => (
              <option key={id} value={id}>
                {schoolsData[id].name}
              </option>
            ))}
          </select>
        </div>

        <div className="h-96 bg-gray-900 p-4 rounded-lg">
          <Pie data={costBreakdownData} options={pieOptions} />
        </div>
        <p className="mt-4 text-sm text-gray-300">
          This chart shows the breakdown of total costs for{' '}
          {schoolsData[selectedSchool]?.name || ''} over the 10-year period.
        </p>
      </Section>
    </div>
  );
};

export default VisualizationPanel;

import { FamilyCosts, FormattedSchoolData, FamilyMember } from '@/types';
import { Grid } from '@/components/ui/grid';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PencilIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { useState, useEffect, useRef } from 'react';
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
import { Bar, Line, Pie } from 'react-chartjs-2';

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

interface CostSummaryProps {
  familyCosts: FamilyCosts;
  schoolsData: Record<string, FormattedSchoolData>;
  formatCurrency: (amount: number) => string;
  familyMembers: FamilyMember[];
  setActiveTab: (value: string) => void;
  years: number[];
  currentYear: number;
}

const CostSummary = ({
  familyCosts,
  schoolsData,
  formatCurrency,
  familyMembers,
  setActiveTab,
  years,
  currentYear,
}: CostSummaryProps) => {
  const schools = Object.keys(familyCosts.bySchool);

  // Sort schools by total cost
  const sortedSchools = [...schools].sort((a, b) => {
    return familyCosts.bySchool[a].grandTotal - familyCosts.bySchool[b].grandTotal;
  });

  // The first school is now the lowest cost
  const lowestCostSchool = sortedSchools[0];
  const [selectedSchool, setSelectedSchool] = useState(lowestCostSchool);

  // State to track visible datasets
  const [barVisibleDatasets, setBarVisibleDatasets] = useState<boolean[]>([true, true, true]);
  const [lineVisibleDatasets, setLineVisibleDatasets] = useState<boolean[]>(
    sortedSchools.map(() => true)
  );
  const [pieVisibleSegments, setPieVisibleSegments] = useState<boolean[]>(Array(6).fill(true));

  // Chart type toggle for yearly projection
  const [yearlyChartType, setYearlyChartType] = useState<'bar' | 'line'>('line');

  // State for totals
  const [visibleBarTotal, setVisibleBarTotal] = useState<Record<string, number>>({});
  const [visibleLineYearTotals, setVisibleLineYearTotals] = useState<Record<string, number>>({});
  const [visiblePieTotal, setVisiblePieTotal] = useState<number>(0);

  // Add refs for chart instances
  const barChartRef = useRef<any>(null);
  const lineChartRef = useRef<any>(null);
  const pieChartRef = useRef<any>(null);
  const yearlyBarChartRef = useRef<any>(null);
  const yearlyLineChartRef = useRef<any>(null);

  // Configure dark mode for Chart.js
  useEffect(() => {
    // Set the chart.js defaults to use dark mode colors
    ChartJS.defaults.color = '#e5e7eb'; // text color
    ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.1)'; // border colors
    ChartJS.defaults.backgroundColor = 'rgba(255, 255, 255, 0.1)'; // background colors

    // Initialize totals
    updateBarTotals(barVisibleDatasets);
    updateLineTotals(lineVisibleDatasets);
    updatePieTotal(pieVisibleSegments);
  }, []);

  // Get totals by year for each school (moved from YearlyProjection)
  const getTotalByYear = (schoolId: string) => {
    const totalsByYear: Record<number, number> = {};
    const costs = familyCosts.bySchool[schoolId];

    // Calculate total cost per year
    Object.values(costs.byStudent).forEach(student => {
      Object.entries(student.yearly).forEach(([yearStr, yearCosts]) => {
        const year = parseInt(yearStr);
        if (!totalsByYear[year]) totalsByYear[year] = 0;
        totalsByYear[year] += yearCosts.total;
      });
    });

    // Add registration fees to first year
    const firstYear = years[0];
    totalsByYear[firstYear] = (totalsByYear[firstYear] || 0) + costs.totalOneTime;

    return totalsByYear;
  };

  // Helper function to get school color with alpha
  function getSchoolColor(schoolId: string, alpha = 0.7): string {
    const colorMap: Record<string, string> = {
      lisboan: `rgba(53, 162, 235, ${alpha})`,
      tasis: `rgba(255, 99, 132, ${alpha})`,
      stDominics: `rgba(75, 192, 192, ${alpha})`,
      primaryyears: `rgba(255, 159, 64, ${alpha})`,
      carlucci: `rgba(153, 102, 255, ${alpha})`,
      parkschool: `rgba(255, 205, 86, ${alpha})`,
    };

    return colorMap[schoolId] || `rgba(180, 180, 180, ${alpha})`;
  }

  // Prepare data for yearly bar chart visualization (from YearlyProjection)
  const prepareYearlyBarData = () => {
    const datasets = sortedSchools.map(schoolId => {
      const totalsByYear = getTotalByYear(schoolId);

      return {
        label: schoolsData[schoolId].name.split(' ')[0],
        data: years.map(year => totalsByYear[year] || 0),
        backgroundColor: getSchoolColor(schoolId),
        borderColor: getSchoolColor(schoolId, 1),
        borderWidth: 1,
      };
    });

    return {
      labels: years.map(year => year.toString()),
      datasets,
    };
  };

  // Prepare data for yearly line chart visualization
  const prepareYearlyLineData = () => {
    const datasets = sortedSchools.map(schoolId => {
      const totalsByYear = getTotalByYear(schoolId);

      return {
        label: schoolsData[schoolId].name.split(' ')[0],
        data: years.map(year => totalsByYear[year] || 0),
        backgroundColor: getSchoolColor(schoolId),
        borderColor: getSchoolColor(schoolId, 1),
        borderWidth: 2,
        tension: 0.2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: false,
      };
    });

    return {
      labels: years.map(year => year.toString()),
      datasets,
    };
  };

  // Bar chart options for yearly visualization
  const yearlyBarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: function (this: any, value: number) {
            return formatCurrency(value);
          } as any,
        },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        titleColor: 'rgba(255, 255, 255, 1)',
        bodyColor: 'rgba(255, 255, 255, 1)',
        padding: 12,
        displayColors: true,
        boxWidth: 10,
        boxHeight: 10,
        boxPadding: 3,
        usePointStyle: false,
        callbacks: {
          label: function (context: any) {
            // Only show the school name and value, no total
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${formatCurrency(value)}`;
          },
          // Remove the title that shows the total
          title: function (context: any) {
            return context[0].label;
          },
        },
      },
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'white',
          boxWidth: 14,
          boxHeight: 14,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
      title: {
        display: true,
        text: 'School Costs Per Year',
        font: {
          size: 16,
          weight: 'bold' as const,
          family: "'Inter', sans-serif",
        },
        color: 'white',
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    animation: {
      duration: 1000,
    },
  };

  // Line chart options for yearly visualization
  const yearlyLineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: function (this: any, value: number) {
            return formatCurrency(value);
          } as any,
        },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        titleColor: 'rgba(255, 255, 255, 1)',
        bodyColor: 'rgba(255, 255, 255, 1)',
        padding: 12,
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${formatCurrency(value)}`;
          },
        },
      },
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'white',
          boxWidth: 14,
          boxHeight: 14,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
      title: {
        display: true,
        text: 'Yearly Cost Projection',
        font: {
          size: 16,
          weight: 'bold' as const,
          family: "'Inter', sans-serif",
        },
        color: 'white',
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    animation: {
      duration: 1000,
    },
  };

  // Prepare data for total cost comparison
  const schoolNames = sortedSchools.map(id => schoolsData[id].name.split(' ')[0]);

  // Added function to calculate total cost per school
  const getTotalCostBySchool = (schoolId: string): number => {
    return familyCosts.bySchool[schoolId].grandTotal;
  };

  // Calculate bar chart totals based on visible datasets
  const updateBarTotals = (visibleDatasets: boolean[]) => {
    const totals: Record<string, number> = {};

    sortedSchools.forEach(schoolId => {
      let total = 0;

      if (visibleDatasets[0]) {
        // Mandatory costs
        total += Math.round(familyCosts.bySchool[schoolId].totalMandatory / 1000);
      }

      if (visibleDatasets[1]) {
        // Optional costs
        total += Math.round(familyCosts.bySchool[schoolId].totalOptional / 1000);
      }

      if (visibleDatasets[2]) {
        // One-time fees
        total += Math.round(familyCosts.bySchool[schoolId].totalOneTime / 1000);
      }

      totals[schoolId] = total;
    });

    setVisibleBarTotal(totals);
  };

  // Calculate line chart totals based on visible datasets
  const updateLineTotals = (visibleDatasets: boolean[]) => {
    const totals: Record<string, number> = {};

    years.forEach(year => {
      const yearStr = year.toString();
      let total = 0;

      sortedSchools.forEach((schoolId, index) => {
        if (visibleDatasets[index]) {
          // Find the data point for this year in the dataset
          const yearData = yearlyDatasets[index].data[years.indexOf(year)];
          total += yearData;
        }
      });

      totals[yearStr] = total;
    });

    setVisibleLineYearTotals(totals);
  };

  // Calculate pie chart total based on visible segments
  const updatePieTotal = (visibleSegments: boolean[]) => {
    const data = prepareCostBreakdownData(selectedSchool);
    let total = 0;

    data.datasets[0].data.forEach((value, index) => {
      if (visibleSegments[index]) {
        total += value;
      }
    });

    setVisiblePieTotal(total);
  };

  // Added annotations for bar chart to display totals above each bar
  // Update bar chart data to include totals for each school
  const totalCostData = {
    labels: schoolNames,
    datasets: [
      {
        label: 'Mandatory Costs',
        data: sortedSchools.map(id => Math.round(familyCosts.bySchool[id].totalMandatory / 1000)),
        backgroundColor: 'rgba(53, 162, 235, 0.7)',
      },
      {
        label: 'Optional Costs',
        data: sortedSchools.map(id => Math.round(familyCosts.bySchool[id].totalOptional / 1000)),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      },
      {
        label: 'One-time Fees',
        data: sortedSchools.map(id => Math.round(familyCosts.bySchool[id].totalOneTime / 1000)),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
      },
    ],
  };

  // Prepare data for yearly cost comparison
  const yearlyLabels = years.map(year => year.toString());

  const yearlyDatasets = sortedSchools.map(schoolId => {
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

  // Prepare data for cost breakdown pie chart
  const prepareCostBreakdownData = (schoolId: string) => {
    const costs = familyCosts.bySchool[schoolId];
    const oneTimeFees = costs.totalOneTime;
    const tuition = costs.totalMandatory - 0; // Subtract other mandatory costs if needed in the future

    // Calculate total costs by type
    let lunchTotal = 0;
    let transportTotal = 0;
    let uniformTotal = 0;
    let afterSchoolTotal = 0;

    Object.values(costs.byStudent).forEach(student => {
      Object.values(student.yearly).forEach(yearCost => {
        lunchTotal += yearCost.breakdown.lunch;
        transportTotal += yearCost.breakdown.transport;
        uniformTotal += yearCost.breakdown.uniform;
        afterSchoolTotal += yearCost.breakdown.afterSchool;
      });
    });

    // Find which categories have data
    const hasLunch = lunchTotal > 0;
    const hasTransport = transportTotal > 0;
    const hasUniform = uniformTotal > 0;
    const hasAfterSchool = afterSchoolTotal > 0;

    const values = [
      Math.round(tuition / 1000),
      Math.round(oneTimeFees / 1000),
      Math.round(lunchTotal / 1000),
      Math.round(transportTotal / 1000),
      Math.round(uniformTotal / 1000),
      Math.round(afterSchoolTotal / 1000),
    ];

    // Create background colors with dimmed appearance for zero values
    const regularColors = [
      'rgba(53, 162, 235, 0.7)',
      'rgba(255, 99, 132, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(255, 159, 64, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 205, 86, 0.7)',
    ];

    const dimmedColors = [
      'rgba(53, 162, 235, 0.2)',
      'rgba(255, 99, 132, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 205, 86, 0.2)',
    ];

    // For each value, use regular or dimmed color based on whether it's zero
    const backgroundColors = [
      regularColors[0], // Tuition is always included
      regularColors[1], // Registration fees are always included
      hasLunch ? regularColors[2] : dimmedColors[2],
      hasTransport ? regularColors[3] : dimmedColors[3],
      hasUniform ? regularColors[4] : dimmedColors[4],
      hasAfterSchool ? regularColors[5] : dimmedColors[5],
    ];

    return {
      labels: ['Tuition', 'Registration Fees', 'Lunch', 'Transport', 'Uniform', 'After School'],
      datasets: [
        {
          data: values,
          backgroundColor: backgroundColors,
          borderWidth: 1,
        },
      ],
    };
  };

  // Update pie chart totals when school changes
  useEffect(() => {
    updatePieTotal(pieVisibleSegments);
  }, [selectedSchool]);

  const costBreakdownData = prepareCostBreakdownData(selectedSchool);

  // Update bar chart options with generateLabels
  const createBarOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: 'rgba(255, 255, 255, 0.8)',
            usePointStyle: true,
            pointStyle: 'circle',
            generateLabels: (chart: any) => {
              // This ensures labels reflect the hidden state
              const datasets = chart.data.datasets;

              return datasets.map((dataset: any, i: number) => {
                return {
                  text: dataset.label,
                  fillStyle: dataset.backgroundColor,
                  strokeStyle: 'rgba(255, 255, 255, 0.8)',
                  lineWidth: 1,
                  hidden: !barVisibleDatasets[i],
                  datasetIndex: i,
                  pointStyle: 'circle',
                };
              });
            },
          },
          onClick: (e: any, legendItem: any, legend: any) => {
            // Get the index of the clicked dataset
            const index = legendItem.datasetIndex;

            // Toggle visibility in our state
            const newVisibility = [...barVisibleDatasets];
            newVisibility[index] = !newVisibility[index];
            setBarVisibleDatasets(newVisibility);

            // Update the total based on new visibility
            updateBarTotals(newVisibility);

            // Toggle visibility in the chart
            const ci = legend.chart;
            ci.getDatasetMeta(index).hidden = !ci.getDatasetMeta(index).hidden;
            ci.update();
          },
        },
        title: {
          display: true,
          text: 'Total Education Costs by School (in €1,000s)',
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
            footer: function (tooltipItems: any) {
              // Use dynamic total that respects visible datasets
              const schoolIndex = tooltipItems[0].dataIndex;
              const schoolId = sortedSchools[schoolIndex];
              const visibleTotal = visibleBarTotal[schoolId] || 0;
              return `Total: €${visibleTotal}k`;
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
  };

  // Update line chart options with generateLabels
  const createLineOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: 'rgba(255, 255, 255, 0.8)',
            usePointStyle: true,
            pointStyle: 'circle',
            generateLabels: (chart: any) => {
              // This ensures labels reflect the hidden state
              const datasets = chart.data.datasets;

              return datasets.map((dataset: any, i: number) => {
                return {
                  text: dataset.label,
                  fillStyle: dataset.borderColor,
                  strokeStyle: dataset.borderColor,
                  lineWidth: 2,
                  hidden: !lineVisibleDatasets[i],
                  datasetIndex: i,
                  pointStyle: 'circle',
                };
              });
            },
          },
          onClick: (e: any, legendItem: any, legend: any) => {
            // Get the index of the clicked dataset
            const index = legendItem.datasetIndex;

            // Toggle visibility in our state
            const newVisibility = [...lineVisibleDatasets];
            newVisibility[index] = !newVisibility[index];
            setLineVisibleDatasets(newVisibility);

            // Update the total based on new visibility
            updateLineTotals(newVisibility);

            // Toggle visibility in the chart
            const ci = legend.chart;
            ci.getDatasetMeta(index).hidden = !ci.getDatasetMeta(index).hidden;
            ci.update();
          },
        },
        title: {
          display: true,
          text: 'Yearly Cost Projection (in €1,000s)',
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
            footer: function (tooltipItems: any) {
              const year = tooltipItems[0].label;
              // Use dynamic total that respects visible datasets
              const yearTotal = visibleLineYearTotals[year] || 0;
              return `Year Total: €${yearTotal}k`;
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
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          title: {
            display: true,
            text: 'Cost in €1,000s',
            color: 'rgba(255, 255, 255, 0.7)',
          },
        },
      },
    };
  };

  // Add a function to create custom options for pie chart with click handlers
  const createPieOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '40%', // Make this a doughnut chart to display total in center
      plugins: {
        legend: {
          position: 'right' as const,
          labels: {
            color: 'rgba(255, 255, 255, 0.8)',
            usePointStyle: true,
            pointStyle: 'circle',
            generateLabels: (chart: any) => {
              // This custom function ensures labels reflect the hidden state and style
              const datasets = chart.data.datasets;
              const labels = chart.data.labels;

              if (datasets.length === 0) {
                return [];
              }

              return labels.map((label: string, i: number) => {
                const meta = chart.getDatasetMeta(0);
                const value = datasets[0].data[i];
                const isHidden = meta.data[i].hidden || !pieVisibleSegments[i];
                const isZero = value === 0;

                return {
                  text: isZero ? `${label} (Not Included)` : label,
                  fillStyle: datasets[0].backgroundColor[i],
                  strokeStyle: '#fff',
                  lineWidth: 2,
                  hidden: isHidden,
                  index: i,
                  pointStyle: 'circle',
                  fontColor: isZero ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                };
              });
            },
          },
          onClick: (e: any, legendItem: any, legend: any) => {
            // Get the index of the clicked item
            const index = legendItem.index;

            // Toggle visibility in our state
            const newVisibility = [...pieVisibleSegments];
            newVisibility[index] = !newVisibility[index];
            setPieVisibleSegments(newVisibility);

            // Update the total based on new visibility
            updatePieTotal(newVisibility);

            // Toggle visibility in the chart
            const ci = legend.chart;
            if (ci.getDatasetMeta(0).data[index]) {
              ci.getDatasetMeta(0).data[index].hidden = !ci.getDatasetMeta(0).data[index].hidden;
              ci.update();
            }
          },
        },
        title: {
          display: true,
          text: `Cost Breakdown for ${schoolsData[selectedSchool]?.name || ''}`,
          font: {
            size: 16,
            weight: 'bold' as const,
          },
          color: 'rgba(255, 255, 255, 0.9)',
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              const value = context.parsed;
              if (value === 0) {
                return `${context.label}: Not Included`;
              }

              // Calculate percentage based on visible segments total
              const totalVisible = pieVisibleSegments.reduce((acc, isVisible, idx) => {
                const dataValue = costBreakdownData.datasets[0].data[idx];
                return isVisible && dataValue > 0 ? acc + dataValue : acc;
              }, 0);

              const percentage = Math.round((value * 100) / totalVisible);
              let label = context.label || '';
              if (label) {
                label += ': ';
              }
              if (value !== null) {
                label += `€${value}k (${percentage}%)`;
              }
              return label;
            },
          },
        },
      },
    };
  };

  // Replace the constants with calls to the functions
  const barOptions = createBarOptions();
  const lineOptions = createLineOptions();
  const pieOptions = createPieOptions();

  // Replace the pie chart render with the center total in a useEffect
  useEffect(() => {
    // Clear and redraw the center text when visiblePieTotal changes
    const chartCanvas = document.getElementById('cost-breakdown-chart');
    if (chartCanvas) {
      const ctx = (chartCanvas as HTMLCanvasElement).getContext('2d');
      if (ctx) {
        // Calculate canvas center
        const width = (chartCanvas as HTMLCanvasElement).width;
        const height = (chartCanvas as HTMLCanvasElement).height;

        // Format the total
        const totalInThousands = Math.round(visiblePieTotal);

        // Clear previous text (clearing a small rectangle in the center)
        ctx.clearRect(width / 2 - 60, height / 2 - 30, 120, 60);

        // Draw the new text
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';

        // Title
        ctx.font = 'bold 14px Arial';
        ctx.fillText('Total', width / 2, height / 2 - 10);

        // Value
        ctx.font = 'bold 18px Arial';
        ctx.fillText(`€${totalInThousands}k`, width / 2, height / 2 + 10);
      }
    }
  }, [visiblePieTotal, costBreakdownData]);

  // Apply chart visibility to elements on first render and when visibility states change
  useEffect(() => {
    if (barChartRef.current) {
      barVisibleDatasets.forEach((isVisible, index) => {
        const meta = barChartRef.current.getDatasetMeta(index);
        meta.hidden = !isVisible;
      });
      barChartRef.current.update();
    }
  }, [barVisibleDatasets]);

  useEffect(() => {
    if (lineChartRef.current) {
      lineVisibleDatasets.forEach((isVisible, index) => {
        const meta = lineChartRef.current.getDatasetMeta(index);
        meta.hidden = !isVisible;
      });
      lineChartRef.current.update();
    }
  }, [lineVisibleDatasets]);

  useEffect(() => {
    if (pieChartRef.current) {
      pieVisibleSegments.forEach((isVisible, index) => {
        const meta = pieChartRef.current.getDatasetMeta(0);
        if (meta.data[index]) {
          meta.data[index].hidden = !isVisible;
        }
      });
      pieChartRef.current.update();
    }
  }, [pieVisibleSegments]);

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSchool(e.target.value);
  };

  return (
    <div className="space-y-8">
      {/* 1. Family Members Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Family Members</h3>
        <Grid cols={1} mdCols={3} gap="md">
          {familyMembers.map(member => (
            <Card
              key={member.id}
              className="border border-gray-700 rounded-lg shadow-sm overflow-hidden bg-gray-800"
            >
              <div className="p-4 bg-gray-750 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-gray-700"
                  onClick={() => setActiveTab('family')}
                >
                  <PencilIcon className="h-4 w-4 text-gray-400" />
                </Button>
              </div>
              <div className="p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-300">Age:</span>
                  <span className="text-sm font-medium text-white">{member.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-300">Graduation Year:</span>
                  <span className="text-sm font-medium text-white">{member.graduationYear}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Included Costs:</h4>
                  <div className="flex flex-wrap gap-1">
                    {member.includeOptionalCosts.lunch && (
                      <Badge className="bg-blue-900 text-white border-blue-800">Lunch</Badge>
                    )}
                    {member.includeOptionalCosts.transport && (
                      <Badge className="bg-purple-900 text-white border-purple-800">
                        Transport
                      </Badge>
                    )}
                    {member.includeOptionalCosts.uniform && (
                      <Badge className="bg-orange-900 text-white border-orange-800">Uniform</Badge>
                    )}
                    {member.includeOptionalCosts.afterSchool && (
                      <Badge className="bg-teal-900 text-white border-teal-800">After School</Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </Grid>
      </div>

      {/* 2. School Cost Comparison */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">School Cost Comparison</h3>
        <Grid cols={1} mdCols={3} gap="md">
          {sortedSchools.map(schoolId => {
            const school = schoolsData[schoolId];
            const costs = familyCosts.bySchool[schoolId];
            const isLowestCost = schoolId === lowestCostSchool;

            return (
              <Card
                key={schoolId}
                className={`border rounded-lg shadow-sm overflow-hidden ${isLowestCost ? 'border-green-500' : 'border-gray-700'} bg-gray-800`}
              >
                <div
                  className={`p-4 ${isLowestCost ? 'bg-green-900' : 'bg-gray-750'} border-b border-gray-700`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-semibold text-white">{school.name}</h3>
                    {isLowestCost && (
                      <Badge className="bg-green-700 text-white border-green-600">Best Value</Badge>
                    )}
                  </div>
                  <a
                    href={school.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:underline"
                  >
                    School Website
                  </a>
                </div>

                <div className="p-4">
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300">Mandatory Costs:</span>
                      <span className="text-sm font-medium text-white">
                        {formatCurrency(costs.totalMandatory)}
                      </span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300">Optional Costs:</span>
                      <span className="text-sm font-medium text-white">
                        {formatCurrency(costs.totalOptional)}
                      </span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300">One-time Fees:</span>
                      <span className="text-sm font-medium text-white">
                        {formatCurrency(costs.totalOneTime)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between pt-3 border-t border-gray-600">
                    <span className="font-semibold text-gray-200">Total Cost:</span>
                    <span className="font-bold text-lg text-white">
                      {formatCurrency(costs.grandTotal)}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </Grid>
      </div>

      {/* 3. Visualization Section */}
      <div className="space-y-10">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Total Cost Comparison</h3>
            <div className="text-sm text-gray-300">
              Hover over bars to see cost breakdown and total
            </div>
          </div>
          <div className="h-80">
            <Bar
              data={totalCostData}
              options={barOptions}
              ref={ref => {
                if (ref) {
                  barChartRef.current = ref;
                }
              }}
            />
          </div>
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {sortedSchools.map((schoolId, index) => (
              <div
                key={schoolId}
                className="flex items-center space-x-2 bg-gray-750 px-3 py-1 rounded-full"
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getSchoolColor(schoolId) }}
                ></span>
                <span className="text-sm text-white">
                  {schoolsData[schoolId].name.split(' ')[0]}:{' '}
                  {formatCurrency((visibleBarTotal[schoolId] || 0) * 1000)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Yearly Cost Projection</h3>
            <div className="flex items-center gap-2">
              <Button
                variant={yearlyChartType === 'bar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setYearlyChartType('bar')}
                className="text-xs"
              >
                Bar Chart
              </Button>
              <Button
                variant={yearlyChartType === 'line' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setYearlyChartType('line')}
                className="text-xs"
              >
                Line Chart
              </Button>
            </div>
          </div>
          <Card className="p-6 bg-gray-900 shadow-lg border-gray-800 mb-8">
            <div className="h-80" style={{ minHeight: '400px' }}>
              {yearlyChartType === 'bar' ? (
                <Bar
                  data={prepareYearlyBarData()}
                  options={yearlyBarChartOptions}
                  ref={ref => {
                    if (ref) {
                      yearlyBarChartRef.current = ref;
                    }
                  }}
                />
              ) : (
                <Line
                  data={prepareYearlyLineData()}
                  options={yearlyLineChartOptions}
                  ref={ref => {
                    if (ref) {
                      yearlyLineChartRef.current = ref;
                    }
                  }}
                />
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-gray-700 flex flex-wrap gap-3 justify-center">
              {sortedSchools.map(schoolId => {
                const totalForSchool = years.reduce((sum, year) => {
                  return sum + (getTotalByYear(schoolId)[year] || 0);
                }, 0);

                return (
                  <div
                    key={schoolId}
                    className="flex items-center gap-2.5 bg-gray-800 px-4 py-2 rounded-full border border-gray-700 shadow-md"
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{
                        backgroundColor: getSchoolColor(schoolId),
                        border: '1px solid rgba(255,255,255,0.3)',
                      }}
                    ></div>
                    <span className="text-sm text-gray-300">
                      {schoolsData[schoolId].name.split(' ')[0]}:{' '}
                      <span className="font-semibold text-white">
                        {formatCurrency(totalForSchool)}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Cost Breakdown</h3>
            <Select
              value={selectedSchool}
              onChange={handleSchoolChange}
              className="w-[240px] bg-gray-700 border-gray-600 text-white"
            >
              {sortedSchools.map(schoolId => (
                <option key={schoolId} value={schoolId}>
                  {schoolsData[schoolId].name} -{' '}
                  {formatCurrency(familyCosts.bySchool[schoolId].grandTotal)}
                </option>
              ))}
            </Select>
          </div>
          <div className="h-80 relative">
            <Pie
              id="cost-breakdown-chart"
              data={costBreakdownData}
              options={pieOptions}
              ref={ref => {
                if (ref) {
                  pieChartRef.current = ref;
                }
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-lg font-bold text-white">Total</div>
                <div className="text-xl font-bold text-white">
                  {formatCurrency(visiblePieTotal * 1000)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostSummary;

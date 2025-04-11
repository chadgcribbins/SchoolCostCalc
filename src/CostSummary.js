import React from 'react';

const CostSummary = ({ schoolsData, familyCosts, formatCurrency }) => {
  return (
    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Cost Summary</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-blue-100">
              <th className="py-2 px-3 text-left">School</th>
              <th className="py-2 px-3 text-right">Mandatory Costs</th>
              <th className="py-2 px-3 text-right">Optional Costs</th>
              <th className="py-2 px-3 text-right">One-time Fees</th>
              <th className="py-2 px-3 text-right">Total (10 Years)</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(schoolsData).map(schoolId => (
              <tr key={schoolId} className="border-t">
                <td className="py-2 px-3 font-medium">{schoolsData[schoolId].name}</td>
                <td className="py-2 px-3 text-right">{formatCurrency(familyCosts[schoolId].mandatory.total)}</td>
                <td className="py-2 px-3 text-right">{formatCurrency(familyCosts[schoolId].optional.total)}</td>
                <td className="py-2 px-3 text-right">{formatCurrency(familyCosts[schoolId].oneTime.total)}</td>
                <td className="py-2 px-3 text-right font-bold">{formatCurrency(familyCosts[schoolId].grandTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CostSummary;
'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Grid } from '@/components/ui/grid';

// Dynamically import the calculator to avoid hydration issues
const MainCalculator = dynamic(() => import('@/components/MainCalculator'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="space-y-6">
      <Grid cols={1} gap="lg">
        <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-2 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">
            Plan Your Children's Education Costs in Portugal
          </h2>
          <p className="text-gray-300 mb-2">
            This calculator helps you project the cost of private international education in
            Portugal from 2025 to 2035, with data from top international schools.
          </p>
          <p className="text-gray-300">
            Add your family members, customize costs, and explore detailed projections and
            visualizations.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="bg-gray-800 rounded-lg shadow-sm p-8 text-center border border-gray-700">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
              <p className="mt-4 text-gray-400">Loading calculator...</p>
            </div>
          }
        >
          <MainCalculator />
        </Suspense>
      </Grid>
    </div>
  );
}

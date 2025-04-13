import React from 'react';
import PortugalSchoolCalculator from './MainCalculator';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <PortugalSchoolCalculator />
      <footer className="text-center text-gray-500 text-sm mt-8">
        © {new Date().getFullYear()} Portugal International School Calculator
      </footer>
    </div>
  );
}

export default App;

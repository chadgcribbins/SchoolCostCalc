import FigmaTest from '@/components/FigmaTest';

export default function FigmaTestPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Figma Integration Test Page</h1>
      <p className="mb-6">
        This page tests the connection to the Figma API and displays information about the design
        system file.
      </p>

      <div className="bg-white shadow rounded-lg">
        <FigmaTest />
      </div>
    </div>
  );
}

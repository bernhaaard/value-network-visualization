"use client";

// Minimal 2D scene for testing
export function TwoDScene() {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="p-4">
        <svg width="100%" height="600px" viewBox="0 0 200 120" className="border rounded">
          {/* Simple test shapes */}
          <circle cx={50} cy={60} r={15} fill="#4a90e2" stroke="#fff" strokeWidth={2} />
          <rect x={75} y={45} width={30} height={30} fill="#50c878" stroke="#fff" strokeWidth={2} />
          <circle cx={130} cy={60} r={15} fill="#ff6b6b" stroke="#fff" strokeWidth={2} />

          {/* Simple connection lines */}
          <line x1={65} y1={60} x2={75} y2={60} stroke="#4a90e2" strokeWidth={2} />
          <line x1={105} y1={60} x2={115} y2={60} stroke="#4a90e2" strokeWidth={2} />
        </svg>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">SVG rendering test</p>
      </div>
    </div>
  );
}

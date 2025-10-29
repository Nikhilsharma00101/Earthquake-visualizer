import { useState } from "react";

interface FilterPanelProps {
  // Function to send filter values (min/max magnitude) to parent component
  onFilterChange: (filters: { minMag: number | null; maxMag: number | null }) => void;
  // Function to reset all filters
  onReset: () => void;
}

export default function FilterPanel({ onFilterChange, onReset }: FilterPanelProps) {
  // Local states for minimum and maximum magnitude inputs
  const [minMag, setMinMag] = useState<number | "">("");
  const [maxMag, setMaxMag] = useState<number | "">("");

  // Triggered when user clicks "Apply"
  const handleFilter = () => {
    onFilterChange({
      minMag: minMag === "" ? null : Number(minMag),
      maxMag: maxMag === "" ? null : Number(maxMag),
    });
  };

  // Resets all fields and filters
  const handleReset = () => {
    setMinMag("");
    setMaxMag("");
    onReset();
  };

  return (
    <div className="bg-gray-900/60 border border-gray-700 p-4 rounded-xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Magnitude range inputs */}
      <div className="flex items-center gap-3">
        {/* Minimum magnitude */}
        <div className="flex flex-col">
          <label className="text-gray-400 text-sm mb-1">Min Magnitude</label>
          <input
            type="number"
            step="0.1" // allows decimal input
            value={minMag}
            onChange={(e) => setMinMag(e.target.value === "" ? "" : parseFloat(e.target.value))}
            placeholder="e.g. 3.5"
            className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Maximum magnitude */}
        <div className="flex flex-col">
          <label className="text-gray-400 text-sm mb-1">Max Magnitude</label>
          <input
            type="number"
            step="0.1"
            value={maxMag}
            onChange={(e) => setMaxMag(e.target.value === "" ? "" : parseFloat(e.target.value))}
            placeholder="e.g. 7.0"
            className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Apply and Reset buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleFilter}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition"
        >
          Apply
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-md transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

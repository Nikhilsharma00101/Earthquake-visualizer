import { useState } from "react";

interface FilterPanelProps {
  minMag: number | null;
  maxMag: number | null;
  timeRange: "hour" | "day" | "week" | "month";
  onFilterChange: (filters: {
    minMag: number | null;
    maxMag: number | null;
    timeRange: "hour" | "day" | "week" | "month";
  }) => void;
  onReset: () => void;
}

export default function FilterPanel({
  minMag,
  maxMag,
  timeRange,
  onFilterChange,
  onReset,
}: FilterPanelProps) {
  const [localMin, setLocalMin] = useState<number | "">(minMag ?? "");
  const [localMax, setLocalMax] = useState<number | "">(maxMag ?? "");

  const handleApply = () => {
    onFilterChange({
      minMag: localMin === "" ? null : Number(localMin),
      maxMag: localMax === "" ? null : Number(localMax),
      timeRange,
    });
  };

  const handleReset = () => {
    setLocalMin("");
    setLocalMax("");
    onReset();
  };

  return (
    <div className="bg-gray-900/60 border border-gray-700 p-4 rounded-xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Min Magnitude */}
        <div className="flex flex-col">
          <label className="text-gray-400 text-sm mb-1">Min Magnitude</label>
          <input
            type="number"
            step="0.1"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value === "" ? "" : parseFloat(e.target.value))}
            placeholder="e.g. 3.5"
            className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Max Magnitude */}
        <div className="flex flex-col">
          <label className="text-gray-400 text-sm mb-1">Max Magnitude</label>
          <input
            type="number"
            step="0.1"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value === "" ? "" : parseFloat(e.target.value))}
            placeholder="e.g. 7.0"
            className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Time Range */}
        <div className="flex flex-col">
          <label className="text-gray-400 text-sm mb-1">Time Range</label>
          <select
            value={timeRange}
            onChange={(e) =>
              onFilterChange({
                minMag: localMin === "" ? null : Number(localMin),
                maxMag: localMax === "" ? null : Number(localMax),
                timeRange: e.target.value as "hour" | "day" | "week" | "month",
              })
            }
            className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="hour">Past Hour</option>
            <option value="day">Past 24 Hours</option>
            <option value="week">Past 7 Days</option>
            <option value="month">Past 30 Days</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleApply}
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

import { useState, useMemo } from "react";
import type { EarthquakeFeature } from "../utils/fetchEarthquakes";
import FilterPanel from "./FilterPanel";

interface EarthquakeStatsProps {
  earthquakes: EarthquakeFeature[];
}

export default function EarthquakeStats({ earthquakes }: EarthquakeStatsProps) {
  // Filter states
  const [filters, setFilters] = useState<{ minMag: number | null; maxMag: number | null }>({
    minMag: null,
    maxMag: null,
  });

  const handleFilterChange = (newFilters: { minMag: number | null; maxMag: number | null }) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({ minMag: null, maxMag: null });
    setCurrentPage(1);
  };

  // Filtered earthquakes
  const filteredEarthquakes = useMemo(() => {
    return earthquakes.filter((e) => {
      const mag = e.properties.mag;
      if (filters.minMag !== null && mag < filters.minMag) return false;
      if (filters.maxMag !== null && mag > filters.maxMag) return false;
      return true;
    });
  }, [earthquakes, filters]);

  const total = filteredEarthquakes.length;
  const magnitudes = filteredEarthquakes.map((e) => e.properties.mag);
  const maxMag = magnitudes.length ? Math.max(...magnitudes) : 0;
  const avgMag = magnitudes.length
    ? (magnitudes.reduce((a, b) => a + b, 0) / total).toFixed(2)
    : "0.00";

  // Pagination setup
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(total / itemsPerPage);
  const currentData = filteredEarthquakes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Intensity meter percentage (scaled 0–10)
  const intensity = Math.min((maxMag / 10) * 100, 100);

  // Format timestamp → human readable
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gray-800/40 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 shadow-2xl text-white">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Earthquake Statistics (Past 24 Hours)
      </h2>

      {/*  Filter Panel */}
      <FilterPanel onFilterChange={handleFilterChange} onReset={handleReset} />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">Total Earthquakes</p>
          <h3 className="text-3xl font-bold text-blue-400">{total}</h3>
        </div>

        <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">Average Magnitude</p>
          <h3 className="text-3xl font-bold text-yellow-400">{avgMag}</h3>
        </div>

        <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">Strongest Magnitude</p>
          <h3 className="text-3xl font-bold text-red-400">{maxMag}</h3>
        </div>
      </div>

      {/* Intensity Meter */}
      <div className="mb-8">
        <p className="text-sm text-gray-400 mb-2">Max Intensity Scale</p>
        <div className="w-full h-4 rounded-full bg-gray-700 overflow-hidden">
          <div
            className="h-4 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 transition-all duration-700"
            style={{ width: `${intensity}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      {/* Earthquake Data Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-700 bg-gray-900/50 shadow-inner">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="bg-gray-800/80 text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 text-left">Time (UTC)</th>
              <th className="py-3 px-4 text-left">Location</th>
              <th className="py-3 px-4 text-center">Mag</th>
              <th className="py-3 px-4 text-center">Depth (km)</th>
              <th className="py-3 px-4 text-center">Lat</th>
              <th className="py-3 px-4 text-center">Lon</th>
              <th className="py-3 px-4 text-center">Felt</th>
              <th className="py-3 px-4 text-center">CDI</th>
              <th className="py-3 px-4 text-center">Link</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((quake) => {
              const [lon, lat, depth] = quake.geometry.coordinates;
              const { mag, place, time, url } = quake.properties;
              const felt: number | null = (quake.properties as any).felt ?? null;
              const cdi: number | null = (quake.properties as any).cdi ?? null;

              return (
                <tr
                  key={quake.id}
                  className="border-t border-gray-700 hover:bg-gray-800/60 transition"
                >
                  <td className="py-3 px-4 whitespace-nowrap">{formatTime(time)}</td>
                  <td className="py-3 px-4">{place}</td>
                  <td
                    className={`py-3 px-4 text-center font-semibold ${
                      mag >= 6
                        ? "text-red-400"
                        : mag >= 4
                        ? "text-orange-400"
                        : mag >= 2
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {mag.toFixed(1)}
                  </td>
                  <td className="py-3 px-4 text-center">{depth.toFixed(1)}</td>
                  <td className="py-3 px-4 text-center">{lat.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center">{lon.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center">{felt ?? "-"}</td>
                  <td className="py-3 px-4 text-center">{cdi ?? "-"}</td>
                  <td className="py-3 px-4 text-center">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      View ↗
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>

        <span className="text-gray-400 text-sm">
          Page <span className="text-white font-semibold">{currentPage}</span> of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 mt-6 border-t border-gray-700 pt-4 leading-relaxed">
        <strong>Note:</strong> <br />
        <span className="text-gray-400">
          <strong>Felt</strong> = Number of people who reported feeling the earthquake. <br />
          <strong>CDI (Community Determined Intensity)</strong> = A measure of perceived shaking
          intensity, calculated from felt reports on the USGS "Did You Feel It?" system.
        </span>
      </p>
    </div>
  );
}

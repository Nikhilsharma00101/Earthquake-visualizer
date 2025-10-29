import { useState } from "react";
import type { EarthquakeFeature } from "../utils/fetchEarthquakes";
import EarthquakeModal from "./EarthquakeModal";

interface EarthquakeStatsProps {
  earthquakes: EarthquakeFeature[];
}

export default function EarthquakeStats({ earthquakes }: EarthquakeStatsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuake, setSelectedQuake] = useState<EarthquakeFeature | null>(null);

  const total = earthquakes.length;
  const magnitudes = earthquakes.map((e) => e.properties.mag);
  const maxMag = magnitudes.length ? Math.max(...magnitudes) : 0;
  const avgMag = magnitudes.length
    ? (magnitudes.reduce((a, b) => a + b, 0) / total).toFixed(2)
    : "0.00";

  const itemsPerPage = 10;
  const totalPages = Math.ceil(total / itemsPerPage);
  const currentData = earthquakes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const intensity = Math.min((maxMag / 10) * 100, 100);

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
    <div className="relative bg-black border border-gray-700 rounded-2xl p-6 shadow-2xl text-white">
      <h2 className="text-2xl font-bold mb-4">Earthquake Statistics</h2>

      {total === 0 ? (
        <div className="text-gray-400 text-center py-10 animate-pulse">
          No earthquake data available for this range.
        </div>
      ) : (
        <>
          {/* 📊 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard label="Total Earthquakes" value={total} color="text-blue-400" />
            <StatCard label="Average Magnitude" value={avgMag} color="text-yellow-400" />
            <StatCard label="Strongest Magnitude" value={maxMag} color="text-red-400" />
          </div>

          {/* 🌋 Intensity Meter */}
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

          {/* 🧾 Data Table */}
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
                  <th className="py-3 px-4 text-center">Details</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((quake) => {
                  const [lon, lat, depth] = quake.geometry.coordinates;
                  const { mag, place, time, felt, cdi } = quake.properties;
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
                        <button
                          onClick={() => setSelectedQuake(quake)}
                          className="text-blue-400 hover:underline font-medium"
                        >
                          More Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 🔢 Pagination */}
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
        </>
      )}

      {/* ℹ️ Modal */}
      {selectedQuake && (
        <>
          <div
            onClick={() => setSelectedQuake(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99]"
          />
          <div className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-gray-900 border-l border-gray-700 z-[100] shadow-2xl">
            <EarthquakeModal quake={selectedQuake} onClose={() => setSelectedQuake(null)} />
          </div>
        </>
      )}
    </div>
  );
}

/** Reusable Stat Card */
function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4 text-center">
      <p className="text-white text-sm">{label}</p>
      <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
    </div>
  );
}

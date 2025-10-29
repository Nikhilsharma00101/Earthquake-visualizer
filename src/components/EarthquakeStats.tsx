import { useState, useMemo, useCallback } from "react";
import type { EarthquakeFeature } from "../utils/fetchEarthquakes";
import EarthquakeModal from "./EarthquakeModal";

interface EarthquakeStatsProps {
  earthquakes: EarthquakeFeature[];
}

export default function EarthquakeStats({ earthquakes }: EarthquakeStatsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuake, setSelectedQuake] = useState<EarthquakeFeature | null>(null);

  // 🧠 Memoize heavy calculations
  const { total, maxMag, avgMag } = useMemo(() => {
    const mags = earthquakes.map((e) => e.properties.mag || 0);
    const total = earthquakes.length;
    const maxMag = mags.length ? Math.max(...mags) : 0;
    const avgMag = mags.length
      ? (mags.reduce((a, b) => a + b, 0) / total).toFixed(2)
      : "0.00";
    return { total, maxMag, avgMag, magnitudes: mags };
  }, [earthquakes]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(total / itemsPerPage);

  // 🧩 Memoize paginated data
  const currentData = useMemo(
    () => earthquakes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [earthquakes, currentPage]
  );

  const intensity = Math.min((maxMag / 10) * 100, 100);

  const formatTime = useCallback((timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  }, []);

  return (
    <section
      aria-labelledby="earthquake-stats-heading"
      className="relative bg-black border border-gray-700 rounded-2xl p-6 shadow-2xl text-white"
    >
      <h2 id="earthquake-stats-heading" className="text-2xl font-bold mb-4">
        Earthquake Statistics
      </h2>

      {total === 0 ? (
        <p className="text-gray-400 text-center py-10 animate-pulse">
          No earthquake data available for this range.
        </p>
      ) : (
        <>
          {/* 📊 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6" role="group" aria-label="Earthquake summary statistics">
            <StatCard label="Total Earthquakes" value={total} color="text-blue-400" />
            <StatCard label="Average Magnitude" value={avgMag} color="text-yellow-400" />
            <StatCard label="Strongest Magnitude" value={maxMag} color="text-red-400" />
          </div>

          {/* 🌋 Intensity Meter */}
          <div className="mb-8">
            <p className="text-sm text-gray-400 mb-2" id="intensity-label">
              Max Intensity Scale
            </p>
            <div
              role="progressbar"
              aria-labelledby="intensity-label"
              aria-valuenow={intensity}
              aria-valuemin={0}
              aria-valuemax={100}
              className="w-full h-4 rounded-full bg-gray-700 overflow-hidden"
            >
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
            <table className="min-w-full text-sm text-gray-300" aria-label="Earthquake data table">
              <thead className="bg-gray-800/80 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th scope="col" className="py-3 px-4 text-left">Time (UTC)</th>
                  <th scope="col" className="py-3 px-4 text-left">Location</th>
                  <th scope="col" className="py-3 px-4 text-center">Mag</th>
                  <th scope="col" className="py-3 px-4 text-center">Depth (km)</th>
                  <th scope="col" className="py-3 px-4 text-center">Lat</th>
                  <th scope="col" className="py-3 px-4 text-center">Lon</th>
                  <th scope="col" className="py-3 px-4 text-center">Felt</th>
                  <th scope="col" className="py-3 px-4 text-center">CDI</th>
                  <th scope="col" className="py-3 px-4 text-center">Details</th>
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
                          className="text-blue-400 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                          aria-label={`View details for ${place}`}
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
          <nav
            className="flex justify-center items-center gap-3 mt-6"
            aria-label="Pagination"
          >
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
          </nav>
        </>
      )}

      {/* ℹ️ Modal */}
      {selectedQuake && (
        <>
          <div
            onClick={() => setSelectedQuake(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99]"
            aria-hidden="true"
          />
          <aside
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-gray-900 border-l border-gray-700 z-[100] shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            <EarthquakeModal quake={selectedQuake} onClose={() => setSelectedQuake(null)} />
          </aside>
        </>
      )}
    </section>
  );
}

/** ♻️ Reusable Stat Card */
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
    <div
      className="bg-gray-900/60 border border-gray-700 rounded-xl p-4 text-center"
      role="group"
      aria-label={label}
    >
      <p className="text-white text-sm">{label}</p>
      <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
    </div>
  );
}

import { useEffect, useState, useCallback, useMemo } from "react";
import MapView from "../components/MapView";
import EarthquakeStats from "../components/EarthquakeStats";
import {
  fetchEarthquakes,
  type EarthquakeFeature,
  type TimeRange,
} from "../utils/fetchEarthquakes";
import LiveEarthquakeFeed from "../components/LiveEarthquakeFeed";
import EarthquakeCharts from "../components/EarthquakeCharts";
import FilterPanel from "../components/FilterPanel";

export default function Home() {
  const [earthquakes, setEarthquakes] = useState<EarthquakeFeature[]>([]);
  const [filteredQuakes, setFilteredQuakes] = useState<EarthquakeFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("day");
  const [magnitudeRange, setMagnitudeRange] = useState("All Magnitudes");

  // Fetch earthquake data with localStorage caching
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);

      // 1️⃣ Try cached data first for instant render
      const cached = localStorage.getItem(`quakes_${timeRange}`);
      if (cached && isMounted) {
        const parsed = JSON.parse(cached);
        setEarthquakes(parsed);
        setFilteredQuakes(parsed);
        setLoading(false);
      }

      // 2️⃣ Then fetch fresh data in background
      try {
        const data = await fetchEarthquakes(timeRange);
        if (isMounted && data.length > 0) {
          setEarthquakes(data);
          setFilteredQuakes(data);
          localStorage.setItem(`quakes_${timeRange}`, JSON.stringify(data));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [timeRange]);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (filters: { minMag: number | null; maxMag: number | null; timeRange: TimeRange }) => {
      setTimeRange(filters.timeRange);

      const filtered = earthquakes.filter((quake) => {
        const mag = quake.properties.mag;
        const min = filters.minMag ?? -Infinity;
        const max = filters.maxMag ?? Infinity;
        return mag >= min && mag <= max;
      });

      const label =
        filters.minMag !== null || filters.maxMag !== null
          ? filters.minMag !== null && filters.maxMag !== null
            ? `${filters.minMag}–${filters.maxMag}`
            : filters.minMag !== null
            ? `${filters.minMag}+`
            : `<${filters.maxMag}`
          : "All Magnitudes";

      setMagnitudeRange(label);
      setFilteredQuakes(filtered);
    },
    [earthquakes]
  );

  const handleReset = useCallback(() => {
    setFilteredQuakes(earthquakes);
    setTimeRange("day");
    setMagnitudeRange("All Magnitudes");
  }, [earthquakes]);

  // 🦴 Skeleton loader instead of full-screen message
  const SkeletonLoader = () => (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col items-center animate-pulse ">
      <header className="pt-20 pb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-400 mt-5">
          Earthquake Visualizer
        </h1>
      </header>
      <div className="w-11/12 max-w-5xl space-y-6">
        <div className="h-[400px] bg-gray-800 rounded-2xl"></div>
        <div className="h-24 bg-gray-800 rounded-xl"></div>
      </div>
      <p className="mt-10 text-gray-400 text-sm">Fetching latest data...</p>
    </div>
  );

  const content = useMemo(() => {
    if (loading && earthquakes.length === 0) {
      return <SkeletonLoader />;
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-black to-[#050505] text-gray-100 flex flex-col items-center">
        <LiveEarthquakeFeed />

        {/* Header */}
        <header className="pt-20 pb-10 text-center z-[1001] max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-wide mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text drop-shadow-[0_0_4px_rgba(0,0,0,0.6)] md:pb-5 pt-5">
            Earthquake Visualizer
          </h1>
          <p className="text-gray-200 text-base leading-relaxed">
            Explore real-time seismic activity across the planet — powered by continuous data
            from the USGS network.
          </p>
        </header>

        {/* Filters */}
        <section className="w-11/12 max-w-5xl mb-6">
          <FilterPanel
            minMag={null}
            maxMag={null}
            timeRange={timeRange}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </section>

        {/* Map */}
        <main className="relative z-[1000] p-6 w-11/12 max-w-7xl text-center">
          <h2 className="text-2xl font-semibold mb-3 text-gray-100">Live Global Seismic Map</h2>
          <p className="text-gray-300 text-sm mb-6 max-w-2xl mx-auto">
            Explore recent earthquakes by magnitude and depth. Hover or tap any marker to reveal
            location, magnitude, and time of occurrence.
          </p>
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
            <MapView earthquakes={filteredQuakes} />
          </div>
        </main>

        {/* Stats */}
        <section className="relative z-[1001] w-11/12 max-w-5xl mt-12 mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-gray-100 text-center">
            Earthquake Analytics Overview
          </h2>
          <p className="text-gray-300 text-sm text-center mb-6 max-w-2xl mx-auto">
            A summary of global seismic activity — including frequency, average magnitude, and
            intensity distribution.
          </p>
          <EarthquakeStats earthquakes={filteredQuakes} />
        </section>

        {/* Charts */}
        <EarthquakeCharts
          earthquakes={filteredQuakes}
          timeRange={timeRange}
          magnitudeRange={magnitudeRange}
        />

        {/* Info */}
        <section className="max-w-5xl w-11/12 mb-10">
          <div className="bg-gray-900/60 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 shadow-2xl text-center">
            <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text drop-shadow-[0_0_4px_rgba(0,0,0,0.6)]">
              Understanding Earth&apos;s Movements
            </h2>
            <p className="text-gray-200 mb-6 max-w-2xl mx-auto text-sm leading-relaxed">
              Each earthquake represents a pulse from the Earth&apos;s crust — a signal of shifting
              tectonic plates beneath our feet. This platform helps you explore those signals with
              clarity and precision.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left sm:text-center">
              <article className="bg-gray-800/70 p-4 rounded-xl border border-gray-700">
                <h3 className="text-blue-400 font-medium text-lg mb-1">🔍 Real-Time Tracking</h3>
                <p className="text-gray-200 text-sm">
                  Every event is updated within minutes of detection, ensuring you see the most
                  accurate and current global seismic data.
                </p>
              </article>

              <article className="bg-gray-800/70 p-4 rounded-xl border border-gray-700">
                <h3 className="text-purple-400 font-medium text-lg mb-1">🌐 Global Visualization</h3>
                <p className="text-gray-200 text-sm">
                  From minor tremors to major quakes, view seismic activity as it happens around the
                  world — all in one interactive map.
                </p>
              </article>

              <article className="bg-gray-800/70 p-4 rounded-xl border border-gray-700">
                <h3 className="text-pink-400 font-medium text-lg mb-1">📊 Analytical Insights</h3>
                <p className="text-gray-200 text-sm">
                  Compare magnitudes, analyze intensity patterns, and gain a deeper understanding of
                  Earth&apos;s seismic behavior.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-gray-300 text-xs py-6 z-[1001] text-center border-t border-gray-700 w-full">
          Data sourced from{" "}
          <a
            href="https://earthquake.usgs.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-300"
          >
            USGS Earthquake API
          </a>
          <p className="mt-1 text-gray-400">Auto-refreshed every 5 minutes for live accuracy.</p>
        </footer>
      </div>
    );
  }, [loading, earthquakes, filteredQuakes, timeRange, magnitudeRange, handleFilterChange, handleReset]);

  return content;
}

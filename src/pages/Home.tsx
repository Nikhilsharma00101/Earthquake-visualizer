import { useEffect, useState } from "react";
import MapView from "../components/MapView";
import EarthquakeStats from "../components/EarthquakeStats";
import { fetchEarthquakes } from "../utils/fetchEarthquakes";
import type { EarthquakeFeature } from "../utils/fetchEarthquakes";

export default function Home() {
  const [earthquakes, setEarthquakes] = useState<EarthquakeFeature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await fetchEarthquakes();
      setEarthquakes(data);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-black text-white text-xl font-semibold">
        Loading earthquake data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center">
      {/* Header */}
      <header className="py-8 text-center z-[1001]">
        <h1 className="text-4xl font-extrabold tracking-wide mb-2 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Earthquake Visualizer 🌎
        </h1>
        <p className="text-gray-400 text-sm">
          Global earthquake activity (Past 24 hours)
        </p>
      </header>


      {/* Map Section */}
      <main className="relative z-[1000] p-6 w-11/12 max-w-6xl">
        <MapView earthquakes={earthquakes} />
      </main>

      {/* Footer */}
      <footer className="text-gray-500 text-xs py-4 z-[1001]">
        Data source:{" "}
        <a
          href="https://earthquake.usgs.gov"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-400"
        >
          USGS Earthquake API
        </a>
      </footer>

      {/* Stats Section */}
      <section className="relative z-[1001] w-11/12 max-w-5xl mb-6">
        <EarthquakeStats earthquakes={earthquakes} />
      </section>
      
    </div>
  );
}

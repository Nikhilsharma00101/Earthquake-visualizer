import { useEffect, useState } from "react";
import MapView from "../components/MapView";
import EarthquakeGlobe from "../components/EarthquakeGlobe";
import ToggleView from "../components/ToggleView";
import { fetchEarthquakes, type EarthquakeFeature } from "../utils/fetchEarthquakes";

export default function Home() {
  const [earthquakes, setEarthquakes] = useState<EarthquakeFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [is3D, setIs3D] = useState(false);

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
      <header className="py-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-wide mb-2 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Earthquake Visualizer 🌎
        </h1>
        <p className="text-gray-400 text-sm">
          Global earthquake activity (Past 24 hours)
        </p>
      </header>

      <ToggleView is3D={is3D} onToggle={() => setIs3D(!is3D)} />

      <main className="p-6 w-11/12 max-w-6xl">
        {is3D ? (
          <EarthquakeGlobe earthquakes={earthquakes} />
        ) : (
          <MapView earthquakes={earthquakes} />
        )}
      </main>

      <footer className="text-gray-500 text-xs py-4">
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
    </div>
  );
}

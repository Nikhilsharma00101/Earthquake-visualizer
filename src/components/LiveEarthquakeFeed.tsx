import { useEffect, useState } from "react";
import type { EarthquakeFeature } from "../utils/fetchEarthquakes";
import { fetchEarthquakes } from "../utils/fetchEarthquakes";

export default function LiveEarthquakeFeed() {
  const [latestQuake, setLatestQuake] = useState<EarthquakeFeature | null>(null);

  // Fetch the most recent quake
  const loadLatest = async () => {
    const data = await fetchEarthquakes();
    if (data.length > 0) {
      const recent = data.reduce((latest, current) =>
        current.properties.time > latest.properties.time ? current : latest
      );
      setLatestQuake(recent);
    }
  };

  useEffect(() => {
    loadLatest();
    const interval = setInterval(loadLatest, 5 * 60 * 1000); // every 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (!latestQuake) return null;

  const { mag, place, time } = latestQuake.properties;

  // Format readable time
  const formatTime = (timestamp: number) =>
    new Date(timestamp).toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // Build the message in natural language
  const message = `An earthquake of magnitude ${mag.toFixed(
    1
  )} occurred near ${place} at ${formatTime(time)}.`;

  return (
    <div className="fixed top-0 left-0 w-full z-[1100] bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 border-b border-gray-700 shadow-md">
      <div
        className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-4 py-2 text-center sm:text-left"
        role="status"
        aria-live="polite"
      >
        {/* Live Indicator */}
        <span className="flex items-center gap-1 shrink-0">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-red-300">
            Live Update
          </span>
        </span>

        {/* Message (responsive, wraps naturally) */}
        <p className="text-sm sm:text-base font-medium text-gray-100 leading-snug sm:leading-normal break-words text-center sm:text-left">
          {message}
        </p>
      </div>
    </div>
  );
}

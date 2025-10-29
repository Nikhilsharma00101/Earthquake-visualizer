import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  ZoomControl,
  LayersControl,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { motion } from "framer-motion";
import { memo, useMemo, useEffect } from "react";
import type { EarthquakeFeature } from "../utils/fetchEarthquakes";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import "../styles/cluster.css";

interface MapViewProps {
  earthquakes: EarthquakeFeature[];
}

// Utility: readable time difference
const timeAgo = (timestamp: number): string => {
  const diff = Date.now() - timestamp;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "less than an hour ago";
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

// Dynamic color based on magnitude
const getColor = (mag: number): string => {
  if (mag >= 6) return "#ef4444"; // red
  if (mag >= 4) return "#f97316"; // orange
  if (mag >= 2) return "#facc15"; // yellow
  return "#22c55e"; // green
};

// ✅ Native Heatmap Layer (Leaflet.heat)
function HeatmapLayer({ points }: { points: [number, number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    // @ts-ignore - leaflet.heat adds L.heatLayer globally
    const heat = (window as any).L.heatLayer(points, {
      radius: 25,
      blur: 18,
      maxZoom: 10,
      minOpacity: 0.4,
      gradient: {
        0.2: "#22c55e",
        0.4: "#facc15",
        0.6: "#f97316",
        0.8: "#ef4444",
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
}

function MapView({ earthquakes }: MapViewProps) {
  // Prepare heatmap points
  const heatmapPoints = useMemo<[number, number, number][]>(
    () =>
      earthquakes.map((quake) => {
        const [lon, lat] = quake.geometry.coordinates;
        const mag = quake.properties.mag || 0;
        return [lat, lon, mag / 10]; // normalize intensity
      }),
    [earthquakes]
  );

  return (
    <div
      className="relative w-full h-[85vh] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#1b1b1b] dark:to-[#121212]"
      role="region"
      aria-label="Interactive global earthquake map"
    >
      {/* Magnitude Legend */}
      <div
        className="absolute top-4 left-4 z-[1000] bg-white/40 backdrop-blur-md rounded-xl shadow-md px-4 py-2 border border-white/30"
        aria-label="Magnitude intensity legend"
      >
        <p className="text-xs font-semibold text-gray-800 mb-1">
          Magnitude Intensity
        </p>
        <div
          className="relative w-40 h-3 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={6}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-400 via-orange-500 to-red-600" />
        </div>
        <div className="flex justify-between text-[10px] text-gray-700 mt-1">
          <span>0</span>
          <span>2</span>
          <span>4</span>
          <span>6+</span>
        </div>
      </div>

      <MapContainer
        center={[20, 0]}
        zoom={3}
        minZoom={2}
        maxZoom={19}
        scrollWheelZoom
        zoomControl={false}
        className="h-full w-full z-0"
      >
        <ZoomControl position="bottomright" />

        <motion.div
          className="absolute top-4 right-4 z-[1000] rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 shadow-lg border border-gray-300/30 dark:border-gray-700/30 overflow-hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <LayersControl position="topright">
            {/* Base Layers */}
            <LayersControl.BaseLayer checked name="Street View">
              <TileLayer
                url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${
                  import.meta.env.VITE_MAPTILER_API_KEY
                }`}
                attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Satellite View">
              <TileLayer
                url={`https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${
                  import.meta.env.VITE_MAPTILER_API_KEY
                }`}
                attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a>'
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Dark Mode">
              <TileLayer
                url={`https://api.maptiler.com/maps/toner/{z}/{x}/{y}.png?key=${
                  import.meta.env.VITE_MAPTILER_API_KEY
                }`}
                attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a>'
              />
            </LayersControl.BaseLayer>

            {/* Heatmap Layer */}
            <LayersControl.Overlay checked name="Heat Intensity Map">
              <HeatmapLayer points={heatmapPoints} />
            </LayersControl.Overlay>

            {/* Cluster Markers */}
            <LayersControl.Overlay checked name="Earthquake Markers">
              <MarkerClusterGroup chunkedLoading disableClusteringAtZoom={7}>
                {earthquakes.map((quake) => {
                  const [lon, lat, depth] = quake.geometry.coordinates;
                  const mag = quake.properties.mag || 0;

                  return (
                    <CircleMarker
                      key={quake.id}
                      center={[lat, lon]}
                      radius={5 + mag * 2}
                      fillColor={getColor(mag)}
                      color="#222"
                      weight={1}
                      opacity={0.8}
                      fillOpacity={0.85}
                    >
                      <Popup>
                        <motion.div
                          className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-3 w-56 border border-gray-200 dark:border-gray-700"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-base mb-1 leading-tight">
                            {quake.properties.place}
                          </h2>

                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                mag >= 6
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                  : mag >= 4
                                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                                  : mag >= 2
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                              }`}
                            >
                              M {mag.toFixed(1)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {timeAgo(quake.properties.time)}
                            </span>
                          </div>

                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Depth:</span>{" "}
                            {depth.toFixed(1)} km
                          </p>

                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Coordinates:</span>{" "}
                            {lat.toFixed(2)}, {lon.toFixed(2)}
                          </p>

                          {quake.properties.url && (
                            <a
                              href={quake.properties.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block mt-3 text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                            >
                              View full report ↗
                            </a>
                          )}
                        </motion.div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </MarkerClusterGroup>
            </LayersControl.Overlay>
          </LayersControl>
        </motion.div>
      </MapContainer>
    </div>
  );
}

export default memo(MapView);

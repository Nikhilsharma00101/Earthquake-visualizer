import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import type { EarthquakeFeature } from "../utils/fetchEarthquakes";
import "leaflet/dist/leaflet.css";
import "../styles/cluster.css"; // custom cluster styling

interface MapViewProps {
  earthquakes: EarthquakeFeature[];
}

// Utility for readable time difference
const timeAgo = (timestamp: number) => {
  const diff = Date.now() - timestamp;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "less than an hour ago";
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const getColor = (mag: number) => {
  if (mag >= 6) return "#ef4444"; // red
  if (mag >= 4) return "#f97316"; // orange
  if (mag >= 2) return "#f2cd3aff"; // yellow
  return "#22c55e"; // green
};

//  Helper component to smoothly zoom the map on marker click
function FlyToLocation({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  map.flyTo([lat, lon], 7, { duration: 1.5 });
  return null;
}

export default function MapView({ earthquakes }: MapViewProps) {
  return (
    <div className="relative w-full h-[85vh] rounded-2xl overflow-hidden shadow-xl border border-gray-200">
      <MapContainer
        center={[20, 0]}
        zoom={3}
        minZoom={2}
        maxZoom={19}
        scrollWheelZoom
        zoomControl={false}
        className="h-full w-full"
      >
        {/*  MapTiler tiles */}
        <TileLayer
          url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${import.meta.env.VITE_MAPTILER_API_KEY}`}
          attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />

        <ZoomControl position="bottomright" />

        <MarkerClusterGroup chunkedLoading disableClusteringAtZoom={8}>
          {earthquakes.map((quake) => {
            const [lon, lat, depth] = quake.geometry.coordinates;
            const mag = quake.properties.mag || 0;

            return (
              <CircleMarker
                key={quake.id}
                center={[lat, lon]}
                radius={5 + mag * 2}
                fillColor={getColor(mag)}
                color="#000"
                weight={0.5}
                opacity={0.9}
                fillOpacity={0.85}
                eventHandlers={{
                  click: () => {
                    const map = document.querySelector(".leaflet-container") as any;
                    if (map) FlyToLocation({ lat, lon });
                  },
                }}
              >
                <Popup>
                  <div className="bg-white rounded-xl shadow-md p-3 w-56 border border-gray-200">
                    <h2 className="font-semibold text-gray-900 text-base mb-1 leading-tight">
                      {quake.properties.place}
                    </h2>

                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          mag >= 6
                            ? "bg-red-100 text-red-700"
                            : mag >= 4
                            ? "bg-orange-100 text-orange-700"
                            : mag >= 2
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        M {mag.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-500">{timeAgo(quake.properties.time)}</span>
                    </div>

                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Depth:</span> {depth.toFixed(1)} km
                    </p>

                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Coordinates:</span>{" "}
                      {lat.toFixed(2)}, {lon.toFixed(2)}
                    </p>

                    {quake.properties.url && (
                      <a
                        href={quake.properties.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-sm text-blue-600 font-semibold hover:underline"
                      >
                        View full report ↗
                      </a>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}

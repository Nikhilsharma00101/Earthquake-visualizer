import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import type { EarthquakeFeature } from "../utils/fetchEarthquakes";

interface MapViewProps {
  earthquakes: EarthquakeFeature[];
}

const getColor = (mag: number) => {
  if (mag >= 6) return "#d73027"; // red
  if (mag >= 4) return "#fc8d59"; // orange
  if (mag >= 2) return "#fee08b"; // yellow
  return "#91cf60"; // green
};

export default function MapView({ earthquakes }: MapViewProps) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      scrollWheelZoom
      className="h-[80vh] w-full rounded-xl shadow-lg border border-gray-200"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      {earthquakes.map((quake) => {
        const [lon, lat] = quake.geometry.coordinates;
        const mag = quake.properties.mag || 0;
        return (
          <CircleMarker
            key={quake.id}
            center={[lat, lon]}
            radius={5 + mag * 2}
            fillColor={getColor(mag)}
            color="#000"
            weight={0.5}
            opacity={0.8}
            fillOpacity={0.8}
          >
            <Popup>
              <div className="text-sm">
                <h2 className="font-bold text-lg text-gray-800 mb-1">
                  {quake.properties.place}
                </h2>
                <p>Magnitude: <span className="font-semibold">{mag}</span></p>
                <p>Time: {new Date(quake.properties.time).toLocaleString()}</p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}

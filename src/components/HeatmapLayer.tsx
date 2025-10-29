import { useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet.heat";

interface HeatmapLayerProps {
  points: [number, number, number][]; // [lat, lng, intensity]
}

export default function HeatmapLayer({ points }: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // @ts-ignore: leaflet.heat is a plugin, not in types
    const heat = (window as any).L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 10,
      minOpacity: 0.4,
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
}

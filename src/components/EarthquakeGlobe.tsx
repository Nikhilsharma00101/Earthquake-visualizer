import { useRef, useEffect } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import type { EarthquakeFeature } from "../utils/fetchEarthquakes";

interface GlobeProps {
  earthquakes: EarthquakeFeature[];
}

export default function EarthquakeGlobe({ earthquakes }: GlobeProps) {
  // ✅ use `undefined` instead of `null` for perfect TS compatibility
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
    }
  }, []);

  const points = earthquakes.map((q) => ({
    lat: q.geometry.coordinates[1],
    lng: q.geometry.coordinates[0],
    size: Math.max(0.3, q.properties.mag / 2),
    color:
      q.properties.mag >= 6
        ? "red"
        : q.properties.mag >= 4
        ? "orange"
        : q.properties.mag >= 2
        ? "yellow"
        : "green",
    place: q.properties.place,
    magnitude: q.properties.mag,
    time: new Date(q.properties.time).toLocaleString(),
  }));

  return (
    <div className="w-full h-[80vh] rounded-2xl shadow-2xl overflow-hidden border border-gray-300 bg-[#0b0e13]">
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={points}
        pointAltitude="size"
        pointColor="color"
        pointLabel={(d: any) =>
          `<div style="font-size:13px;">
             <b>${d.place}</b><br/>
             Magnitude: ${d.magnitude}<br/>
             ${d.time}
           </div>`
        }
      />
    </div>
  );
}

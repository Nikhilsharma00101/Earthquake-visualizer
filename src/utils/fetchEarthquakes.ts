export interface EarthquakeFeature {
  id: string;
  properties: {
    place: string;
    mag: number;
    time: number;
  };
  geometry: {
    coordinates: [number, number, number]; // [lon, lat, depth]
  };
}

export async function fetchEarthquakes(): Promise<EarthquakeFeature[]> {
  try {
    const res = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
    );
    if (!res.ok) throw new Error("Failed to fetch earthquakes");
    const data = await res.json();
    return data.features as EarthquakeFeature[];
  } catch (err) {
    console.error(err);
    return [];
  }
}

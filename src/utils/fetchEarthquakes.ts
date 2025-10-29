export interface EarthquakeFeature {
  id: string;
  properties: {
    mag: number;
    place: string;
    time: number;
    url: string;
    sig?: number; // significance
    alert?: string; // alert level (green, yellow, red)
    tsunami?: number; // tsunami flag (0 or 1)
    mmi?: number; // maximum reported intensity
    cdi?: number; // community intensity
    felt?: number; // number of people who felt it
    status?: string; // review status
    title?: string; // readable title
  };
  geometry: {
    coordinates: [number, number, number]; // [longitude, latitude, depth]
  };
}

export async function fetchEarthquakes(): Promise<EarthquakeFeature[]> {
  try {
    const res = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
    );

    if (!res.ok) throw new Error("Failed to fetch earthquake data");

    const data = await res.json();

    // Ensure each feature has required structure
    if (!Array.isArray(data.features)) {
      console.error("Unexpected data format:", data);
      return [];
    }

    return data.features as EarthquakeFeature[];
  } catch (err) {
    console.error("Error fetching earthquakes:", err);
    return [];
  }
}

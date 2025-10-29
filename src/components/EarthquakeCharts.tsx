import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import type { EarthquakeFeature } from "../utils/fetchEarthquakes";

interface Props {
  earthquakes: EarthquakeFeature[];
}

export default function EarthquakeCharts({ earthquakes }: Props) {
  const [chartData, setChartData] = useState<
    { hour: string; count: number; avgMag: number }[]
  >([]);
  const [magnitudeData, setMagnitudeData] = useState<{ name: string; count: number }[]>([]);
  const [depthData, setDepthData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    // 1️ Aggregate by hour (last 24h)
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, "0")}:00`,
      count: 0,
      totalMag: 0,
    }));

    earthquakes.forEach((quake) => {
      const date = new Date(quake.properties.time);
      const hr = date.getHours();
      const t = hours[hr];
      t.count += 1;
      t.totalMag += quake.properties.mag;
    });

    const filled = hours.map((h) => ({
      hour: h.hour,
      count: h.count,
      avgMag: h.count > 0 ? parseFloat((h.totalMag / h.count).toFixed(2)) : 0,
    }));

    setChartData(filled);

    // 2️ Magnitude distribution
    const magBuckets = [
      { name: "< 2.5", count: 0 },
      { name: "2.5 – 4.5", count: 0 },
      { name: "4.5 – 6.0", count: 0 },
      { name: "6.0+", count: 0 },
    ];
    earthquakes.forEach((q) => {
      const m = q.properties.mag;
      if (m < 2.5) magBuckets[0].count++;
      else if (m < 4.5) magBuckets[1].count++;
      else if (m < 6.0) magBuckets[2].count++;
      else magBuckets[3].count++;
    });
    setMagnitudeData(magBuckets);

    // 3️ Depth distribution
    const depths = earthquakes.map((q) => q.geometry.coordinates[2]);
    const shallow = depths.filter((d) => d < 70).length;
    const intermediate = depths.filter((d) => d >= 70 && d < 300).length;
    const deep = depths.filter((d) => d >= 300).length;
    setDepthData([
      { name: "Shallow (<70km)", value: shallow },
      { name: "Intermediate (70–300km)", value: intermediate },
      { name: "Deep (>300km)", value: deep },
    ]);
  }, [earthquakes]);

  const COLORS = ["#60A5FA", "#A78BFA", "#F472B6", "#FBBF24"];

  return (
    <section className="w-11/12 max-w-7xl mx-auto my-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Global Seismic Analytics
      </h2>
      <p className="text-gray-300 text-center mb-10 text-sm max-w-2xl mx-auto">
        A data-driven visualization of global earthquakes in the past 24 hours.
        Each chart reflects patterns in magnitude, frequency, and depth, powered by live USGS data.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Chart 1: Frequency by Hour */}
        <ChartCard title="⏱ Earthquakes per Hour">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#9333EA" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="hour" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#E5E7EB" }}
              />
              <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 2: Average Magnitude by Hour */}
        <ChartCard title="🌋 Average Magnitude by Hour">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="hour" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="avgMag"
                stroke="#A78BFA"
                strokeWidth={2.5}
                dot={{ r: 4, stroke: "#F9FAFB", strokeWidth: 1 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 3: Magnitude Distribution */}
        <ChartCard title="📊 Magnitude Distribution">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={magnitudeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="count"
                radius={[6, 6, 0, 0]}
                fill="url(#barGradient)"
                animationDuration={900}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 4: Depth Distribution */}
        <ChartCard title="🌐 Depth Distribution">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={depthData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                dataKey="value"
                label={(props) => {
                  const percent = Number(props.percent) || 0;
                  return `${props.name ?? ""} (${(percent * 100).toFixed(1)}%)`;
                }}
              >
                {depthData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#FFFFFF", //  tooltip main text
                }}
                labelStyle={{
                  color: "#FFFFFF", //  label text
                }}
                itemStyle={{
                  color: "#FFFFFF", //  each item text
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </section>
  );
}

/* -------------------- UI Card Wrapper -------------------- */
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900/70 border border-gray-700 rounded-2xl p-6 shadow-2xl backdrop-blur-md hover:shadow-[0_0_25px_rgba(147,51,234,0.2)] transition-all duration-300">
      <h3 className="text-lg font-semibold mb-4 text-gray-100">{title}</h3>
      {children}
    </div>
  );
}

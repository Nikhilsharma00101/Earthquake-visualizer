import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import type { EarthquakeFeature } from "../utils/fetchEarthquakes";

interface EarthquakeModalProps {
  quake: EarthquakeFeature | null;
  onClose: () => void;
}

export default function EarthquakeModal({ quake, onClose }: EarthquakeModalProps) {
  if (!quake) return null;

  const { properties, geometry } = quake;
  const [lon, lat, depth] = geometry.coordinates;

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const safe = (val: any, fallback: string = "-") =>
    val !== null && val !== undefined && val !== "" ? val : fallback;

  return (
    <AnimatePresence>
      {quake && (
        <>
          {/* Transparent background, keep map visible */}
          <motion.div
            className="fixed inset-0 pointer-events-none z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal container */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[520px] bg-gray-900/95 border-l border-gray-700 shadow-2xl z-50 backdrop-blur-md flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            {/* Sticky Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800 sticky top-0 bg-gray-950/80 backdrop-blur-sm z-10 mt-10">
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                {safe(properties.title, "Earthquake Details")}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition"
                aria-label="Close details modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <Section title="Core Information">
                <Detail label="Magnitude" value={safe(properties.mag?.toFixed(1))} />
                <Detail label="Location" value={safe(properties.place)} />
                <Detail label="Latitude" value={lat.toFixed(2)} />
                <Detail label="Longitude" value={lon.toFixed(2)} />
                <Detail label="Depth (km)" value={depth.toFixed(1)} />
                <Detail label="Time" value={formatTime(properties.time)} />
              </Section>

              <Section title="Impact & Alerts">
                <Detail label="Significance" value={safe(properties.sig)} />
                <Detail label="Alert Level" value={safe(properties.alert)} />
                <Detail
                  label="Tsunami Warning"
                  value={properties.tsunami === 1 ? "Yes" : "No"}
                />
                <Detail label="MMI (Shaking Intensity)" value={safe(properties.mmi)} />
                <Detail label="CDI (Community Intensity)" value={safe(properties.cdi)} />
                <Detail label="Felt Reports" value={safe(properties.felt)} />
              </Section>

              <Section title="Event Status">
                <Detail label="Status" value={safe(properties.status)} />
                <Detail label="Event ID" value={safe(quake.id)} />
              </Section>

              {/* CTA */}
              <div className="text-center mt-6 pb-4">
                <a
                  href={properties.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition"
                >
                  View Live Data on USGS <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* === Helper Components === */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

interface DetailProps {
  label: string;
  value: string | number;
}

function Detail({ label, value }: DetailProps) {
  return (
    <div className="flex flex-col border border-gray-700 rounded-lg p-3 bg-gray-800/40 backdrop-blur-sm">
      <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
      <span className="text-sm font-medium text-white break-words">{value ?? "-"}</span>
    </div>
  );
}

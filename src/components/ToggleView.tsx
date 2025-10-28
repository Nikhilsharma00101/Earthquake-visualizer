interface ToggleViewProps {
  is3D: boolean;
  onToggle: () => void;
}

export default function ToggleView({ is3D, onToggle }: ToggleViewProps) {
  return (
    <div className="flex items-center justify-center my-6">
      <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-gray-500 shadow-md">
        <span className={`${!is3D ? "text-blue-400" : "text-gray-300"} text-sm`}>
          🗺 2D Map
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={is3D} onChange={onToggle} className="sr-only peer" />
          <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-7"></div>
        </label>
        <span className={`${is3D ? "text-blue-400" : "text-gray-300"} text-sm`}>
          🌍 3D Globe
        </span>
      </div>
    </div>
  );
}

export function TelemetryRing({ 
  value, 
  max = 100, 
  label, 
  color = '#3b82f6' 
}: { 
  value: number
  max?: number
  label: string
  color?: string
}) {
  const percentage = (value / max) * 100
  const circumference = 2 * Math.PI * 45

  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="120" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="rgba(71, 85, 105, 0.2)"
          strokeWidth="2"
        />
        {/* Animated progress circle */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (circumference * percentage) / 100}
          strokeLinecap="round"
          className="transition-all duration-300"
          filter="drop-shadow(0 0 6px rgba(59, 130, 246, 0.3))"
        />
      </svg>
      <div className="text-center mt-2">
        <div className="text-xl font-bold text-white">{value.toFixed(0)}%</div>
        <div className="text-xs text-slate-500">{label}</div>
      </div>
    </div>
  )
}

export function TelemetryRings({ cpuUsage, memoryUsage, diskUsage }: { cpuUsage: number; memoryUsage: number; diskUsage: number }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <TelemetryRing value={cpuUsage} label="CPU" color="#3b82f6" />
      <TelemetryRing value={memoryUsage} label="Memory" color="#a855f7" />
      <TelemetryRing value={diskUsage} label="Disk" color="#ec4899" />
    </div>
  )
}

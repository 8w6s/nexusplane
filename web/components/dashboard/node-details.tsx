import { Terminal } from 'lucide-react'

export function NodeDetails() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Node Details: <span className="font-mono">vn-dedicated-01</span></h2>
        <button className="px-3 py-2 border border-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-900/50 transition-colors flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          Open Terminal
        </button>
      </div>

      {/* Real-time Telemetry */}
      <div
        className="rounded-lg p-4"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          border: '1px solid rgba(71, 85, 105, 0.2)',
        }}
      >
        <h3 className="text-sm font-semibold text-white mb-4">Real-time Telemetry</h3>
        
        <div className="grid grid-cols-3 gap-4">
          {/* CPU Utilization */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 relative flex items-center justify-center mb-2">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(71, 85, 105, 0.2)" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  strokeDasharray={`${(24 / 100) * 283} 283`}
                  strokeLinecap="round"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
              </svg>
              <div className="absolute text-center">
                <div className="text-lg font-mono font-bold text-white">24%</div>
              </div>
            </div>
            <span className="text-xs text-slate-400 text-center">CPU Utilization</span>
          </div>

          {/* Memory Allocation */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 relative flex items-center justify-center mb-2">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(71, 85, 105, 0.2)" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="8"
                  strokeDasharray={`${(48.2 / 64) * 283} 283`}
                  strokeLinecap="round"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
              </svg>
              <div className="absolute text-center">
                <div className="text-xs font-mono font-bold text-white">48.2GB</div>
                <div className="text-xs text-slate-500">/64GB</div>
              </div>
            </div>
            <span className="text-xs text-slate-400 text-center">Memory Allocation</span>
          </div>

          {/* Disk I/O */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 relative flex items-center justify-center mb-2">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(71, 85, 105, 0.2)" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="8"
                  strokeDasharray={`${(1.2 / 5) * 283} 283`}
                  strokeLinecap="round"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
              </svg>
              <div className="absolute text-center">
                <div className="text-sm font-mono font-bold text-white">1.2GB/s</div>
              </div>
            </div>
            <span className="text-xs text-slate-400 text-center">Disk I/O</span>
          </div>
        </div>
      </div>

      {/* Provisioned Instances */}
      <div
        className="rounded-lg p-4"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          border: '1px solid rgba(71, 85, 105, 0.2)',
        }}
      >
        <h3 className="text-sm font-semibold text-white mb-4">Provisioned Instances</h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-slate-800/50">
            <div className="flex items-center gap-4 flex-1">
              <span className="font-mono text-slate-500 text-xs">i-0a2b3c4</span>
              <span className="text-slate-400">Ubuntu 22.04</span>
              <span className="text-slate-500 text-xs">2 vCPU / 4GB</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              <span className="text-xs">Running</span>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4 flex-1">
              <span className="font-mono text-slate-500 text-xs">i-9x8z7y6</span>
              <span className="text-slate-400">Debian 12</span>
              <span className="text-slate-500 text-xs">4 vCPU / 16GB</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              <span className="text-xs">Running</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Logs */}
      <div
        className="rounded-lg overflow-hidden"
        style={{
          backgroundColor: '#000000',
          border: '1px solid rgba(71, 85, 105, 0.2)',
        }}
      >
        <div className="p-4 space-y-2">
          <h3 className="text-sm font-semibold text-slate-400 mb-3">Recent System Logs</h3>
          
          <div className="font-mono text-xs leading-relaxed text-green-400 space-y-1.5">
            <div><span className="text-slate-600">[2024-05-24 10:02:11]</span> INFO: Agent heartbeat successful. Latency: 2ms.</div>
            <div><span className="text-slate-600">[2024-05-24 10:02:15]</span> INFO: Instance i-0a2b3c4 CPU stats synced.</div>
            <div><span className="text-pink-400">[2024-05-24 10:02:18]</span> <span className="text-pink-400">WARN</span>: Memory pool reaching 80% threshold on node vn-dedicated-01.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

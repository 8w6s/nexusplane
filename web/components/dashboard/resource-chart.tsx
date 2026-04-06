export function ResourceChart() {
  return (
    <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Phân bổ tài nguyên</h3>

      <div className="flex flex-col items-center gap-8">
        {/* Donut Chart */}
        <div className="relative w-40 h-40">
          <svg className="w-full h-full" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#1e293b"
              strokeWidth="20"
            />
            
            {/* Compute segment (60%) - Blue to Purple gradient */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="url(#computeGrad)"
              strokeWidth="20"
              strokeDasharray={`${(60 / 100) * 502.4} 502.4`}
              strokeDashoffset="0"
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />
            
            {/* Storage segment (25%) - Purple to Pink gradient */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="url(#storageGrad)"
              strokeWidth="20"
              strokeDasharray={`${(25 / 100) * 502.4} 502.4`}
              strokeDashoffset={`-${(60 / 100) * 502.4}`}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />
            
            {/* Buffer segment (15%) - Pink to Emerald gradient */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="url(#bufferGrad)"
              strokeWidth="20"
              strokeDasharray={`${(15 / 100) * 502.4} 502.4`}
              strokeDashoffset={`-${(85 / 100) * 502.4}`}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />

            {/* Center circle */}
            <circle cx="100" cy="100" r="55" fill="#000000" />

            {/* Gradients */}
            <defs>
              <linearGradient id="computeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient id="storageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <linearGradient id="bufferGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Center text */}
            <text
              x="100"
              y="95"
              textAnchor="middle"
              fontSize="24"
              fontWeight="bold"
              fill="#ffffff"
            >
              100%
            </text>
            <text
              x="100"
              y="115"
              textAnchor="middle"
              fontSize="12"
              fill="#94a3b8"
            >
              Tổng
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="w-full space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
            <div>
              <p className="text-sm text-white">Compute</p>
              <p className="text-xs text-slate-400">60%</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
            <div>
              <p className="text-sm text-white">Storage</p>
              <p className="text-xs text-slate-400">25%</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-emerald-500" />
            <div>
              <p className="text-sm text-white">Buffer</p>
              <p className="text-xs text-slate-400">15%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

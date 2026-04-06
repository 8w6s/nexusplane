'use client'

import { Activity, Cpu, HardDrive, Zap, AlertCircle, TrendingUp } from 'lucide-react'

export function OverviewPage() {
  const stats = [
    {
      label: 'Total Nodes',
      value: '24',
      icon: Activity,
      color: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      trend: '+4 this month',
    },
    {
      label: 'Active Instances',
      value: '186',
      icon: Cpu,
      color: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
      trend: '+28 today',
    },
    {
      label: 'Storage Used',
      value: '18.2 TB',
      icon: HardDrive,
      color: 'bg-pink-500/20',
      iconColor: 'text-pink-400',
      trend: '+2.4 TB week',
    },
    {
      label: 'Bandwidth',
      value: '4.2 Gbps',
      icon: Zap,
      color: 'bg-green-500/20',
      iconColor: 'text-green-400',
      trend: 'Peak usage',
    },
  ]

  const alerts = [
    { severity: 'warning', message: 'Node HZ-EU-02 CPU usage at 89%' },
    { severity: 'info', message: 'Backup completed for 12 volumes' },
    { severity: 'error', message: 'Certificate expires in 7 days' },
  ]

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-600 space-x-2">
        <span>Console</span>
        <span>&gt;</span>
        <span>Overview</span>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-slate-400 text-sm mt-2">Real-time infrastructure status and metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="rounded-lg p-6 border transition-all hover:border-blue-500/30"
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.4)',
                borderColor: 'rgba(71, 85, 105, 0.2)',
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                  <p className="text-xs text-slate-600 mt-2">{stat.trend}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}
                >
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content - Two column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Charts */}
        <div className="lg:col-span-2 space-y-4">
          {/* CPU Usage Over Time */}
          <div
            className="rounded-lg p-6 border"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              borderColor: 'rgba(71, 85, 105, 0.2)',
            }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">CPU Usage (24h)</h3>
            <div className="h-48 flex items-end justify-between gap-2 px-2 pb-4">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                  style={{
                    height: `${Math.random() * 100}%`,
                    opacity: 0.6 + Math.random() * 0.4,
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-600 mt-2">
              <span>0h</span>
              <span>24h</span>
            </div>
          </div>

          {/* Memory Distribution */}
          <div
            className="rounded-lg p-6 border"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              borderColor: 'rgba(71, 85, 105, 0.2)',
            }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Memory Distribution by Region</h3>
            <div className="space-y-3">
              {[
                { name: 'Vietnam (VN-01)', used: 65, color: '#3b82f6' },
                { name: 'Germany (EU-01)', used: 48, color: '#8b5cf6' },
                { name: 'USA West (US-01)', used: 72, color: '#ec4899' },
                { name: 'Singapore (SG-01)', used: 38, color: '#10b981' },
              ].map((region) => (
                <div key={region.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{region.name}</span>
                    <span className="text-slate-500">{region.used}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${region.used}%`,
                        backgroundColor: region.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Alerts */}
        <div
          className="rounded-lg p-6 border"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            borderColor: 'rgba(71, 85, 105, 0.2)',
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            Recent Alerts
          </h3>
          <div className="space-y-3">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className="p-3 rounded border-l-2"
                style={{
                  backgroundColor:
                    alert.severity === 'error'
                      ? 'rgba(239, 68, 68, 0.1)'
                      : alert.severity === 'warning'
                        ? 'rgba(234, 179, 8, 0.1)'
                        : 'rgba(59, 130, 246, 0.1)',
                  borderLeftColor:
                    alert.severity === 'error' ? '#ef4444' : alert.severity === 'warning' ? '#eab308' : '#3b82f6',
                }}
              >
                <p
                  className="text-sm"
                  style={{
                    color:
                      alert.severity === 'error' ? '#fca5a5' : alert.severity === 'warning' ? '#fcd34d' : '#93c5fd',
                  }}
                >
                  {alert.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

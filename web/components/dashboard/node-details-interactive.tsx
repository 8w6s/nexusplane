'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, RotateCw, Lock, Zap } from 'lucide-react'

interface NodeDetailsProps {
  nodeId: string
  onToast: (toast: { message: string; type: 'success' | 'error' | 'info' }) => void
}

const nodeDetailsData: Record<string, any> = {
  'node-vn-01': {
    name: 'node-vn-01',
    status: 'ONLINE',
    uptime: '45 days 12h',
    region: 'Vietnam (VN-01)',
    ip: '192.168.1.100',
    hypervisor: 'KVM/QEMU',
    cpuUsage: 24,
    memoryUsage: 32,
    diskUsage: 45,
    networkIn: '2.3 Gbps',
    networkOut: '1.8 Gbps',
    instances: [
      { id: 'vm-web-01', cpu: 4, memory: 16, status: 'running' },
      { id: 'vm-db-01', cpu: 8, memory: 32, status: 'running' },
      { id: 'vm-backup-01', cpu: 2, memory: 8, status: 'stopped' },
    ],
    logs: [
      '[INFO] VM vm-web-01 started successfully',
      '[INFO] Storage snapshot completed',
      '[WARN] High memory usage detected - 89%',
      '[INFO] Network traffic optimization applied',
      '[INFO] Backup completed at 03:45 UTC',
    ],
  },
  'node-hetzner-eu-02': {
    name: 'node-hetzner-eu-02',
    status: 'ONLINE',
    uptime: '120 days 8h',
    region: 'Germany (EU-01)',
    ip: '185.23.98.45',
    hypervisor: 'Hyper-V',
    cpuUsage: 58,
    memoryUsage: 64,
    diskUsage: 72,
    networkIn: '8.5 Gbps',
    networkOut: '7.2 Gbps',
    instances: [
      { id: 'vm-app-01', cpu: 8, memory: 32, status: 'running' },
      { id: 'vm-app-02', cpu: 8, memory: 32, status: 'running' },
      { id: 'vm-cache-01', cpu: 4, memory: 16, status: 'running' },
      { id: 'vm-dev-01', cpu: 4, memory: 16, status: 'running' },
    ],
    logs: [
      '[INFO] All instances healthy',
      '[INFO] Storage I/O normalized',
      '[INFO] Memory pressure released',
      '[WARN] CPU spike detected - 87%',
      '[INFO] Automated scaling triggered',
    ],
  },
  'node-us-west-03': {
    name: 'node-us-west-03',
    status: 'ONLINE',
    uptime: '8 days 4h',
    region: 'USA West (US-01)',
    ip: '203.0.113.22',
    hypervisor: 'KVM/QEMU',
    cpuUsage: 85,
    memoryUsage: 78,
    diskUsage: 88,
    networkIn: '1.2 Gbps',
    networkOut: '0.9 Gbps',
    instances: [
      { id: 'vm-ai-01', cpu: 4, memory: 24, status: 'running' },
      { id: 'vm-process-01', cpu: 2, memory: 8, status: 'running' },
    ],
    logs: [
      '[ERROR] Disk space running low',
      '[WARN] CPU over 80% - migration recommended',
      '[INFO] Rebalancing workload',
      '[INFO] New instance initialized',
      '[WARN] Network latency increased',
    ],
  },
  'node-digitalocean-nyc-04': {
    name: 'node-digitalocean-nyc-04',
    status: 'ONLINE',
    uptime: '60 days 16h',
    region: 'New York (US-East)',
    ip: '192.0.2.88',
    hypervisor: 'KVM/QEMU',
    cpuUsage: 42,
    memoryUsage: 48,
    diskUsage: 55,
    networkIn: '3.5 Gbps',
    networkOut: '2.8 Gbps',
    instances: [
      { id: 'vm-api-01', cpu: 4, memory: 16, status: 'running' },
      { id: 'vm-api-02', cpu: 4, memory: 16, status: 'running' },
      { id: 'vm-queue-01', cpu: 2, memory: 8, status: 'running' },
    ],
    logs: [
      '[INFO] All services operational',
      '[INFO] Database sync completed',
      '[INFO] Cache refreshed',
      '[INFO] Performance metrics normal',
      '[INFO] Scheduled maintenance completed',
    ],
  },
}

export function NodeDetails({ nodeId, onToast }: NodeDetailsProps) {
  const [expandedTab, setExpandedTab] = useState<'overview' | 'instances' | 'logs'>('overview')
  const [refreshing, setRefreshing] = useState(false)

  const details = nodeDetailsData[nodeId] || nodeDetailsData['node-vn-01']

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      onToast({ message: 'Node data refreshed', type: 'success' })
    }, 1000)
  }

  const handleReboot = () => {
    onToast({ message: `Rebooting ${nodeId}...`, type: 'info' })
  }

  const handleLock = () => {
    onToast({ message: `Node locked`, type: 'success' })
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(71, 85, 105, 0.2)' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{details.name}</h3>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLock}
              className="p-2 rounded hover:bg-slate-800 transition-colors"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              onClick={handleReboot}
              className="p-2 rounded hover:bg-yellow-900/50 transition-colors"
            >
              <Zap className="w-4 h-4 text-yellow-400" />
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Status</span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-green-400">{details.status}</span>
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Uptime</span>
            <span className="text-slate-300 font-mono">{details.uptime}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Region</span>
            <span className="text-slate-300">{details.region}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-3 border-t border-slate-700/50"></div>

        {/* Metrics */}
        <div className="space-y-3 text-sm">
          {[
            { label: 'CPU Usage', value: details.cpuUsage, color: '#3b82f6' },
            { label: 'Memory Usage', value: details.memoryUsage, color: '#a855f7' },
            { label: 'Disk Usage', value: details.diskUsage, color: '#ec4899' },
          ].map((metric) => (
            <div key={metric.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-400">{metric.label}</span>
                <span className="font-mono text-slate-300">{metric.value}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800/30 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${metric.value}%`,
                    backgroundColor: metric.color,
                    boxShadow: `0 0 8px ${metric.color}66`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-3 border-t border-slate-700/50"></div>

        {/* Network */}
        <div className="text-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Network In</span>
            <span className="font-mono text-slate-300">{details.networkIn}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Network Out</span>
            <span className="font-mono text-slate-300">{details.networkOut}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-2">
        {['overview', 'instances', 'logs'].map((tab) => (
          <button
            key={tab}
            onClick={() => setExpandedTab(tab as typeof expandedTab)}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-between ${
              expandedTab === tab ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-slate-800/30 text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <span className="capitalize">{tab}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${expandedTab === tab ? 'rotate-180' : ''}`}
            />
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {expandedTab === 'instances' && (
        <div className="rounded-lg p-4 space-y-2" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(71, 85, 105, 0.2)' }}>
          {details.instances.map((instance: any) => (
            <div
              key={instance.id}
              className="flex items-center justify-between p-2 rounded hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <div className="flex-1">
                <div className="text-sm font-mono text-white">{instance.id}</div>
                <div className="text-xs text-slate-600">{instance.cpu}C / {instance.memory}GB</div>
              </div>
              <div className={`text-xs px-2 py-1 rounded ${instance.status === 'running' ? 'bg-green-500/20 text-green-300' : 'bg-slate-700 text-slate-300'}`}>
                {instance.status}
              </div>
            </div>
          ))}
        </div>
      )}

      {expandedTab === 'logs' && (
        <div className="rounded-lg p-4 space-y-1 font-mono text-xs" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(71, 85, 105, 0.2)' }}>
          {details.logs.map((log: string, idx: number) => (
            <div
              key={idx}
              className={`text-slate-400 ${
                log.includes('ERROR')
                  ? 'text-red-400'
                  : log.includes('WARN')
                    ? 'text-yellow-400'
                    : log.includes('INFO')
                      ? 'text-green-400'
                      : 'text-slate-400'
              }`}
            >
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

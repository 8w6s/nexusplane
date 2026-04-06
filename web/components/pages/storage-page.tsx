'use client'

import { useState } from 'react'
import { Plus, MoreVertical, Copy } from 'lucide-react'

export function StoragePage() {
  const [activeTab, setActiveTab] = useState('volumes')
  const [statusMessage, setStatusMessage] = useState('')

  const volumes = [
    {
      id: 'vol-001',
      name: 'primary-data-01',
      size: '500 GB',
      type: 'SSD NVMe',
      node: 'node-vn-01',
      attached: 'web-server-01',
      status: 'In Use',
      iops: '3000',
    },
    {
      id: 'vol-002',
      name: 'database-storage',
      size: '2 TB',
      type: 'SSD NVMe',
      node: 'node-hetzner-eu-02',
      attached: 'database-primary',
      status: 'In Use',
      iops: '15000',
    },
    {
      id: 'vol-003',
      name: 'backup-archive',
      size: '5 TB',
      type: 'HDD',
      node: 'node-us-west-03',
      attached: '-',
      status: 'Available',
      iops: '1000',
    },
    {
      id: 'vol-004',
      name: 'temp-cache',
      size: '250 GB',
      type: 'SSD NVMe',
      node: 'node-digitalocean-nyc-04',
      attached: 'cache-redis-01',
      status: 'In Use',
      iops: '5000',
    },
  ]

  const snapshots = [
    {
      id: 'snap-001',
      name: 'daily-backup-2026-04-05',
      sourceVolume: 'primary-data-01',
      size: '120 GB',
      created: '2 hours ago',
      status: 'Completed',
      progress: 100,
    },
    {
      id: 'snap-002',
      name: 'weekly-archive-2026-04-01',
      sourceVolume: 'database-storage',
      size: '485 GB',
      created: '4 days ago',
      status: 'Completed',
      progress: 100,
    },
    {
      id: 'snap-003',
      name: 'monthly-backup-2026-04-01',
      sourceVolume: 'primary-data-01',
      size: '120 GB',
      created: '5 days ago',
      status: 'Completed',
      progress: 100,
    },
    {
      id: 'snap-004',
      name: 'emergency-restore-point',
      sourceVolume: 'backup-archive',
      size: '850 GB',
      created: 'In progress...',
      status: 'Creating',
      progress: 67,
    },
  ]

  const announce = (message: string) => {
    setStatusMessage(message)
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-600 space-x-2">
        <span>Console</span>
        <span>&gt;</span>
        <span>Storage</span>
      </div>

      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Storage Management</h1>
          <p className="text-slate-400 text-sm mt-2">Manage volumes and snapshots</p>
        </div>
        <button
          type="button"
          onClick={() => announce('Đã mở luồng tạo volume demo và chờ cấu hình.')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Volume
        </button>
      </div>

      {statusMessage && (
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
          {statusMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b" style={{ borderColor: 'rgba(71, 85, 105, 0.2)' }}>
        <button
          onClick={() => setActiveTab('volumes')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'volumes'
              ? 'text-blue-400 border-blue-400'
              : 'text-slate-400 border-transparent hover:text-slate-300'
          }`}
        >
          Volumes
        </button>
        <button
          onClick={() => setActiveTab('snapshots')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'snapshots'
              ? 'text-blue-400 border-blue-400'
              : 'text-slate-400 border-transparent hover:text-slate-300'
          }`}
        >
          Snapshots
        </button>
      </div>

      {/* Volumes Tab */}
      {activeTab === 'volumes' && (
        <div
          className="rounded-lg border overflow-hidden"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            borderColor: 'rgba(71, 85, 105, 0.2)',
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderColor: 'rgba(71, 85, 105, 0.2)' }} className="border-b">
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Name</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Size</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Type</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Node</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Attached To</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">IOPS</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Status</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {volumes.map((volume) => (
                  <tr
                    key={volume.id}
                    style={{ borderColor: 'rgba(71, 85, 105, 0.2)' }}
                    className="border-b hover:bg-slate-900/20 transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-mono text-sm">{volume.name}</td>
                    <td className="px-6 py-4 text-slate-400">{volume.size}</td>
                    <td className="px-6 py-4 text-slate-400">{volume.type}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{volume.node}</td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-sm">{volume.attached}</td>
                    <td className="px-6 py-4 text-slate-400">{volume.iops}</td>
                    <td className="px-6 py-4">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: volume.status === 'In Use' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                          color: volume.status === 'In Use' ? '#86efac' : '#93c5fd',
                        }}
                      >
                        {volume.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => announce(`Đã mở menu hành động cho ${volume.name}.`)}
                        className="text-slate-400 hover:text-slate-200"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Snapshots Tab */}
      {activeTab === 'snapshots' && (
        <div className="space-y-4">
          {snapshots.map((snapshot) => (
            <div
              key={snapshot.id}
              className="rounded-lg p-4 border hover:border-blue-500/30 transition-all"
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.4)',
                borderColor: 'rgba(71, 85, 105, 0.2)',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-white font-mono font-medium">{snapshot.name}</h4>
                  <p className="text-slate-600 text-sm mt-1">From: {snapshot.sourceVolume}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: snapshot.status === 'Completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                      color: snapshot.status === 'Completed' ? '#86efac' : '#93c5fd',
                    }}
                  >
                    {snapshot.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => announce(`Đã sao chép snapshot ${snapshot.name}.`)}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                <span>{snapshot.size}</span>
                <span>{snapshot.created}</span>
              </div>
              {snapshot.progress < 100 && (
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                    style={{ width: `${snapshot.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

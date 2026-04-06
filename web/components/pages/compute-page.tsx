'use client'

import { useState } from 'react'
import { Play, Pause, RotateCcw, Trash2, Plus, Filter } from 'lucide-react'

export function ComputePage() {
  const [selectedInstances, setSelectedInstances] = useState<string[]>([])
  const [showAddModal, setShowAddModal] = useState(false)

  const instances = [
    {
      id: 'i-001',
      name: 'web-server-01',
      type: 't3.medium',
      state: 'running',
      node: 'node-vn-01',
      ip: '10.0.1.45',
      cpu: 2,
      memory: 4,
      created: '2 months ago',
    },
    {
      id: 'i-002',
      name: 'api-backend-01',
      type: 't3.large',
      state: 'running',
      node: 'node-vn-01',
      ip: '10.0.1.46',
      cpu: 4,
      memory: 8,
      created: '1 month ago',
    },
    {
      id: 'i-003',
      name: 'database-primary',
      type: 'm5.xlarge',
      state: 'running',
      node: 'node-hetzner-eu-02',
      ip: '10.0.2.102',
      cpu: 8,
      memory: 16,
      created: '3 months ago',
    },
    {
      id: 'i-004',
      name: 'cache-redis-01',
      type: 't3.small',
      state: 'stopped',
      node: 'node-us-west-03',
      ip: '10.0.3.50',
      cpu: 1,
      memory: 2,
      created: '1 week ago',
    },
    {
      id: 'i-005',
      name: 'worker-job-01',
      type: 't3.medium',
      state: 'running',
      node: 'node-digitalocean-nyc-04',
      ip: '10.0.4.88',
      cpu: 2,
      memory: 4,
      created: '3 days ago',
    },
  ]

  const images = [
    { id: 'ami-001', name: 'Ubuntu 22.04 LTS', size: '2.1 GB', instances: 12 },
    { id: 'ami-002', name: 'Debian 11', size: '1.8 GB', instances: 5 },
    { id: 'ami-003', name: 'CentOS 8', size: '2.5 GB', instances: 3 },
    { id: 'ami-004', name: 'Alpine Linux', size: '0.5 GB', instances: 8 },
  ]

  const toggleInstance = (id: string) => {
    setSelectedInstances((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-600 space-x-2">
        <span>Console</span>
        <span>&gt;</span>
        <span>Compute</span>
      </div>

      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Compute Management</h1>
          <p className="text-slate-400 text-sm mt-2">Manage your instances and images</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Launch Instance
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b" style={{ borderColor: 'rgba(71, 85, 105, 0.2)' }}>
        <button className="px-4 py-3 text-sm font-medium text-blue-400 border-b-2 border-blue-400">Instances</button>
        <button className="px-4 py-3 text-sm font-medium text-slate-400 hover:text-slate-300">Images</button>
      </div>

      {/* Instances Table */}
      <div
        className="rounded-lg border overflow-hidden"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          borderColor: 'rgba(71, 85, 105, 0.2)',
        }}
      >
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(71, 85, 105, 0.2)' }}>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">{selectedInstances.length} selected</span>
          </div>
          {selectedInstances.length > 0 && (
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 flex items-center gap-1">
                <Play className="w-3 h-3" />
                Start
              </button>
              <button className="px-3 py-1 text-sm bg-yellow-500/20 text-yellow-400 rounded hover:bg-yellow-500/30 flex items-center gap-1">
                <Pause className="w-3 h-3" />
                Stop
              </button>
              <button className="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 flex items-center gap-1">
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderColor: 'rgba(71, 85, 105, 0.2)' }} className="border-b">
                <th className="px-6 py-3 text-left text-slate-400 font-medium w-8">
                  <input
                    type="checkbox"
                    checked={selectedInstances.length === instances.length}
                    onChange={(e) =>
                      setSelectedInstances(e.target.checked ? instances.map((i) => i.id) : [])
                    }
                    className="cursor-pointer"
                  />
                </th>
                <th className="px-6 py-3 text-left text-slate-400 font-medium">Name</th>
                <th className="px-6 py-3 text-left text-slate-400 font-medium">Type</th>
                <th className="px-6 py-3 text-left text-slate-400 font-medium">Node</th>
                <th className="px-6 py-3 text-left text-slate-400 font-medium">IP Address</th>
                <th className="px-6 py-3 text-left text-slate-400 font-medium">State</th>
                <th className="px-6 py-3 text-left text-slate-400 font-medium">Created</th>
                <th className="px-6 py-3 text-left text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {instances.map((instance) => (
                <tr
                  key={instance.id}
                  style={{ borderColor: 'rgba(71, 85, 105, 0.2)' }}
                  className="border-b hover:bg-slate-900/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedInstances.includes(instance.id)}
                      onChange={() => toggleInstance(instance.id)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 text-white font-mono text-sm">{instance.name}</td>
                  <td className="px-6 py-4 text-slate-400">{instance.type}</td>
                  <td className="px-6 py-4 text-slate-400">{instance.node}</td>
                  <td className="px-6 py-4 font-mono text-slate-400 text-sm">{instance.ip}</td>
                  <td className="px-6 py-4">
                    <span
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: instance.state === 'running' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                        color: instance.state === 'running' ? '#86efac' : '#d1d5db',
                      }}
                    >
                      {instance.state}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{instance.created}</td>
                  <td className="px-6 py-4">
                    <button className="text-slate-400 hover:text-blue-400 transition-colors">SSH</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Images Section */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Available Images</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="rounded-lg p-4 border hover:border-blue-500/30 transition-all cursor-pointer"
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.4)',
                borderColor: 'rgba(71, 85, 105, 0.2)',
              }}
            >
              <h4 className="text-white font-medium">{image.name}</h4>
              <p className="text-slate-600 text-sm mt-1">{image.size}</p>
              <p className="text-slate-600 text-sm">{image.instances} instances</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

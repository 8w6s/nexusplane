'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface AttachNodeModalProps {
  onClose: () => void
  onAttach: (data: any) => void
}

export function AttachNodeModal({ onClose, onAttach }: AttachNodeModalProps) {
  const [formData, setFormData] = useState({
    nodeName: '',
    nodeType: 'compute',
    ipAddress: '',
    cpu: '16',
    memory: '64',
    storage: '2',
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAttach(formData)
    setFormData({
      nodeName: '',
      nodeType: 'compute',
      ipAddress: '',
      cpu: '16',
      memory: '64',
      storage: '2',
      description: '',
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Attach New Node</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Node Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Node Name</label>
            <input
              type="text"
              required
              placeholder="e.g., node-production-01"
              value={formData.nodeName}
              onChange={(e) => setFormData({ ...formData, nodeName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {/* Node Type */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Node Type</label>
            <select
              value={formData.nodeType}
              onChange={(e) => setFormData({ ...formData, nodeType: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="compute">Compute</option>
              <option value="storage">Storage</option>
              <option value="memory">Memory</option>
            </select>
          </div>

          {/* IP Address */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">IP Address</label>
            <input
              type="text"
              required
              placeholder="192.168.1.100"
              value={formData.ipAddress}
              onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {/* Resources */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">CPU Cores</label>
              <input
                type="number"
                value={formData.cpu}
                onChange={(e) => setFormData({ ...formData, cpu: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Memory (GB)</label>
              <input
                type="number"
                value={formData.memory}
                onChange={(e) => setFormData({ ...formData, memory: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Storage (TB)</label>
              <input
                type="number"
                value={formData.storage}
                onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              placeholder="Optional description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 h-20 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Attach Node
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

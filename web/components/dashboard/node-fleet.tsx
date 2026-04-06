'use client'

import { useState } from 'react'
import { MoreVertical, Copy, Trash2, Eye } from 'lucide-react'

interface NodeFleetProps {
  selectedNodeId: string
  onNodeSelect: (nodeId: string) => void
  searchQuery: string
  onToast: (toast: { message: string; type: 'success' | 'error' | 'info' }) => void
  onOpenTerminal?: (nodeId: string) => void
}

const nodes = [
  {
    id: 'node-vn-01',
    hypervisor: 'KVM/QEMU',
    ip: '192.168.1.100',
    cpu: 16,
    memory: 64,
    storage: 2,
    bandwidth: 1,
    agentStatus: 'AGENT-OK',
    agentType: 'local',
    load: 24,
    instances: 12,
  },
  {
    id: 'node-hetzner-eu-02',
    hypervisor: 'Hyper-V',
    ip: '185.23.98.45',
    cpu: 32,
    memory: 128,
    storage: 4,
    bandwidth: 10,
    agentStatus: 'API-SYNCED',
    agentType: 'cloud',
    load: 58,
    instances: 34,
  },
  {
    id: 'node-us-west-03',
    hypervisor: 'KVM/QEMU',
    ip: '203.0.113.22',
    cpu: 8,
    memory: 32,
    storage: 1,
    bandwidth: 1,
    agentStatus: 'AGENT-OK',
    agentType: 'local',
    load: 85,
    instances: 18,
  },
  {
    id: 'node-digitalocean-nyc-04',
    hypervisor: 'KVM/QEMU',
    ip: '192.0.2.88',
    cpu: 12,
    memory: 48,
    storage: 2,
    bandwidth: 5,
    agentStatus: 'API-SYNCED',
    agentType: 'cloud',
    load: 42,
    instances: 22,
  },
]

export function NodeFleet({ selectedNodeId, onNodeSelect, searchQuery, onToast, onOpenTerminal }: NodeFleetProps) {
  const [contextMenuId, setContextMenuId] = useState<string | null>(null)

  const filteredNodes = nodes.filter(
    (node) =>
      node.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.ip.includes(searchQuery)
  )

  const handleCopyIP = (ip: string, nodeName: string) => {
    navigator.clipboard.writeText(ip)
    onToast({ message: `Copied ${ip} to clipboard`, type: 'success' })
  }

  const handleDeleteNode = (nodeName: string) => {
    onToast({ message: `Node "${nodeName}" removed from fleet`, type: 'error' })
    setContextMenuId(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Active Nodes ({filteredNodes.length}/{nodes.length})
        </h2>
      </div>

      {filteredNodes.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          No nodes matching "{searchQuery}"
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNodes.map((node) => (
            <div key={node.id} className="relative">
              <div
                onClick={() => onNodeSelect(node.id)}
                className="rounded-lg overflow-hidden transition-all cursor-pointer group"
                style={{
                  backgroundColor: selectedNodeId === node.id ? 'rgba(59, 130, 246, 0.1)' : 'rgba(15, 23, 42, 0.4)',
                  border: selectedNodeId === node.id ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(71, 85, 105, 0.2)',
                  borderLeft: node.agentStatus === 'AGENT-OK' ? '3px solid #3b82f6' : '3px solid #a855f7',
                  boxShadow: selectedNodeId === node.id ? 'rgba(59, 130, 246, 0.2) 0 0 20px' : 'rgba(59, 130, 246, 0.05) 0 0 20px',
                }}
              >
                {/* Card content */}
                <div className="p-4 space-y-3">
                  {/* Row 1: Name + Resources + Status */}
                  <div className="flex items-center justify-between gap-4">
                    {/* Left: Name and IP */}
                    <div className="flex-1">
                      <div className="font-mono text-white font-medium">{node.id}</div>
                      <div className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                        <span>Hypervisor: {node.hypervisor}</span>
                        <span>|</span>
                        <span className="font-mono text-slate-500">{node.ip}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopyIP(node.ip, node.id)
                          }}
                          className="text-slate-500 hover:text-blue-400 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Center: Resource matrix */}
                    <div className="flex gap-3 text-xs flex-shrink-0">
                      <div className="text-center">
                        <div className="font-mono text-blue-400">{node.cpu}C</div>
                        <div className="text-slate-600 text-xs">CPU</div>
                      </div>
                      <div className="text-center">
                        <div className="font-mono text-purple-400">{node.memory}GB</div>
                        <div className="text-slate-600 text-xs">RAM</div>
                      </div>
                      <div className="text-center">
                        <div className="font-mono text-slate-400">{node.storage}TB</div>
                        <div className="text-slate-600 text-xs">NVMe</div>
                      </div>
                      <div className="text-center">
                        <div className="font-mono text-slate-400">{node.bandwidth}Gbps</div>
                        <div className="text-slate-600 text-xs">Bandwidth</div>
                      </div>
                      <div className="text-center">
                        <div className="font-mono text-slate-300">{node.instances}</div>
                        <div className="text-slate-600 text-xs">Instances</div>
                      </div>
                    </div>

                    {/* Right: Status badge + Menu */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span
                        className="px-3 py-1 rounded text-xs font-medium text-center"
                        style={{
                          backgroundColor: node.agentType === 'local' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(168, 85, 247, 0.1)',
                          color: node.agentType === 'local' ? '#60a5fa' : '#c084fc',
                        }}
                      >
                        {node.agentStatus}
                      </span>

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setContextMenuId(contextMenuId === node.id ? null : node.id)
                          }}
                          className="p-1 rounded hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-white opacity-0 group-hover:opacity-100"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {contextMenuId === node.id && (
                          <div className="absolute right-0 mt-1 w-32 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-40">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCopyIP(node.ip, node.id)
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                            >
                              <Copy className="w-3 h-3" />
                              Copy IP
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (onOpenTerminal) {
                                  onOpenTerminal(node.id)
                                  setContextMenuId(null)
                                }
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              SSH
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteNode(node.id)
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors border-t border-slate-700"
                            >
                              <Trash2 className="w-3 h-3" />
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">CPU Load</span>
                      <span className="text-xs font-mono text-slate-400">{node.load}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800/30 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${node.load > 80 ? 'animate-pulse' : ''}`}
                        style={{
                          width: `${node.load}%`,
                          backgroundColor: node.load > 80 ? '#ec4899' : '#3b82f6',
                          boxShadow: node.load > 80 ? '0 0 8px rgba(236, 72, 153, 0.5)' : '0 0 8px rgba(59, 130, 246, 0.5)',
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

'use client'

import { LayoutDashboard, Server, HardDrive, Network, Shield, Boxes, Plug } from 'lucide-react'

const menuItems = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview', sublabel: null },
  { id: 'compute', icon: Server, label: 'Compute', sublabel: 'Instances' },
  { id: 'storage', icon: HardDrive, label: 'Storage', sublabel: 'Volumes / Snapshots' },
  { id: 'networking', icon: Network, label: 'Networking', sublabel: 'VPC / Firewalls' },
  { id: 'security', icon: Shield, label: 'Security', sublabel: 'IAM / Keys' },
  { id: 'infrastructure', icon: Boxes, label: 'Infrastructure', sublabel: 'Nodes Fleet' },
  { id: 'integrations', icon: Plug, label: 'Integrations', sublabel: 'Cloud Providers API' },
]

interface SidebarProps {
  activePage: string
  onPageChange: (pageId: string) => void
}

export function Sidebar({ activePage, onPageChange }: SidebarProps) {
  return (
    <div className="w-64 flex flex-col h-screen border-r" style={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(71, 85, 105, 0.12)' }}>
      {/* Top - Logo */}
      <div className="p-6 border-b" style={{ borderColor: 'rgba(71, 85, 105, 0.12)' }}>
        <button
          onClick={() => onPageChange('overview')}
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          {/* Geometric hexagon glow effect */}
          <div className="relative w-8 h-8">
            <svg viewBox="0 0 32 32" className="w-full h-full">
              <polygon points="16,2 28,8 28,24 16,30 4,24 4,8" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
              <polygon points="16,8 24,12 24,20 16,24 8,20 8,12" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-white font-sans">Orchestrator</span>
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-start gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all mb-1 ${
                isActive ? 'bg-blue-500/10' : 'hover:bg-slate-900/20'
              }`}
              style={isActive ? { borderLeft: '3px solid #3b82f6' } : {}}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
              <div className="flex-1 min-w-0 text-left">
                <div className={`text-sm font-medium ${isActive ? 'text-blue-300' : 'text-slate-400'}`}>
                  {item.label}
                </div>
                {item.sublabel && <div className="text-xs text-slate-600 mt-0.5">{item.sublabel}</div>}
              </div>
            </button>
          )
        })}
      </nav>

      {/* Status Bar */}
      <div className="p-4 border-t" style={{ borderColor: 'rgba(71, 85, 105, 0.12)' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-xs text-slate-600">System Healthy</span>
        </div>
      </div>
    </div>
  )
}

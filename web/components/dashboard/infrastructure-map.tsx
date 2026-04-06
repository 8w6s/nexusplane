import { Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const nodes = [
  {
    name: 'VN-01 (Dedicated)',
    status: 'Online',
    statusColor: 'emerald',
    specs: '16 Cores / 64GB RAM',
    cpu: 20,
    ram: 45,
    tag: 'Local Agent',
    tagColor: 'blue',
  },
  {
    name: 'Hetzner EU',
    status: 'API Synced',
    statusColor: 'blue',
    specs: 'Quota: 24/50 Instances',
    progress: 48,
    tag: 'Cloud API',
    tagColor: 'purple',
  },
  {
    name: 'Vultr US-West',
    status: 'API Synced',
    statusColor: 'blue',
    specs: 'Quota: 10/20 Instances',
    progress: 50,
    tag: 'Cloud API',
    tagColor: 'purple',
  },
]

export function InfrastructureMap() {
  return (
    <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Địa điểm hạ tầng</h3>
        <Button 
          variant="outline" 
          size="sm"
          className="border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 h-8 gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="text-xs">Thêm Location</span>
        </Button>
      </div>

      <div className="space-y-3">
        {nodes.map((node, idx) => (
          <div key={idx} className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4 hover:bg-slate-800/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  node.statusColor === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'
                }`} />
                <div>
                  <p className="text-sm font-semibold text-white">{node.name}</p>
                  <p className="text-xs text-slate-400">{node.status}</p>
                </div>
              </div>
              <Badge 
                variant="outline"
                className={`text-xs ${
                  node.tagColor === 'blue' 
                    ? 'border-blue-400/30 text-blue-400 bg-blue-500/10' 
                    : 'border-purple-400/30 text-purple-400 bg-purple-500/10'
                }`}
              >
                {node.tag}
              </Badge>
            </div>

            <p className="text-xs text-slate-400 mb-3">{node.specs}</p>

            {/* Progress Bars */}
            {node.cpu !== undefined ? (
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">CPU</span>
                    <span className="text-xs text-slate-500">{node.cpu}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" 
                      style={{ width: `${node.cpu}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">RAM</span>
                    <span className="text-xs text-slate-500">{node.ram}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full" 
                      style={{ width: `${node.ram}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">Sử dụng</span>
                  <span className="text-xs text-slate-500">{node.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" 
                    style={{ width: `${node.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

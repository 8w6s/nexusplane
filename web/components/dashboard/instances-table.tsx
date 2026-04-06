import { useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const instances = [
  {
    name: 'prod-web-01',
    ip: '192.168.1.10',
    os: 'Ubuntu 24.04',
    location: 'VN-01',
    status: 'Running',
  },
  {
    name: 'test-api-02',
    ip: '10.0.0.5',
    os: 'Debian 12',
    location: 'Hetzner',
    status: 'Stopped',
  },
  {
    name: 'game-mc-01',
    ip: '45.77.22.11',
    os: 'Custom ISO',
    location: 'Vultr',
    status: 'Running',
  },
]

export function InstancesTable() {
  const [statusMessage, setStatusMessage] = useState('')

  const announce = (message: string) => {
    setStatusMessage(message)
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-slate-800/50 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Máy chủ gần đây</h3>
        <Button
          type="button"
          onClick={() => announce('Đã mở luồng triển khai instance demo.')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-purple-500/20"
        >
          Deploy New Instance
        </Button>
      </div>

      {statusMessage && <div className="border-b border-slate-800/50 bg-blue-500/10 px-6 py-3 text-sm text-blue-100">{statusMessage}</div>}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800/50 bg-slate-800/30">
              <th className="px-6 py-4 text-left">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Instance Name</span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">IP Address</span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">OS</span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {instances.map((instance, idx) => (
              <tr 
                key={idx}
                className="border-b border-slate-800/30 hover:bg-slate-800/10 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-white">{instance.name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-mono text-slate-300">{instance.ip}</span>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="outline" className="border-slate-700 text-slate-300 bg-slate-800/30 text-xs">
                    {instance.os}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="outline" className="border-slate-700 text-slate-300 bg-slate-800/30 text-xs">
                    {instance.location}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  {instance.status === 'Running' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <Badge className="bg-green-500/10 text-green-400 border-0 text-xs">
                        {instance.status}
                      </Badge>
                    </div>
                  ) : (
                    <Badge variant="outline" className="border-slate-700 text-slate-400 bg-slate-700/30 text-xs">
                      {instance.status}
                    </Badge>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => announce(`Đã mở menu hành động cho ${instance.name}.`)}
                    className="p-2 hover:bg-slate-700/30 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-slate-400 hover:text-slate-300" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

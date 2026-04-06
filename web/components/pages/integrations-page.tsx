'use client'

import { useState } from 'react'
import { Cloud, Check, AlertCircle } from 'lucide-react'

export function IntegrationsPage() {
  const [statusMessage, setStatusMessage] = useState('')

  const providers = [
    {
      id: 'aws',
      name: 'Amazon Web Services',
      status: 'Connected',
      account: 'prod-aws-account',
      region: 'us-east-1',
      instances: 24,
      lastSync: '5 minutes ago',
      enabled: true,
    },
    {
      id: 'gcp',
      name: 'Google Cloud Platform',
      status: 'Connected',
      account: 'my-gcp-project',
      region: 'us-central1',
      instances: 8,
      lastSync: '10 minutes ago',
      enabled: true,
    },
    {
      id: 'azure',
      name: 'Microsoft Azure',
      status: 'Connected',
      account: 'azure-subscription',
      region: 'East US',
      instances: 5,
      lastSync: '3 minutes ago',
      enabled: true,
    },
    {
      id: 'digitalocean',
      name: 'DigitalOcean',
      status: 'Connected',
      account: 'digitalocean-team',
      region: 'nyc3',
      instances: 12,
      lastSync: '8 minutes ago',
      enabled: true,
    },
    {
      id: 'linode',
      name: 'Linode',
      status: 'Not Connected',
      account: '-',
      region: '-',
      instances: 0,
      lastSync: 'Never',
      enabled: false,
    },
  ]

  const webhooks = [
    {
      id: 'webhook-001',
      name: 'Instance State Changes',
      url: 'https://api.example.com/webhooks/instances',
      events: ['instance.started', 'instance.stopped'],
      enabled: true,
      lastTriggered: '2 hours ago',
    },
    {
      id: 'webhook-002',
      name: 'Volume Operations',
      url: 'https://api.example.com/webhooks/volumes',
      events: ['volume.created', 'volume.deleted'],
      enabled: true,
      lastTriggered: '1 day ago',
    },
    {
      id: 'webhook-003',
      name: 'Billing Alerts',
      url: 'https://billing.example.com/alerts',
      events: ['billing.threshold'],
      enabled: false,
      lastTriggered: 'Never',
    },
  ]

  const apiUsage = [
    { endpoint: 'GET /instances', calls: 1230, last24h: 245 },
    { endpoint: 'POST /instances', calls: 340, last24h: 12 },
    { endpoint: 'GET /volumes', calls: 890, last24h: 156 },
    { endpoint: 'DELETE /instances', calls: 45, last24h: 2 },
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
        <span>Integrations</span>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-white">Integrations</h1>
        <p className="text-slate-400 text-sm mt-2">Cloud providers, webhooks, and API integrations</p>
      </div>

      {statusMessage && (
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
          {statusMessage}
        </div>
      )}

      {/* Cloud Providers Section */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Cloud Providers</h2>
        <div className="space-y-3">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="rounded-lg p-4 border hover:border-blue-500/30 transition-all"
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.4)',
                borderColor: 'rgba(71, 85, 105, 0.2)',
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Cloud className="w-5 h-5 text-blue-400" />
                    <h4 className="text-white font-medium">{provider.name}</h4>
                    {provider.enabled ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm mt-3">
                    <div>
                      <p className="text-slate-600">Account</p>
                      <p className="text-slate-300">{provider.account}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Region</p>
                      <p className="text-slate-300">{provider.region}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Instances</p>
                      <p className="text-slate-300">{provider.instances}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Last Sync</p>
                      <p className="text-slate-300">{provider.lastSync}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  {provider.enabled ? (
                    <>
                      <button
                        type="button"
                        onClick={() => announce(`Đã sync ${provider.name} trong chế độ demo.`)}
                        className="px-3 py-1 text-sm rounded border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                      >
                        Sync
                      </button>
                      <button
                        type="button"
                        onClick={() => announce(`Đã mở settings cho ${provider.name}.`)}
                        className="px-3 py-1 text-sm rounded border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                      >
                        Settings
                      </button>
                      <button
                        type="button"
                        onClick={() => announce(`Đã ngắt kết nối demo với ${provider.name}.`)}
                        className="px-3 py-1 text-sm rounded border border-red-700/30 text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => announce(`Đã khởi tạo kết nối demo với ${provider.name}.`)}
                      className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Webhooks Section */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Webhooks</h2>
        <div className="space-y-3">
          {webhooks.map((webhook) => (
            <div
              key={webhook.id}
              className="rounded-lg p-4 border hover:border-blue-500/30 transition-all"
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.4)',
                borderColor: 'rgba(71, 85, 105, 0.2)',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-white font-medium">{webhook.name}</h4>
                  <p className="text-slate-600 text-sm font-mono mt-1">{webhook.url}</p>
                </div>
                <span
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: webhook.enabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                    color: webhook.enabled ? '#86efac' : '#d1d5db',
                  }}
                >
                  {webhook.enabled ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-slate-600">Events: {webhook.events.join(', ')}</p>
                  <p className="text-slate-600 mt-1">Last Triggered: {webhook.lastTriggered}</p>
                </div>
                  <button
                    type="button"
                    onClick={() => announce(`Đã mở editor webhook cho ${webhook.name}.`)}
                    className="px-3 py-1 text-sm rounded border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Usage Section */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">API Usage</h2>
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
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Endpoint</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Total Calls</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Last 24h</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Average</th>
                </tr>
              </thead>
              <tbody>
                {apiUsage.map((usage, idx) => (
                  <tr
                    key={idx}
                    style={{ borderColor: 'rgba(71, 85, 105, 0.2)' }}
                    className="border-b hover:bg-slate-900/20 transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-mono text-sm">{usage.endpoint}</td>
                    <td className="px-6 py-4 text-slate-400">{usage.calls}</td>
                    <td className="px-6 py-4 text-slate-400">{usage.last24h}</td>
                    <td className="px-6 py-4">
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{ width: `${(usage.last24h / Math.max(...apiUsage.map((u) => u.last24h))) * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

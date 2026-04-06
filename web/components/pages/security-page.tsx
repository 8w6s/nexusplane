'use client'

import { useState } from 'react'
import { Plus, Copy, RotateCcw, Trash2 } from 'lucide-react'

export function SecurityPage() {
  const [activeTab, setActiveTab] = useState('keys')
  const [statusMessage, setStatusMessage] = useState('')

  const apiKeys = [
    {
      id: 'key-001',
      name: 'Production API Key',
      key: 'sk_live_51KnQ8EABCD...****',
      created: '2 months ago',
      lastUsed: '1 hour ago',
      status: 'Active',
      permissions: ['read', 'write'],
    },
    {
      id: 'key-002',
      name: 'Staging API Key',
      key: 'sk_test_51KnQ8EABCD...****',
      created: '3 weeks ago',
      lastUsed: '2 days ago',
      status: 'Active',
      permissions: ['read', 'write'],
    },
    {
      id: 'key-003',
      name: 'Webhook API Key',
      key: 'sk_webhook_51K...****',
      created: '1 month ago',
      lastUsed: 'Never',
      status: 'Active',
      permissions: ['read'],
    },
  ]

  const certificates = [
    {
      id: 'cert-001',
      domain: 'api.example.com',
      issuer: 'Let&apos;s Encrypt',
      expires: '2024-10-15',
      daysLeft: 157,
      status: 'Valid',
    },
    {
      id: 'cert-002',
      domain: 'example.com',
      issuer: 'Let&apos;s Encrypt',
      expires: '2024-06-20',
      daysLeft: 76,
      status: 'Valid',
    },
    {
      id: 'cert-003',
      domain: '*.example.com',
      issuer: 'DigiCert',
      expires: '2024-05-10',
      daysLeft: 34,
      status: 'Expires Soon',
    },
  ]

  const iamUsers = [
    {
      id: 'user-001',
      name: 'john.doe@example.com',
      role: 'Admin',
      mfa: true,
      lastLogin: '1 hour ago',
      status: 'Active',
    },
    {
      id: 'user-002',
      name: 'jane.smith@example.com',
      role: 'Developer',
      mfa: true,
      lastLogin: '3 hours ago',
      status: 'Active',
    },
    {
      id: 'user-003',
      name: 'bob.wilson@example.com',
      role: 'Operator',
      mfa: false,
      lastLogin: '2 days ago',
      status: 'Active',
    },
    {
      id: 'user-004',
      name: 'alice.johnson@example.com',
      role: 'Viewer',
      mfa: false,
      lastLogin: 'Never',
      status: 'Inactive',
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
        <span>Security</span>
      </div>

      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Security</h1>
          <p className="text-slate-400 text-sm mt-2">API keys, certificates, and IAM management</p>
        </div>
        <button
          type="button"
          onClick={() => announce('Đã mở luồng tạo API key demo.')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Key
        </button>
      </div>

      {statusMessage && (
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
          {statusMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b" style={{ borderColor: 'rgba(71, 85, 105, 0.2)' }}>
        {[
          { id: 'keys', label: 'API Keys' },
          { id: 'certificates', label: 'Certificates' },
          { id: 'iam', label: 'IAM Users' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'text-blue-400 border-blue-400'
                : 'text-slate-400 border-transparent hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* API Keys */}
      {activeTab === 'keys' && (
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="rounded-lg p-4 border hover:border-blue-500/30 transition-all"
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.4)',
                borderColor: 'rgba(71, 85, 105, 0.2)',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-white font-medium">{apiKey.name}</h4>
                  <p className="text-slate-600 text-sm font-mono mt-1">{apiKey.key}</p>
                </div>
                <span
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    color: '#86efac',
                  }}
                >
                  {apiKey.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                <div>
                  <p className="text-slate-600">Created</p>
                  <p className="text-slate-300">{apiKey.created}</p>
                </div>
                <div>
                  <p className="text-slate-600">Last Used</p>
                  <p className="text-slate-300">{apiKey.lastUsed}</p>
                </div>
                <div>
                  <p className="text-slate-600">Permissions</p>
                  <p className="text-slate-300">{apiKey.permissions.join(', ')}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => announce(`Đã sao chép key ${apiKey.name}.`)}
                  className="px-3 py-1 text-xs rounded border border-slate-700 text-slate-300 hover:bg-slate-800 flex items-center gap-1 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
                <button
                  type="button"
                  onClick={() => announce(`Đã rotate demo key ${apiKey.name}.`)}
                  className="px-3 py-1 text-xs rounded border border-slate-700 text-slate-300 hover:bg-slate-800 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Rotate
                </button>
                <button
                  type="button"
                  onClick={() => announce(`Đã revoke demo key ${apiKey.name}.`)}
                  className="px-3 py-1 text-xs rounded border border-red-700/30 text-red-400 hover:bg-red-500/10 flex items-center gap-1 transition-colors ml-auto"
                >
                  <Trash2 className="w-3 h-3" />
                  Revoke
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificates */}
      {activeTab === 'certificates' && (
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
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Domain</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Issuer</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Expires</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Days Left</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Status</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((cert) => (
                  <tr
                    key={cert.id}
                    style={{ borderColor: 'rgba(71, 85, 105, 0.2)' }}
                    className="border-b hover:bg-slate-900/20 transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-mono text-sm">{cert.domain}</td>
                    <td className="px-6 py-4 text-slate-400">{cert.issuer}</td>
                    <td className="px-6 py-4 text-slate-400">{cert.expires}</td>
                    <td className="px-6 py-4">
                      <span
                        style={{
                          color: cert.daysLeft > 30 ? '#10b981' : cert.daysLeft > 7 ? '#f59e0b' : '#ef4444',
                        }}
                      >
                        {cert.daysLeft} days
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor:
                            cert.status === 'Valid'
                              ? 'rgba(16, 185, 129, 0.2)'
                              : 'rgba(234, 179, 8, 0.2)',
                          color: cert.status === 'Valid' ? '#86efac' : '#fcd34d',
                        }}
                      >
                        {cert.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => announce(`Đã renew certificate ${cert.domain}.`)}
                        className="text-slate-400 hover:text-blue-400 transition-colors text-xs"
                      >
                        Renew
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* IAM Users */}
      {activeTab === 'iam' && (
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
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Role</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">MFA</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Last Login</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Status</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {iamUsers.map((user) => (
                  <tr
                    key={user.id}
                    style={{ borderColor: 'rgba(71, 85, 105, 0.2)' }}
                    className="border-b hover:bg-slate-900/20 transition-colors"
                  >
                    <td className="px-6 py-4 text-white">{user.name}</td>
                    <td className="px-6 py-4 text-slate-400">{user.role}</td>
                    <td className="px-6 py-4">
                      <span className={user.mfa ? 'text-green-400' : 'text-red-400'}>
                        {user.mfa ? '✓ Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{user.lastLogin}</td>
                    <td className="px-6 py-4">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: user.status === 'Active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                          color: user.status === 'Active' ? '#86efac' : '#d1d5db',
                        }}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => announce(`Đã mở editor cho ${user.name}.`)}
                        className="text-slate-400 hover:text-slate-200 text-xs"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

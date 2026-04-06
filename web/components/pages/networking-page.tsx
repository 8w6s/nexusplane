'use client'

import { useState } from 'react'
import { Plus, Shield, Zap } from 'lucide-react'

export function NetworkingPage() {
  const [activeTab, setActiveTab] = useState('vpcs')

  const vpcs = [
    {
      id: 'vpc-001',
      name: 'production-vn',
      cidr: '10.0.0.0/16',
      region: 'Vietnam (VN-01)',
      subnets: 3,
      instances: 12,
      status: 'Active',
    },
    {
      id: 'vpc-002',
      name: 'staging-eu',
      cidr: '10.1.0.0/16',
      region: 'Germany (EU-01)',
      subnets: 2,
      instances: 5,
      status: 'Active',
    },
    {
      id: 'vpc-003',
      name: 'backup-us',
      cidr: '10.2.0.0/16',
      region: 'USA West (US-01)',
      subnets: 1,
      instances: 3,
      status: 'Active',
    },
  ]

  const firewallRules = [
    {
      id: 'fw-001',
      name: 'Allow SSH',
      direction: 'Inbound',
      protocol: 'TCP',
      port: '22',
      source: '0.0.0.0/0',
      action: 'Allow',
      enabled: true,
    },
    {
      id: 'fw-002',
      name: 'Allow HTTP',
      direction: 'Inbound',
      protocol: 'TCP',
      port: '80',
      source: '0.0.0.0/0',
      action: 'Allow',
      enabled: true,
    },
    {
      id: 'fw-003',
      name: 'Allow HTTPS',
      direction: 'Inbound',
      protocol: 'TCP',
      port: '443',
      source: '0.0.0.0/0',
      action: 'Allow',
      enabled: true,
    },
    {
      id: 'fw-004',
      name: 'Allow Database',
      direction: 'Inbound',
      protocol: 'TCP',
      port: '5432',
      source: '10.0.0.0/16',
      action: 'Allow',
      enabled: true,
    },
    {
      id: 'fw-005',
      name: 'Block Telnet',
      direction: 'Inbound',
      protocol: 'TCP',
      port: '23',
      source: '0.0.0.0/0',
      action: 'Deny',
      enabled: true,
    },
  ]

  const loadBalancers = [
    {
      id: 'lb-001',
      name: 'web-lb-01',
      type: 'Application LB',
      status: 'Active',
      protocol: 'HTTP/HTTPS',
      instances: 3,
      trafficMonth: '2.5 TB',
    },
    {
      id: 'lb-002',
      name: 'api-lb-01',
      type: 'Application LB',
      status: 'Active',
      protocol: 'HTTPS',
      instances: 5,
      trafficMonth: '8.2 TB',
    },
    {
      id: 'lb-003',
      name: 'database-nlb-01',
      type: 'Network LB',
      status: 'Active',
      protocol: 'TCP',
      instances: 2,
      trafficMonth: '15.8 TB',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-600 space-x-2">
        <span>Console</span>
        <span>&gt;</span>
        <span>Networking</span>
      </div>

      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Networking</h1>
          <p className="text-slate-400 text-sm mt-2">VPCs, firewalls, and load balancers</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New VPC
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b" style={{ borderColor: 'rgba(71, 85, 105, 0.2)' }}>
        {[
          { id: 'vpcs', label: 'VPCs' },
          { id: 'firewall', label: 'Firewall Rules' },
          { id: 'loadbalancers', label: 'Load Balancers' },
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

      {/* VPCs */}
      {activeTab === 'vpcs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vpcs.map((vpc) => (
            <div
              key={vpc.id}
              className="rounded-lg p-4 border hover:border-blue-500/30 transition-all"
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.4)',
                borderColor: 'rgba(71, 85, 105, 0.2)',
              }}
            >
              <h4 className="text-white font-mono font-medium">{vpc.name}</h4>
              <div className="space-y-2 mt-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">CIDR:</span>
                  <span className="text-slate-300 font-mono">{vpc.cidr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Region:</span>
                  <span className="text-slate-300">{vpc.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Subnets:</span>
                  <span className="text-slate-300">{vpc.subnets}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Instances:</span>
                  <span className="text-slate-300">{vpc.instances}</span>
                </div>
              </div>
              <div className="mt-3">
                <span
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    color: '#86efac',
                  }}
                >
                  {vpc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Firewall Rules */}
      {activeTab === 'firewall' && (
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
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Direction</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Protocol</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Port</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Source</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Action</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {firewallRules.map((rule) => (
                  <tr
                    key={rule.id}
                    style={{ borderColor: 'rgba(71, 85, 105, 0.2)' }}
                    className="border-b hover:bg-slate-900/20 transition-colors"
                  >
                    <td className="px-6 py-4 text-white">{rule.name}</td>
                    <td className="px-6 py-4 text-slate-400">{rule.direction}</td>
                    <td className="px-6 py-4 text-slate-400">{rule.protocol}</td>
                    <td className="px-6 py-4 font-mono text-slate-400">{rule.port}</td>
                    <td className="px-6 py-4 font-mono text-slate-400 text-xs">{rule.source}</td>
                    <td className="px-6 py-4">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: rule.action === 'Allow' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: rule.action === 'Allow' ? '#86efac' : '#fca5a5',
                        }}
                      >
                        {rule.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-slate-400 hover:text-slate-200">
                        <Shield className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Load Balancers */}
      {activeTab === 'loadbalancers' && (
        <div className="space-y-4">
          {loadBalancers.map((lb) => (
            <div
              key={lb.id}
              className="rounded-lg p-4 border hover:border-blue-500/30 transition-all"
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.4)',
                borderColor: 'rgba(71, 85, 105, 0.2)',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-white font-mono font-medium">{lb.name}</h4>
                  <p className="text-slate-600 text-sm mt-1">Type: {lb.type}</p>
                </div>
                <span
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    color: '#86efac',
                  }}
                >
                  {lb.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-600">Protocol</p>
                  <p className="text-slate-300 font-mono">{lb.protocol}</p>
                </div>
                <div>
                  <p className="text-slate-600">Instances</p>
                  <p className="text-slate-300">{lb.instances}</p>
                </div>
                <div>
                  <p className="text-slate-600">Traffic/Month</p>
                  <p className="text-slate-300">{lb.trafficMonth}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'

import {
  Activity,
  ArrowUpRight,
  CheckCircle,
  ChevronRight,
  Globe,
  Layers3,
  MonitorCog,
  RefreshCw,
  Server,
  Shield,
  Sparkles,
  TriangleAlert,
  TrendingUp,
  Zap,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { DemoState, DomainSectionMap, Node, Region, SimulationScenario, LiveFeedItem } from '@/types'
import {
  DomainHero,
  GlassCard,
  InfoTile,
  MetricCard,
  MiniSparkline,
  ProgressLine,
  SectionTabs,
  StatValue,
  buildTelemetryBars,
  handleCardKeyDown,
  nodeBadgeClass,
  pulseValue,
  resourcePulse,
} from './shared'

type AdminSection = DomainSectionMap['admin']

interface AdminDomainPanelProps {
  state: DemoState
  section: AdminSection
  selectedNode: Node
  selectedRegion: Region
  liveTick: number
  scenario: SimulationScenario
  liveFeed: LiveFeedItem[]
  onSectionChange: (section: AdminSection) => void
  onSelectNode: (nodeId: string) => void
  onNodePatch: (nodeId: string, patch: Partial<Node>) => void
  onToggleLicense: () => void
  onOpenNodeModal: () => void
}

const sections: { id: AdminSection; label: string; icon: typeof Sparkles }[] = [
  { id: 'overview', label: 'Overview', icon: Sparkles },
  { id: 'fleet', label: 'Fleet', icon: Layers3 },
  { id: 'license', label: 'License', icon: Shield },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
]

export function AdminDomainPanel({
  state,
  section,
  selectedNode,
  selectedRegion,
  liveTick,
  scenario,
  liveFeed,
  onSectionChange,
  onSelectNode,
  onNodePatch,
  onToggleLicense,
  onOpenNodeModal,
}: AdminDomainPanelProps) {
  const onlineNodes = state.nodes.filter((n) => n.status !== 'offline').length
  const totalInstances = state.nodes.reduce((sum, n) => sum + n.instanceCount, 0)
  const mrr = state.instances.reduce((sum, i) => sum + i.priceMonthly, 0)
  const fleetHealth = pulseValue(96.4, liveTick, scenario === 'traffic-spike' ? 4.8 : 1.6).toFixed(1)

  return (
    <div className="space-y-6">
      <DomainHero
        eyebrow="The God View"
        title="Admin Control Plane"
        description="Quản lý license, fleet node, và chính sách nền tảng NexusPlane. Mọi thứ trong một màn hình."
        stats={[
          { label: 'Nodes online', value: `${onlineNodes}/${state.nodes.length}` },
          { label: 'Total instances', value: String(totalInstances) },
          { label: 'MRR (demo)', value: `$${mrr}/mo` },
        ]}
        actions={
          <>
            <Button
              variant="outline"
              className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/5"
              onClick={onToggleLicense}
            >
              <Shield className="size-4" />
              {state.license.readOnly ? 'Restore License' : 'Expire License'}
            </Button>
            <Button className="bg-blue-500 text-white hover:bg-blue-400 shadow-lg shadow-blue-500/20" onClick={onOpenNodeModal}>
              <Sparkles className="size-4" />
              Provision Node
            </Button>
          </>
        }
      />

      <SectionTabs sections={sections} activeSection={section} onChange={onSectionChange} />

      {section === 'overview' && (
        <AdminOverview
          state={state}
          liveTick={liveTick}
          scenario={scenario}
          fleetHealth={fleetHealth}
          liveFeed={liveFeed}
          onToggleLicense={onToggleLicense}
        />
      )}
      {section === 'fleet' && (
        <AdminFleet
          state={state}
          selectedNode={selectedNode}
          selectedRegion={selectedRegion}
          liveTick={liveTick}
          scenario={scenario}
          onSelectNode={onSelectNode}
          onNodePatch={onNodePatch}
          onOpenNodeModal={onOpenNodeModal}
        />
      )}
      {section === 'license' && <AdminLicense state={state} onToggleLicense={onToggleLicense} />}
      {section === 'analytics' && (
        <AdminAnalytics state={state} liveTick={liveTick} scenario={scenario} liveFeed={liveFeed} />
      )}
    </div>
  )
}

function AdminOverview({
  state,
  liveTick,
  scenario,
  fleetHealth,
  liveFeed,
  onToggleLicense,
}: {
  state: DemoState
  liveTick: number
  scenario: SimulationScenario
  fleetHealth: string
  liveFeed: LiveFeedItem[]
  onToggleLicense: () => void
}) {
  const degradedCount = state.nodes.filter((n) => n.status === 'degraded').length
  const avgLoad = Math.round(state.nodes.reduce((s, n) => s + n.load, 0) / Math.max(state.nodes.length, 1))

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Fleet health"
          value={`${fleetHealth}%`}
          hint="Based on live node signals"
          tone="emerald"
          delta="+0.3%"
        />
        <MetricCard
          label="Avg node load"
          value={`${avgLoad}%`}
          hint={scenario === 'traffic-spike' ? 'Traffic spike active' : 'Normal operations'}
          tone="blue"
        />
        <MetricCard
          label="License mode"
          value={state.license.readOnly ? 'Read-only' : 'Live'}
          hint={state.license.key}
          tone={state.license.readOnly ? 'pink' : 'emerald'}
        />
        <MetricCard
          label="Signal window"
          value={`${18 + (liveTick % 5)}s`}
          hint={liveFeed[0]?.title ?? 'Signals stable'}
          tone="purple"
        />
      </div>

      {/* Main grid */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* Node health grid */}
        <GlassCard title="Node fleet snapshot" description="Trạng thái tức thì của toàn bộ node trong fleet.">
          <div className="grid gap-3 sm:grid-cols-2">
            {state.nodes.map((node) => {
              const bars = buildTelemetryBars(node.load, liveTick, scenario)
              return (
                <div
                  key={node.id}
                  className={cn(
                    'rounded-2xl border p-4 transition-all',
                    node.status === 'degraded'
                      ? 'border-pink-500/20 bg-pink-500/5'
                      : node.status === 'maintenance'
                        ? 'border-amber-500/20 bg-amber-500/5'
                        : 'border-white/5 bg-white/[0.03]',
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{node.name}</p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">{node.provider}</p>
                    </div>
                    <Badge className={nodeBadgeClass(node.status)}>{node.status}</Badge>
                  </div>
                  <MiniSparkline
                    values={bars}
                    tone={node.status === 'degraded' ? 'pink' : 'blue'}
                    height={36}
                  />
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono">{node.ip}</span>
                    <span>{node.load}% load</span>
                  </div>
                </div>
              )
            })}
          </div>
          {degradedCount > 0 && (
            <div className="flex items-center gap-2 rounded-2xl border border-pink-500/20 bg-pink-500/5 px-4 py-3 text-sm text-pink-200">
              <TriangleAlert className="size-4 shrink-0" />
              {degradedCount} node đang ở trạng thái degraded — cần kiểm tra ngay.
            </div>
          )}
        </GlassCard>

        {/* Right column */}
        <div className="space-y-4">
          {/* License status */}
          <GlassCard
            title="License status"
            description="Control visibility còn active; destructive admin actions có thể bị khoá ngay lập tức."
          >
            <div
              className={cn(
                'rounded-2xl border p-4',
                state.license.readOnly
                  ? 'border-amber-500/20 bg-amber-500/10'
                  : 'border-emerald-500/20 bg-emerald-500/10',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{state.license.plan}</p>
                  <p className="mt-1 font-mono text-xs text-slate-400">{state.license.key}</p>
                </div>
                <Badge
                  className={
                    state.license.readOnly
                      ? 'bg-amber-500/20 text-amber-200'
                      : 'bg-emerald-500/20 text-emerald-200'
                  }
                >
                  {state.license.readOnly ? 'Read-only' : 'Active'}
                </Badge>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-400">
                <StatValue label="Seats" value={String(state.license.seats)} />
                <StatValue label="Version" value={state.license.version} />
                <StatValue label="Expires" value={state.license.expiresAt.slice(0, 7)} />
              </div>
            </div>
            <Button
              className="w-full bg-slate-900 text-white hover:bg-slate-800"
              onClick={onToggleLicense}
            >
              {state.license.readOnly ? 'Restore to Live' : 'Simulate Expiry'}
            </Button>
          </GlassCard>

          {/* Alert feed */}
          <GlassCard title="Recent alerts" description="Tín hiệu quan trọng nhất cần xử lý.">
            <div className="space-y-2">
              {state.alerts.slice(0, 4).map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    'flex items-start gap-3 rounded-2xl border px-4 py-3',
                    alert.severity === 'critical'
                      ? 'border-rose-500/20 bg-rose-500/10 text-rose-100'
                      : alert.severity === 'warning'
                        ? 'border-amber-500/20 bg-amber-500/10 text-amber-100'
                        : 'border-sky-500/20 bg-sky-500/10 text-sky-100',
                  )}
                >
                  {alert.severity === 'critical' ? (
                    <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                  ) : alert.severity === 'warning' ? (
                    <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                  ) : (
                    <CheckCircle className="mt-0.5 size-4 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="mt-0.5 text-xs opacity-75">{alert.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

function AdminFleet({
  state,
  selectedNode,
  selectedRegion,
  liveTick,
  scenario,
  onSelectNode,
  onNodePatch,
  onOpenNodeModal,
}: {
  state: DemoState
  selectedNode: Node
  selectedRegion: Region
  liveTick: number
  scenario: SimulationScenario
  onSelectNode: (id: string) => void
  onNodePatch: (id: string, patch: Partial<Node>) => void
  onOpenNodeModal: () => void
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)]">
      <div className="space-y-4">
        {/* Fleet header */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            {state.nodes.length} nodes · {state.nodes.filter((n) => n.status === 'online').length} online
          </p>
          <Button
            variant="outline"
            className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/5"
            onClick={onOpenNodeModal}
          >
            <Sparkles className="size-4" />
            Add node
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {state.nodes.map((node) => (
            <NodeCard
              key={node.id}
              node={node}
              region={state.regions.find((r) => r.id === node.regionId)}
              selected={selectedNode.id === node.id}
              liveTick={liveTick}
              scenario={scenario}
              onSelect={() => onSelectNode(node.id)}
              onNodePatch={onNodePatch}
            />
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <div className="space-y-4">
        <GlassCard
          title={selectedNode.name}
          description={`${selectedRegion.datacenter} · ${selectedNode.provider}`}
        >
          <div className="space-y-4">
            {/* Status badge */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Status</span>
              <Badge className={nodeBadgeClass(selectedNode.status)}>{selectedNode.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InfoTile label="Region" value={selectedRegion.name} />
              <InfoTile label="Datacenter" value={selectedRegion.datacenter} />
              <InfoTile label="Uptime" value={`${selectedNode.uptimeDays}d`} />
              <InfoTile label="Instances" value={String(selectedNode.instanceCount)} />
              <InfoTile label="Agent mode" value={selectedNode.agentMode.toUpperCase()} />
              <InfoTile label="OS" value={selectedNode.os} />
            </div>

            <InfoTile label="Hardware ID" value={selectedNode.hardwareId} mono />

            <div className="space-y-3">
              <ProgressLine
                label="CPU pressure"
                value={resourcePulse(selectedNode.load, liveTick, scenario, 6)}
                tone="blue"
              />
              <ProgressLine
                label="Memory"
                value={resourcePulse(selectedNode.ramGb / 2.56, liveTick + 1, scenario, 8)}
                tone="purple"
              />
              <ProgressLine
                label="Storage"
                value={resourcePulse(selectedNode.storageTb / 0.024, liveTick + 2, scenario, 5)}
                tone="pink"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedNode.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid gap-2">
              <Button
                variant="outline"
                className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/5"
                onClick={() => onNodePatch(selectedNode.id, { load: Math.min(selectedNode.load + 6, 99) })}
              >
                <RefreshCw className="size-4" />
                Sync load
              </Button>
              <Button
                variant="outline"
                className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/5"
                onClick={() =>
                  onNodePatch(selectedNode.id, {
                    status: selectedNode.status === 'maintenance' ? 'online' : 'maintenance',
                  })
                }
              >
                <MonitorCog className="size-4" />
                {selectedNode.status === 'maintenance' ? 'Restore node' : 'Set maintenance'}
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Region info */}
        <GlassCard title="Region info" description="Thông tin datacenter của node đang chọn.">
          <div className="space-y-3">
            <InfoTile label="Country" value={selectedRegion.country} />
            <InfoTile label="Timezone" value={selectedRegion.timezone} />
            <InfoTile label="Code" value={selectedRegion.code} />
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

function NodeCard({
  node,
  region,
  selected,
  liveTick,
  scenario,
  onSelect,
  onNodePatch,
}: {
  node: Node
  region: Region | undefined
  selected: boolean
  liveTick: number
  scenario: SimulationScenario
  onSelect: () => void
  onNodePatch: (id: string, patch: Partial<Node>) => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => handleCardKeyDown(e, onSelect)}
      className={cn(
        'group rounded-[1.5rem] border p-4 text-left transition-all outline-none cursor-pointer',
        selected
          ? 'border-blue-500/30 bg-blue-500/10 shadow-lg shadow-blue-500/10'
          : 'border-white/5 bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.05]',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Server className="size-4 text-slate-500" />
            <p className="text-base font-semibold text-white">{node.name}</p>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {node.provider} · {region?.name ?? node.regionId}
          </p>
          <p className="mt-1.5 font-mono text-xs text-slate-400">{node.ip}</p>
        </div>
        <Badge className={nodeBadgeClass(node.status)}>{node.status}</Badge>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <StatValue label="CPU" value={`${node.cpuCores}C`} />
        <StatValue label="RAM" value={`${node.ramGb}GB`} />
        <StatValue label="Load" value={`${node.load}%`} />
      </div>

      <div className="mt-3 h-1.5 rounded-full bg-white/5">
        <div
          className={cn(
            'h-1.5 rounded-full transition-all duration-700',
            node.status === 'degraded' ? 'bg-pink-500' : 'bg-blue-500',
          )}
          style={{ width: `${node.load}%` }}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {node.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-slate-400"
          >
            {tag}
          </span>
        ))}
      </div>

      <div
        className="mt-4 flex items-center justify-between gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-white"
          onClick={() => onNodePatch(node.id, { load: Math.min(node.load + 6, 99) })}
        >
          <RefreshCw className="size-3.5" />
          Sync
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-white"
          onClick={() =>
            onNodePatch(node.id, {
              status: node.status === 'maintenance' ? 'online' : 'maintenance',
            })
          }
        >
          <MonitorCog className="size-3.5" />
          {node.status === 'maintenance' ? 'Restore' : 'Maintenance'}
        </button>
      </div>
    </div>
  )
}

function AdminLicense({
  state,
  onToggleLicense,
}: {
  state: DemoState
  onToggleLicense: () => void
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <GlassCard
        title="License ledger"
        description="Chế độ read-only chỉ chặn phần điều khiển admin, không chạm đến khách cuối."
      >
        <div className="space-y-4">
          {/* Main license row */}
          <div
            className={cn(
              'rounded-2xl border p-5',
              state.license.readOnly
                ? 'border-amber-500/20 bg-amber-500/10'
                : 'border-emerald-500/20 bg-emerald-500/10',
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-white">{state.license.plan}</p>
                <p className="mt-1.5 font-mono text-sm text-slate-300">{state.license.key}</p>
              </div>
              <Badge
                className={
                  state.license.readOnly
                    ? 'bg-amber-500/20 text-amber-200'
                    : 'bg-emerald-500/20 text-emerald-200'
                }
              >
                {state.license.readOnly ? 'Read-only' : 'Active'}
              </Badge>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <InfoTile label="Hardware lock (HWID)" value={state.license.hwid} mono />
              <InfoTile label="Version" value={state.license.version} />
              <InfoTile label="Seats" value={String(state.license.seats)} />
              <InfoTile label="Expires" value={state.license.expiresAt} />
            </div>
          </div>

          {/* Zero-hostage note */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-amber-200">
              <TriangleAlert className="size-4" />
              Zero-hostage mode
            </div>
            <p className="mt-2.5 text-sm leading-6 text-amber-100/80">
              Khi license hết hạn, UI chỉ khoá thao tác admin. VPS của khách hàng cuối{' '}
              <strong className="text-amber-200">vẫn vận hành bình thường</strong> — không có data loss.
            </p>
          </div>

          <Button
            className="w-full bg-slate-900 text-white hover:bg-slate-800"
            onClick={onToggleLicense}
          >
            <Shield className="size-4" />
            {state.license.readOnly ? 'Turn license back on' : 'Simulate expiry'}
          </Button>
        </div>
      </GlassCard>

      {/* Policy toggle */}
      <div className="space-y-4">
        <GlassCard
          title="Policy signals"
          description="Các tín hiệu ảnh hưởng đến quyền điều khiển."
        >
          <div className="space-y-3">
            {state.alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  'rounded-2xl border px-4 py-3',
                  alert.severity === 'critical'
                    ? 'border-rose-500/20 bg-rose-500/10 text-rose-100'
                    : alert.severity === 'warning'
                      ? 'border-amber-500/20 bg-amber-500/10 text-amber-100'
                      : 'border-sky-500/20 bg-sky-500/10 text-sky-100',
                )}
              >
                <p className="text-sm font-medium">{alert.title}</p>
                <p className="mt-1 text-xs opacity-75">{alert.detail}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-wider opacity-60">
                  <span>{alert.targetType}</span>
                  <span>{alert.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Platform health */}
        <GlassCard title="Platform health" description="">
          <div className="space-y-3">
            {[
              { label: 'API gateway', value: 99.9 },
              { label: 'Auth service', value: 100 },
              { label: 'Billing pipeline', value: 98.7 },
              { label: 'Provisioner', value: 97.2 },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'size-2 rounded-full',
                      item.value >= 99 ? 'bg-emerald-400' : item.value >= 98 ? 'bg-amber-400' : 'bg-rose-400',
                    )}
                  />
                  <span className="text-slate-300">{item.label}</span>
                </div>
                <span className="font-mono text-xs text-slate-400">{item.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

function AdminAnalytics({
  state,
  liveTick,
  scenario,
  liveFeed,
}: {
  state: DemoState
  liveTick: number
  scenario: SimulationScenario
  liveFeed: LiveFeedItem[]
}) {
  const [selectedMetric, setSelectedMetric] = useState<'load' | 'instances' | 'revenue'>('load')

  const metrics = [
    { id: 'load' as const, label: 'CPU Load', icon: Activity },
    { id: 'instances' as const, label: 'Instances', icon: Globe },
    { id: 'revenue' as const, label: 'Revenue', icon: TrendingUp },
  ]

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total nodes" value={String(state.nodes.length)} hint="Fleet size" tone="blue" />
        <MetricCard
          label="Running instances"
          value={String(state.instances.filter((i) => i.status === 'running').length)}
          hint="Across all nodes"
          tone="emerald"
        />
        <MetricCard
          label="Monthly revenue"
          value={`$${state.instances.reduce((s, i) => s + i.priceMonthly, 0)}`}
          hint="Demo MRR snapshot"
          tone="purple"
          delta={scenario === 'revenue-push' ? '+12%' : '+4%'}
        />
        <MetricCard
          label="Alerts active"
          value={String(state.alerts.filter((a) => !a.resolved).length)}
          hint="Pending resolution"
          tone="pink"
        />
      </div>

      {/* Chart area */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <GlassCard title="Fleet telemetry" description="Sparkline per node — backend cần gắn websocket vào đây.">
          {/* Metric selector */}
          <div className="mb-4 flex gap-2">
            {metrics.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedMetric(id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium transition-all',
                  selectedMetric === id
                    ? 'bg-blue-500/20 text-blue-200'
                    : 'text-slate-500 hover:text-white',
                )}
              >
                <Icon className="size-3.5" />
                {label}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {state.nodes.map((node) => {
              const bars = buildTelemetryBars(node.load, liveTick, scenario)
              const tone = node.status === 'degraded' ? 'pink' : node.status === 'maintenance' ? 'purple' : 'blue'
              return (
                <div key={node.id} className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <p className="text-sm font-medium text-white">{node.name}</p>
                    <Badge className={nodeBadgeClass(node.status)}>{node.status}</Badge>
                  </div>
                  <MiniSparkline values={bars} tone={tone} height={52} />
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{node.instanceCount} instances</span>
                    <span className="font-mono">{node.load}% avg</span>
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>

        {/* Operations log */}
        <GlassCard title="Operations log" description="Những thay đổi gần nhất trong admin plane.">
          <div className="space-y-3">
            {liveFeed
              .filter((item) => item.domain === 'admin' || item.domain === 'system')
              .slice(0, 6)
              .map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/5 bg-white/[0.03] p-4"
                >
                  <div className="flex items-start gap-3">
                    <Zap
                      className={cn(
                        'mt-0.5 size-4 shrink-0',
                        item.tone === 'warning' ? 'text-amber-300' : 'text-blue-300',
                      )}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{item.title}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-400">{item.detail}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-wider text-slate-600">
                        <span>{item.timestamp}</span>
                        <span className="flex items-center gap-1">
                          {item.cta}
                          <ChevronRight className="size-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </GlassCard>
      </div>

      {/* Node comparison table */}
      <GlassCard title="Node comparison" description="So sánh tài nguyên toàn fleet.">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-slate-500">
                <th className="pb-3 text-left font-medium">Node</th>
                <th className="pb-3 text-left font-medium">Provider</th>
                <th className="pb-3 text-left font-medium">CPU</th>
                <th className="pb-3 text-left font-medium">RAM</th>
                <th className="pb-3 text-left font-medium">Load</th>
                <th className="pb-3 text-left font-medium">Uptime</th>
                <th className="pb-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {state.nodes.map((node) => (
                <tr key={node.id} className="text-slate-300">
                  <td className="py-3 font-medium text-white">{node.name}</td>
                  <td className="py-3 text-slate-400">{node.provider}</td>
                  <td className="py-3 font-mono">{node.cpuCores}C</td>
                  <td className="py-3 font-mono">{node.ramGb}GB</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-white/5">
                        <div
                          className={cn(
                            'h-1.5 rounded-full',
                            node.load > 80
                              ? 'bg-rose-500'
                              : node.load > 60
                                ? 'bg-amber-500'
                                : 'bg-blue-500',
                          )}
                          style={{ width: `${node.load}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs">{node.load}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-400">{node.uptimeDays}d</td>
                  <td className="py-3">
                    <Badge className={nodeBadgeClass(node.status)}>{node.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}

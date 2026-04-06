import { useState } from 'react'

import {
  Activity,
  ArrowRight,
  Box,
  Database,
  Flame,
  Globe,
  HardDrive,
  Layers,
  MonitorCog,
  Network,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  Shield,
  Terminal,
  TriangleAlert,
  Wifi,
  Zap,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type {
  DemoState,
  DomainSectionMap,
  Instance,
  LiveFeedItem,
  Node,
  Region,
  SimulationScenario,
} from '@/types'

import {
  DomainHero,
  GlassCard,
  InfoTile,
  MetricCard,
  MiniSparkline,
  ProgressLine,
  SectionTabs,
  StatValue,
  activityToneClass,
  buildTelemetryBars,
  handleCardKeyDown,
  nodeBadgeClass,
  resourcePulse,
  statusClass,
} from './shared'

type PanelSection = DomainSectionMap['panel']

interface PanelDomainPanelProps {
  state: DemoState
  section: PanelSection
  selectedInstance: Instance
  selectedRegion: Region
  selectedNode: Node | undefined
  liveTick: number
  scenario: SimulationScenario
  liveFeed: LiveFeedItem[]
  onSectionChange: (section: PanelSection) => void
  onSelectInstance: (instanceId: string) => void
  onInstanceAction: (instanceId: string, action: 'start' | 'stop' | 'restart' | 'delete') => void
  onOpenDeployModal: () => void
  onOpenTerminal: (instance: Instance) => void
}

const sections: { id: PanelSection; label: string; icon: typeof MonitorCog }[] = [
  { id: 'instances', label: 'Instances', icon: MonitorCog },
  { id: 'images', label: 'Images', icon: HardDrive },
  { id: 'networking', label: 'Networking', icon: Database },
  { id: 'activity', label: 'Activity', icon: Activity },
]

export function PanelDomainPanel({
  state,
  section,
  selectedInstance,
  selectedRegion,
  selectedNode,
  liveTick,
  scenario,
  liveFeed,
  onSectionChange,
  onSelectInstance,
  onInstanceAction,
  onOpenDeployModal,
  onOpenTerminal,
}: PanelDomainPanelProps) {
  const all = state.instances
  const running = all.filter((i) => i.status === 'running').length
  const stopped = all.filter((i) => i.status === 'stopped').length

  return (
    <div className="space-y-6">
      <DomainHero
        eyebrow="Pterodactyl in a suit"
        title="Control Plane"
        description="Vận hành hàng ngày: thao tác nhanh, ưu tiên danh sách instances và console bridge."
        stats={[
          { label: 'Total instances', value: String(all.length) },
          { label: 'Running', value: String(running) },
          { label: 'Stopped', value: String(stopped) },
        ]}
        actions={
          <Button
            className="bg-blue-500 text-white hover:bg-blue-400 shadow-lg shadow-blue-500/20"
            onClick={onOpenDeployModal}
          >
            <MonitorCog className="size-4" />
            Deploy Instance
          </Button>
        }
      />

      <SectionTabs sections={sections} activeSection={section} onChange={onSectionChange} />

      {section === 'instances' && (
        <InstancesSection
          state={state}
          selectedInstance={selectedInstance}
          selectedRegion={selectedRegion}
          selectedNode={selectedNode}
          liveTick={liveTick}
          scenario={scenario}
          onSelectInstance={onSelectInstance}
          onInstanceAction={onInstanceAction}
          onOpenDeployModal={onOpenDeployModal}
          onOpenTerminal={onOpenTerminal}
        />
      )}
      {section === 'images' && (
        <ImagesSection liveTick={liveTick} scenario={scenario} onOpenDeployModal={onOpenDeployModal} />
      )}
      {section === 'networking' && (
        <NetworkingSection liveTick={liveTick} scenario={scenario} />
      )}
      {section === 'activity' && (
        <ActivitySection liveFeed={liveFeed} />
      )}
    </div>
  )
}

// ─── Instances ────────────────────────────────────────────────────────────────

function InstancesSection({
  state,
  selectedInstance,
  selectedRegion,
  selectedNode,
  liveTick,
  scenario,
  onSelectInstance,
  onInstanceAction,
  onOpenDeployModal,
  onOpenTerminal,
}: {
  state: DemoState
  selectedInstance: Instance
  selectedRegion: Region
  selectedNode: Node | undefined
  liveTick: number
  scenario: SimulationScenario
  onSelectInstance: (id: string) => void
  onInstanceAction: (id: string, action: 'start' | 'stop' | 'restart' | 'delete') => void
  onOpenDeployModal: () => void
  onOpenTerminal: (i: Instance) => void
}) {
  const filtered = state.instances.filter((i) => {
    const q = state.searchQuery.trim().toLowerCase()
    if (!q) return true
    return [i.name, i.ip, i.os, i.ownerName, i.status, i.kind].some((f) =>
      f.toLowerCase().includes(q),
    )
  })

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.85fr)]">
      {/* Instance grid */}
      <div className="space-y-3">
        {/* Quick stats bar */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'VPS', value: filtered.filter((i) => i.kind === 'vps').length, icon: Server },
            { label: 'Game', value: filtered.filter((i) => i.kind === 'game').length, icon: Flame },
            { label: 'App', value: filtered.filter((i) => i.kind === 'app').length, icon: Box },
            { label: 'Provisioning', value: filtered.filter((i) => i.status === 'provisioning').length, icon: Zap },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
              <div className="flex items-center gap-2 text-slate-500">
                <Icon className="size-3.5" />
                <span className="text-[11px] uppercase tracking-wider">{label}</span>
              </div>
              <p className="mt-2 text-xl font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((instance) => (
            <InstanceCard
              key={instance.id}
              instance={instance}
              node={state.nodes.find((n) => n.id === instance.nodeId)}
              region={state.regions.find((r) => r.id === instance.regionId)}
              selected={selectedInstance.id === instance.id}
              liveTick={liveTick}
              scenario={scenario}
              onSelect={() => onSelectInstance(instance.id)}
              onPower={(action) => onInstanceAction(instance.id, action)}
              onOpenTerminal={() => onOpenTerminal(instance)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-white/10 py-16 text-center">
            <MonitorCog className="size-10 text-slate-600" />
            <p className="text-slate-400">Không tìm thấy instance nào</p>
            <Button
              variant="outline"
              className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/5"
              onClick={onOpenDeployModal}
            >
              Deploy instance mới
            </Button>
          </div>
        )}
      </div>

      {/* Detail panel */}
      <div className="space-y-4">
        <GlassCard
          title={selectedInstance.name}
          description={`${selectedRegion.name} · ${selectedNode?.name ?? 'Unknown node'}`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Runtime status</span>
              <Badge className={statusClass(selectedInstance.status)}>
                {formatStatus(selectedInstance.status)}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoTile label="IP" value={selectedInstance.ip} mono />
              <InfoTile label="OS" value={selectedInstance.os} />
              <InfoTile label="CPU" value={`${selectedInstance.cpuCores} vCPU`} />
              <InfoTile label="RAM" value={`${selectedInstance.ramGb} GB`} />
              <InfoTile label="Storage" value={`${selectedInstance.storageGb} GB`} />
              <InfoTile label="Price" value={`$${selectedInstance.priceMonthly}/mo`} />
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
              <p className="mb-3 text-xs uppercase tracking-wider text-slate-500">Resource pressure</p>
              <div className="space-y-3">
                <ProgressLine
                  label="Boot progress"
                  value={bootProgress(selectedInstance.status, liveTick)}
                  tone="blue"
                />
                <ProgressLine
                  label="Memory"
                  value={resourcePulse(selectedInstance.ramGb * 8, liveTick + 1, scenario, 14)}
                  tone="purple"
                />
                <ProgressLine
                  label="Disk I/O"
                  value={resourcePulse(Math.min(selectedInstance.storageGb / 2, 92), liveTick + 3, scenario, 9)}
                  tone="pink"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/5"
                  onClick={() => onInstanceAction(selectedInstance.id, 'restart')}
                >
                  <RefreshCw className="size-4" />
                  Restart
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/5"
                  onClick={() =>
                    onInstanceAction(
                      selectedInstance.id,
                      selectedInstance.status === 'running' ? 'stop' : 'start',
                    )
                  }
                >
                  {selectedInstance.status === 'running' ? (
                    <PauseCircle className="size-4" />
                  ) : (
                    <PlayCircle className="size-4" />
                  )}
                  {selectedInstance.status === 'running' ? 'Stop' : 'Start'}
                </Button>
              </div>
              <Button
                className="w-full bg-slate-900 text-white hover:bg-slate-800"
                onClick={() => onOpenTerminal(selectedInstance)}
              >
                <Terminal className="size-4" />
                Open Console
              </Button>
              <button
                type="button"
                onClick={() => onInstanceAction(selectedInstance.id, 'delete')}
                className="w-full rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-2.5 text-sm text-rose-300 transition-colors hover:bg-rose-500/10"
              >
                Delete instance
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Node info */}
        {selectedNode && (
          <GlassCard title="Node info" description="Node đang host instance này.">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white">{selectedNode.name}</p>
                <Badge className={nodeBadgeClass(selectedNode.status)}>{selectedNode.status}</Badge>
              </div>
              <MiniSparkline
                values={buildTelemetryBars(selectedNode.load, liveTick, scenario)}
                tone="blue"
                height={40}
              />
              <InfoTile label="Node load" value={`${selectedNode.load}%`} />
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  )
}

function InstanceCard({
  instance,
  node,
  region,
  selected,
  liveTick,
  scenario,
  onSelect,
  onPower,
  onOpenTerminal,
}: {
  instance: Instance
  node: Node | undefined
  region: Region | undefined
  selected: boolean
  liveTick: number
  scenario: SimulationScenario
  onSelect: () => void
  onPower: (action: 'start' | 'stop' | 'restart') => void
  onOpenTerminal: () => void
}) {
  const kindIcon =
    instance.kind === 'game' ? Flame : instance.kind === 'app' ? Box : Server

  const KindIcon = kindIcon

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
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <KindIcon className="size-3.5 shrink-0 text-slate-500" />
            <p className="truncate text-sm font-semibold text-white">{instance.name}</p>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {instance.os} · {region?.code ?? instance.regionId}
          </p>
          <p className="mt-1.5 font-mono text-xs text-slate-400">{instance.ip}</p>
        </div>
        <Badge className={statusClass(instance.status)}>{formatStatus(instance.status)}</Badge>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <StatValue label="CPU" value={`${instance.cpuCores}C`} />
        <StatValue label="RAM" value={`${instance.ramGb}GB`} />
        <StatValue label="Disk" value={`${instance.storageGb}GB`} />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>{node?.name ?? instance.nodeId}</span>
        <span className="font-mono">${instance.priceMonthly}/mo</span>
      </div>

      <div
        className="mt-3 flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-300 transition-colors hover:bg-white/5"
          onClick={onOpenTerminal}
        >
          <Terminal className="size-3.5" />
          Console
        </button>
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          onClick={() => onPower(instance.status === 'running' ? 'stop' : 'start')}
        >
          {instance.status === 'running' ? (
            <PauseCircle className="size-4" />
          ) : (
            <PlayCircle className="size-4" />
          )}
        </button>
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          onClick={() => onPower('restart')}
        >
          <RefreshCw className="size-4" />
        </button>
      </div>
    </div>
  )
}

// ─── Images ───────────────────────────────────────────────────────────────────

function ImagesSection({
  liveTick,
  scenario,
  onOpenDeployModal,
}: {
  liveTick: number
  scenario: SimulationScenario
  onOpenDeployModal: () => void
}) {
  const images = [
    {
      id: 'ubuntu',
      title: 'Ubuntu 24.04 LTS',
      desc: 'Stable VPS template',
      version: '24.04',
      arch: 'x86_64 · arm64',
      size: '1.2 GB',
      tone: 'blue' as const,
    },
    {
      id: 'debian',
      title: 'Debian 12 Bookworm',
      desc: 'Minimal production base',
      version: '12.5',
      arch: 'x86_64',
      size: '0.8 GB',
      tone: 'purple' as const,
    },
    {
      id: 'alma',
      title: 'AlmaLinux 9.4',
      desc: 'RHEL-compatible runtime',
      version: '9.4',
      arch: 'x86_64',
      size: '1.6 GB',
      tone: 'pink' as const,
    },
    {
      id: 'alpine',
      title: 'Alpine Linux 3.19',
      desc: 'Ultra-lightweight container',
      version: '3.19',
      arch: 'x86_64 · arm64',
      size: '0.05 GB',
      tone: 'emerald' as const,
    },
  ]

  const [selectedId, setSelectedId] = useState(images[0].id)
  const [queueState, setQueueState] = useState<'idle' | 'queued' | 'building'>('idle')
  const selected = images.find((i) => i.id === selectedId) ?? images[0]
  const readiness = `${Math.round(resourcePulse(82, liveTick, scenario, 10))}%`

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <div className="space-y-4">
        <GlassCard title="Available images" description="OS templates được tối ưu cho deploy nhanh.">
          <div className="space-y-3">
            {images.map((img) => {
              const isSelected = img.id === selectedId
              return (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedId(img.id)}
                  className={cn(
                    'w-full rounded-2xl border p-4 text-left transition-all',
                    isSelected
                      ? 'border-blue-500/30 bg-blue-500/10'
                      : 'border-white/5 bg-white/[0.03] hover:border-white/10 hover:bg-white/5',
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex size-9 items-center justify-center rounded-xl',
                          img.tone === 'blue'
                            ? 'bg-blue-500/10 text-blue-300'
                            : img.tone === 'purple'
                              ? 'bg-purple-500/10 text-purple-300'
                              : img.tone === 'emerald'
                                ? 'bg-emerald-500/10 text-emerald-300'
                                : 'bg-pink-500/10 text-pink-300',
                        )}
                      >
                        <HardDrive className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{img.title}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{img.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-500">{img.size}</span>
                      {isSelected && (
                        <Badge className="bg-blue-500/15 text-blue-200 border border-blue-500/20">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                    <span>v{img.version}</span>
                    <span>·</span>
                    <span>{img.arch}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </GlassCard>

        {/* Featured image highlight */}
        <div className="rounded-3xl border border-white/5 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_50%)] p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500">
            <Shield className="size-3.5" />
            Security hardened
          </div>
          <p className="mt-3 text-lg font-semibold text-white">
            Tất cả images được CIS benchmark và scan malware trước khi release.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['CIS Level 1', 'No root SSH', 'Firewall preset', 'Auto-update'].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Preview panel */}
      <div className="space-y-4">
        <GlassCard title="Template preview" description="Mock pipeline — gắn image API sau deploy.">
          <div className="space-y-4">
            <InfoTile label="Selected image" value={selected.title} />
            <InfoTile label="Architecture" value={selected.arch} />
            <InfoTile label="Image size" value={selected.size} />
            <InfoTile
              label="Queue state"
              value={
                queueState === 'idle'
                  ? 'Standby'
                  : queueState === 'queued'
                    ? '⏳ Queued'
                    : '🔨 Building'
              }
            />
            <ProgressLine label="Registry readiness" value={Number(readiness.replace('%', ''))} tone="blue" />

            <div className="space-y-2">
              <Button
                className="w-full bg-blue-500 text-white hover:bg-blue-400"
                onClick={() =>
                  setQueueState(queueState === 'queued' ? 'building' : 'queued')
                }
              >
                <RefreshCw className="size-4" />
                {queueState === 'queued' ? 'Promote to build' : 'Queue template'}
              </Button>
              <Button
                variant="outline"
                className="w-full border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/5"
                onClick={onOpenDeployModal}
              >
                <MonitorCog className="size-4" />
                Use in deploy flow
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Build log mock */}
        <GlassCard title="Build log" description="">
          <div className="space-y-1.5 font-mono text-xs">
            {[
              { ok: true, msg: `Fetching ${selected.title}...` },
              { ok: true, msg: 'Verifying checksum SHA256' },
              { ok: true, msg: 'Applying CIS hardening layer' },
              { ok: queueState !== 'idle', msg: 'Pushing to registry' },
              { ok: queueState === 'building', msg: 'Build complete ✓' },
            ].map((line, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-lg px-3 py-2',
                  line.ok
                    ? 'text-emerald-300/80'
                    : 'text-slate-600',
                )}
              >
                {line.ok ? '●' : '○'} {line.msg}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

// ─── Networking ───────────────────────────────────────────────────────────────

function NetworkingSection({
  liveTick,
  scenario,
}: {
  liveTick: number
  scenario: SimulationScenario
}) {
  const vpcs = [
    { id: 'vpc-prod', label: 'VPC production-vn', cidr: '10.0.0.0/16', instances: 12, region: 'SGP-01' },
    { id: 'vpc-staging', label: 'VPC staging-dev', cidr: '10.1.0.0/16', instances: 4, region: 'SGP-01' },
    { id: 'vpc-game', label: 'VPC game-servers', cidr: '10.2.0.0/16', instances: 8, region: 'TYO-02' },
  ]

  const firewalls = [
    { id: 'fw-ssh', name: 'Allow SSH', port: '22/TCP', source: '0.0.0.0/0', status: 'active' },
    { id: 'fw-web', name: 'Allow HTTPS', port: '443/TCP', source: '0.0.0.0/0', status: 'active' },
    { id: 'fw-game', name: 'Game ports', port: '25565/UDP', source: '0.0.0.0/0', status: 'active' },
    { id: 'fw-panel', name: 'Panel internal', port: '8080/TCP', source: '10.0.0.0/8', status: 'active' },
  ]

  const lbs = [
    { id: 'lb-web', name: 'web-lb-01', protocol: 'HTTP/HTTPS', backends: 3, throughput: resourcePulse(2.4, liveTick, scenario, 0.8).toFixed(1) },
    { id: 'lb-game', name: 'game-lb-01', protocol: 'UDP', backends: 5, throughput: resourcePulse(1.1, liveTick + 2, scenario, 0.4).toFixed(1) },
  ]

  const [selectedVpc, setSelectedVpc] = useState(vpcs[0].id)

  return (
    <div className="space-y-6">
      {/* Top KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="VPCs" value={String(vpcs.length)} hint="Private networks" tone="blue" />
        <MetricCard label="Firewall rules" value={String(firewalls.length)} hint="Active policies" tone="purple" />
        <MetricCard
          label="Throughput"
          value={`${resourcePulse(3.5, liveTick, scenario, 1.2).toFixed(1)} TB/mo`}
          hint="Combined load balancer"
          tone="emerald"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        {/* VPC list */}
        <div className="space-y-4">
          <GlassCard title="Virtual Private Clouds" description="Network isolation theo môi trường.">
            <div className="space-y-3">
              {vpcs.map((vpc) => (
                <button
                  key={vpc.id}
                  type="button"
                  onClick={() => setSelectedVpc(vpc.id)}
                  className={cn(
                    'w-full rounded-2xl border p-4 text-left transition-all',
                    selectedVpc === vpc.id
                      ? 'border-blue-500/30 bg-blue-500/10'
                      : 'border-white/5 bg-white/[0.03] hover:border-white/10 hover:bg-white/5',
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Network className="size-4 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-white">{vpc.label}</p>
                        <p className="mt-0.5 font-mono text-xs text-slate-500">{vpc.cidr}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{vpc.instances}</p>
                      <p className="text-xs text-slate-500">instances</p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">{vpc.region}</div>
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Load balancers */}
          <GlassCard title="Load balancers" description="Phân phối traffic tự động.">
            <div className="space-y-3">
              {lbs.map((lb) => (
                <div key={lb.id} className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Wifi className="size-4 text-slate-400" />
                      <p className="text-sm font-medium text-white">{lb.name}</p>
                    </div>
                    <Badge className="bg-emerald-500/15 text-emerald-200 border border-emerald-500/20">
                      Active
                    </Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <StatValue label="Protocol" value={lb.protocol} />
                    <StatValue label="Backends" value={String(lb.backends)} />
                    <StatValue label="Traffic" value={`${lb.throughput}TB`} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Firewall rules */}
        <div className="space-y-4">
          <GlassCard title="Firewall rules" description="Access control theo port và source CIDR.">
            <div className="space-y-2">
              {firewalls.map((fw) => (
                <div
                  key={fw.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="size-4 shrink-0 text-emerald-400" />
                    <div>
                      <p className="text-sm text-white">{fw.name}</p>
                      <p className="font-mono text-xs text-slate-500">{fw.port}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs text-slate-400">{fw.source}</p>
                    <Badge className="mt-1 bg-emerald-500/15 text-emerald-200 border border-emerald-500/20 text-[10px]">
                      allow
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/5"
            >
              <ArrowRight className="size-4" />
              Add firewall rule
            </Button>
          </GlassCard>

          {/* DNS quick panel */}
          <GlassCard title="DNS zones" description="Quản lý domain routing.">
            <div className="space-y-2">
              {[
                { domain: 'nexusplane.io', records: 8, type: 'A · CNAME' },
                { domain: 'panel.nexusplane.io', records: 3, type: 'A' },
                { domain: 'shop.nexusplane.io', records: 5, type: 'A · MX' },
              ].map((zone) => (
                <div
                  key={zone.domain}
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="size-3.5 text-slate-500" />
                    <p className="font-mono text-sm text-white">{zone.domain}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">{zone.records} records</p>
                    <p className="text-[11px] text-slate-600">{zone.type}</p>
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

// ─── Activity ─────────────────────────────────────────────────────────────────

function ActivitySection({ liveFeed }: { liveFeed: LiveFeedItem[] }) {
  const [filter, setFilter] = useState<LiveFeedItem['domain'] | 'all'>('all')

  const filtered = liveFeed.filter((item) => filter === 'all' || item.domain === filter)

  const domainFilters = [
    { id: 'all', label: 'All', count: liveFeed.length },
    { id: 'admin', label: 'Admin', count: liveFeed.filter((i) => i.domain === 'admin').length },
    { id: 'panel', label: 'Panel', count: liveFeed.filter((i) => i.domain === 'panel').length },
    { id: 'dash', label: 'Dash', count: liveFeed.filter((i) => i.domain === 'dash').length },
    { id: 'shop', label: 'Shop', count: liveFeed.filter((i) => i.domain === 'shop').length },
    { id: 'system', label: 'System', count: liveFeed.filter((i) => i.domain === 'system').length },
  ] as const

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
      {/* Filter sidebar */}
      <div className="space-y-4">
        <GlassCard title="Filter by domain" description="Tách event stream theo nguồn.">
          <div className="grid gap-2">
            {domainFilters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id as typeof filter)}
                className={cn(
                  'flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition-all',
                  filter === item.id
                    ? 'border-blue-500/30 bg-blue-500/10 text-white'
                    : 'border-white/5 bg-white/[0.03] text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white',
                )}
              >
                <span>{item.label}</span>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[11px] font-medium',
                    filter === item.id ? 'bg-blue-500/20 text-blue-200' : 'bg-white/5 text-slate-500',
                  )}
                >
                  {item.count}
                </span>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Summary */}
        <GlassCard title="Stream summary" description="">
          <div className="space-y-3">
            <MetricCard label="Total events" value={String(liveFeed.length)} hint="In memory ring" tone="blue" />
            <MetricCard
              label="Warnings"
              value={String(liveFeed.filter((i) => i.tone === 'warning').length)}
              hint="Need attention"
              tone="pink"
            />
          </div>
        </GlassCard>
      </div>

      {/* Feed */}
      <GlassCard title="Activity feed" description="Nhật ký hành vi — backend wire vào websocket / SSE sau.">
        <div className="space-y-3">
          {filtered.map((item, index) => (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-4"
            >
              <span
                className={cn(
                  'mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                  activityToneClass(item.tone),
                )}
              >
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-medium text-white">{item.title}</p>
                  <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] uppercase tracking-wider text-slate-500">
                    {item.domain}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-5 text-slate-400">{item.detail}</p>
                <div className="mt-2.5 flex items-center justify-between text-[11px] uppercase tracking-wider text-slate-600">
                  <span>{item.timestamp}</span>
                  <span className="flex items-center gap-1">
                    {item.cta} <ArrowRight className="size-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Layers className="size-8 text-slate-700" />
              <p className="text-sm text-slate-500">Không có events cho domain này</p>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Server({ className }: { className?: string }) {
  return <MonitorCog className={className} />
}

function bootProgress(status: Instance['status'], liveTick: number) {
  if (status === 'running') return 100
  if (status === 'provisioning') return Math.min(42 + liveTick * 7, 96)
  return 12 + (liveTick % 4) * 2
}

function formatStatus(status: Instance['status']) {
  const map: Record<Instance['status'], string> = {
    running: 'Running',
    stopped: 'Stopped',
    paused: 'Paused',
    provisioning: 'Provisioning',
  }
  return map[status] ?? status
}

import type { ReactNode } from 'react'
import { Activity, ArrowRight, BellRing, Gauge, Pause, Play, Radar, Search, Sparkles, Terminal, LayoutDashboard, ShoppingCart, ShieldAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { DemoDomain, License, LiveFeedItem, SimulationScenario, StorefrontTheme } from '@/types'

interface SummaryChip {
  label: string
  value: string
  tone: 'blue' | 'purple' | 'pink' | 'emerald'
}

interface DomainConfig {
  id: DemoDomain
  title: string
  subtitle: string
  host: string
  accent: string
}

interface LiveStat {
  label: string
  value: string
}

interface NexusPlaneShellProps {
  activeDomain: DemoDomain
  onDomainChange: (domain: DemoDomain) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  primaryActionLabel: string
  onPrimaryAction: () => void
  summary: SummaryChip[]
  license: License
  accountBalance: number
  storefrontTheme: StorefrontTheme
  onThemeToggle: () => void
  liveMode: boolean
  onToggleLiveMode: () => void
  simulationScenario: SimulationScenario
  onSimulationScenarioChange: (scenario: SimulationScenario) => void
  liveFeed: LiveFeedItem[]
  liveStats: LiveStat[]
  statusMessage?: string
  children: ReactNode
}

const domainConfig: DomainConfig[] = [
  {
    id: 'admin',
    title: 'Admin',
    subtitle: 'License · Fleet · Analytics',
    host: 'admin.domain.com',
    accent: 'from-blue-500 to-cyan-400',
  },
  {
    id: 'panel',
    title: 'Panel',
    subtitle: 'Daily VPS orchestration',
    host: 'panel.domain.com',
    accent: 'from-slate-300 to-blue-500',
  },
  {
    id: 'dash',
    title: 'Dash',
    subtitle: 'Client billing portal',
    host: 'dash.domain.com',
    accent: 'from-purple-500 to-pink-400',
  },
  {
    id: 'shop',
    title: 'Shop',
    subtitle: 'Storefront · Headless API',
    host: 'shop.domain.com',
    accent: 'from-emerald-400 to-blue-400',
  },
]

const scenarioOptions: { id: SimulationScenario; label: string; hint: string }[] = [
  { id: 'balanced', label: 'Balanced', hint: 'Nhịp vận hành ổn định' },
  { id: 'traffic-spike', label: 'Traffic Spike', hint: 'Tăng tải và autoscale giả lập' },
  { id: 'maintenance-window', label: 'Maintenance', hint: 'Bảo trì có kiểm soát' },
  { id: 'revenue-push', label: 'Revenue Push', hint: 'Storefront và billing nóng lên' },
]

export function NexusPlaneShell({
  activeDomain,
  onDomainChange,
  searchQuery,
  onSearchChange,
  primaryActionLabel,
  onPrimaryAction,
  summary,
  license,
  accountBalance,
  storefrontTheme,
  onThemeToggle,
  liveMode,
  onToggleLiveMode,
  simulationScenario,
  onSimulationScenarioChange,
  liveFeed,
  liveStats,
  statusMessage,
  children,
}: NexusPlaneShellProps) {
  const activeConfig = domainConfig.find((domain) => domain.id === activeDomain) ?? domainConfig[0]
  const activeScenario = scenarioOptions.find((item) => item.id === simulationScenario) ?? scenarioOptions[0]

  return (
    <div className="relative min-h-screen overflow-clip bg-[#000000] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_35%),radial-gradient(circle_at_right,_rgba(168,85,247,0.11),_transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_22%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:70px_70px] opacity-20" />

      <div className="relative flex min-h-screen pb-24 lg:pb-0">
        <aside className="hidden w-[280px] shrink-0 border-r border-white/5 bg-black/90 px-5 py-6 lg:flex lg:flex-col">
          <div className="rounded-[1.75rem] border border-white/5 bg-slate-950/80 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-bold text-white shadow-lg shadow-blue-500/20">
                NP
              </div>
              <div>
                <p className="text-base font-semibold text-white">NexusPlane</p>
                <p className="text-xs text-slate-500">Cloud orchestration OS</p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {domainConfig.map((domain) => {
                const isActive = activeDomain === domain.id
                return (
                  <button
                    key={domain.id}
                    type="button"
                    onClick={() => onDomainChange(domain.id)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all',
                      isActive
                        ? 'border-blue-500/30 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                        : 'border-white/5 bg-white/0 hover:border-white/10 hover:bg-white/5',
                    )}
                  >
                    <div>
                      <p className={cn('text-sm font-semibold', isActive ? 'text-white' : 'text-slate-300')}>
                        {domain.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{domain.subtitle}</p>
                    </div>
                    <ArrowRight className={cn('size-4 transition-transform', isActive ? 'text-white' : 'text-slate-600')} />
                  </button>
                )
              })}
            </div>

            <div className="mt-5 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>License</span>
                <span className={license.readOnly ? 'text-amber-300' : 'text-emerald-300'}>
                  {license.readOnly ? 'Read-only' : 'Live'}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-white">{license.plan}</p>
              <p className="mt-1 font-mono text-xs text-slate-400">{license.key}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {summary.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/5 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                <p className="mt-2 text-xl font-semibold text-white">{item.value}</p>
                <div className={cn('mt-3 h-1.5 rounded-full bg-white/5', item.tone === 'blue' && 'bg-blue-500/20', item.tone === 'purple' && 'bg-purple-500/20', item.tone === 'pink' && 'bg-pink-500/20', item.tone === 'emerald' && 'bg-emerald-500/20')} />
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[1.75rem] border border-white/5 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">Simulation deck</p>
                <p className="mt-1 text-xs text-slate-500">{activeScenario.hint}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/5"
                onClick={onToggleLiveMode}
              >
                {liveMode ? <Pause className="size-4" /> : <Play className="size-4" />}
                {liveMode ? 'Pause' : 'Resume'}
              </Button>
            </div>

            <div className="mt-4 grid gap-2">
              {scenarioOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onSimulationScenarioChange(option.id)}
                  className={cn(
                    'rounded-2xl border px-3 py-3 text-left transition-all',
                    simulationScenario === option.id
                      ? 'border-blue-500/30 bg-blue-500/10'
                      : 'border-white/5 bg-white/[0.03] hover:border-white/10 hover:bg-white/5',
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-white">{option.label}</span>
                    <Radar className={cn('size-4', simulationScenario === option.id ? 'text-blue-300' : 'text-slate-600')} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{option.hint}</p>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-white/5 bg-black/70 backdrop-blur-2xl">
            <div className="flex items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="hidden items-center gap-3 md:flex">
                <div className={cn('size-3 rounded-full bg-gradient-to-r', activeConfig.accent)} />
                <div>
                  <p className="text-sm font-semibold text-white">{activeConfig.host}</p>
                  <p className="text-xs text-slate-500">{activeConfig.subtitle}</p>
                </div>
              </div>

              <div className="ml-auto flex w-full max-w-3xl flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    value={searchQuery}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder={`Search in ${activeConfig.title.toLowerCase()}...`}
                    className="h-12 border-white/10 bg-white/[0.03] pl-11 text-sm text-white placeholder:text-slate-500 focus-visible:border-blue-500/40"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 border-white/10 bg-white/[0.03] px-4 text-slate-300 hover:bg-white/5"
                    onClick={onThemeToggle}
                  >
                    <Sparkles className="size-4" />
                    <span className="hidden sm:inline">{storefrontTheme === 'midnight' ? 'Midnight' : 'Paper'}</span>
                  </Button>
                  <Button
                    type="button"
                    className="h-12 bg-blue-500 px-4 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-400"
                    onClick={onPrimaryAction}
                  >
                    {primaryActionLabel}
                  </Button>
                </div>
              </div>

              <div className="mt-3 flex gap-3 px-4 sm:px-6 lg:hidden">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 flex-1 border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/5"
                  onClick={onThemeToggle}
                >
                  <Sparkles className="size-4" />
                  Theme
                </Button>
                <Button
                  type="button"
                  className="h-11 flex-1 bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-400"
                  onClick={onPrimaryAction}
                >
                  {primaryActionLabel}
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-white/5 px-4 py-3 text-xs text-slate-500 sm:px-6 lg:px-8">
              <Chip label="Balance" value={`$${accountBalance.toFixed(2)}`} />
              <Chip label="License" value={license.readOnly ? 'Read-only' : 'Enabled'} />
              <Chip label="Hardware ID" value={license.hwid} mono />
              <Chip label="Theme" value={storefrontTheme} />
              <Chip label="Live mode" value={liveMode ? 'Running' : 'Paused'} />
              <Chip label="Scenario" value={activeScenario.label} />
            </div>
          </header>

          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {statusMessage && (
              <div className="mb-4 rounded-2xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-100 shadow-lg shadow-blue-500/10">
                {statusMessage}
              </div>
            )}
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="rounded-[2rem] border border-white/5 bg-slate-950/50 p-4 shadow-[0_24px_120px_rgba(0,0,0,0.45)] sm:p-6 lg:p-8">
                {children}
              </div>

              <div className="space-y-6">
                <ShellCard
                  title="Ops meter"
                  description="Các điểm chạm UI giả, nhưng structure đủ sạch để gắn backend event stream sau này."
                  icon={<Gauge className="size-4 text-blue-300" />}
                >
                  <div className="grid gap-3">
                    {liveStats.map((item) => (
                      <div key={item.label} className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
                        <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </ShellCard>

                <ShellCard
                  title="Live queue"
                  description="Dùng như mock activity rail cho websocket, SSE hoặc polling layer sau này."
                  icon={<BellRing className="size-4 text-purple-300" />}
                >
                  <div className="space-y-3">
                    {liveFeed.slice(0, 5).map((item) => (
                      <div key={item.id} className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <ToneDot tone={item.tone} />
                              <p className="truncate text-sm font-medium text-white">{item.title}</p>
                            </div>
                            <p className="mt-2 text-xs leading-5 text-slate-400">{item.detail}</p>
                          </div>
                          <span className="shrink-0 text-[11px] uppercase tracking-[0.2em] text-slate-600">
                            {item.domain}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-slate-500">
                          <span>{item.timestamp}</span>
                          <span>{item.cta}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ShellCard>

                <ShellCard
                  title="Live controls"
                  description="Mô phỏng command center mà không cần backend thật ở giai đoạn layout."
                  icon={<Activity className="size-4 text-emerald-300" />}
                >
                  <div className="space-y-3">
                    <Button
                      type="button"
                      className="w-full bg-blue-500 text-white hover:bg-blue-400"
                      onClick={onToggleLiveMode}
                    >
                      {liveMode ? <Pause className="size-4" /> : <Play className="size-4" />}
                      {liveMode ? 'Pause fake stream' : 'Resume fake stream'}
                    </Button>
                    <div className="grid gap-2">
                      {scenarioOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => onSimulationScenarioChange(option.id)}
                          className={cn(
                            'rounded-2xl border px-3 py-3 text-left text-sm transition-all',
                            simulationScenario === option.id
                              ? 'border-blue-500/30 bg-blue-500/10 text-white'
                              : 'border-white/5 bg-white/[0.03] text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white',
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </ShellCard>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-black/80 p-2 backdrop-blur-3xl pb-safe lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around gap-1">
          {domainConfig.map((domain) => {
            const isActive = activeDomain === domain.id;
            let Icon = Terminal;
            if (domain.id === 'admin') Icon = ShieldAlert;
            if (domain.id === 'dash') Icon = LayoutDashboard;
            if (domain.id === 'shop') Icon = ShoppingCart;
            
            return (
              <button
                key={domain.id}
                onClick={() => onDomainChange(domain.id)}
                className={cn(
                  'flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-2 transition-all',
                  isActive 
                    ? 'bg-gradient-to-b from-blue-500/20 to-transparent text-blue-400' 
                    : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                )}
              >
                <Icon className="size-5" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  {domain.title}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ShellCard({
  title,
  description,
  icon,
  children,
}: {
  title: string
  description: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <div className="rounded-[1.75rem] border border-white/5 bg-slate-950/60 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function Chip({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.03] px-3 py-1.5">
      <span>{label}</span>
      <span className={cn('text-slate-300', mono && 'font-mono')}>{value}</span>
    </div>
  )
}

function ToneDot({ tone }: { tone: LiveFeedItem['tone'] }) {
  return (
    <span
      className={cn(
        'inline-flex size-2.5 rounded-full',
        tone === 'critical'
          ? 'bg-rose-400'
          : tone === 'warning'
            ? 'bg-amber-300'
            : 'bg-sky-300',
      )}
    />
  )
}



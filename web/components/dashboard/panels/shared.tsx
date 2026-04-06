import type { ComponentType, KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { InstanceStatus, LiveFeedItem, Node, SimulationScenario } from '@/types'

export function GlassCard({
  title,
  description,
  children,
  className,
}: {
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <Card className={cn('border-white/5 bg-slate-950/80 shadow-[0_20px_80px_rgba(0,0,0,0.3)]', className)}>
      <CardHeader className="space-y-1.5 pb-4">
        <CardTitle className="text-lg text-white">{title}</CardTitle>
        {description && <CardDescription className="text-sm text-slate-500">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  )
}

export function MetricCard({
  label,
  value,
  hint,
  tone,
  delta,
}: {
  label: string
  value: string
  hint?: string
  tone: 'blue' | 'purple' | 'pink' | 'emerald'
  delta?: string
}) {
  return (
    <Card className="border-white/5 bg-white/[0.03] shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
      <CardContent className="p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
        <div className="mt-3 flex items-end justify-between gap-4">
          <p className="text-2xl font-semibold text-white">{value}</p>
          <span className={cn('size-3 rounded-full', toneClass(tone))} />
        </div>
        <div className="mt-2 flex items-center justify-between">
          {hint && <p className="text-xs text-slate-500 truncate">{hint}</p>}
          {delta && <span className="text-xs text-emerald-400 font-mono ml-auto shrink-0">{delta}</span>}
        </div>
      </CardContent>
    </Card>
  )
}

export function InfoTile({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={cn('mt-1 text-sm text-white', mono && 'font-mono text-slate-300')}>{value}</p>
    </div>
  )
}

export function StatValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3 text-center">
      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 font-mono text-sm text-white">{value}</p>
    </div>
  )
}

export function ProgressLine({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: 'blue' | 'purple' | 'pink' | 'emerald'
}) {
  const barColor =
    tone === 'blue'
      ? 'bg-blue-500'
      : tone === 'purple'
        ? 'bg-purple-500'
        : tone === 'pink'
          ? 'bg-pink-500'
          : 'bg-emerald-500'

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{label}</span>
        <span className="font-mono text-slate-300">{Math.round(value)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.04]">
        <div
          className={cn('h-1.5 rounded-full transition-all duration-700', barColor)}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  )
}

export function SectionTabs<T extends string>({
  sections,
  activeSection,
  onChange,
}: {
  sections: { id: T; label: string; icon: ComponentType<{ className?: string }> }[]
  activeSection: T
  onChange: (section: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 rounded-3xl border border-white/5 bg-white/[0.03] p-2">
      {sections.map((section) => {
        const Icon = section.icon
        const isActive = activeSection === section.id
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onChange(section.id)}
            className={cn(
              'inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-all',
              isActive
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:bg-white/5 hover:text-white',
            )}
          >
            <Icon className="size-4" />
            {section.label}
          </button>
        )
      })}
    </div>
  )
}

export function DomainHero({
  eyebrow,
  title,
  description,
  stats,
  actions,
}: {
  eyebrow: string
  title: string
  description: string
  stats: { label: string; value: string }[]
  actions: ReactNode
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] xl:items-end">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">{description}</p>
      </div>
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3">
              <p className="text-xs text-slate-500">{stat.label}</p>
              <p className="mt-1 text-sm font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">{actions}</div>
      </div>
    </div>
  )
}

export function MiniSparkline({
  values,
  tone = 'blue',
  height = 48,
}: {
  values: number[]
  tone?: 'blue' | 'purple' | 'pink' | 'emerald'
  height?: number
}) {
  const max = Math.max(...values, 1)
  const color =
    tone === 'blue'
      ? 'bg-blue-500/70'
      : tone === 'purple'
        ? 'bg-purple-500/70'
        : tone === 'pink'
          ? 'bg-pink-500/70'
          : 'bg-emerald-500/70'

  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {values.map((v, i) => (
        <div
          key={i}
          className={cn('flex-1 rounded-t-sm transition-all duration-700', color)}
          style={{ height: `${Math.round((v / max) * 100)}%` }}
        />
      ))}
    </div>
  )
}

export function ToneBadge({ status }: { status: string }) {
  const classes = statusClass(status as InstanceStatus)
  return <Badge className={classes}>{status}</Badge>
}

export function handleCardKeyDown(event: ReactKeyboardEvent<HTMLElement>, onActivate: () => void) {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  onActivate()
}

export function pulseValue(base: number, liveTick: number, variance: number) {
  return Math.max(base - variance, Math.min(base + variance, base + Math.sin(liveTick / 1.7) * variance))
}

export function resourcePulse(base: number, liveTick: number, scenario: SimulationScenario, variance: number) {
  const boost =
    scenario === 'traffic-spike'
      ? variance * 0.9
      : scenario === 'maintenance-window'
        ? -variance * 0.35
        : scenario === 'revenue-push'
          ? variance * 0.4
          : 0
  return Math.max(8, Math.min(100, base + boost + Math.sin(liveTick / 1.6) * variance))
}

export function buildTelemetryBars(load: number, liveTick: number, scenario: SimulationScenario): number[] {
  return [22, 36, 48, 40, load, 58, 44, 62].map((v, i) =>
    Math.round(resourcePulse(v, liveTick + i, scenario, 12)),
  )
}

export function statusClass(status: InstanceStatus) {
  return status === 'running'
    ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/20'
    : status === 'provisioning'
      ? 'bg-blue-500/15 text-blue-200 border border-blue-500/20'
      : status === 'paused'
        ? 'bg-amber-500/15 text-amber-200 border border-amber-500/20'
        : 'bg-slate-700/50 text-slate-200 border border-slate-500/20'
}

export function nodeBadgeClass(status: Node['status']) {
  return status === 'online'
    ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/20'
    : status === 'degraded'
      ? 'bg-pink-500/15 text-pink-200 border border-pink-500/20'
      : status === 'offline'
        ? 'bg-rose-500/15 text-rose-200 border border-rose-500/20'
        : 'bg-amber-500/15 text-amber-200 border border-amber-500/20'
}

export function invoiceBadge(status: string) {
  return status === 'paid'
    ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/20'
    : status === 'overdue'
      ? 'bg-rose-500/15 text-rose-200 border border-rose-500/20'
      : 'bg-blue-500/15 text-blue-200 border border-blue-500/20'
}

export function activityToneClass(tone: LiveFeedItem['tone']) {
  return tone === 'critical'
    ? 'bg-rose-500/10 text-rose-200'
    : tone === 'warning'
      ? 'bg-amber-500/10 text-amber-200'
      : 'bg-blue-500/10 text-blue-200'
}

function toneClass(tone: 'blue' | 'purple' | 'pink' | 'emerald') {
  return tone === 'blue'
    ? 'bg-blue-500'
    : tone === 'purple'
      ? 'bg-purple-500'
      : tone === 'pink'
        ? 'bg-pink-500'
        : 'bg-emerald-500'
}

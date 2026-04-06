import { useState } from 'react'

import {
  ArrowRight,
  Box,
  CheckCircle,
  ChevronRight,
  CircleDollarSign,
  Code2,
  Cpu,
  ExternalLink,
  Flame,
  Globe,
  HardDrive,
  LayoutGrid,
  Package,
  Palette,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
  Wifi,
  Zap,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type {
  DemoState,
  DomainSectionMap,
  ShopPlan,
  SimulationScenario,
} from '@/types'

import {
  DomainHero,
  GlassCard,
  InfoTile,
  MetricCard,
  ProgressLine,
  SectionTabs,
  StatValue,
  handleCardKeyDown,
  pulseValue,
  resourcePulse,
} from './shared'

type ShopSection = DomainSectionMap['shop']

interface ShopDomainPanelProps {
  state: DemoState
  section: ShopSection
  selectedPlan: ShopPlan
  liveTick: number
  scenario: SimulationScenario
  onSectionChange: (section: ShopSection) => void
  onSelectPlan: (planId: string) => void
  onPurchasePlan: (plan: ShopPlan) => void
  onToggleTheme: () => void
  onCopyApiSnippet: () => void
}

const sections: { id: ShopSection; label: string; icon: typeof ShoppingCart }[] = [
  { id: 'catalog', label: 'Catalog', icon: ShoppingCart },
  { id: 'api', label: 'API', icon: Code2 },
  { id: 'brand', label: 'Brand', icon: Sparkles },
]

export function ShopDomainPanel({
  state,
  section,
  selectedPlan,
  liveTick,
  scenario,
  onSectionChange,
  onSelectPlan,
  onPurchasePlan,
  onToggleTheme,
  onCopyApiSnippet,
}: ShopDomainPanelProps) {
  const conversion =
    scenario === 'revenue-push'
      ? `${(9.2 + (liveTick % 4) * 0.3).toFixed(1)}%`
      : `${(8.1 + (liveTick % 3) * 0.2).toFixed(1)}%`

  return (
    <div className="space-y-6">
      <DomainHero
        eyebrow="Headless commerce"
        title="NexusPlane Storefront"
        description="Bán gói hosting, game server và API headless với cảm giác sạch, đắt tiền và conversion cao."
        stats={[
          { label: 'Plans available', value: String(state.plans.length) },
          { label: 'Conversion rate', value: conversion },
          { label: 'Theme', value: state.storefrontTheme },
        ]}
        actions={
          <Button
            variant="outline"
            className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/5"
            onClick={onToggleTheme}
          >
            <Sparkles className="size-4" />
            {state.storefrontTheme === 'midnight' ? 'Switch to Paper' : 'Switch to Midnight'}
          </Button>
        }
      />

      <SectionTabs sections={sections} activeSection={section} onChange={onSectionChange} />

      {section === 'catalog' && (
        <CatalogSection
          state={state}
          selectedPlan={selectedPlan}
          liveTick={liveTick}
          scenario={scenario}
          onSelectPlan={onSelectPlan}
          onPurchasePlan={onPurchasePlan}
        />
      )}
      {section === 'api' && (
        <ApiSection
          selectedPlan={selectedPlan}
          liveTick={liveTick}
          scenario={scenario}
          onCopyApiSnippet={onCopyApiSnippet}
          onPurchasePlan={onPurchasePlan}
        />
      )}
      {section === 'brand' && (
        <BrandSection
          state={state}
          selectedPlan={selectedPlan}
          liveTick={liveTick}
          scenario={scenario}
          onPurchasePlan={onPurchasePlan}
          onToggleTheme={onToggleTheme}
        />
      )}
    </div>
  )
}

// ─── Catalog ───────────────────────────────────────────────────────────────────

function CatalogSection({
  state,
  selectedPlan,
  liveTick,
  scenario,
  onSelectPlan,
  onPurchasePlan,
}: {
  state: DemoState
  selectedPlan: ShopPlan
  liveTick: number
  scenario: SimulationScenario
  onSelectPlan: (id: string) => void
  onPurchasePlan: (plan: ShopPlan) => void
}) {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'vps' | 'game' | 'app'>('all')
  const conversion =
    scenario === 'revenue-push'
      ? (9.2 + (liveTick % 4) * 0.3).toFixed(1)
      : (8.1 + (liveTick % 3) * 0.2).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Store KPIs */}
      <div className="grid gap-4 sm:grid-cols-4">
        <MetricCard label="Conversion" value={`${conversion}%`} hint="Purchase rate" tone="emerald" delta="+0.4%" />
        <MetricCard
          label="Plans live"
          value={String(state.plans.length)}
          hint="Published tiers"
          tone="blue"
        />
        <MetricCard
          label="Avg ticket"
          value={`$${(state.plans.reduce((s, p) => s + p.priceMonthly, 0) / state.plans.length).toFixed(0)}`}
          hint="Per monthly plan"
          tone="purple"
        />
        <MetricCard
          label="Theme"
          value={state.storefrontTheme === 'midnight' ? '🌙 Midnight' : '📄 Paper'}
          hint="Active storefront skin"
          tone="pink"
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-2">
        {([
          { id: 'all', label: 'All plans', icon: LayoutGrid },
          { id: 'vps', label: 'VPS', icon: Cpu },
          { id: 'game', label: 'Game servers', icon: Flame },
          { id: 'app', label: 'App hosting', icon: Box },
        ] as const).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setCategoryFilter(id)}
            className={cn(
              'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all',
              categoryFilter === id
                ? 'bg-blue-500/20 text-blue-200 border border-blue-500/20'
                : 'text-slate-500 hover:text-white border border-transparent',
            )}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Plans grid */}
      <div className="grid gap-4 xl:grid-cols-4">
        {state.plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            active={selectedPlan.id === plan.id}
            onSelect={() => onSelectPlan(plan.id)}
            onPurchase={() => onPurchasePlan(plan)}
          />
        ))}
      </div>

      {/* Checkout preview */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.6fr)]">
        <GlassCard title="Selected plan detail" description="Preview trước khi checkout.">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoTile label="Plan name" value={selectedPlan.name} />
            <InfoTile label="Monthly price" value={`$${selectedPlan.priceMonthly}`} />
            <InfoTile label="CPU" value={`${selectedPlan.cpuCores} vCPU`} />
            <InfoTile label="RAM" value={`${selectedPlan.ramGb} GB`} />
            <InfoTile label="Storage" value={`${selectedPlan.storageGb} GB NVMe`} />
            <InfoTile label="Bandwidth" value={`${selectedPlan.bandwidthTb} TB/mo`} />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {selectedPlan.highlights.map((h) => (
              <span
                key={h}
                className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-200"
              >
                {h}
              </span>
            ))}
          </div>

          <Button
            className="w-full bg-blue-500 text-white hover:bg-blue-400 shadow-lg shadow-blue-500/20"
            onClick={() => onPurchasePlan(selectedPlan)}
          >
            <CircleDollarSign className="size-4" />
            Buy {selectedPlan.name} — ${selectedPlan.priceMonthly}/mo
          </Button>
        </GlassCard>

        {/* Why choose */}
        <GlassCard title="Why NexusPlane?" description="">
          <div className="space-y-3">
            {[
              { icon: Zap, text: 'Deploy trong 30 giây' },
              { icon: Globe, text: 'Datacenter đa vùng Đông Nam Á' },
              { icon: CheckCircle, text: '99.9% SLA uptime guarantee' },
              { icon: Wifi, text: 'DDoS protection built-in' },
              { icon: HardDrive, text: 'NVMe SSD storage mặc định' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-slate-300">
                <Icon className="size-4 shrink-0 text-emerald-400" />
                {text}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

function PlanCard({
  plan,
  active,
  onSelect,
  onPurchase,
}: {
  plan: ShopPlan
  active: boolean
  onSelect: () => void
  onPurchase: () => void
}) {
  const accentGradient =
    plan.accent === 'blue'
      ? 'from-blue-500/20 to-transparent'
      : plan.accent === 'purple'
        ? 'from-purple-500/20 to-transparent'
        : 'from-pink-500/20 to-transparent'

  const accentBorder =
    plan.accent === 'blue'
      ? 'border-blue-500/30'
      : plan.accent === 'purple'
        ? 'border-purple-500/30'
        : 'border-pink-500/30'

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => handleCardKeyDown(e, onSelect)}
      className={cn(
        'relative rounded-[1.75rem] border p-5 text-left transition-all outline-none cursor-pointer overflow-hidden',
        active
          ? `${accentBorder} bg-white/[0.04] shadow-xl`
          : 'border-white/5 bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.05]',
      )}
    >
      {/* Gradient accent */}
      {active && (
        <div
          className={cn(
            'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-50',
            accentGradient,
          )}
        />
      )}

      {plan.popular && (
        <div className="absolute right-4 top-4">
          <Badge className="bg-pink-500/20 text-pink-200 border border-pink-500/20">
            <Star className="mr-1 size-3" />
            Popular
          </Badge>
        </div>
      )}

      <div className="relative">
        <p className="text-lg font-semibold text-white">{plan.name}</p>
        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white">${plan.priceMonthly}</span>
          <span className="text-sm text-slate-400">/mo</span>
        </div>

        <div className="mt-5 space-y-2.5 text-sm">
          <div className="flex items-center gap-2 text-slate-300">
            <Cpu className="size-3.5 text-slate-500" />
            {plan.cpuCores} vCPU cores
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Package className="size-3.5 text-slate-500" />
            {plan.ramGb} GB RAM
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <HardDrive className="size-3.5 text-slate-500" />
            {plan.storageGb} GB NVMe
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Wifi className="size-3.5 text-slate-500" />
            {plan.bandwidthTb} TB bandwidth
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {plan.highlights.map((h) => (
            <span
              key={h}
              className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-400"
            >
              {h}
            </span>
          ))}
        </div>

        <div className="mt-5" onClick={(e) => e.stopPropagation()}>
          <Button
            className={cn(
              'w-full',
              plan.accent === 'blue'
                ? 'bg-blue-500 hover:bg-blue-400 shadow-lg shadow-blue-500/20'
                : plan.accent === 'purple'
                  ? 'bg-purple-500 hover:bg-purple-400 shadow-lg shadow-purple-500/20'
                  : 'bg-pink-500 hover:bg-pink-400 shadow-lg shadow-pink-500/20',
              'text-white',
            )}
            onClick={onPurchase}
          >
            <ShoppingCart className="size-4" />
            Get started
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── API ──────────────────────────────────────────────────────────────────────

function ApiSection({
  selectedPlan,
  liveTick,
  scenario,
  onCopyApiSnippet,
  onPurchasePlan,
}: {
  selectedPlan: ShopPlan
  liveTick: number
  scenario: SimulationScenario
  onCopyApiSnippet: () => void
  onPurchasePlan: (p: ShopPlan) => void
}) {
  const endpoints = [
    { method: 'GET', path: '/api/storefront/plans', desc: 'List all available plans', status: 200 },
    { method: 'GET', path: '/api/storefront/regions', desc: 'List datacenter regions', status: 200 },
    { method: 'POST', path: '/api/storefront/checkout', desc: 'Create checkout session', status: scenario === 'revenue-push' ? 201 : 202 },
    { method: 'GET', path: '/api/storefront/customer/:id', desc: 'Fetch customer account', status: 200 },
    { method: 'POST', path: '/api/storefront/customer/:id/topup', desc: 'Top up wallet balance', status: 201 },
  ]

  const mockResponses = {
    plans: `{
  "plans": [
    {
      "id": "${selectedPlan.id}",
      "name": "${selectedPlan.name}",
      "price_monthly": ${selectedPlan.priceMonthly},
      "cpu_cores": ${selectedPlan.cpuCores},
      "ram_gb": ${selectedPlan.ramGb}
    }
  ]
}`,
  }

  const requestLog = [
    `GET /plans 200 · ${220 + liveTick * 5}ms`,
    `GET /regions 200 · ${180 + liveTick * 4}ms`,
    `POST /checkout ${scenario === 'revenue-push' ? 201 : 202} · ${240 + liveTick * 6}ms`,
    `GET /customer/cust-001 200 · ${160 + liveTick * 3}ms`,
  ]

  return (
    <div className="space-y-6">
      {/* API stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Endpoints"
          value={String(endpoints.length)}
          hint="REST API surface"
          tone="blue"
        />
        <MetricCard
          label="Avg latency"
          value={`${Math.round(pulseValue(210, liveTick, 40))}ms`}
          hint="Based on mock log"
          tone="emerald"
        />
        <MetricCard
          label="API version"
          value="v1.0"
          hint="Stable · No breaking changes"
          tone="purple"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
        {/* Endpoint list */}
        <div className="space-y-4">
          <GlassCard
            title="Storefront API"
            description="Full REST API để dev bên ngoài nhúng vào custom frontend."
          >
            <div className="space-y-2">
              {endpoints.map((ep) => (
                <div
                  key={ep.path}
                  className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-4"
                >
                  <span
                    className={cn(
                      'shrink-0 rounded-lg px-2 py-1 text-[11px] font-bold uppercase tracking-wider',
                      ep.method === 'GET'
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'bg-blue-500/15 text-blue-300',
                    )}
                  >
                    {ep.method}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-sm text-white">{ep.path}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{ep.desc}</p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 rounded-lg px-2 py-1 text-[11px] font-mono',
                      ep.status < 300
                        ? 'bg-emerald-500/10 text-emerald-300'
                        : 'bg-amber-500/10 text-amber-300',
                    )}
                  >
                    {ep.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                className="bg-blue-500 text-white hover:bg-blue-400"
                onClick={onCopyApiSnippet}
              >
                <Code2 className="size-4" />
                Copy fetch snippet
              </Button>
              <Button
                variant="outline"
                className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/5"
                onClick={() => onPurchasePlan(selectedPlan)}
              >
                <ShoppingCart className="size-4" />
                Simulate checkout
              </Button>
            </div>

            {/* Request log */}
            <div className="rounded-2xl border border-white/5 bg-black/40 p-4">
              <p className="mb-3 text-xs uppercase tracking-wider text-slate-500">Mock request log</p>
              <div className="space-y-1.5 font-mono text-xs">
                {requestLog.map((line) => (
                  <div key={line} className="text-emerald-300/80">
                    › {line}
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Code snippet */}
          <GlassCard title="Fetch snippet" description="Copy và paste vào custom storefront.">
            <div className="rounded-2xl border border-white/5 bg-black/60 p-4">
              <pre className="overflow-x-auto font-mono text-xs text-emerald-300/90">
                {`const plans = await fetch(
  'https://shop.domain.com/api/storefront/plans',
  { headers: { 'Authorization': 'Bearer <token>' } }
).then(r => r.json())

// plans.plans → ShopPlan[]`}
              </pre>
            </div>
            <Button
              variant="outline"
              className="w-full border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/5"
              onClick={onCopyApiSnippet}
            >
              <Code2 className="size-4" />
              Copy to clipboard
            </Button>
          </GlassCard>
        </div>

        {/* Right: Response preview + Checkout */}
        <div className="space-y-4">
          <GlassCard title="Response preview" description="Mock JSON output cho /plans endpoint.">
            <div className="rounded-2xl border border-white/5 bg-black/60 p-4">
              <pre className="overflow-x-auto font-mono text-xs text-slate-300">
                {mockResponses.plans}
              </pre>
            </div>
          </GlassCard>

          <GlassCard title="Checkout preview" description="Luồng mua hàng demo để show conversion.">
            <div className="space-y-3">
              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-white">{selectedPlan.name}</p>
                  <Badge
                    className={
                      selectedPlan.accent === 'blue'
                        ? 'bg-blue-500/15 text-blue-200 border border-blue-500/20'
                        : selectedPlan.accent === 'purple'
                          ? 'bg-purple-500/15 text-purple-200 border border-purple-500/20'
                          : 'bg-pink-500/15 text-pink-200 border border-pink-500/20'
                    }
                  >
                    {selectedPlan.accent}
                  </Badge>
                </div>
                <p className="mt-3 text-2xl font-bold text-white">
                  ${selectedPlan.priceMonthly}
                  <span className="ml-1 text-sm font-normal text-slate-400">/mo</span>
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">${selectedPlan.priceMonthly}.00</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Discount (demo)</span>
                  <span className="font-mono text-emerald-400">-$0.00</span>
                </div>
                <div className="border-t border-white/5 pt-2 flex items-center justify-between font-semibold">
                  <span className="text-white">Total</span>
                  <span className="font-mono text-white">${selectedPlan.priceMonthly}.00</span>
                </div>
              </div>

              <Button
                className="w-full bg-blue-500 text-white hover:bg-blue-400 shadow-lg shadow-blue-500/20"
                onClick={() => onPurchasePlan(selectedPlan)}
              >
                <CircleDollarSign className="size-4" />
                Complete checkout
              </Button>
            </div>
          </GlassCard>

          {/* SDK links */}
          <GlassCard title="SDK & integrations" description="">
            <div className="space-y-2">
              {[
                { name: 'JavaScript SDK', status: 'Coming soon' },
                { name: 'Python client', status: 'Coming soon' },
                { name: 'Webhook events', status: 'Planned' },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3"
                >
                  <span className="text-sm text-slate-300">{item.name}</span>
                  <span className="text-xs text-slate-500">{item.status}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

// ─── Brand ────────────────────────────────────────────────────────────────────

function BrandSection({
  state,
  selectedPlan,
  liveTick,
  scenario,
  onPurchasePlan,
  onToggleTheme,
}: {
  state: DemoState
  selectedPlan: ShopPlan
  liveTick: number
  scenario: SimulationScenario
  onPurchasePlan: (p: ShopPlan) => void
  onToggleTheme: () => void
}) {
  const [variant, setVariant] = useState<'A' | 'B'>('A')
  const [highlightStyle, setHighlightStyle] = useState<'premium' | 'minimal'>('premium')
  const conversionLift = `${pulseValue(scenario === 'revenue-push' ? 11.2 : 7.4, liveTick, 1.1).toFixed(1)}%`

  return (
    <div className="space-y-6">
      {/* Design tokens */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <GlassCard title="Brand direction" description="Design system cho NexusPlane UI.">
          <div className="space-y-5">
            {/* Color palette */}
            <div>
              <p className="mb-3 text-xs uppercase tracking-wider text-slate-500">Color palette</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Surface', color: '#000000', desc: 'Mission-control black', swatch: 'bg-black border-white/20' },
                  { label: 'Primary', color: '#3B82F6', desc: 'Blue 500 — action', swatch: 'bg-blue-500' },
                  { label: 'Accent', color: '#EC4899', desc: 'Pink 400 — revenue', swatch: 'bg-pink-400' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                    <div className={cn('h-8 w-full rounded-xl border', item.swatch)} />
                    <p className="mt-3 text-xs uppercase tracking-wider text-slate-500">{item.label}</p>
                    <p className="mt-1 font-mono text-xs text-white">{item.color}</p>
                    <p className="mt-0.5 text-[11px] text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div>
              <p className="mb-3 text-xs uppercase tracking-wider text-slate-500">Typography</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { name: 'Geist Sans', usage: 'UI · Body · Labels', preview: 'Aa' },
                  { name: 'Geist Mono', usage: 'Code · IDs · Metrics', preview: '01' },
                ].map((f) => (
                  <div key={f.name} className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                    <p className="text-3xl font-light text-white">{f.preview}</p>
                    <p className="mt-2 text-sm text-white">{f.name}</p>
                    <p className="text-xs text-slate-500">{f.usage}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Theme toggle */}
            <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] p-4">
              <div>
                <p className="text-sm font-medium text-white">Active theme</p>
                <p className="text-xs text-slate-500">
                  {state.storefrontTheme === 'midnight' ? 'Dark — mission control' : 'Light — clean editorial'}
                </p>
              </div>
              <Button
                variant="outline"
                className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/5"
                onClick={onToggleTheme}
              >
                <Palette className="size-4" />
                Switch
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Plan spotlight */}
        <div className="space-y-4">
          <GlassCard title="Plan spotlight" description="Plan đang highlight trong storefront.">
            <div className="space-y-4">
              <div
                className={cn(
                  'rounded-3xl border p-5',
                  selectedPlan.accent === 'blue'
                    ? 'border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent'
                    : selectedPlan.accent === 'purple'
                      ? 'border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent'
                      : 'border-pink-500/20 bg-gradient-to-br from-pink-500/10 to-transparent',
                )}
              >
                {selectedPlan.popular && (
                  <Badge className="mb-3 bg-pink-500/20 text-pink-200 border border-pink-500/20">
                    Most popular
                  </Badge>
                )}
                <p className="text-2xl font-semibold text-white">{selectedPlan.name}</p>
                <p className="mt-2 font-mono text-sm text-slate-400">
                  ${selectedPlan.priceMonthly}/month
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedPlan.highlights.map((h) => (
                    <span
                      key={h}
                      className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-200"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <Button
                className="w-full bg-blue-500 text-white hover:bg-blue-400"
                onClick={() => onPurchasePlan(selectedPlan)}
              >
                <CircleDollarSign className="size-4" />
                Activate plan
              </Button>
            </div>
          </GlassCard>

          {/* Lift metrics */}
          <GlassCard title="A/B experiment" description="">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVariant(variant === 'A' ? 'B' : 'A')}
                  className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-left transition-colors hover:bg-white/5"
                >
                  <p className="text-xs text-slate-500">Hero variant</p>
                  <p className="mt-2 text-lg font-semibold text-white">Variant {variant}</p>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setHighlightStyle(highlightStyle === 'premium' ? 'minimal' : 'premium')
                  }
                  className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-left transition-colors hover:bg-white/5"
                >
                  <p className="text-xs text-slate-500">Style</p>
                  <p className="mt-2 text-lg font-semibold text-white capitalize">
                    {highlightStyle}
                  </p>
                </button>
              </div>
              <ProgressLine label="Conversion lift" value={parseFloat(conversionLift)} tone="emerald" />
              <div className="flex flex-wrap gap-2">
                {['Dark mode', 'Fast CTAs', 'Mono IDs', `Lift ${conversionLift}`].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Brand manifesto */}
      <div className="rounded-3xl border border-white/5 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_48%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.16),_transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Brand manifesto</p>
        <p className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-white">
          Clean, cold, premium, and engineered for operators who care more about control than decoration.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {[
            'Mission-control aesthetic',
            'Zero clutter',
            'Typography-first',
            'Dark by default',
            'Built for power users',
          ].map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-slate-300"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

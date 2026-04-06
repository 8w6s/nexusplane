import { useState } from 'react'

import {
  ArrowUpRight,
  Bell,
  CheckCircle,
  CircleDollarSign,
  CreditCard,
  Globe,
  KeyRound,
  MailCheck,
  MonitorCog,
  Receipt,
  ReceiptText,
  RefreshCw,
  Settings,
  Shield,
  Terminal,
  TrendingUp,
  Wallet,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { DemoState, DomainSectionMap, Instance, SimulationScenario } from '@/types'

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
  invoiceBadge,
  resourcePulse,
  statusClass,
} from './shared'

type DashSection = DomainSectionMap['dash']

interface DashDomainPanelProps {
  state: DemoState
  section: DashSection
  selectedInstance: Instance
  liveTick: number
  scenario: SimulationScenario
  onSectionChange: (section: DashSection) => void
  onSelectInstance: (instanceId: string) => void
  onOpenTerminal: (instance: Instance) => void
  onPayInvoice: (invoiceId: string) => void
  onTopUpBalance: (amount: number) => void
}

const sections: { id: DashSection; label: string; icon: typeof Wallet }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Wallet },
  { id: 'billing', label: 'Billing', icon: ReceiptText },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function DashDomainPanel({
  state,
  section,
  selectedInstance,
  liveTick,
  scenario,
  onSectionChange,
  onSelectInstance,
  onOpenTerminal,
  onPayInvoice,
  onTopUpBalance,
}: DashDomainPanelProps) {
  const openInvoices = state.invoices.filter((i) => i.status !== 'paid').length
  const customerInstances = state.instances.filter(
    (i) => i.ownerName.includes('tenant') || i.name.startsWith('dash-') || i.name.startsWith('customer'),
  )

  return (
    <div className="space-y-6">
      <DomainHero
        eyebrow="Minimal self-service"
        title="Client Portal"
        description="Khách hàng chỉ thấy VPS của họ, billing cá nhân và nút thao tác thật nhanh."
        stats={[
          { label: 'Balance', value: `$${state.account.balance.toFixed(2)}` },
          { label: 'Open invoices', value: String(openInvoices) },
          { label: 'Active VPS', value: String(customerInstances.filter((i) => i.status === 'running').length) },
        ]}
        actions={
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/5"
              onClick={() => onTopUpBalance(25)}
            >
              <CircleDollarSign className="size-4" />
              Top up $25
            </Button>
            <Button
              className="bg-blue-500 text-white hover:bg-blue-400 shadow-lg shadow-blue-500/20"
              onClick={() =>
                onPayInvoice(
                  state.invoices.find((i) => i.status !== 'paid')?.id ?? state.invoices[0].id,
                )
              }
            >
              <ReceiptText className="size-4" />
              Pay Due Invoice
            </Button>
          </div>
        }
      />

      <SectionTabs sections={sections} activeSection={section} onChange={onSectionChange} />

      {section === 'dashboard' && (
        <DashOverview
          state={state}
          customerInstances={customerInstances}
          selectedInstance={selectedInstance}
          liveTick={liveTick}
          scenario={scenario}
          onSelectInstance={onSelectInstance}
          onOpenTerminal={onOpenTerminal}
          onPayInvoice={onPayInvoice}
        />
      )}
      {section === 'billing' && (
        <DashBilling
          state={state}
          liveTick={liveTick}
          onPayInvoice={onPayInvoice}
          onTopUpBalance={onTopUpBalance}
        />
      )}
      {section === 'settings' && (
        <DashSettings
          state={state}
          liveTick={liveTick}
          scenario={scenario}
          selectedInstance={selectedInstance}
          onTopUpBalance={onTopUpBalance}
          onOpenTerminal={onOpenTerminal}
        />
      )}
    </div>
  )
}

// ─── Dashboard Overview ───────────────────────────────────────────────────────

function DashOverview({
  state,
  customerInstances,
  selectedInstance,
  liveTick,
  scenario,
  onSelectInstance,
  onOpenTerminal,
  onPayInvoice,
}: {
  state: DemoState
  customerInstances: Instance[]
  selectedInstance: Instance
  liveTick: number
  scenario: SimulationScenario
  onSelectInstance: (id: string) => void
  onOpenTerminal: (i: Instance) => void
  onPayInvoice: (id: string) => void
}) {
  return (
    <div className="space-y-6">
      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Wallet balance"
          value={`$${state.account.balance.toFixed(2)}`}
          hint={state.account.savedPaymentMethod}
          tone="blue"
        />
        <MetricCard
          label="Next renewal"
          value={state.account.nextRenewal}
          hint={state.account.email}
          tone="purple"
        />
        <MetricCard
          label="Active VPS"
          value={String(customerInstances.filter((i) => i.status === 'running').length)}
          hint="Machines online"
          tone="emerald"
        />
        <MetricCard
          label="Open invoices"
          value={String(state.invoices.filter((i) => i.status !== 'paid').length)}
          hint="Awaiting payment"
          tone="pink"
        />
      </div>

      {/* Main layout */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        {/* Instance list */}
        <GlassCard
          title="Your machines"
          description="Toàn bộ VPS đang được quản lý trong tài khoản này."
        >
          <div className="space-y-3">
            {customerInstances.map((instance) => (
              <CustomerInstanceRow
                key={instance.id}
                instance={instance}
                selected={selectedInstance.id === instance.id}
                liveTick={liveTick}
                scenario={scenario}
                onSelect={() => onSelectInstance(instance.id)}
                onOpenTerminal={() => onOpenTerminal(instance)}
              />
            ))}

            {customerInstances.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <MonitorCog className="size-10 text-slate-600" />
                <p className="text-slate-400">Chưa có VPS nào trong tài khoản</p>
                <Button
                  variant="outline"
                  className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/5"
                >
                  Xem gói hosting
                </Button>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Selected instance detail */}
          <GlassCard title={selectedInstance.name} description="Instance đang chọn">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Status</span>
                <Badge className={statusClass(selectedInstance.status)}>
                  {selectedInstance.status}
                </Badge>
              </div>
              <InfoTile label="IP Address" value={selectedInstance.ip} mono />
              <InfoTile label="OS" value={selectedInstance.os} />
              <InfoTile label="Renewal" value={state.account.nextRenewal} />

              <ProgressLine
                label="CPU burst"
                value={resourcePulse(selectedInstance.cpuCores * 14, liveTick, scenario, 18)}
                tone="blue"
              />
              <ProgressLine
                label="Bandwidth"
                value={resourcePulse(selectedInstance.bandwidthTb * 15, liveTick + 2, scenario, 20)}
                tone="purple"
              />

              <Button
                className="w-full bg-slate-900 text-white hover:bg-slate-800"
                onClick={() => onOpenTerminal(selectedInstance)}
              >
                <Terminal className="size-4" />
                Open Console
              </Button>
            </div>
          </GlassCard>

          {/* Pending invoice */}
          {state.invoices.filter((i) => i.status !== 'paid').length > 0 && (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-amber-200">
                <ReceiptText className="size-4" />
                Invoice chờ thanh toán
              </div>
              {state.invoices
                .filter((i) => i.status !== 'paid')
                .slice(0, 2)
                .map((inv) => (
                  <div key={inv.id} className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white">{inv.number}</p>
                      <p className="text-xs text-amber-100/70">Due {inv.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm text-white">${inv.amount}</p>
                      <button
                        type="button"
                        onClick={() => onPayInvoice(inv.id)}
                        className="mt-1 text-xs text-amber-300 hover:text-amber-100"
                      >
                        Pay now →
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CustomerInstanceRow({
  instance,
  selected,
  liveTick,
  scenario,
  onSelect,
  onOpenTerminal,
}: {
  instance: Instance
  selected: boolean
  liveTick: number
  scenario: SimulationScenario
  onSelect: () => void
  onOpenTerminal: () => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => handleCardKeyDown(e, onSelect)}
      className={cn(
        'rounded-3xl border px-5 py-4 text-left transition-all outline-none cursor-pointer',
        selected
          ? 'border-blue-500/30 bg-blue-500/10'
          : 'border-white/5 bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.05]',
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-base font-semibold text-white">{instance.name}</p>
          <p className="mt-1 text-xs text-slate-500">
            {instance.os} · {instance.ownerName}
          </p>
          <p className="mt-1.5 font-mono text-xs text-slate-400">{instance.ip}</p>
        </div>
        <Badge className={statusClass(instance.status)}>{instance.status}</Badge>
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
        <span>{instance.cpuCores} vCPU</span>
        <span>·</span>
        <span>{instance.ramGb} GB RAM</span>
        <span>·</span>
        <span>${instance.priceMonthly}/mo</span>
      </div>

      <MiniSparkline
        values={buildTelemetryBars(instance.cpuCores * 12, liveTick, scenario)}
        tone="blue"
        height={28}
      />

      <div
        className="mt-3 flex gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="outline"
          className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/5"
          onClick={onOpenTerminal}
        >
          <Terminal className="size-4" />
          Open Console
        </Button>
      </div>
    </div>
  )
}

// ─── Billing ──────────────────────────────────────────────────────────────────

function DashBilling({
  state,
  liveTick,
  onPayInvoice,
  onTopUpBalance,
}: {
  state: DemoState
  liveTick: number
  onPayInvoice: (id: string) => void
  onTopUpBalance: (amount: number) => void
}) {
  const totalSpend = state.invoices
    .filter((i) => i.status === 'paid')
    .reduce((s, i) => s + i.amount, 0)

  const topUpAmounts = [10, 25, 50, 100]

  return (
    <div className="space-y-6">
      {/* Billing KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Current balance"
          value={`$${state.account.balance.toFixed(2)}`}
          hint={state.account.savedPaymentMethod}
          tone="blue"
        />
        <MetricCard
          label="Total paid"
          value={`$${totalSpend}`}
          hint="All-time paid invoices"
          tone="emerald"
        />
        <MetricCard
          label="Next renewal"
          value={state.account.nextRenewal}
          hint="Auto-charge scheduled"
          tone="purple"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* Wallet */}
        <div className="space-y-4">
          <GlassCard title="Wallet" description="Số dư và phương thức thanh toán.">
            <div className="space-y-4">
              {/* Balance meter */}
              <div className="rounded-3xl border border-white/5 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_60%)] p-5">
                <p className="text-xs uppercase tracking-wider text-slate-500">Available balance</p>
                <p className="mt-3 text-4xl font-bold tabular-nums text-white">
                  ${state.account.balance.toFixed(2)}
                </p>
                <p className="mt-2 text-sm text-slate-400">{state.account.email}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <CreditCard className="size-3.5" />
                  {state.account.savedPaymentMethod}
                </div>
              </div>

              {/* Top-up amounts */}
              <div>
                <p className="mb-3 text-xs text-slate-500">Quick top-up</p>
                <div className="grid grid-cols-4 gap-2">
                  {topUpAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => onTopUpBalance(amount)}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] py-3 text-sm font-medium text-white transition-colors hover:bg-blue-500/10 hover:border-blue-500/20"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>

              <Button className="w-full bg-blue-500 text-white hover:bg-blue-400">
                <Wallet className="size-4" />
                Manage payment methods
              </Button>
            </div>
          </GlassCard>

          {/* Spending summary */}
          <GlassCard title="This month" description="">
            <div className="space-y-3">
              {[
                { label: 'Compute', value: state.instances.reduce((s, i) => s + i.priceMonthly * 0.7, 0).toFixed(2) },
                { label: 'Storage', value: state.instances.reduce((s, i) => s + i.priceMonthly * 0.2, 0).toFixed(2) },
                { label: 'Bandwidth', value: state.instances.reduce((s, i) => s + i.priceMonthly * 0.1, 0).toFixed(2) },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="font-mono text-white">${item.value}</span>
                </div>
              ))}
              <div className="border-t border-white/5 pt-3 flex items-center justify-between text-sm font-semibold">
                <span className="text-white">Total</span>
                <span className="font-mono text-white">
                  ${state.instances.reduce((s, i) => s + i.priceMonthly, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Invoice list */}
        <GlassCard title="Invoices" description="Lịch sử thanh toán và hóa đơn chờ.">
          <div className="space-y-3">
            {state.invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="rounded-2xl border border-white/5 bg-white/[0.03] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-xl',
                        invoice.status === 'paid'
                          ? 'bg-emerald-500/10 text-emerald-300'
                          : invoice.status === 'overdue'
                            ? 'bg-rose-500/10 text-rose-300'
                            : 'bg-blue-500/10 text-blue-300',
                      )}
                    >
                      {invoice.status === 'paid' ? (
                        <CheckCircle className="size-4" />
                      ) : (
                        <Receipt className="size-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white">{invoice.number}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{invoice.description}</p>
                    </div>
                  </div>
                  <Badge className={invoiceBadge(invoice.status)}>{invoice.status}</Badge>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <div className="space-y-0.5 text-xs text-slate-500">
                    <p>Issued: {invoice.issuedAt}</p>
                    <p>Due: {invoice.dueDate}</p>
                  </div>
                  <span className="font-mono text-lg font-semibold text-white">
                    ${invoice.amount}
                  </span>
                </div>

                {invoice.status !== 'paid' && (
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      className="w-full border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/5"
                      onClick={() => onPayInvoice(invoice.id)}
                    >
                      <CircleDollarSign className="size-4" />
                      Pay now
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

// ─── Settings ─────────────────────────────────────────────────────────────────

function DashSettings({
  state,
  liveTick,
  scenario,
  selectedInstance,
  onTopUpBalance,
  onOpenTerminal,
}: {
  state: DemoState
  liveTick: number
  scenario: SimulationScenario
  selectedInstance: Instance
  onTopUpBalance: (amount: number) => void
  onOpenTerminal: (i: Instance) => void
}) {
  const [receiptMode, setReceiptMode] = useState<'instant' | 'daily-digest'>('instant')
  const [notifLevel, setNotifLevel] = useState<'all' | 'billing' | 'critical'>('all')
  const [twoFa, setTwoFa] = useState(false)

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      {/* Profile */}
      <div className="space-y-4">
        <GlassCard title="Profile" description="Thông tin tài khoản và phương thức thanh toán.">
          <div className="space-y-3">
            {/* Avatar area */}
            <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-lg font-bold text-white">
                {state.account.name.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-white">{state.account.name}</p>
                <p className="text-sm text-slate-400">{state.account.email}</p>
              </div>
            </div>

            <InfoTile label="Email" value={state.account.email} />
            <InfoTile label="Payment method" value={state.account.savedPaymentMethod} />
            <InfoTile label="Account type" value="Client Portal" />
            <InfoTile label="Next billing" value={state.account.nextRenewal} />
          </div>
        </GlassCard>

        {/* Security */}
        <GlassCard title="Security" description="Bảo mật tài khoản.">
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setTwoFa(!twoFa)}
              className={cn(
                'flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all',
                twoFa
                  ? 'border-emerald-500/20 bg-emerald-500/10'
                  : 'border-white/5 bg-white/[0.03] hover:border-white/10 hover:bg-white/5',
              )}
            >
              <div className="flex items-center gap-3">
                <Shield className={cn('size-4', twoFa ? 'text-emerald-300' : 'text-slate-500')} />
                <div>
                  <p className="text-sm font-medium text-white">Two-factor auth</p>
                  <p className="text-xs text-slate-500">{twoFa ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
              <div
                className={cn(
                  'h-5 w-9 rounded-full transition-all',
                  twoFa ? 'bg-emerald-500' : 'bg-slate-700',
                )}
              >
                <div
                  className={cn(
                    'mt-0.5 size-4 rounded-full bg-white shadow transition-transform',
                    twoFa ? 'translate-x-4.5' : 'translate-x-0.5',
                  )}
                />
              </div>
            </button>

            <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
              <KeyRound className="size-4 text-slate-500" />
              <div className="flex-1">
                <p className="text-sm text-white">API keys</p>
                <p className="text-xs text-slate-500">2 keys active</p>
              </div>
              <button type="button" className="text-xs text-blue-400 hover:text-blue-300">
                Manage →
              </button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Preferences + Quick actions */}
      <div className="space-y-4">
        <GlassCard title="Notification preferences" description="Cài đặt cách nhận thông báo.">
          <div className="space-y-3">
            {/* Receipt mode */}
            <div>
              <p className="mb-2 text-xs text-slate-500">Receipt delivery</p>
              <div className="grid grid-cols-2 gap-2">
                {(['instant', 'daily-digest'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setReceiptMode(mode)}
                    className={cn(
                      'rounded-2xl border p-3 text-left text-sm transition-all',
                      receiptMode === mode
                        ? 'border-blue-500/30 bg-blue-500/10 text-white'
                        : 'border-white/5 bg-white/[0.03] text-slate-400 hover:bg-white/5',
                    )}
                  >
                    <MailCheck className={cn('size-4 mb-2', receiptMode === mode ? 'text-blue-300' : 'text-slate-500')} />
                    {mode === 'instant' ? 'Instant mail' : 'Daily digest'}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification level */}
            <div>
              <p className="mb-2 text-xs text-slate-500">Alert level</p>
              <div className="grid grid-cols-3 gap-2">
                {(['all', 'billing', 'critical'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setNotifLevel(level)}
                    className={cn(
                      'rounded-xl border p-2.5 text-xs font-medium capitalize transition-all',
                      notifLevel === level
                        ? 'border-blue-500/30 bg-blue-500/10 text-white'
                        : 'border-white/5 bg-white/[0.03] text-slate-400 hover:bg-white/5',
                    )}
                  >
                    <Bell className={cn('mx-auto mb-1.5 size-3.5', notifLevel === level ? 'text-blue-300' : 'text-slate-600')} />
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Quick actions */}
        <GlassCard title="Quick actions" description="Những thứ khách hàng cần nhất — một chạm.">
          <div className="space-y-3">
            <ProgressLine
              label="Portal readiness"
              value={resourcePulse(88, liveTick, scenario, 8)}
              tone="pink"
            />

            <div className="grid gap-2">
              <Button
                className="w-full bg-blue-500 text-white hover:bg-blue-400"
                onClick={() => onTopUpBalance(10)}
              >
                <CircleDollarSign className="size-4" />
                Quick top-up $10
              </Button>
              <Button
                variant="outline"
                className="w-full border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/5"
                onClick={() => onOpenTerminal(selectedInstance)}
              >
                <Terminal className="size-4" />
                Open console
              </Button>
              <Button
                variant="outline"
                className="w-full border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/5"
              >
                <RefreshCw className="size-4" />
                Refresh account data
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Referral */}
        <div className="rounded-3xl border border-purple-500/20 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.12),transparent_60%)] p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-purple-200">
            <TrendingUp className="size-4" />
            Referral program
          </div>
          <p className="mt-2 text-sm leading-6 text-purple-100/80">
            Giới thiệu bạn bè và nhận{' '}
            <strong className="text-purple-200">$10 credit</strong> mỗi người đăng ký thành công.
          </p>
          <Button
            variant="outline"
            className="mt-4 border-purple-500/30 bg-purple-500/10 text-purple-200 hover:bg-purple-500/15"
          >
            <Globe className="size-4" />
            Get referral link
          </Button>
        </div>
      </div>
    </div>
  )
}

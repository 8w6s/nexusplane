'use client'

import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { ChevronDown, Maximize2, Plus, Send, Terminal, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { CustomerAccount, Instance, Node, Region, ShopPlan } from '@/types'

function quotePlanCheckout(plan: ShopPlan, couponCode: string) {
  const subtotal = plan.priceMonthly || 0
  let discount = 0
  if (couponCode.toUpperCase() === 'NEXUS10') {
    discount = subtotal * 0.1
  }
  return { 
    subtotal, 
    discount, 
    total: Math.max(0, subtotal - discount), 
    couponCode: discount > 0 ? couponCode : '' 
  }
}

interface NodeProvisionModalProps {
  regions: Region[]
  selectedRegionId: string
  onClose: () => void
  onSubmit: (node: Node) => void
}

interface InstanceDeployModalProps {
  regions: Region[]
  nodes: Node[]
  plans: ShopPlan[]
  onClose: () => void
  onSubmit: (instance: Instance) => void
}

interface TerminalModalProps {
  instance: Instance
  onClose: () => void
  onPowerAction: (action: 'start' | 'stop' | 'restart') => void
}

interface CheckoutModalProps {
  plan: ShopPlan
  account: CustomerAccount
  onClose: () => void
  onSubmit: (payload: { billingEmail: string; paymentMethod: string; couponCode: string }) => Promise<void> | void
  isSubmitting?: boolean
}

const ipv4Pattern =
  /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/

function createNodeId(name: string) {
  return `node-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(16).slice(2, 6)}`
}

function createInstanceId(name: string) {
  return `inst-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(16).slice(2, 6)}`
}

export function NodeProvisionModal({ regions, selectedRegionId, onClose, onSubmit }: NodeProvisionModalProps) {
  const [name, setName] = useState('')
  const [provider, setProvider] = useState('Bare Metal')
  const [regionId, setRegionId] = useState(selectedRegionId)
  const [ip, setIp] = useState('192.168.1.240')
  const [os, setOs] = useState('Ubuntu Server 24.04')
  const [cpuCores, setCpuCores] = useState('16')
  const [ramGb, setRamGb] = useState('64')
  const [storageTb, setStorageTb] = useState('1.2')
  const [tags, setTags] = useState('KVM, Docker, Billing')
  const [error, setError] = useState<string | null>(null)

  const region = useMemo(
    () => regions.find((item) => item.id === regionId) ?? regions[0],
    [regions, regionId],
  )

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Tên node không được để trống.')
      return
    }

    if (!ipv4Pattern.test(ip.trim())) {
      setError('Địa chỉ IP phải là IPv4 hợp lệ.')
      return
    }

    const cpu = Number(cpuCores)
    const ram = Number(ramGb)
    const storage = Number(storageTb)

    if ([cpu, ram, storage].some((value) => Number.isNaN(value) || value <= 0)) {
      setError('CPU, RAM và Storage phải là số hợp lệ lớn hơn 0.')
      return
    }

    onSubmit({
      id: createNodeId(name),
      name: name.trim(),
      provider: provider.trim(),
      regionId: region.id,
      ip: ip.trim(),
      os: os.trim(),
      status: 'online',
      agentMode: provider === 'Bare Metal' ? 'local' : 'cloud',
      cpuCores: cpu,
      ramGb: ram,
      storageTb: Number(storage.toFixed(1)),
      load: 18 + Math.floor(Math.random() * 18),
      uptimeDays: 1,
      instanceCount: 0,
      hardwareId: `HW-${Math.random().toString(16).slice(2, 6).toUpperCase()}-${Math.random().toString(16).slice(2, 6).toUpperCase()}`,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    })
  }

  return (
    <ModalShell title="Provision New Node" subtitle={`${region.name} · ${region.datacenter}`} onClose={onClose}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Node Name">
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="prod-core-vn-02" />
        </Field>
        <Field label="Provider">
          <Input value={provider} onChange={(event) => setProvider(event.target.value)} placeholder="Bare Metal" />
        </Field>
        <Field label="Region">
          <select
            value={regionId}
            onChange={(event) => setRegionId(event.target.value)}
            className="h-10 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 text-sm text-white outline-none transition focus:border-blue-500/50"
          >
            {regions.map((item) => (
              <option key={item.id} value={item.id} className="bg-slate-950">
                {item.name} ({item.code})
              </option>
            ))}
          </select>
        </Field>
        <Field label="Public IP">
          <Input value={ip} onChange={(event) => setIp(event.target.value)} placeholder="192.168.1.240" />
        </Field>
        <Field label="Operating System">
          <Input value={os} onChange={(event) => setOs(event.target.value)} placeholder="Ubuntu Server 24.04" />
        </Field>
        <Field label="Tags">
          <Input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="KVM, Docker, Billing" />
        </Field>
        <Field label="CPU Cores">
          <Input value={cpuCores} onChange={(event) => setCpuCores(event.target.value)} type="number" min={1} />
        </Field>
        <Field label="RAM (GB)">
          <Input value={ramGb} onChange={(event) => setRamGb(event.target.value)} type="number" min={1} />
        </Field>
        <Field label="Storage (TB)">
          <Input value={storageTb} onChange={(event) => setStorageTb(event.target.value)} type="number" step="0.1" min={0.1} />
        </Field>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-400">
        <p className="font-medium text-white">Deployment target preview</p>
        <p className="mt-2 leading-6">
          {provider === 'Bare Metal' ? 'Local agent sẽ orchestration qua libvirt / Docker.' : 'Cloud API sẽ được sync qua control plane sau khi khởi tạo.'}
        </p>
      </div>

      {error && <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" className="border-slate-800 bg-transparent text-slate-300 hover:bg-white/5" onClick={onClose}>
          Cancel
        </Button>
        <Button className="bg-blue-500 text-white hover:bg-blue-400" onClick={handleSubmit}>
          <Plus className="size-4" />
          Provision Node
        </Button>
      </div>
    </ModalShell>
  )
}

export function InstanceDeployModal({ regions, nodes, plans, onClose, onSubmit }: InstanceDeployModalProps) {
  const [name, setName] = useState('')
  const [ownerName, setOwnerName] = useState('tenant-new')
  const [regionId, setRegionId] = useState(regions[0]?.id ?? '')
  const [planId, setPlanId] = useState(plans[0]?.id ?? '')
  const [os, setOs] = useState('Ubuntu 24.04')
  const [error, setError] = useState<string | null>(null)

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === planId) ?? plans[0],
    [plans, planId],
  )

  const targetNode = useMemo(
    () => nodes.find((node) => node.regionId === regionId) ?? nodes[0],
    [nodes, regionId],
  )

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Tên instance không được để trống.')
      return
    }

    if (!selectedPlan || !targetNode) {
      setError('Thiếu dữ liệu triển khai.')
      return
    }

    onSubmit({
      id: createInstanceId(name),
      name: name.trim(),
      kind: selectedPlan?.name?.includes('Game') ? 'game' : 'vps',
      os,
      regionId: targetNode?.regionId || 'us-east',
      nodeId: targetNode?.id || 'node-0',
      ip: `10.20.${Math.floor(Math.random() * 90) + 10}.${Math.floor(Math.random() * 150) + 10}`,
      status: 'provisioning',
      cpuCores: selectedPlan?.cpuCores || 1,
      ramGb: selectedPlan?.ramGb || 1,
      storageGb: selectedPlan?.storageGb || 20,
      bandwidthTb: selectedPlan?.bandwidthTb || 1,
      priceMonthly: selectedPlan?.priceMonthly || 5.0,
      createdAt: new Date().toISOString().slice(0, 10),
      ownerName: ownerName.trim() || 'tenant-demo',
      pinned: false,
    })
  }

  return (
    <ModalShell title="Deploy New Instance" subtitle={selectedPlan ? `${selectedPlan.name} · ${targetNode?.name ?? 'No node available'}` : 'Select a plan'} onClose={onClose}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Instance Name">
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="prod-web-02" />
        </Field>
        <Field label="Owner">
          <Input value={ownerName} onChange={(event) => setOwnerName(event.target.value)} placeholder="tenant-demo" />
        </Field>
        <Field label="Region">
          <select
            value={regionId}
            onChange={(event) => setRegionId(event.target.value)}
            className="h-10 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 text-sm text-white outline-none transition focus:border-blue-500/50"
          >
            {regions.map((region) => (
              <option key={region.id} value={region.id} className="bg-slate-950">
                {region.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Plan">
          <select
            value={planId}
            onChange={(event) => setPlanId(event.target.value)}
            className="h-10 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 text-sm text-white outline-none transition focus:border-blue-500/50"
          >
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id} className="bg-slate-950">
                {plan.name} · ${plan.priceMonthly}/mo
              </option>
            ))}
          </select>
        </Field>
        <Field label="Operating System">
          <Input value={os} onChange={(event) => setOs(event.target.value)} placeholder="Ubuntu 24.04" />
        </Field>
        <Field label="Provision Target">
          <Input value={targetNode?.name ?? 'No node'} readOnly />
        </Field>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-400">
        <div className="flex items-center justify-between text-white">
          <span>Estimate</span>
          <span className="font-mono text-blue-300">${selectedPlan?.priceMonthly ?? 0}/month</span>
        </div>
        <p className="mt-2 leading-6">
          {selectedPlan?.cpuCores ?? 0} vCPU · {selectedPlan?.ramGb ?? 0}GB RAM · {selectedPlan?.storageGb ?? 0}GB NVMe · {selectedPlan?.bandwidthTb ?? 0}TB bandwidth
        </p>
      </div>

      {error && <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" className="border-slate-800 bg-transparent text-slate-300 hover:bg-white/5" onClick={onClose}>
          Cancel
        </Button>
        <Button className="bg-blue-500 text-white hover:bg-blue-400" onClick={handleSubmit}>
          <Plus className="size-4" />
          Deploy Instance
        </Button>
      </div>
    </ModalShell>
  )
}

export function CheckoutModal({ plan, account, onClose, onSubmit, isSubmitting = false }: CheckoutModalProps) {
  const [billingEmail, setBillingEmail] = useState(account.email)
  const [paymentMethod, setPaymentMethod] = useState(account.savedPaymentMethod)
  const [couponCode, setCouponCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setBillingEmail(account.email)
    setPaymentMethod(account.savedPaymentMethod)
  }, [account.email, account.savedPaymentMethod, plan.id])

  const quote = useMemo(() => quotePlanCheckout(plan, couponCode), [couponCode, plan])

  const handleSubmit = async () => {
    const normalizedEmail = billingEmail.trim()

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      setError('Email thanh toán không hợp lệ.')
      return
    }

    if (!paymentMethod.trim()) {
      setError('Vui lòng chọn phương thức thanh toán.')
      return
    }

    setError(null)

    try {
      await Promise.resolve(
        onSubmit({
          billingEmail: normalizedEmail,
          paymentMethod: paymentMethod.trim(),
          couponCode: couponCode.trim(),
        }),
      )
    } catch {
      setError('Không thể tạo checkout trong chế độ demo này.')
    }
  }

  return (
    <ModalShell title={`Secure checkout · ${plan.name}`} subtitle="Mọi bước đều là demo, nhưng state vẫn được lưu qua SQLite." onClose={onClose} size="xl">
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Billing email">
              <Input value={billingEmail} onChange={(event) => setBillingEmail(event.target.value)} placeholder="jordan@example.com" />
            </Field>
            <Field label="Payment method">
              <select
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="h-10 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 text-sm text-white outline-none transition focus:border-blue-500/50"
              >
                {Array.from(new Set([account.savedPaymentMethod, 'Visa •••• 4242', 'Mastercard •••• 1881', 'Bank transfer', 'Momo'])).map((method) => (
                  <option key={method} value={method} className="bg-slate-950">
                    {method}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Coupon code">
              <Input value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="NEXUS10" />
            </Field>
            <Field label="Invoice reference">
              <Input value="Generated after confirmation" readOnly />
            </Field>
          </div>

          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-400">Order notes</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Sau khi xác nhận, hệ thống sẽ tạo một hóa đơn mới, ghi vào SQLite và chuyển bạn sang khu Billing để tiếp tục thanh toán giả.
            </p>
          </div>

          {error && <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" className="border-slate-800 bg-transparent text-slate-300 hover:bg-white/5" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button className="bg-blue-500 text-white hover:bg-blue-400" onClick={handleSubmit} disabled={isSubmitting}>
              <Plus className="size-4" />
              {isSubmitting ? 'Creating invoice...' : 'Confirm checkout'}
            </Button>
          </div>
        </div>

        <div className="space-y-4 rounded-[1.75rem] border border-white/5 bg-slate-950/80 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Summary</p>
            <p className="mt-2 text-2xl font-semibold text-white">{plan.name}</p>
            <p className="mt-1 text-sm text-slate-400">{plan.cpuCores} vCPU · {plan.ramGb}GB RAM · {plan.storageGb}GB NVMe</p>
          </div>

          <div className="space-y-3 rounded-3xl border border-white/5 bg-white/[0.03] p-4 text-sm text-slate-300">
            <Row label="Subtotal" value={`$${quote.subtotal.toFixed(2)}`} />
            <Row label="Discount" value={quote.discount > 0 ? `-$${quote.discount.toFixed(2)} (${quote.couponCode})` : '—'} />
            <Row label="Billing email" value={normalizedAccountEmail(account.email, billingEmail)} />
            <Row label="Payment method" value={paymentMethod || account.savedPaymentMethod} />
            <div className="h-px bg-white/5" />
            <Row label="Total due" value={`$${quote.total.toFixed(2)}`} emphasis />
          </div>

          <div className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-100">
            <p className="font-medium text-blue-200">Checkout flow</p>
            <p className="mt-2 leading-6 text-blue-100/85">
              1. Tạo invoice giả.
              <br />
              2. Ghi dữ liệu vào SQLite.
              <br />
              3. Chuyển sang billing để thanh toán mô phỏng.
            </p>
          </div>
        </div>
      </div>
    </ModalShell>
  )
}

export function TerminalModal({ instance, onClose, onPowerAction }: TerminalModalProps) {
  const [command, setCommand] = useState('')
  const [history, setHistory] = useState<string[]>([
    `Connected to ${instance.name}...`,
    `root@${instance.name}:~#`,
  ])

  const commandBook: Record<string, string[]> = {
    uptime: [' 20:42:51 up 42 days, 12:30, 1 user, load average: 0.34, 0.31, 0.29', `root@${instance.name}:~#`],
    'df -h': [
      'Filesystem      Size  Used Avail Use% Mounted on',
      '/dev/sda1      120G   44G   76G  37% /',
      '/dev/sdb1      240G   90G  150G  38% /mnt/data',
      `root@${instance.name}:~#`,
    ],
    'docker ps': ['CONTAINER ID   IMAGE   STATUS', 'c1a2b3d4      nexusplane/api   Up 12m', `root@${instance.name}:~#`],
    'virsh list': ['Id   Name            State', `-    ${instance.name}   ${instance.status}`, `root@${instance.name}:~#`],
    'journalctl -n 20': [
      '[INFO] Agent heartbeat successful',
      '[INFO] Instance runtime healthy',
      '[WARN] Minor CPU burst detected',
      `root@${instance.name}:~#`,
    ],
  }

  const runCommand = () => {
    const nextCommand = command.trim()
    if (!nextCommand) return

    if (nextCommand === 'restart') {
      onPowerAction('restart')
      setHistory((current) => [...current, `${instance.name}:~# ${nextCommand}`, 'Restart signal queued.', `root@${instance.name}:~#`])
      setCommand('')
      return
    }

    if (nextCommand === 'stop') {
      onPowerAction('stop')
      setHistory((current) => [...current, `${instance.name}:~# ${nextCommand}`, 'Instance stop initiated.', `root@${instance.name}:~#`])
      setCommand('')
      return
    }

    if (nextCommand === 'start') {
      onPowerAction('start')
      setHistory((current) => [...current, `${instance.name}:~# ${nextCommand}`, 'Instance start initiated.', `root@${instance.name}:~#`])
      setCommand('')
      return
    }

    setHistory((current) => [
      ...current,
      `${instance.name}:~# ${nextCommand}`,
      ...(commandBook[nextCommand] ?? [
        `bash: ${nextCommand}: command not found`,
        'Try: uptime, df -h, docker ps, virsh list, journalctl -n 20, start, stop, restart',
        `root@${instance.name}:~#`,
      ]),
    ])
    setCommand('')
  }

  return (
    <ModalShell title={`Console · ${instance.name}`} subtitle={instance.ip} onClose={onClose} size="xl">
      <div className="rounded-2xl border border-slate-800 bg-black p-4 font-mono text-sm text-emerald-400 shadow-2xl shadow-black/40">
        <div className="max-h-[22rem] space-y-1 overflow-y-auto">
          {history.map((line, index) => (
            <div key={`${line}-${index}`} className={cn('leading-6', line.startsWith('bash:') && 'text-rose-400')}>
              {line}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3 border-t border-white/5 pt-4 text-emerald-400">
          <span className="shrink-0">root@{instance.name}:~#</span>
          <input
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') runCommand()
            }}
            className="w-full bg-transparent text-emerald-300 outline-none placeholder:text-emerald-700"
            placeholder="uptime, df -h, docker ps, virsh list, restart..."
          />
          <button
            type="button"
            onClick={runCommand}
            className="inline-flex size-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 transition-colors hover:bg-emerald-500/20"
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <QuickCommand onClick={() => setCommand('uptime')} icon={<Terminal className="size-4" />} label="Uptime" />
        <QuickCommand onClick={() => setCommand('docker ps')} icon={<Maximize2 className="size-4" />} label="Runtime" />
        <QuickCommand onClick={() => setCommand('restart')} icon={<ChevronDown className="size-4 rotate-90" />} label="Restart" />
      </div>
    </ModalShell>
  )
}

function ModalShell({
  title,
  subtitle,
  onClose,
  children,
  size = 'lg',
}: {
  title: string
  subtitle: string
  onClose: () => void
  children: ReactNode
  size?: 'lg' | 'xl'
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950 shadow-[0_30px_120px_rgba(0,0,0,0.6)] max-h-[calc(100vh-3rem)] overflow-y-auto',
          size === 'xl' ? 'max-w-5xl' : 'max-w-3xl',
        )}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.12),_transparent_38%)]" />
        <div className="relative border-b border-white/5 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
        <div className="relative px-6 py-6">{children}</div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="space-y-2 text-sm">
      <span className="block text-slate-400">{label}</span>
      {children}
    </label>
  )
}

function QuickCommand({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-left transition-colors hover:border-blue-500/30 hover:bg-slate-900/70"
    >
      <span className="inline-flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">{icon}</span>
      <span className="text-sm font-medium text-white">{label}</span>
    </button>
  )
}

function Row({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className={cn('text-right font-mono text-slate-200', emphasis && 'text-base font-semibold text-white')}>{value}</span>
    </div>
  )
}

function normalizedAccountEmail(accountEmail: string, billingEmail: string) {
  return billingEmail.trim() || accountEmail
}


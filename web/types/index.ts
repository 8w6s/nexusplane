export type DemoDomain = 'admin' | 'panel' | 'dash' | 'shop'

export type DomainSectionMap = {
  admin: 'overview' | 'fleet' | 'license' | 'analytics'
  panel: 'instances' | 'images' | 'networking' | 'activity'
  dash: 'dashboard' | 'billing' | 'settings'
  shop: 'catalog' | 'api' | 'brand'
}

export type DomainSection = DomainSectionMap[DemoDomain]

export type LicenseStatus = 'active' | 'expired' | 'trial'
export type NodeStatus = 'online' | 'degraded' | 'maintenance' | 'offline'
export type InstanceStatus = 'running' | 'stopped' | 'paused' | 'provisioning'
export type AlertSeverity = 'info' | 'warning' | 'critical'
export type InvoiceStatus = 'paid' | 'open' | 'overdue'
export type StorefrontTheme = 'midnight' | 'paper'
export type SimulationScenario = 'balanced' | 'traffic-spike' | 'maintenance-window' | 'revenue-push'

export interface Region {
  id: string
  name: string
  code: string
  country: string
  datacenter: string
  timezone: string
  accent: string
}

export interface Node {
  id: string
  name: string
  provider: string
  regionId: string
  ip: string
  os: string
  status: NodeStatus
  agentMode: 'local' | 'cloud'
  cpuCores: number
  ramGb: number
  storageTb: number
  load: number
  uptimeDays: number
  instanceCount: number
  hardwareId: string
  tags: string[]
}

export interface Instance {
  id: string
  name: string
  kind: 'vps' | 'game' | 'app'
  os: string
  regionId: string
  nodeId: string
  ip: string
  status: InstanceStatus
  cpuCores: number
  ramGb: number
  storageGb: number
  bandwidthTb: number
  priceMonthly: number
  createdAt: string
  ownerName: string
  pinned: boolean
}

export interface Alert {
  id: string
  severity: AlertSeverity
  title: string
  detail: string
  timestamp: string
  targetType: 'node' | 'instance' | 'license' | 'billing'
  targetId: string
  resolved: boolean
}

export interface License {
  key: string
  status: LicenseStatus
  hwid: string
  expiresAt: string
  plan: string
  readOnly: boolean
  seats: number
  version: string
}

export interface ShopPlan {
  id: string
  name: string
  priceMonthly: number
  cpuCores: number
  ramGb: number
  storageGb: number
  bandwidthTb: number
  accent: 'blue' | 'purple' | 'pink'
  highlights: string[]
  popular?: boolean
}

export interface Invoice {
  id: string
  number: string
  description: string
  amount: number
  status: InvoiceStatus
  dueDate: string
  issuedAt: string
}

export interface CustomerAccount {
  name: string
  email: string
  balance: number
  nextRenewal: string
  savedPaymentMethod: string
}

export interface CheckoutRequest {
  planId: string
  billingEmail?: string
  paymentMethod?: string
  couponCode?: string
}

export interface CheckoutQuote {
  subtotal: number
  discountRate: number
  discount: number
  total: number
  couponCode: string
}

export interface CheckoutResponse {
  invoice: Invoice
  account: CustomerAccount
  planId: string
  quote: CheckoutQuote
}

export interface DemoToast {
  id: string
  title: string
  message: string
  tone: 'success' | 'error' | 'info'
}

export interface LiveFeedItem {
  id: string
  domain: DemoDomain | 'system'
  title: string
  detail: string
  timestamp: string
  tone: AlertSeverity
  cta: string
}

export interface DemoState {
  activeDomain: DemoDomain
  activeSection: Record<DemoDomain, DomainSection>
  searchQuery: string
  selectedNodeId: string
  selectedInstanceId: string
  selectedPlanId: string
  storefrontTheme: StorefrontTheme
  regions: Region[]
  nodes: Node[]
  instances: Instance[]
  alerts: Alert[]
  license: License
  plans: ShopPlan[]
  invoices: Invoice[]
  account: CustomerAccount
  toasts: DemoToast[]
}


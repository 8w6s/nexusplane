import { create } from 'zustand';
import { 
  DemoDomain, DomainSection, StorefrontTheme, 
  LicenseStatus, Alert, DemoToast, CustomerAccount, Invoice 
} from '@/types';

interface NexusState {
  activeDomain: DemoDomain;
  activeSection: Record<DemoDomain, DomainSection>;
  searchQuery: string;
  selectedNodeId: string | null;
  selectedInstanceId: string | null;
  selectedPlanId: string | null;
  storefrontTheme: StorefrontTheme;
  license: { status: LicenseStatus; readOnly: boolean; expiresAt: string };
  account: CustomerAccount;
  alerts: Alert[];
  toasts: DemoToast[];
  invoices: Invoice[];
  
  // Actions
  setActiveDomain: (domain: DemoDomain) => void;
  setSection: (domain: DemoDomain, section: DomainSection) => void;
  setSearchQuery: (query: string) => void;
  selectNode: (id: string | null) => void;
  selectInstance: (id: string | null) => void;
  selectPlan: (id: string | null) => void;
  setStorefrontTheme: (theme: StorefrontTheme) => void;
  pushToast: (toast: Omit<DemoToast, 'id'>) => void;
  dismissToast: (id: string) => void;
  appendAlert: (alert: Alert) => void;
}

export const useNexusStore = create<NexusState>((set) => ({
  activeDomain: 'shop',
  activeSection: {
    admin: 'overview',
    panel: 'instances',
    dash: 'dashboard',
    shop: 'catalog',
  },
  searchQuery: '',
  selectedNodeId: null,
  selectedInstanceId: null,
  selectedPlanId: null,
  storefrontTheme: 'midnight',
  license: { status: 'active', readOnly: false, expiresAt: '2025-12-31' },
  account: { balance: 150.0, nextRenewal: '2024-05-01' },
  alerts: [],
  toasts: [],
  invoices: [],

  setActiveDomain: (domain) => set({ activeDomain: domain }),
  setSection: (domain, section) => set((state) => ({ 
    activeSection: { ...state.activeSection, [domain]: section } 
  })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectNode: (id) => set({ selectedNodeId: id }),
  selectInstance: (id) => set({ selectedInstanceId: id }),
  selectPlan: (id) => set({ selectedPlanId: id }),
  setStorefrontTheme: (theme) => set({ storefrontTheme: theme }),
  pushToast: (toast) => set((state) => ({
    toasts: [...state.toasts, { ...toast, id: `toast-${Date.now()}` }]
  })),
  dismissToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
  appendAlert: (alert) => set((state) => ({
    alerts: [alert, ...state.alerts].slice(0, 8)
  })),
}));

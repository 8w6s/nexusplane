"use client";

import { useMemo, useState } from "react";
import { DemoToastStack } from "@/components/dashboard/demo-toast";
import {
  AdminDomainPanel, DashDomainPanel, PanelDomainPanel, ShopDomainPanel,
} from "@/components/dashboard/domain-panels";
import {
  InstanceDeployModal, NodeProvisionModal, TerminalModal,
} from "@/components/dashboard/demo-modals";
import { NexusPlaneShell } from "@/components/dashboard/nexusplane-shell";
import { useNexusStore } from "@/store/nexus-store";
import { useNodes, useServers, usePlans } from "@/hooks/use-api";
import { apiClient } from "@/lib/api-client";
import type { Instance, Node, ShopPlan } from "@/types";

export function DashboardClient() {
  const store = useNexusStore();
  const { nodes, mutateNodes } = useNodes();
  const { servers, mutateServers } = useServers();
  const { plans } = usePlans();

  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [terminalInstanceId, setTerminalInstanceId] = useState<string | null>(null);

  const query = store.searchQuery.trim().toLowerCase();

  const filteredNodes = useMemo(() => {
    if (!query) return nodes;
    return nodes.filter((node) =>
      [node.name, node.provider, node.ip, node.os, node.regionId].some((value) =>
        value?.toLowerCase().includes(query)
      ),
    );
  }, [query, nodes]);

  const filteredInstances = useMemo(() => {
    if (!query) return servers;
    return servers.filter((instance) =>
      [instance.name, instance.ip, instance.ownerName, instance.status].some((value) =>
        value?.toLowerCase().includes(query)
      ),
    );
  }, [query, servers]);

  const filteredPlans = useMemo(() => {
    if (!query) return plans;
    return plans.filter((plan) =>
      [plan.name, String(plan.priceMonthly)].some((value) => value.toLowerCase().includes(query)),
    );
  }, [query, plans]);

  const activeNode = filteredNodes.find((n) => n.id === store.selectedNodeId) ?? filteredNodes[0] ?? { id: "", name: "Loading Node...", provider: "...", regionId: "...", ip: "...", os: "...", status: "offline", instanceCount: 0, hardwareId: "", tags: [], createdAt: "" };
  const activeInstance = filteredInstances.find((i) => i.id === store.selectedInstanceId) ?? filteredInstances[0] ?? { id: "", name: "Loading Instance...", ip: "...", status: "unknown" };
  const activePlan = filteredPlans.find((p) => p.id === store.selectedPlanId) ?? filteredPlans[0] ?? { id: "", name: "Loading Plan...", priceMonthly: 0, cpuCores: 0, ramGb: 0, storageGb: 0, bandwidthTb: 0, highlights: [] };

  const summary = useMemo(() => {
    if (store.activeDomain === "admin") {
      return [
        { label: "Fleet", value: `${nodes.length} nodes`, tone: "blue" as const },
        { label: "Alerts", value: `${store.alerts.length} signals`, tone: "purple" as const },
        { label: "Status", value: "Online", tone: "emerald" as const },
      ];
    }
    if (store.activeDomain === "panel") {
      return [
        { label: "Instances", value: `${servers.length}`, tone: "blue" as const },
        { label: "Running", value: `${servers.filter(i => i.status === 'running').length}`, tone: "emerald" as const },
        { label: "Selected", value: activeInstance?.name || "None", tone: "purple" as const },
      ];
    }
    if (store.activeDomain === "dash") {
      return [
        { label: "Balance", value: `$${store.account.balance.toFixed(2)}`, tone: "blue" as const },
        { label: "Active Subs", value: "1", tone: "emerald" as const },
      ];
    }
    return [
      { label: "Plans", value: `${plans.length}`, tone: "blue" as const },
      { label: "Shop Status", value: "Live", tone: "purple" as const },
      { label: "Conversion", value: "9.5%", tone: "pink" as const },
    ];
  }, [store.activeDomain, nodes.length, servers, activeInstance, store.account.balance, plans.length, store.alerts.length]);

  const primaryActionLabel =
    store.activeDomain === "admin"
      ? "Provision Node"
      : store.activeDomain === "panel"
      ? "Deploy Instance"
      : store.activeDomain === "dash"
      ? "Top up Billing"
      : "Checkout Selected Plan";

  const handlePrimaryAction = () => {
    if (store.activeDomain === "admin") return setIsNodeModalOpen(true);
    if (store.activeDomain === "panel") return setIsDeployModalOpen(true);
    if (store.activeDomain === "dash") {
      store.pushToast({ tone: "info", title: "Coming soon", message: "Stripe integration pending." });
      return;
    }
    handlePurchasePlan(activePlan);
  };

  const handleInstanceSubmit = async (instance: Instance) => {
    store.pushToast({ tone: "info", title: "Provisioning", message: "Sending real request to Backend..." });
    setIsDeployModalOpen(false);
    try {
      await apiClient.post('/servers', {
        name: instance.name,
        region: instance.regionId,
        plan: instance.planId,
        image: instance.os,
      });
      store.pushToast({ tone: "success", title: "Success", message: "Server order submitted to Go Backend!" });
      mutateServers(); // re-fetch from UI
      store.setSection("panel", "instances");
    } catch (e) {
      store.pushToast({ tone: "error", title: "Failed", message: "Could not provision server" });
    }
  };

  const handleNodeSubmit = async (node: Node) => {
    setIsNodeModalOpen(false);
    store.pushToast({ tone: "warning", title: "Not implemented", message: "Admin POST /v1/nodes chưa làm :)" });
  };

  const handlePurchasePlan = (plan: ShopPlan) => {
    if (!plan) return;
    store.selectPlan(plan.id);
    store.pushToast({ tone: "success", title: "Checkout preview", message: `Ready to pay $${plan.priceMonthly} for ${plan.name}` });
  };

  const handleThemeToggle = () => {
    const nextTheme = store.storefrontTheme === "midnight" ? "paper" : "midnight";
    store.setStorefrontTheme(nextTheme);
  };

  return (
    <>
      <NexusPlaneShell
        activeDomain={store.activeDomain}
        onDomainChange={store.setActiveDomain}
        searchQuery={store.searchQuery}
        onSearchChange={store.setSearchQuery}
        primaryActionLabel={primaryActionLabel}
        onPrimaryAction={handlePrimaryAction}
        summary={summary}
        license={store.license}
        accountBalance={store.account.balance}
        storefrontTheme={store.storefrontTheme}
        onThemeToggle={handleThemeToggle}
        liveMode={true}
        onToggleLiveMode={() => {}}
        simulationScenario={"balanced"}
        onSimulationScenarioChange={() => {}}
        liveFeed={[]}
        liveStats={[]}
        statusMessage={"Live mode via REST APIs"}
      >
        {store.activeDomain === "admin" && (
          <AdminDomainPanel
            state={{ nodes, alerts: store.alerts, license: store.license } as any}
            section={store.activeSection.admin as any}
            selectedNode={activeNode}
            selectedRegion={{ id: 'us-east', name: 'US East' } as any}
            liveTick={1}
            scenario={"balanced"}
            liveFeed={[]}
            onSectionChange={(section) => store.setSection("admin", section)}
            onSelectNode={store.selectNode}
            onNodePatch={() => {}}
            onToggleLicense={() => {}}
            onOpenNodeModal={() => setIsNodeModalOpen(true)}
          />
        )}

        {store.activeDomain === "panel" && (
          <PanelDomainPanel
            state={{ instances: servers, nodes } as any}
            section={store.activeSection.panel as any}
            selectedInstance={activeInstance}
            selectedRegion={{ id: 'us-east', name: 'US East' } as any}
            selectedNode={nodes.find((n) => n.id === activeInstance?.nodeId)}
            liveTick={1}
            scenario={"balanced"}
            liveFeed={[]}
            onSectionChange={(section) => store.setSection("panel", section)}
            onSelectInstance={store.selectInstance}
            onInstanceAction={() => {}}
            onOpenDeployModal={() => setIsDeployModalOpen(true)}
            onOpenTerminal={(instance) => setTerminalInstanceId(instance.id)}
          />
        )}

        {store.activeDomain === "dash" && (
          <DashDomainPanel
            state={{ account: store.account, invoices: store.invoices, instances: servers } as any}
            section={store.activeSection.dash as any}
            selectedInstance={activeInstance}
            liveTick={1}
            scenario={"balanced"}
            onSectionChange={(section) => store.setSection("dash", section)}
            onSelectInstance={store.selectInstance}
            onOpenTerminal={(instance) => setTerminalInstanceId(instance.id)}
            onPayInvoice={() => {}}
            onTopUpBalance={() => {}}
          />
        )}

        {store.activeDomain === "shop" && (
          <ShopDomainPanel
            state={{ plans, storefrontTheme: store.storefrontTheme } as any}
            section={store.activeSection.shop as any}
            selectedPlan={activePlan}
            liveTick={1}
            scenario={"balanced"}
            onSectionChange={(section) => store.setSection("shop", section)}
            onSelectPlan={store.selectPlan}
            onPurchasePlan={handlePurchasePlan}
            onToggleTheme={handleThemeToggle}
            onCopyApiSnippet={async () => {
              await navigator.clipboard.writeText("fetch('/api/v1/catalog/plans')");
              store.pushToast({ tone: "success", title: "Copied!", message: ""});
            }}
          />
        )}
      </NexusPlaneShell>

      <DemoToastStack toasts={store.toasts} onDismiss={store.dismissToast} />

      {isNodeModalOpen && (
        <NodeProvisionModal
          regions={[{id: "us-east", name:"US East"}] as any}
          selectedRegionId={"us-east"}
          onClose={() => setIsNodeModalOpen(false)}
          onSubmit={handleNodeSubmit as any}
        />
      )}

      {isDeployModalOpen && (
        <InstanceDeployModal
          regions={[{id: "us-east", name:"US East"}] as any}
          nodes={nodes}
          plans={plans}
          onClose={() => setIsDeployModalOpen(false)}
          onSubmit={handleInstanceSubmit as any}
        />
      )}
    </>
  );
}

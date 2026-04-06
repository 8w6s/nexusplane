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
  const [checkoutPlan, setCheckoutPlan] = useState<ShopPlan | null>(null);

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

  const terminalInstance = useMemo(
    () => servers.find((i) => i.id === terminalInstanceId),
    [servers, terminalInstanceId]
  );

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
    handlePurchasePlan(activePlan as ShopPlan);
  };

  const handleInstanceSubmit = async (instance: Instance) => {
    store.pushToast({ tone: "info", title: "Provisioning", message: "Sending real request to Backend..." });
    setIsDeployModalOpen(false);
    try {
      await apiClient.post('/servers', {
        name: instance.name,
        region: instance.regionId,
        planId: instance.id, // Fixed: use instance.id which is planId in modal logic
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
    if (!plan?.id) return;
    setCheckoutPlan(plan);
  };

  const handleCheckoutSubmit = async (payload: any) => {
    setCheckoutPlan(null);
    store.pushToast({ tone: "success", title: "Checkout Successful", message: `Order for ${payload.billingEmail} processed.` });
  };

  const handleThemeToggle = () => {
    const nextTheme = store.storefrontTheme === "midnight" ? "paper" : "midnight";
    store.setStorefrontTheme(nextTheme);
  };

  const dummyRegion: Region = {
    id: 'us-east',
    name: 'US East',
    code: 'US-E',
    country: 'United States',
    datacenter: 'NJ-1',
    timezone: 'UTC-5',
    accent: 'blue'
  }

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
            nodes={nodes}
            instances={servers}
            alerts={store.alerts}
            license={store.license}
            section={store.activeSection.admin}
            selectedNode={activeNode as Node}
            selectedRegion={dummyRegion}
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
            instances={servers}
            nodes={nodes}
            regions={[dummyRegion]}
            section={store.activeSection.panel}
            selectedInstance={activeInstance as Instance}
            selectedRegion={dummyRegion}
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
            invoices={store.invoices}
            instances={servers}
            account={store.account}
            section={store.activeSection.dash}
            selectedInstance={activeInstance as Instance}
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
            plans={plans}
            storefrontTheme={store.storefrontTheme}
            section={store.activeSection.shop}
            selectedPlan={activePlan as ShopPlan}
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
          regions={[dummyRegion]}
          selectedRegionId={"us-east"}
          onClose={() => setIsNodeModalOpen(false)}
          onSubmit={handleNodeSubmit}
        />
      )}

      {isDeployModalOpen && (
        <InstanceDeployModal
          regions={[dummyRegion]}
          nodes={nodes}
          plans={plans}
          onClose={() => setIsDeployModalOpen(false)}
          onSubmit={handleInstanceSubmit}
        />
      )}

      {terminalInstance && (
        <TerminalModal
          instance={terminalInstance}
          onClose={() => setTerminalInstanceId(null)}
          onPowerAction={() => {}}
        />
      )}

      {checkoutPlan && (
        <CheckoutModal
          plan={checkoutPlan}
          account={store.account}
          onClose={() => setCheckoutPlan(null)}
          onSubmit={handleCheckoutSubmit}
        />
      )}
    </>
  );
}

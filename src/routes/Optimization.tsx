import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DataTable } from "../components/DataTable";
import { MetricCard } from "../components/MetricCard";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { api, queryKeys } from "../lib/api";
import { formatCurrency } from "../lib/calculations";
import { AccountSelector } from "../shared/ui/AccountSelector";
import { AsyncState } from "../shared/ui/AsyncState";
import type { OptimizationScenario } from "../types";

const columns: ColumnDef<OptimizationScenario>[] = [
  { accessorKey: "name", header: "Scenario" },
  { accessorKey: "lever", header: "Lever" },
  { accessorKey: "accountId", header: "Account" },
  { accessorKey: "annualSavings", header: "Annual savings", cell: ({ row }) => formatCurrency(row.original.annualSavings) },
  { accessorKey: "diversionLift", header: "Diversion lift", cell: ({ row }) => `${row.original.diversionLift}%` },
  { accessorKey: "serviceRisk", header: "Risk", cell: ({ row }) => <StatusBadge value={row.original.serviceRisk} /> },
  { accessorKey: "implementationEffort", header: "Effort", cell: ({ row }) => <StatusBadge value={row.original.implementationEffort} /> },
];

export function Optimization() {
  const accounts = useQuery({ queryKey: queryKeys.accounts, queryFn: api.accounts });
  const query = useQuery({ queryKey: queryKeys.optimizationScenarios(), queryFn: () => api.optimizationScenarios() });
  const [accountId, setAccountId] = useState("all");
  const filtered = useMemo(
    () => (accountId === "all" ? query.data : query.data?.filter((scenario) => scenario.accountId === accountId)),
    [accountId, query.data],
  );
  const totalSavings = (filtered ?? []).reduce((sum, scenario) => sum + scenario.annualSavings, 0);
  const avgLift = filtered?.length
    ? Math.round(filtered.reduce((sum, scenario) => sum + scenario.diversionLift, 0) / filtered.length)
    : 0;

  return (
    <>
      <PageHeader
        eyebrow="Phase 5 completion"
        title="Optimization, what-if modeling, and AI-assist readiness"
        description="Every scenario has expected value, diversion impact, service risk, and implementation effort before it reaches a customer."
        actions={<AccountSelector accounts={accounts.data ?? []} value={accountId} onChange={setAccountId} />}
      />
      <section className="metric-grid compact">
        <MetricCard label="Scenario value" value={formatCurrency(totalSavings)} detail="Annualized opportunity" icon="SV" />
        <MetricCard label="Average diversion lift" value={`${avgLift}%`} detail="Across selected scenarios" icon="DL" />
        <MetricCard label="Scenarios" value={`${filtered?.length ?? 0}`} detail="Human-review ready" icon="SC" />
        <MetricCard label="AI posture" value="Guarded" detail="Explainable and approval-gated" icon="AI" />
      </section>
      <AsyncState data={filtered} isLoading={query.isLoading} isError={query.isError} emptyTitle="No optimization scenarios">
        {(scenarios) => <DataTable data={scenarios} columns={columns} searchPlaceholder="Search scenarios, levers, accounts" />}
      </AsyncState>
    </>
  );
}

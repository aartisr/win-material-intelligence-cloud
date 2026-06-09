import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../components/DataTable";
import { MetricCard } from "../components/MetricCard";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { api, queryKeys } from "../lib/api";
import { AsyncState } from "../shared/ui/AsyncState";
import type { SecurityControl } from "../types";

const columns: ColumnDef<SecurityControl>[] = [
  { accessorKey: "control", header: "Control" },
  { accessorKey: "scope", header: "Scope" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge value={row.original.status} /> },
  { accessorKey: "evidence", header: "Evidence" },
];

export function Security() {
  const query = useQuery({ queryKey: queryKeys.securityControls, queryFn: api.securityControls });
  const controls = query.data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Production readiness"
        title="Security, tenant isolation, and claim governance"
        description="Controls keep the platform safe to scale: tenant boundaries, calculation evidence, human approvals, and adapter visibility."
      />
      <section className="metric-grid compact">
        <MetricCard label="Controls" value={`${controls.length}`} detail="Modeled readiness controls" icon="SC" />
        <MetricCard label="Complete" value={`${controls.filter((control) => control.status === "complete").length}`} detail="Current simulated posture" icon="OK" />
        <MetricCard label="Tenant posture" value="Scoped" detail="Route and object boundaries" icon="TN" />
        <MetricCard label="Claims posture" value="Governed" detail="Human-approved outputs" icon="CL" />
      </section>
      <AsyncState data={query.data} isLoading={query.isLoading} isError={query.isError} emptyTitle="No security controls">
        {(securityControls) => <DataTable data={securityControls} columns={columns} searchPlaceholder="Search controls and evidence" />}
      </AsyncState>
    </>
  );
}

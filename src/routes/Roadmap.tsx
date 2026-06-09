import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../components/DataTable";
import { MetricCard } from "../components/MetricCard";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { api, queryKeys } from "../lib/api";
import { AsyncState } from "../shared/ui/AsyncState";
import type { PhasePlan } from "../types";

const columns: ColumnDef<PhasePlan>[] = [
  { accessorKey: "phase", header: "Phase" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "objective", header: "Objective" },
  { accessorKey: "owner", header: "Owner" },
  { accessorKey: "completion", header: "Completion", cell: ({ row }) => `${row.original.completion}%` },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge value={row.original.status} /> },
  { accessorKey: "exitGate", header: "Exit gate" },
];

export function Roadmap() {
  const query = useQuery({ queryKey: queryKeys.phasePlans, queryFn: api.phasePlans });
  const phases = query.data ?? [];
  const completed = phases.filter((phase) => phase.status === "complete").length;
  const average = phases.length ? Math.round(phases.reduce((sum, phase) => sum + phase.completion, 0) / phases.length) : 0;

  return (
    <>
      <PageHeader
        eyebrow="All phases"
        title="Implementation roadmap and completion control"
        description="Phase 0 through Phase 8 are represented as gated product capabilities, not loose checklist items."
      />
      <section className="metric-grid compact">
        <MetricCard label="Phases complete" value={`${completed}/${phases.length}`} detail="Program completion status" icon="PH" />
        <MetricCard label="Average readiness" value={`${average}%`} detail="Across all phase gates" icon="RD" />
        <MetricCard label="Blocked gates" value={`${phases.filter((phase) => phase.status === "blocked").length}`} detail="Requires executive action" icon="BG" />
        <MetricCard label="Scale posture" value="Phase 8" detail="Enterprise flywheel modeled" icon="EF" />
      </section>
      <AsyncState data={query.data} isLoading={query.isLoading} isError={query.isError} emptyTitle="No phase plan available">
        {(phasePlans) => <DataTable data={phasePlans} columns={columns} searchPlaceholder="Search phases, owners, gates" />}
      </AsyncState>
    </>
  );
}

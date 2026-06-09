import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../components/DataTable";
import { MetricCard } from "../components/MetricCard";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { api, queryKeys } from "../lib/api";
import { sourceAdapters } from "../plugins/sourceAdapters";
import { AsyncState } from "../shared/ui/AsyncState";
import type { ReconciliationRun } from "../types";

const columns: ColumnDef<ReconciliationRun>[] = [
  { accessorKey: "source", header: "Source" },
  { accessorKey: "recordsIngested", header: "Ingested" },
  { accessorKey: "matchedRecords", header: "Matched" },
  { accessorKey: "exceptions", header: "Exceptions" },
  { accessorKey: "startedAt", header: "Started" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge value={row.original.status} /> },
];

export function Ingestion() {
  const query = useQuery({ queryKey: queryKeys.reconciliationRuns, queryFn: api.reconciliationRuns });
  const runs = query.data ?? [];
  const records = runs.reduce((sum, run) => sum + run.recordsIngested, 0);
  const exceptions = runs.reduce((sum, run) => sum + run.exceptions, 0);
  const matched = runs.reduce((sum, run) => sum + run.matchedRecords, 0);
  const matchRate = records ? Math.round((matched / records) * 100) : 0;

  return (
    <>
      <PageHeader
        eyebrow="Phase 2 completion"
        title="Source ingestion, reconciliation, and ledger trust"
        description="Adapter health and reconciliation runs make real source integration plug-and-play while preserving customer-report trust."
      />
      <section className="metric-grid compact">
        <MetricCard label="Adapters registered" value={`${sourceAdapters.length}`} detail="Route, scale, rail, special waste" icon="AD" />
        <MetricCard label="Records ingested" value={records.toLocaleString()} detail="Latest reconciliation batch" icon="IN" />
        <MetricCard label="Match rate" value={`${matchRate}%`} detail="Matched to ledger records" icon="MR" />
        <MetricCard label="Exceptions" value={`${exceptions}`} detail="Queued before report approval" icon="EX" />
      </section>
      <section className="two-column align-start">
        <article className="panel">
          <div className="panel-header">
            <h2>Adapter registry</h2>
            <span>{sourceAdapters.length} connected</span>
          </div>
          <div className="control-list">
            {sourceAdapters.map((adapter) => (
              <div key={adapter.id}>
                <div>
                  <strong>{adapter.label}</strong>
                  <span>{adapter.systemType} · {adapter.owner} · {adapter.lastSync}</span>
                </div>
                <StatusBadge value={adapter.health} />
              </div>
            ))}
          </div>
        </article>
        <AsyncState data={query.data} isLoading={query.isLoading} isError={query.isError} emptyTitle="No reconciliation runs">
          {(reconciliationRuns) => (
            <DataTable data={reconciliationRuns} columns={columns} searchPlaceholder="Search reconciliation sources" />
          )}
        </AsyncState>
      </section>
    </>
  );
}

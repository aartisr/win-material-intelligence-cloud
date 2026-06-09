import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../components/DataTable";
import { MetricCard } from "../components/MetricCard";
import { PageHeader } from "../components/PageHeader";
import { api, queryKeys } from "../lib/api";
import { AsyncState } from "../shared/ui/AsyncState";
import type { EnterpriseSignal } from "../types";

const columns: ColumnDef<EnterpriseSignal>[] = [
  { accessorKey: "signal", header: "Signal" },
  { accessorKey: "metric", header: "Metric" },
  { accessorKey: "current", header: "Current" },
  { accessorKey: "target", header: "Target" },
  { accessorKey: "owner", header: "Owner" },
];

export function Enterprise() {
  const query = useQuery({ queryKey: queryKeys.enterpriseSignals, queryFn: api.enterpriseSignals });
  const signals = query.data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Phase 8 completion"
        title="Enterprise flywheel and strategic moat"
        description="Connect customer retention, operational optimization, rail proof, and premium data products into one measurable flywheel."
      />
      <section className="metric-grid compact">
        <MetricCard label="Flywheel signals" value={`${signals.length}`} detail="Tracked enterprise levers" icon="FS" />
        <MetricCard label="Renewal proof" value="72%" detail="Verified-report account usage" icon="RP" />
        <MetricCard label="Premium attach" value="41%" detail="Reporting and advisory packages" icon="PA" />
        <MetricCard label="Moat posture" value="Active" detail="Data plus infrastructure advantage" icon="MO" />
      </section>
      <AsyncState data={query.data} isLoading={query.isLoading} isError={query.isError} emptyTitle="No enterprise signals">
        {(enterpriseSignals) => <DataTable data={enterpriseSignals} columns={columns} searchPlaceholder="Search signals, metrics, owners" />}
      </AsyncState>
    </>
  );
}

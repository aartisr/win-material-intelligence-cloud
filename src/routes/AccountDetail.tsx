import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../components/DataTable";
import { MetricCard } from "../components/MetricCard";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { api, queryKeys } from "../lib/api";
import { formatCurrency, formatTons, recommendationValue, summarizeEvents } from "../lib/calculations";
import type { MaterialEvent, Recommendation } from "../types";

const eventColumns: ColumnDef<MaterialEvent>[] = [
  { accessorKey: "date", header: "Date" },
  { accessorKey: "site", header: "Site" },
  { accessorKey: "pathway", header: "Pathway" },
  { accessorKey: "tons", header: "Tons", cell: ({ row }) => formatTons(row.original.tons) },
  { accessorKey: "quality", header: "Quality", cell: ({ row }) => <StatusBadge value={row.original.quality} /> },
  { accessorKey: "evidence", header: "Evidence" },
];

const recColumns: ColumnDef<Recommendation>[] = [
  { accessorKey: "title", header: "Recommendation" },
  { accessorKey: "valueEstimate", header: "Value", cell: ({ row }) => formatCurrency(row.original.valueEstimate) },
  { accessorKey: "confidence", header: "Confidence", cell: ({ row }) => `${row.original.confidence}%` },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge value={row.original.status} /> },
];

export function AccountDetail() {
  const { accountId } = useParams({ from: "/accounts/$accountId" });
  const account = useQuery({ queryKey: queryKeys.account(accountId), queryFn: () => api.account(accountId) });
  const events = useQuery({ queryKey: queryKeys.materialEvents(accountId), queryFn: () => api.materialEvents(accountId) });
  const recs = useQuery({ queryKey: queryKeys.recommendations(accountId), queryFn: () => api.recommendations(accountId) });
  const summary = summarizeEvents(events.data ?? []);

  return (
    <>
      <PageHeader
        eyebrow="Account workspace"
        title={account.data?.name ?? "Account"}
        description="A customer-specific command surface for sustainability proof, service optimization, and renewal value."
      />
      <section className="metric-grid compact">
        <MetricCard label="Total material" value={formatTons(summary.totalTons)} detail="Current reporting period" icon="MT" />
        <MetricCard label="Diversion" value={`${summary.diversionRate}%`} detail="Non-landfill material pathways" icon="DV" />
        <MetricCard label="Report confidence" value={`${summary.verifiedCoverage}%`} detail="Verified source coverage" icon="RC" />
        <MetricCard label="Open value" value={formatCurrency(recommendationValue(recs.data ?? []))} detail="Annualized recommendations" icon="OV" />
      </section>
      <section className="stack">
        <DataTable data={events.data ?? []} columns={eventColumns} searchPlaceholder="Search material events" />
        <DataTable data={recs.data ?? []} columns={recColumns} searchPlaceholder="Search recommendations" />
      </section>
    </>
  );
}

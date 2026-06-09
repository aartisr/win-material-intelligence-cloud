import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../components/DataTable";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { api, queryKeys } from "../lib/api";
import { AsyncState } from "../shared/ui/AsyncState";
import type { Report } from "../types";

const columns: ColumnDef<Report>[] = [
  { accessorKey: "id", header: "Report ID" },
  { accessorKey: "accountId", header: "Account" },
  { accessorKey: "period", header: "Period" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge value={row.original.status} /> },
  { accessorKey: "measuredCoverage", header: "Measured coverage", cell: ({ row }) => `${row.original.measuredCoverage}%` },
  { accessorKey: "generatedAt", header: "Generated" },
];

export function Reports() {
  const query = useQuery({ queryKey: queryKeys.reports(), queryFn: () => api.reports() });
  const form = useForm({
    defaultValues: {
      accountId: "acme-foods",
      period: "June 2026",
      includeEstimates: true,
    },
    onSubmit: async ({ value }) => {
      window.alert(`Report request staged for ${value.accountId} (${value.period})`);
    },
  });

  return (
    <>
      <PageHeader
        eyebrow="ESG-ready output"
        title="Customer report approval and export"
        description="Report generation is intentionally governed: calculation version, measured coverage, approval state, and customer-ready output."
      />
      <section className="two-column align-start">
        <form
          className="panel form-panel"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <div className="panel-header">
            <h2>Stage a report</h2>
            <span>TanStack Form</span>
          </div>
          <form.Field
            name="accountId"
            validators={{
              onChange: ({ value }) => (!value ? "Account is required" : undefined),
            }}
          >
            {(field) => (
              <label>
                Account ID
                <input value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} />
                {field.state.meta.errors.length ? <small>{field.state.meta.errors.join(", ")}</small> : null}
              </label>
            )}
          </form.Field>
          <form.Field name="period">
            {(field) => (
              <label>
                Period
                <input value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} />
              </label>
            )}
          </form.Field>
          <form.Field name="includeEstimates">
            {(field) => (
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(event) => field.handleChange(event.target.checked)}
                />
                Include approved estimated values
              </label>
            )}
          </form.Field>
          <button type="submit">Stage report</button>
        </form>
        <AsyncState data={query.data} isLoading={query.isLoading} isError={query.isError} emptyTitle="No reports staged">
          {(reports) => <DataTable data={reports} columns={columns} searchPlaceholder="Search reports" />}
        </AsyncState>
      </section>
    </>
  );
}

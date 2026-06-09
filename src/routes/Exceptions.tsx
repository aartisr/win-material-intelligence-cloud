import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../components/DataTable";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { api, queryKeys } from "../lib/api";
import { AsyncState } from "../shared/ui/AsyncState";
import type { ExceptionItem } from "../types";

const columns: ColumnDef<ExceptionItem>[] = [
  { accessorKey: "severity", header: "Severity", cell: ({ row }) => <StatusBadge value={row.original.severity} /> },
  { accessorKey: "title", header: "Exception" },
  { accessorKey: "accountId", header: "Account" },
  { accessorKey: "source", header: "Source" },
  { accessorKey: "owner", header: "Owner" },
  { accessorKey: "ageHours", header: "Age", cell: ({ row }) => `${row.original.ageHours}h` },
];

export function Exceptions() {
  const query = useQuery({ queryKey: queryKeys.exceptions, queryFn: api.exceptions });
  return (
    <>
      <PageHeader
        eyebrow="Data quality operations"
        title="Exception queue"
        description="Resolve ledger trust issues before reports become customer-visible."
      />
      <AsyncState data={query.data} isLoading={query.isLoading} isError={query.isError} emptyTitle="No open exceptions">
        {(exceptions) => (
          <DataTable data={exceptions} columns={columns} searchPlaceholder="Search exceptions, source, owner, account" />
        )}
      </AsyncState>
    </>
  );
}

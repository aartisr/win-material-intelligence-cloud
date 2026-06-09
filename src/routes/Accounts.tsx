import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../components/DataTable";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { api, queryKeys } from "../lib/api";
import { formatCurrency } from "../lib/calculations";
import { AsyncState } from "../shared/ui/AsyncState";
import type { Account } from "../types";

const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "name",
    header: "Account",
    cell: ({ row }) => <Link to="/accounts/$accountId" params={{ accountId: row.original.id }}>{row.original.name}</Link>,
  },
  { accessorKey: "segment", header: "Segment" },
  { accessorKey: "region", header: "Region" },
  { accessorKey: "sites", header: "Sites" },
  { accessorKey: "accountManager", header: "Manager" },
  { accessorKey: "monthlySpend", header: "Monthly spend", cell: ({ row }) => formatCurrency(row.original.monthlySpend) },
  { accessorKey: "renewalRisk", header: "Renewal risk", cell: ({ row }) => <StatusBadge value={row.original.renewalRisk} /> },
];

export function Accounts() {
  const query = useQuery({ queryKey: queryKeys.accounts, queryFn: api.accounts });

  return (
    <>
      <PageHeader
        eyebrow="Customer portfolio"
        title="Strategic accounts and pilot readiness"
        description="Portfolio-level view for account managers, sales, and customer success teams."
      />
      <AsyncState data={query.data} isLoading={query.isLoading} isError={query.isError} emptyTitle="No accounts available">
        {(accounts) => (
          <DataTable data={accounts} columns={columns} searchPlaceholder="Search accounts, region, segment, manager" />
        )}
      </AsyncState>
    </>
  );
}

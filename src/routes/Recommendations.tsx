import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DataTable } from "../components/DataTable";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { api, queryKeys } from "../lib/api";
import { formatCurrency } from "../lib/calculations";
import { AccountSelector } from "../shared/ui/AccountSelector";
import { AsyncState } from "../shared/ui/AsyncState";
import type { Recommendation } from "../types";

const columns: ColumnDef<Recommendation>[] = [
  { accessorKey: "title", header: "Recommendation" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "impact", header: "Impact" },
  { accessorKey: "valueEstimate", header: "Annual value", cell: ({ row }) => formatCurrency(row.original.valueEstimate) },
  { accessorKey: "confidence", header: "Confidence", cell: ({ row }) => `${row.original.confidence}%` },
  { accessorKey: "owner", header: "Owner" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge value={row.original.status} /> },
];

export function Recommendations() {
  const query = useQuery({ queryKey: queryKeys.recommendations(), queryFn: () => api.recommendations() });
  const accounts = useQuery({ queryKey: queryKeys.accounts, queryFn: api.accounts });
  const [accountId, setAccountId] = useState("all");
  const filteredRecommendations = useMemo(
    () => (accountId === "all" ? query.data : query.data?.filter((item) => item.accountId === accountId)),
    [accountId, query.data],
  );
  return (
    <>
      <PageHeader
        eyebrow="Human-approved intelligence"
        title="Recommendation center"
        description="A governed queue for haul optimization, compactor conversion, diversion, reporting, and rail opportunities."
        actions={
          <AccountSelector accounts={accounts.data ?? []} value={accountId} onChange={setAccountId} />
        }
      />
      <AsyncState
        data={filteredRecommendations}
        isLoading={query.isLoading}
        isError={query.isError}
        emptyTitle="No recommendations for this account"
      >
        {(recommendations) => (
          <DataTable data={recommendations} columns={columns} searchPlaceholder="Search recommendations, owner, type, impact" />
        )}
      </AsyncState>
    </>
  );
}

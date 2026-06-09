import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DataTable } from "../components/DataTable";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { api, queryKeys } from "../lib/api";
import { formatTons } from "../lib/calculations";
import { AccountSelector } from "../shared/ui/AccountSelector";
import { AsyncState } from "../shared/ui/AsyncState";
import type { MaterialEvent } from "../types";

const columns: ColumnDef<MaterialEvent>[] = [
  { accessorKey: "id", header: "Event ID" },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "accountId", header: "Account" },
  { accessorKey: "site", header: "Site" },
  { accessorKey: "pathway", header: "Pathway" },
  { accessorKey: "tons", header: "Tons", cell: ({ row }) => formatTons(row.original.tons) },
  { accessorKey: "source", header: "Source" },
  { accessorKey: "quality", header: "Quality", cell: ({ row }) => <StatusBadge value={row.original.quality} /> },
  { accessorKey: "calculationVersion", header: "Calc version" },
  { accessorKey: "evidence", header: "Evidence" },
];

export function Ledger() {
  const query = useQuery({ queryKey: queryKeys.materialEvents(), queryFn: () => api.materialEvents() });
  const accounts = useQuery({ queryKey: queryKeys.accounts, queryFn: api.accounts });
  const [accountId, setAccountId] = useState("all");
  const filteredEvents = useMemo(
    () => (accountId === "all" ? query.data : query.data?.filter((event) => event.accountId === accountId)),
    [accountId, query.data],
  );
  return (
    <>
      <PageHeader
        eyebrow="Trust layer"
        title="Canonical material event ledger"
        description="Immutable-style material events with source lineage, quality state, evidence, and calculation version."
        actions={
          <AccountSelector accounts={accounts.data ?? []} value={accountId} onChange={setAccountId} />
        }
      />
      <AsyncState
        data={filteredEvents}
        isLoading={query.isLoading}
        isError={query.isError}
        emptyTitle="No ledger events for this account"
      >
        {(events) => <DataTable data={events} columns={columns} searchPlaceholder="Search ledger by pathway, source, evidence" />}
      </AsyncState>
    </>
  );
}

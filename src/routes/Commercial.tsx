import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../components/DataTable";
import { MetricCard } from "../components/MetricCard";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { api, queryKeys } from "../lib/api";
import { AsyncState } from "../shared/ui/AsyncState";
import type { CommercialPackage } from "../types";

const columns: ColumnDef<CommercialPackage>[] = [
  { accessorKey: "name", header: "Package" },
  { accessorKey: "targetCustomer", header: "Target customer" },
  { accessorKey: "priceModel", header: "Price model" },
  { accessorKey: "includedCapabilities", header: "Capabilities", cell: ({ row }) => row.original.includedCapabilities.join(", ") },
  { accessorKey: "readiness", header: "Readiness", cell: ({ row }) => <StatusBadge value={row.original.readiness} /> },
];

export function Commercial() {
  const query = useQuery({ queryKey: queryKeys.commercialPackages, queryFn: api.commercialPackages });
  const packages = query.data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Phase 6 and 7 completion"
        title="Pilot hardening, commercial packaging, and regional scale"
        description="Turn the product into a sellable, supportable platform with repeatable packages and expansion motions."
      />
      <section className="metric-grid compact">
        <MetricCard label="Packages" value={`${packages.length}`} detail="Portal, ESG, advisory, API" icon="PK" />
        <MetricCard label="Ready offers" value={`${packages.filter((item) => item.readiness === "complete").length}`} detail="Commercially packaged" icon="RO" />
        <MetricCard label="Support posture" value="Playbooked" detail="Onboarding and QBR motions" icon="SP" />
        <MetricCard label="Scale model" value="Regional" detail="Repeatable adapter onboarding" icon="RS" />
      </section>
      <AsyncState data={query.data} isLoading={query.isLoading} isError={query.isError} emptyTitle="No commercial packages">
        {(commercialPackages) => <DataTable data={commercialPackages} columns={columns} searchPlaceholder="Search packages and capabilities" />}
      </AsyncState>
    </>
  );
}

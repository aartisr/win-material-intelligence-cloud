import { materialEvents } from "../data/mockData";
import type { LedgerPlugin, MaterialSourceAdapter } from "../domain/ledgerContracts";
import { validateLedgerCoverage } from "../domain/ledgerContracts";

export const sourceAdapters: MaterialSourceAdapter[] = [
  {
    id: "route-service-adapter",
    label: "Route and service events",
    systemType: "route",
    health: "ready",
    owner: "Dispatch operations",
    lastSync: "2026-06-09 08:30",
    pullEvents: async () => materialEvents.filter((event) => event.source.includes("Route")),
  },
  {
    id: "scale-ticket-adapter",
    label: "Scale and facility tickets",
    systemType: "scale",
    health: "ready",
    owner: "Data operations",
    lastSync: "2026-06-09 08:45",
    pullEvents: async () => materialEvents.filter((event) => event.source.includes("Ticket")),
  },
  {
    id: "rail-manifest-adapter",
    label: "Rail manifests",
    systemType: "rail",
    health: "ready",
    owner: "Rail logistics",
    lastSync: "2026-06-09 07:55",
    pullEvents: async () => materialEvents.filter((event) => event.pathway === "Rail transfer"),
  },
  {
    id: "special-waste-adapter",
    label: "Special-waste certificates",
    systemType: "special-waste",
    health: "degraded",
    owner: "Compliance",
    lastSync: "2026-06-08 16:20",
    pullEvents: async () => materialEvents.filter((event) => event.pathway === "Special handling"),
  },
];

export const ledgerPlugins: LedgerPlugin[] = [
  {
    id: "customer-ready-reporting",
    label: "Customer-ready reporting guard",
    description: "Blocks report approval when events lack review, evidence, or calculation lineage.",
    requiredAdapters: ["scale-ticket-adapter", "rail-manifest-adapter", "special-waste-adapter"],
    validate: validateLedgerCoverage,
  },
  {
    id: "rail-value-model",
    label: "Rail value model",
    description: "Enables rail pathway value calculations and low-carbon transfer summaries.",
    requiredAdapters: ["rail-manifest-adapter"],
    validate: (events) => (events.some((event) => event.pathway === "Rail transfer") ? [] : ["No rail events in scope."]),
  },
];

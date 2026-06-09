import type { MaterialEvent } from "../types";

export type SourceAdapterHealth = "ready" | "degraded" | "not-connected";

export type MaterialSourceAdapter = {
  id: string;
  label: string;
  systemType: "route" | "scale" | "wte" | "mrf" | "rail" | "billing" | "special-waste";
  health: SourceAdapterHealth;
  owner: string;
  lastSync: string;
  pullEvents: () => Promise<MaterialEvent[]>;
};

export type LedgerPlugin = {
  id: string;
  label: string;
  description: string;
  requiredAdapters: string[];
  validate: (events: MaterialEvent[]) => string[];
};

export function validateLedgerCoverage(events: MaterialEvent[]) {
  const issues: string[] = [];
  if (events.length === 0) issues.push("No material events are available for the selected scope.");
  if (events.some((event) => event.quality === "needs-review")) {
    issues.push("One or more events need review before customer-ready reporting.");
  }
  if (events.some((event) => !event.calculationVersion)) {
    issues.push("Every reportable event must carry a calculation version.");
  }
  return issues;
}

export type AppModule = {
  id: string;
  label: string;
  shortLabel: string;
  path: string;
  capability: string;
  phase: string;
};

export const appModules: AppModule[] = [
  {
    id: "home",
    label: "Home",
    shortLabel: "HM",
    path: "/home",
    capability: "Leadership story and decision launchpad",
    phase: "Executive",
  },
  {
    id: "command-center",
    label: "Command Center",
    shortLabel: "CC",
    path: "/dashboard",
    capability: "Executive operating view",
    phase: "Phase 4",
  },
  {
    id: "roadmap",
    label: "Roadmap",
    shortLabel: "RM",
    path: "/roadmap",
    capability: "All phase completion control",
    phase: "Phase 0-8",
  },
  {
    id: "simulation",
    label: "Simulation Mode",
    shortLabel: "SM",
    path: "/simulation",
    capability: "Executive demo scenarios",
    phase: "Demo",
  },
  {
    id: "accounts",
    label: "Accounts",
    shortLabel: "AC",
    path: "/accounts",
    capability: "Customer portfolio",
    phase: "Phase 4",
  },
  {
    id: "ledger",
    label: "Material Ledger",
    shortLabel: "ML",
    path: "/ledger",
    capability: "Canonical event trust layer",
    phase: "Phase 2",
  },
  {
    id: "ingestion",
    label: "Ingestion",
    shortLabel: "IG",
    path: "/ingestion",
    capability: "Source adapters and reconciliation",
    phase: "Phase 2",
  },
  {
    id: "recommendations",
    label: "Recommendations",
    shortLabel: "RC",
    path: "/recommendations",
    capability: "Human-approved optimization",
    phase: "Phase 5",
  },
  {
    id: "optimization",
    label: "Optimization",
    shortLabel: "OP",
    path: "/optimization",
    capability: "What-if and AI-assist readiness",
    phase: "Phase 5",
  },
  {
    id: "reports",
    label: "Reports",
    shortLabel: "RP",
    path: "/reports",
    capability: "ESG-ready reporting",
    phase: "Phase 4",
  },
  {
    id: "commercial",
    label: "Commercial",
    shortLabel: "CM",
    path: "/commercial",
    capability: "Pilot hardening and packages",
    phase: "Phase 6-7",
  },
  {
    id: "enterprise",
    label: "Enterprise",
    shortLabel: "EF",
    path: "/enterprise",
    capability: "Enterprise flywheel",
    phase: "Phase 8",
  },
  {
    id: "exceptions",
    label: "Exceptions",
    shortLabel: "EX",
    path: "/exceptions",
    capability: "Data quality operations",
    phase: "Phase 2",
  },
  {
    id: "security",
    label: "Security",
    shortLabel: "SE",
    path: "/security",
    capability: "Tenant and claims governance",
    phase: "Production",
  },
  {
    id: "governance",
    label: "Governance",
    shortLabel: "GV",
    path: "/admin",
    capability: "Controls and auditability",
    phase: "Phase 6",
  },
];

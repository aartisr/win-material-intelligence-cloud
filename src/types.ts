export type MaterialPathway =
  | "Recycling"
  | "Waste-to-energy"
  | "Rail transfer"
  | "Landfill"
  | "Special handling"
  | "Recovered metal";

export type EventQuality = "verified" | "estimated" | "needs-review";

export type RecommendationStatus = "draft" | "ready" | "approved" | "blocked";

export type Account = {
  id: string;
  name: string;
  segment: string;
  region: string;
  sites: number;
  monthlySpend: number;
  accountManager: string;
  renewalRisk: "low" | "medium" | "high";
};

export type MaterialEvent = {
  id: string;
  accountId: string;
  site: string;
  date: string;
  pathway: MaterialPathway;
  tons: number;
  source: string;
  quality: EventQuality;
  calculationVersion: string;
  evidence: string;
};

export type Recommendation = {
  id: string;
  accountId: string;
  title: string;
  type: "haul" | "compactor" | "contamination" | "reporting" | "rail" | "diversion";
  valueEstimate: number;
  impact: string;
  confidence: number;
  status: RecommendationStatus;
  owner: string;
};

export type Report = {
  id: string;
  accountId: string;
  period: string;
  status: "draft" | "approved" | "customer-ready";
  generatedAt: string;
  measuredCoverage: number;
};

export type ExceptionItem = {
  id: string;
  accountId: string;
  severity: "low" | "medium" | "high";
  title: string;
  source: string;
  owner: string;
  ageHours: number;
};

export type PhaseStatus = "complete" | "in-progress" | "ready" | "blocked";

export type PhasePlan = {
  id: string;
  phase: string;
  name: string;
  status: PhaseStatus;
  objective: string;
  completion: number;
  owner: string;
  exitGate: string;
};

export type ReconciliationRun = {
  id: string;
  source: string;
  recordsIngested: number;
  matchedRecords: number;
  exceptions: number;
  startedAt: string;
  status: "passed" | "warning" | "failed";
};

export type OptimizationScenario = {
  id: string;
  accountId: string;
  name: string;
  lever: "pickup-frequency" | "compactor" | "rail" | "diversion" | "contamination";
  annualSavings: number;
  diversionLift: number;
  serviceRisk: "low" | "medium" | "high";
  implementationEffort: "low" | "medium" | "high";
};

export type CommercialPackage = {
  id: string;
  name: string;
  targetCustomer: string;
  priceModel: string;
  includedCapabilities: string[];
  readiness: PhaseStatus;
};

export type EnterpriseSignal = {
  id: string;
  signal: string;
  metric: string;
  current: string;
  target: string;
  owner: string;
};

export type SecurityControl = {
  id: string;
  control: string;
  scope: string;
  status: PhaseStatus;
  evidence: string;
};

export type SimulationScenario = {
  id: string;
  name: string;
  accountId: string;
  pattern: string;
  realism: "control-room" | "stress-test" | "what-if" | "digital-twin" | "boardroom";
  storyline: string;
  trigger: string;
  durationDays: number;
  pressureEvent: string;
  before: {
    annualCost: number;
    diversionRate: number;
    verifiedCoverage: number;
    exceptions: number;
    railTons: number;
  };
  after: {
    annualCost: number;
    diversionRate: number;
    verifiedCoverage: number;
    exceptions: number;
    railTons: number;
  };
  injectedEvents: string[];
  executiveTakeaway: string;
};

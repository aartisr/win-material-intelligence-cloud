import {
  accounts,
  commercialPackages,
  enterpriseSignals,
  exceptions,
  materialEvents,
  optimizationScenarios,
  phasePlans,
  recommendations,
  reconciliationRuns,
  reports,
  securityControls,
  simulationScenarios,
} from "../data/mockData";

const delay = (ms = 180) => new Promise((resolve) => window.setTimeout(resolve, ms));

export const api = {
  async accounts() {
    await delay();
    return accounts;
  },
  async account(id: string) {
    await delay();
    return accounts.find((account) => account.id === id) ?? accounts[0];
  },
  async materialEvents(accountId?: string) {
    await delay();
    return accountId ? materialEvents.filter((event) => event.accountId === accountId) : materialEvents;
  },
  async recommendations(accountId?: string) {
    await delay();
    return accountId ? recommendations.filter((item) => item.accountId === accountId) : recommendations;
  },
  async reports(accountId?: string) {
    await delay();
    return accountId ? reports.filter((report) => report.accountId === accountId) : reports;
  },
  async exceptions() {
    await delay();
    return exceptions;
  },
  async phasePlans() {
    await delay();
    return phasePlans;
  },
  async reconciliationRuns() {
    await delay();
    return reconciliationRuns;
  },
  async optimizationScenarios(accountId?: string) {
    await delay();
    return accountId
      ? optimizationScenarios.filter((scenario) => scenario.accountId === accountId)
      : optimizationScenarios;
  },
  async commercialPackages() {
    await delay();
    return commercialPackages;
  },
  async enterpriseSignals() {
    await delay();
    return enterpriseSignals;
  },
  async securityControls() {
    await delay();
    return securityControls;
  },
  async simulationScenarios() {
    await delay();
    return simulationScenarios;
  },
};

export const queryKeys = {
  accounts: ["accounts"] as const,
  account: (id: string) => ["accounts", id] as const,
  materialEvents: (accountId?: string) => ["material-events", accountId ?? "all"] as const,
  recommendations: (accountId?: string) => ["recommendations", accountId ?? "all"] as const,
  reports: (accountId?: string) => ["reports", accountId ?? "all"] as const,
  exceptions: ["exceptions"] as const,
  phasePlans: ["phase-plans"] as const,
  reconciliationRuns: ["reconciliation-runs"] as const,
  optimizationScenarios: (accountId?: string) => ["optimization-scenarios", accountId ?? "all"] as const,
  commercialPackages: ["commercial-packages"] as const,
  enterpriseSignals: ["enterprise-signals"] as const,
  securityControls: ["security-controls"] as const,
  simulationScenarios: ["simulation-scenarios"] as const,
};

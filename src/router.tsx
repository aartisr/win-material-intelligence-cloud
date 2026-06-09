import { createRootRoute, createRoute, createRouter, Outlet, redirect } from "@tanstack/react-router";
import { Layout } from "./components/Layout";
import { AccountDetail } from "./routes/AccountDetail";
import { Accounts } from "./routes/Accounts";
import { Admin } from "./routes/Admin";
import { Commercial } from "./routes/Commercial";
import { Dashboard } from "./routes/Dashboard";
import { Enterprise } from "./routes/Enterprise";
import { Exceptions } from "./routes/Exceptions";
import { Ingestion } from "./routes/Ingestion";
import { Ledger } from "./routes/Ledger";
import { Optimization } from "./routes/Optimization";
import { Recommendations } from "./routes/Recommendations";
import { Reports } from "./routes/Reports";
import { Roadmap } from "./routes/Roadmap";
import { Security } from "./routes/Security";
import { Simulation } from "./routes/Simulation";

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
});

const accountsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/accounts",
  component: Accounts,
});

const roadmapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/roadmap",
  component: Roadmap,
});

const simulationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/simulation",
  component: Simulation,
});

const accountDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/accounts/$accountId",
  component: AccountDetail,
});

const ledgerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ledger",
  component: Ledger,
});

const ingestionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ingestion",
  component: Ingestion,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reports",
  component: Reports,
});

const recommendationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recommendations",
  component: Recommendations,
});

const optimizationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/optimization",
  component: Optimization,
});

const commercialRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/commercial",
  component: Commercial,
});

const enterpriseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/enterprise",
  component: Enterprise,
});

const exceptionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/exceptions",
  component: Exceptions,
});

const securityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/security",
  component: Security,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: Admin,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  roadmapRoute,
  simulationRoute,
  accountsRoute,
  accountDetailRoute,
  ledgerRoute,
  ingestionRoute,
  reportsRoute,
  recommendationsRoute,
  optimizationRoute,
  commercialRoute,
  enterpriseRoute,
  exceptionsRoute,
  securityRoute,
  adminRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

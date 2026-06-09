# WIN Material Intelligence Cloud

TanStack-first MVP implementation for the WIN Material Intelligence Cloud concept.

## What this implements

- Executive command center for material flow, diversion, rail movement, renewable power equivalent, recommendation value, and exception count.
- Strategic account portfolio and account-level workspaces.
- Canonical material event ledger with source lineage, evidence, quality state, and calculation version.
- Recommendation center for haul optimization, compactor conversion, diversion, reporting, and rail opportunities.
- Customer report staging and approval surface using TanStack Form.
- Exception queue for data-quality and report-readiness governance.
- Governance screen for calculation factors, tenant isolation, claim templates, source adapters, and TanStack Start migration posture.
- Modular plug-in contracts for source adapters and ledger validation modules.
- Reusable async, table, account filtering, status, and metric UI primitives.
- Phase 0-8 completion surfaces: roadmap, ingestion/reconciliation, optimization, commercial packaging, enterprise flywheel, and security controls.
- Simulation Mode for executive demos without live WIN integrations, including before/after scenarios, injected events, and customer-ready takeaways.

## UX and visual system

The app shell is benchmarked against leading waste, recycling, sustainability, and managed-service sites: WM, RTS, Casella, Recology, Republic Services, RoadRunner, GFL, Waste Connections, CR&R, and WIN Waste. The theme borrows the strongest patterns for an enterprise application context:

- Utility-first header actions for support, reports, optimization, and trust.
- Prominent customer-portal posture and tenant context.
- Left navigation for a large operational information architecture.
- Proof metrics above the fold.
- Dense but readable footer/status links for governance, source health, and enterprise scale.
- High-contrast sustainability palette without turning the product into a generic green marketing page.

## Simulation Mode

Simulation Mode is designed for demos, sales conversations, and stakeholder alignment before real source-system integrations are available. It adapts public best-practice concepts from simulation/control-room products such as SCM Labs, Execsim, LambdaSim, IBM Envizi Planning Analytics, Terragrit, BusinessOptix, AnyLogic, SCM Globe, FLEXEE, and Lagrange.AI.

The 10 included demos are:

- Compactor right-sizing.
- University move-out diversion.
- Hospital compliance recovery.
- Rail disruption and transfer reroute.
- ESG target what-if planner.
- MRF contamination digital twin.
- WTE capacity and outage rehearsal.
- Renewal defense value simulator.
- Route carbon and service reliability optimizer.
- Storm response municipal surge.
- Enterprise ESG API launch.

Each scenario shows annual savings, diversion lift, verified coverage improvement, exception reduction, event injections, and the executive narrative the app would generate.

## TanStack usage

- `@tanstack/react-router` for route contracts and account detail params.
- `@tanstack/react-query` for server-state fetching, cache conventions, and async boundaries.
- `@tanstack/react-table` for portfolio, ledger, reports, recommendations, and exception tables.
- `@tanstack/react-form` for report staging workflow validation.
- `@tanstack/react-store` for a small example review workflow store.

The plan document recommended TanStack Start for the mature full-stack version. This MVP keeps the route and query boundaries explicit so it can move to TanStack Start server functions after real source adapters, auth, report jobs, and ledger services are connected.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://127.0.0.1:3144`.

## Build

```bash
npm run build
```

## Suggested next implementation stages

1. Replace mock data with real ledger APIs backed by WIN source-system adapters.
2. Connect production identity, tenant-aware routes, and object authorization.
3. Replace simulated report staging with asynchronous report generation jobs.
4. Persist recommendation approvals and optimization decisions.
5. Add TanStack Virtual to the ledger table once real event volumes exceed ordinary pagination.
6. Migrate to TanStack Start server functions when the server boundary is ready.

## Project structure

See `ARCHITECTURE.md` for maintainability rules, extension points, and the TanStack Start migration path.

## Repository owner

- Name: [Aarti Sri Ravikumar](https://www.ai-aarti.com)
- GitHub: [aartisr](https://github.com/aartisr)
- Repository: [win-material-intelligence-cloud](https://github.com/aartisr/win-material-intelligence-cloud)

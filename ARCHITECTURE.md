# Architecture

WIN Material Intelligence Cloud is designed as a contract-first, modular front-end platform. The goal is to keep business logic stable while allowing UI, integrations, and deployment models to evolve independently.

## Objectives

- Deliver a reliable operating layer for material intelligence workflows.
- Preserve traceability from source events to customer-facing metrics.
- Keep feature development fast without introducing architectural drift.
- Support a clean migration path from MVP architecture to production-grade server boundaries.

## Architectural principles

1. Contract-first design: core contracts and interfaces are defined before feature wiring.
2. Thin routes: route files orchestrate composition and navigation, not data services.
3. Explicit boundaries: integration, domain, and presentation concerns remain separated.
4. Predictable state: query keys and async behavior are centralized and reusable.
5. Auditability by default: lineage and data quality context travel with reportable metrics.
6. Extensibility over rewrites: adapters and validations are added via registries and interfaces.

## Layer model

| Layer | Responsibility | Must not do |
| --- | --- | --- |
| `src/app` | App-level wiring, navigation registry, query client setup | Hold domain business logic |
| `src/components` | Reusable shell and domain-aware UI components | Implement integration adapters |
| `src/shared/ui` | Domain-agnostic presentation primitives | Depend on WIN-specific contracts |
| `src/domain` | Business contracts, adapter interfaces, validation rules | Depend directly on route composition |
| `src/plugins` | Registration of source adapters and validation plug-ins | Become a general-purpose service layer |
| `src/lib` | API facade, query conventions, calculations, utilities | Own visual layout concerns |
| `src/routes` | Route composition, orchestration, and page-level assembly | Hide business logic or service behavior |
| `src/data` | MVP mock data and fixtures | Act as long-term production data source |

## Feature and phase coverage

- Phase 0-8: Roadmap tracks end-to-end maturity progression, including Phase 0-1 mandate, discovery, ownership, and exit gates.
- Phase 2: Ingestion, Ledger, Exceptions, source adapters, and ledger plug-ins.
- Phase 3: Router, query client, shared UI, and module registry shell.
- Phase 4: Dashboard, Accounts, Reports, Recommendations.
- Phase 5: Optimization and AI-assist readiness with human review controls.
- Phase 6: Governance controls and auditability (`/admin`).
- Phase 6-7: Commercial hardening, packaging, regional scale controls.
- Phase 8: Enterprise flywheel progression.
- Production readiness: Security for tenancy, claims, and audit posture.
- Demo readiness: Simulation for scenario-driven executive narratives.

## Runtime architecture

At runtime, route modules compose UI and domain-facing services through stable interfaces:

1. Router resolves the active module and parameters.
2. Route composes reusable components and data hooks.
3. Query layer handles fetch lifecycle and cache behavior.
4. Domain contracts enforce adapter shape, validation posture, and calculation semantics.
5. UI renders measurable outcomes with loading, empty, and error state integrity.

## Engineering guardrails

1. Add new capabilities through registries/interfaces first, then route wiring.
2. Keep query key factories centralized to protect cache invalidation behavior.
3. Keep customer-visible calculations in `src/domain` or backend services.
4. Keep adapter/integration behavior behind typed interfaces.
5. Keep route files small, composable, and replaceable.
6. Require loading, empty, and error states for all async workspaces.
7. Preserve measured versus estimated lineage on reportable metrics.

## Extension playbooks

### Add a new source system

1. Implement the `MaterialSourceAdapter` contract.
2. Register the adapter in `src/plugins/sourceAdapters.ts`.
3. Add any required ledger validation plug-in.
4. Surface adapter health/sync status in governance-facing views.

### Add a new capability module

1. Add module metadata in `src/app/navigation.ts`.
2. Register route contract in `src/router.tsx`.
3. Implement the route component using shared UI and domain APIs.
4. Document acceptance criteria in this file and in `README.md` when user-facing.

## Quality and operability expectations

- Feature additions should maintain deterministic routing and stable query behavior.
- Data flows should remain inspectable from source ingestion to report output.
- UX states should reflect operational truth, not optimistic assumptions.
- Security and governance surfaces should remain first-class, not post-release add-ons.

## Migration path to TanStack Start

The current MVP uses Vite + TanStack Router/Query/Table/Form/Store. A production migration to TanStack Start should preserve:

- typed route contracts and params,
- query-key factories,
- API facade signatures,
- domain plug-in interfaces,
- route-level composition boundaries.

Server functions should wrap backend services and orchestration logic. The material ledger and long-term persistence logic should stay in dedicated backend services, not in route handlers.

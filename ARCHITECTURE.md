# Architecture

This project is organized around stable contracts rather than screen-by-screen code.

## Layers

- `src/app`: application configuration such as navigation registry and shared query client behavior.
- `src/components`: reusable shell and application-level components.
- `src/shared/ui`: generic UX primitives that should not know the WIN domain.
- `src/domain`: business contracts such as ledger adapters, plug-in interfaces, and validation rules.
- `src/plugins`: plug-and-play source adapter and validation plug-in registrations.
- `src/lib`: API facade, query keys, calculations, and client utilities.
- `src/routes`: route-level composition only. Routes orchestrate data and components, but should not become data services.
- `src/data`: mock data for the MVP. Replace with real source adapters and APIs.

## Phase Coverage

- Phase 0-1: `Roadmap` models mandate, discovery, ownership, and exit gates.
- Phase 2: `Ingestion`, `Ledger`, `Exceptions`, source adapters, and ledger plug-ins model the data foundation.
- Phase 3: `router`, `queryClient`, shared UI, and app module registry model the TanStack product shell.
- Phase 4: `Dashboard`, `Accounts`, `Reports`, and `Recommendations` model MVP intelligence workflows.
- Phase 5: `Optimization` models what-if and AI-assist readiness with human-review controls.
- Phase 6-7: `Commercial` models pilot hardening, packaging, and regional scale.
- Phase 8: `Enterprise` models the strategic flywheel.
- Production readiness: `Security` models tenant, claim, and audit controls.
- Demo readiness: `Simulation` models live executive demos with scenario-driven before/after impact.

## Maintainability Rules

1. Add new capabilities through registries or modules first, then wire them into routes.
2. Keep `queryKeys` centralized so cache invalidation remains predictable.
3. Keep customer-visible calculations in `domain` or backend services, not buried inside UI components.
4. Keep all adapter-like integrations behind typed interfaces.
5. Keep `routes` thin and easy to delete, split, or migrate.
6. Add loading, empty, and error states for every async workspace.
7. Preserve measured vs. estimated data lineage for every reportable metric.

## Plug-And-Play Extension

To add a new source system:

1. Implement `MaterialSourceAdapter`.
2. Register it in `src/plugins/sourceAdapters.ts`.
3. Add any required ledger validation plug-in.
4. Expose health and sync state in Governance.

To add a new capability module:

1. Add an entry to `src/app/navigation.ts`.
2. Add a route in `src/router.tsx`.
3. Create a route component that composes shared UI and domain APIs.
4. Add acceptance criteria to this document or the README.

## TanStack Start Migration Path

This MVP uses Vite with TanStack Router, Query, Table, Form, and Store. The production version can migrate to TanStack Start by preserving:

- typed route tree and params,
- query-key factories,
- API facade signatures,
- domain plug-in interfaces,
- route-level composition boundaries.

Server functions should wrap backend services. They should not contain the material ledger itself.

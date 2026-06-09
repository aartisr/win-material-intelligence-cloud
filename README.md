# WIN Material Intelligence Cloud

WIN Material Intelligence Cloud is a TanStack-first application for operational intelligence across material flow, diversion performance, reporting readiness, and optimization decisioning.

This repository represents an MVP foundation designed for:

- Executive visibility.
- Trustworthy data lineage.
- Workflow-driven recommendations.
- Scalable architecture for production migration.

## Why this project exists

Material and sustainability programs need one place to measure performance, explain variance, and act with confidence. This platform provides a unified operating layer that combines portfolio views, event-level ledger data, exception governance, and scenario modeling.

## Audience guides

### Executive stakeholder view

WIN Material Intelligence Cloud provides a single operating picture for material performance, reporting confidence, and value creation.

- Business outcomes: Better diversion performance, clearer operational accountability, and faster decision cycles.
- Leadership visibility: KPI-centric command center with account-level drill-down.
- Governance confidence: Explicit exception handling, security posture, and audit-oriented controls.
- Scale readiness: Roadmap and architecture designed to move from MVP to enterprise rollout.

Recommended starting flow:

1. Review Command Center for current-state performance.
2. Review Exceptions for risk and data-quality hotspots.
3. Review Recommendations and Optimization for value opportunities.
4. Review Roadmap for phase completion and investment posture.

### Engineering contributor view

This repository is built for contract-first evolution, predictable route composition, and production migration readiness.

- Clear boundaries: Routes orchestrate UI composition, while domain and lib layers own contracts and logic.
- Extensibility: Source integrations and ledger validations are designed as typed plug-ins.
- Maintainability: Shared query patterns and module registry conventions reduce coupling.
- Migration path: Current Vite setup intentionally preserves compatibility with a TanStack Start server-function model.

Recommended onboarding flow:

1. Read [ARCHITECTURE.md](ARCHITECTURE.md) for layer responsibilities and rules.
2. Review module-to-route mapping in this README.
3. Run locally and inspect route-level composition under [src/routes](src/routes).
4. Add features through registries/interfaces before editing route implementations.

### Customer and product-facing view

This platform helps teams explain performance, prioritize actions, and communicate verified progress with confidence.

- Operational clarity: Portfolio and account workspaces connect actions to measurable outcomes.
- Trust and traceability: Ledger-first model strengthens confidence in reportable claims.
- Actionable intelligence: Recommendations and optimization workflows support practical next steps.
- Demo readiness: Simulation Mode communicates before/after value in stakeholder-friendly scenarios.

Recommended demo flow:

1. Start in Simulation Mode for outcome storytelling.
2. Move to Command Center for current KPI context.
3. Show Ledger and Exceptions to establish trust and controls.
4. Close with Recommendations and Reports for action and communication readiness.

## Core capabilities

- Command Center for KPI-first operational oversight.
- Account Portfolio and Account Detail workspaces.
- Canonical Material Ledger with source lineage and validation posture.
- Ingestion and source-adapter operational surfaces.
- Recommendations and Optimization workspaces with human-approval posture.
- Reports and governance-aligned reporting workflow support.
- Exceptions queue for data-quality and report-readiness operations.
- Governance and Security modules for controls, tenancy, and audit posture.
- Simulation Mode for executive demonstrations and scenario narratives.
- Roadmap coverage for Phase 0 through Phase 8 maturity planning.

## Product module map

| Module | Route | Primary purpose | Maturity phase |
| --- | --- | --- | --- |
| Command Center | `/dashboard` | Executive operating view | Phase 4 |
| Roadmap | `/roadmap` | Program phase completion control | Phase 0-8 |
| Simulation Mode | `/simulation` | Scenario-driven executive demos | Demo |
| Accounts | `/accounts` | Portfolio and account workspaces | Phase 4 |
| Material Ledger | `/ledger` | Canonical trust and lineage layer | Phase 2 |
| Ingestion | `/ingestion` | Source adapters and reconciliation | Phase 2 |
| Recommendations | `/recommendations` | Human-approved optimization actions | Phase 5 |
| Optimization | `/optimization` | What-if analysis and AI-assist readiness | Phase 5 |
| Reports | `/reports` | ESG-ready reporting support | Phase 4 |
| Commercial | `/commercial` | Pilot hardening and packaging | Phase 6-7 |
| Enterprise | `/enterprise` | Enterprise flywheel progression | Phase 8 |
| Exceptions | `/exceptions` | Data-quality operations | Phase 2 |
| Security | `/security` | Tenant and claims governance | Production |
| Governance | `/admin` | Controls and auditability | Phase 6 |

## Architecture at a glance

The codebase follows contract-first modular boundaries so capabilities can evolve without destabilizing the platform.

- `src/app`: Application configuration, navigation registry, and shared query behavior.
- `src/components`: Reusable shell and domain-aware UI building blocks.
- `src/shared/ui`: Domain-agnostic UI primitives.
- `src/domain`: Business contracts, adapter interfaces, and validation definitions.
- `src/plugins`: Adapter and validation plug-in registration.
- `src/lib`: API facade, calculations, query conventions, and utility logic.
- `src/routes`: Route composition only; no hidden service-layer logic.
- `src/data`: MVP mock data, intended to be replaced by production integrations.

For full maintainability rules and extension guidance, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Technology stack

- React 18 with TypeScript.
- Vite build and development toolchain.
- TanStack Router for typed route contracts.
- TanStack Query for server-state orchestration.
- TanStack Table for data-intensive workspaces.
- TanStack Form for structured workflow validation.
- TanStack Store for lightweight client state patterns.

## Getting started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Application URL: [http://127.0.0.1:3144](http://127.0.0.1:3144)

### Build for production

```bash
npm run build
```

## NPM scripts

- `npm run dev`: Start local development server.
- `npm run build`: Type-check and create a production bundle.
- `npm run preview`: Preview the production build locally.

## Deploy on Vercel

This repository is configured for Vercel deployment as a Vite single-page app.

What is already configured:
- `vercel.json` sets the build command to `npm run build`.
- `vercel.json` sets the output directory to `dist`.
- `vercel.json` adds an SPA rewrite so deep links (for example `/dashboard`, `/accounts/123`) resolve to `index.html`.

Deployment steps:

1. Import this repository into Vercel.
2. Keep the default Node.js runtime selected by Vercel.
3. Deploy with:
	- Build Command: `npm run build`
	- Output Directory: `dist`
4. Open any deep route URL directly to confirm rewrite behavior.

## Implementation direction

Recommended next delivery steps:

1. Replace mock data with production-grade ledger APIs and source adapters.
2. Add production identity, tenant-aware authorization, and object-level controls.
3. Evolve report workflows from staged simulation to asynchronous job execution.
4. Persist recommendation approval and optimization decision trails.
5. Introduce virtualization for high-volume ledger workloads.
6. Migrate to TanStack Start server functions as backend boundaries mature.

## Repository ownership

- Owner name: [Aarti Sri Ravikumar](https://www.ai-aarti.com)
- GitHub user: [aartisr](https://github.com/aartisr)
- Repository: [win-material-intelligence-cloud](https://github.com/aartisr/win-material-intelligence-cloud)

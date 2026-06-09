import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { appModules } from "../app/navigation";
import { ledgerPlugins, sourceAdapters } from "../plugins/sourceAdapters";

const controls = [
  ["Calculation factor versions", "calc-2026.05 active", "approved"],
  ["Tenant isolation", "Account-scoped access policy", "approved"],
  ["Customer claim templates", "Measured vs estimated labels required", "human review"],
  ["Source adapter registry", "Route, scale, WTE, MRF, rail, billing", "pilot only"],
  ["Start migration posture", "Router/Query boundaries preserved", "ready"],
];

export function Admin() {
  return (
    <>
      <PageHeader
        eyebrow="Governance"
        title="Auditability, access, and calculation controls"
        description="The admin surface keeps the platform defensible as the MVP grows into a regional product."
      />
      <section className="panel">
        <div className="panel-header">
          <h2>Control register</h2>
          <span>Release gates</span>
        </div>
        <div className="control-list">
          {controls.map(([label, detail, status]) => (
            <div key={label}>
              <div>
                <strong>{label}</strong>
                <span>{detail}</span>
              </div>
              <StatusBadge value={status} />
            </div>
          ))}
        </div>
      </section>
      <section className="two-column align-start">
        <article className="panel">
          <div className="panel-header">
            <h2>Plug-in source adapters</h2>
            <span>{sourceAdapters.length} adapters</span>
          </div>
          <div className="control-list">
            {sourceAdapters.map((adapter) => (
              <div key={adapter.id}>
                <div>
                  <strong>{adapter.label}</strong>
                  <span>
                    {adapter.systemType} · {adapter.owner} · Last sync {adapter.lastSync}
                  </span>
                </div>
                <StatusBadge value={adapter.health} />
              </div>
            ))}
          </div>
        </article>
        <article className="panel">
          <div className="panel-header">
            <h2>Capability modules</h2>
            <span>{appModules.length} modules</span>
          </div>
          <div className="control-list">
            {appModules.map((module) => (
              <div key={module.id}>
                <div>
                  <strong>{module.label}</strong>
                  <span>
                    {module.capability} · {module.phase}
                  </span>
                </div>
                <StatusBadge value="ready" />
              </div>
            ))}
          </div>
        </article>
      </section>
      <section className="panel">
        <div className="panel-header">
          <h2>Ledger validation plug-ins</h2>
          <span>{ledgerPlugins.length} active</span>
        </div>
        <div className="control-list">
          {ledgerPlugins.map((plugin) => (
            <div key={plugin.id}>
              <div>
                <strong>{plugin.label}</strong>
                <span>
                  {plugin.description} · Requires {plugin.requiredAdapters.join(", ")}
                </span>
              </div>
              <StatusBadge value="human review" />
            </div>
          ))}
        </div>
      </section>
      <section className="panel">
        <div className="panel-header">
          <h2>Architecture note</h2>
          <span>TanStack Start path</span>
        </div>
        <p>
          This MVP keeps route, query, table, form, and governance boundaries explicit so it can graduate to
          TanStack Start server functions once source adapters, authentication, and report jobs are connected to
          production systems. The ledger and calculation services should remain backend-owned contracts, not browser-only logic.
        </p>
      </section>
    </>
  );
}

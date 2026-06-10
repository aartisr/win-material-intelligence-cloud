import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { MetricCard } from "../components/MetricCard";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { api, queryKeys } from "../lib/api";
import { formatCurrency, formatTons } from "../lib/calculations";
import { AsyncState } from "../shared/ui/AsyncState";

export function Simulation() {
  const query = useQuery({ queryKey: queryKeys.simulationScenarios, queryFn: api.simulationScenarios });
  const navigate = useNavigate();
  const location = useLocation();
  const [hasRun, setHasRun] = useState(false);
  const detailRef = useRef<HTMLElement | null>(null);
  const scenarios = query.data ?? [];
  
  // Extract scenario ID from URL path if present
  const scenarioIdMatch = location.pathname.match(/^\/simulation\/([^/]+)$/);
  const routeScenarioId = scenarioIdMatch ? decodeURIComponent(scenarioIdMatch[1]) : "";
  
  const selected = useMemo(
    () => scenarios.find((scenario) => scenario.id === routeScenarioId) ?? scenarios[0],
    [routeScenarioId, scenarios],
  );

  const savings = selected ? selected.before.annualCost - selected.after.annualCost : 0;
  const diversionLift = selected ? selected.after.diversionRate - selected.before.diversionRate : 0;
  const coverageLift = selected ? selected.after.verifiedCoverage - selected.before.verifiedCoverage : 0;
  const exceptionReduction = selected ? selected.before.exceptions - selected.after.exceptions : 0;
  const railLift = selected ? selected.after.railTons - selected.before.railTons : 0;
  const totalSavings = scenarios.reduce((sum, scenario) => sum + scenario.before.annualCost - scenario.after.annualCost, 0);
  const selectedAccountLabel = selected ? formatEntityLabel(selected.accountId) : "";

  const selectScenario = (nextScenarioId: string, options?: { focusDetails?: boolean }) => {
    setHasRun(false);
    
    navigate({
      to: "/simulation/$scenarioId",
      params: { scenarioId: nextScenarioId },
      hash: options?.focusDetails ? "details" : undefined,
    });

    if (options?.focusDetails) {
      window.requestAnimationFrame(() => {
        detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Simulation mode"
        title="Demo the app's power without live WIN integrations"
        description="Run executive-ready scenarios that show how ledger trust, optimization, reporting, and governance convert raw waste operations into measurable value."
        actions={
          <button
            type="button"
            onClick={() => setHasRun(true)}
            disabled={!selected}
          >
            Run simulation
          </button>
        }
      />

      <AsyncState data={query.data} isLoading={query.isLoading} isError={query.isError} emptyTitle="No simulation scenarios">
        {() =>
          selected ? (
            <div className="simulation-layout">
              <section className="metric-grid compact">
                <MetricCard label="Simulation portfolio" value={`${scenarios.length}`} detail="Borrowed top patterns adapted to waste ops" icon="10" />
                <MetricCard label="Portfolio savings" value={formatCurrency(totalSavings)} detail="Modeled annual opportunity" icon="PS" />
                <MetricCard label="Live demo state" value={hasRun ? "Ran" : "Ready"} detail="Scenario can be reset anytime" icon="LD" />
                <MetricCard label="Realism pattern" value={selected.realism} detail={selected.pattern} icon="RP" />
              </section>

              <section className="scenario-gallery" aria-label="Simulation scenario gallery">
                {scenarios.map((scenario) => {
                  const active = scenario.id === selected.id;
                  return (
                    <Link
                      key={scenario.id}
                      to="/simulation/$scenarioId"
                      params={{ scenarioId: scenario.id }}
                      hash="details"
                      className={active ? "scenario-card active" : "scenario-card"}
                      onClick={() => {
                        setHasRun(false);
                      }}
                    >
                      <span>{scenario.realism}</span>
                      <strong>{scenario.name}</strong>
                      <small>{scenario.pattern}</small>
                    </Link>
                  );
                })}
              </section>

              <section className="panel simulation-control">
                <div className="panel-header">
                  <h2>Scenario console</h2>
                  <StatusBadge value={hasRun ? "complete" : "ready"} />
                </div>
                <label className="select-field">
                  Scenario
                  <select
                    value={selected.id}
                    onChange={(event) => {
                      selectScenario(event.target.value);
                    }}
                  >
                    {scenarios.map((scenario) => (
                      <option key={scenario.id} value={scenario.id}>
                        {scenario.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="scenario-story">
                  <span>{selected.trigger}</span>
                  <p>{selected.storyline}</p>
                  <p className="pressure-event">{selected.pressureEvent}</p>
                  <strong>{selected.durationDays} simulated days</strong>
                </div>
                <div className="scenario-facts" aria-label="Selected scenario quick facts">
                  <div className="scenario-fact">
                    <span>Account</span>
                    <strong>{selectedAccountLabel}</strong>
                  </div>
                  <div className="scenario-fact">
                    <span>Trigger</span>
                    <strong>{selected.trigger}</strong>
                  </div>
                  <div className="scenario-fact">
                    <span>Mode</span>
                    <strong>{selected.realism}</strong>
                  </div>
                  <div className="scenario-fact">
                    <span>Duration</span>
                    <strong>{selected.durationDays} days</strong>
                  </div>
                </div>
              </section>

              <section ref={detailRef} className={hasRun ? "simulation-stage active" : "simulation-stage"}>
                <div className="simulation-stage-header">
                  <div>
                    <span className="eyebrow">Before / After</span>
                    <h2>{selected.name}</h2>
                    <p>{selected.pattern}</p>
                  </div>
                  <div className="simulation-stage-actions">
                    <StatusBadge value={hasRun ? "customer-ready" : "draft"} />
                    <button type="button" className="hero-action hero-action-light" onClick={() => setHasRun(true)}>
                      {hasRun ? "Rerun scenario" : "Run selected scenario"}
                    </button>
                  </div>
                </div>
                <div className="simulation-detail-banner">
                  <div>
                    <span>Selected scenario</span>
                    <strong>{selectedAccountLabel}</strong>
                  </div>
                  <div>
                    <span>Pressure event</span>
                    <strong>{selected.pressureEvent}</strong>
                  </div>
                  <div>
                    <span>Executive outcome</span>
                    <strong>{formatCurrency(savings)} modeled annual savings</strong>
                  </div>
                </div>
                <div className="metric-grid compact">
                  <MetricCard label="Annual savings" value={formatCurrency(savings)} detail="Modeled cost impact" icon="SV" />
                  <MetricCard label="Diversion lift" value={`${diversionLift}%`} detail={`${selected.before.diversionRate}% to ${selected.after.diversionRate}%`} icon="DL" />
                  <MetricCard label="Coverage lift" value={`${coverageLift}%`} detail="Verified source coverage" icon="VC" />
                  <MetricCard label="Exceptions reduced" value={`${exceptionReduction}`} detail={`${selected.before.exceptions} to ${selected.after.exceptions}`} icon="ER" />
                </div>
                <div className="comparison-grid">
                  <ImpactColumn title="Before" tone="before" values={[
                    ["Annual cost", formatCurrency(selected.before.annualCost)],
                    ["Diversion", `${selected.before.diversionRate}%`],
                    ["Verified coverage", `${selected.before.verifiedCoverage}%`],
                    ["Exceptions", `${selected.before.exceptions}`],
                    ["Rail movement", formatTons(selected.before.railTons)],
                  ]} />
                  <ImpactColumn title="After" tone="after" values={[
                    ["Annual cost", formatCurrency(selected.after.annualCost)],
                    ["Diversion", `${selected.after.diversionRate}%`],
                    ["Verified coverage", `${selected.after.verifiedCoverage}%`],
                    ["Exceptions", `${selected.after.exceptions}`],
                    ["Rail movement", formatTons(selected.after.railTons)],
                  ]} />
                </div>
                {railLift > 0 ? <p className="simulation-note">Rail proof increases by {formatTons(railLift)}, giving account teams a visible low-carbon logistics story.</p> : null}
              </section>

              <section className="two-column align-start simulation-bottom">
                <article className="panel">
                  <div className="panel-header">
                    <h2>Injected event stream</h2>
                    <span>{selected.injectedEvents.length} events</span>
                  </div>
                  <ol className="event-stream">
                    {selected.injectedEvents.map((event, index) => (
                      <li key={event}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <strong>{event}</strong>
                      </li>
                    ))}
                  </ol>
                </article>
                <article className="panel executive-card">
                  <div className="panel-header">
                    <h2>Executive takeaway</h2>
                    <StatusBadge value={hasRun ? "approved" : "human review"} />
                  </div>
                  <p>{hasRun ? selected.executiveTakeaway : "Run the simulation to generate the executive narrative and customer-ready result."}</p>
                </article>
              </section>
            </div>
          ) : null
        }
      </AsyncState>
    </>
  );
}

function formatEntityLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function ImpactColumn({
  title,
  tone,
  values,
}: {
  title: string;
  tone: "before" | "after";
  values: Array<[string, string]>;
}) {
  return (
    <article className={`impact-column ${tone}`}>
      <h3>{title}</h3>
      {values.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </article>
  );
}

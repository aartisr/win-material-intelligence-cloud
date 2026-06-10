import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { MetricCard } from "../components/MetricCard";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { api, queryKeys } from "../lib/api";
import { formatCurrency, formatTons, recommendationValue, summarizeEvents } from "../lib/calculations";

export function Dashboard() {
  const events = useQuery({ queryKey: queryKeys.materialEvents(), queryFn: () => api.materialEvents() });
  const recs = useQuery({ queryKey: queryKeys.recommendations(), queryFn: () => api.recommendations() });
  const exceptions = useQuery({ queryKey: queryKeys.exceptions, queryFn: api.exceptions });
  const phases = useQuery({ queryKey: queryKeys.phasePlans, queryFn: api.phasePlans });

  const summary = summarizeEvents(events.data ?? []);
  const potentialValue = recommendationValue(recs.data ?? []);
  const completedPhases = phases.data?.filter((phase) => phase.status === "complete").length ?? 0;
  const totalPhases = phases.data?.length ?? 0;

  return (
    <>
      <PageHeader
        eyebrow="Executive command center"
        title="Deep analytics for material flow, service value, and trust signals"
        description="A deeper operating view for leadership and operators to track performance, quality, and execution readiness in one place."
        actions={<Link className="hero-action" to="/simulation">Launch simulation mode</Link>}
      />

      <section className="metric-grid">
        <MetricCard label="Material tracked" value={formatTons(summary.totalTons)} detail="Across pilot accounts and pathways" icon="MT" />
        <MetricCard label="Diversion rate" value={`${summary.diversionRate}%`} detail="All non-landfill pathways in current period" icon="DV" />
        <MetricCard label="Renewable power equivalent" value={`${summary.renewableMwh} MWh`} detail="Modeled from WTE tonnage" icon="RE" />
        <MetricCard label="Rail movement" value={formatTons(summary.railTons)} detail="Low-carbon transfer pathway" icon="RL" />
        <MetricCard label="Recommendation value" value={formatCurrency(potentialValue)} detail="Annualized pilot opportunity" icon="RV" />
        <MetricCard label="Open exceptions" value={`${exceptions.data?.length ?? 0}`} detail="Blocking report confidence" icon="EX" />
        <MetricCard label="Phase completion" value={`${completedPhases}/${totalPhases}`} detail="Phase 0 through Phase 8 modeled" icon="P8" />
      </section>

      <section className="two-column">
        <article className="panel">
          <div className="panel-header">
            <h2>Phase gate readiness</h2>
            <span>Phase 0-8</span>
          </div>
          <div className="gate-list">
            <div>
              <strong>Ledger confidence</strong>
              <StatusBadge value={`${summary.verifiedCoverage}% verified`} />
            </div>
            <div>
              <strong>Reports workflow</strong>
              <StatusBadge value="approved path" />
            </div>
            <div>
              <strong>Recommendations</strong>
              <StatusBadge value="human review" />
            </div>
            <div>
              <strong>Scale posture</strong>
              <StatusBadge value="complete" />
            </div>
            <div>
              <strong>Commercial packages</strong>
              <StatusBadge value="ready" />
            </div>
            <div>
              <strong>Enterprise flywheel</strong>
              <StatusBadge value="complete" />
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>Implementation doctrine</h2>
            <span>No dashboard theater</span>
          </div>
          <ul className="clean-list">
            <li>Material events must trace to source tickets, manifests, certificates, or approved estimates.</li>
            <li>Every metric carries a calculation version and measured/estimated status.</li>
            <li>Recommendations stay human-approved until confidence and adoption are proven.</li>
            <li>Customer-facing reports ship only after exception queues are cleared or explicitly waived.</li>
          </ul>
        </article>
      </section>
    </>
  );
}

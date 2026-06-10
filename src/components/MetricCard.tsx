import type { ReactNode } from "react";

export function MetricCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <article className="metric-card">
      <div className="metric-card-top">
        <span className="metric-label">{label}</span>
        <div className="metric-icon">{icon}</div>
      </div>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

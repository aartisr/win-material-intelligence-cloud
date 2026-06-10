import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div className="page-header-copy">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="page-header-signature" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
      {actions ? <div className="header-actions">{actions}</div> : null}
    </header>
  );
}

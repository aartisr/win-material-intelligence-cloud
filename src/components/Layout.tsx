import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { appModules } from "../app/navigation";

export function Layout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const activeModule = appModules.find(
    (item) => pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path)),
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <span>WIN</span>
          </div>
          <div>
            <strong>Material Intelligence</strong>
            <span>Cloud · Enterprise command layer</span>
          </div>
        </div>
        <div className="sidebar-kpi">
          <span>Verified operating system</span>
          <strong>Phase 0-8 complete</strong>
        </div>
        <nav aria-label="Primary">
          {appModules.map((item) => {
            const active = pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path));
            return (
              <Link key={item.id} to={item.path} className={active ? "nav-link active" : "nav-link"}>
                <span className="nav-icon">{item.shortLabel}</span>
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.phase}</small>
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="phase-card">
          <span className="nav-icon">AI</span>
          <div>
            <strong>Human-approved intelligence</strong>
            <span>Every claim traces to evidence, status, and source lineage.</span>
          </div>
        </div>
      </aside>
      <div className="content-shell">
        <header className="topbar">
          <div className="topbar-context">
            <span className="eyebrow">WIN Material Intelligence Cloud</span>
            <strong>{activeModule?.label ?? "Command Center"}</strong>
            <small>{activeModule?.capability ?? "Executive operating view"}</small>
          </div>
          <label className="global-search">
            <span>Search</span>
            <input placeholder="Accounts, reports, material events, source adapters" />
          </label>
          <div className="utility-actions" aria-label="Utility actions">
            <Link to="/security">Trust Center</Link>
            <Link to="/reports">Export</Link>
            <Link to="/optimization">Optimize</Link>
          </div>
          <div className="tenant-pill">
            <span>Enterprise</span>
            <strong>Pilot Northeast</strong>
          </div>
        </header>
        <main className="main-content">{children}</main>
        <footer className="app-footer">
          <div>
            <strong>Material Intelligence Cloud</strong>
            <span>Customer-ready reporting · Operational optimization · Sustainability proof</span>
          </div>
          <div className="footer-links">
            <Link to="/ingestion">Source Health</Link>
            <Link to="/admin">Governance</Link>
            <Link to="/commercial">Commercial Packages</Link>
            <Link to="/enterprise">Enterprise Flywheel</Link>
          </div>
          <div className="footer-status">
            <span>Accessibility AA-ready</span>
            <span>Calculation lineage active</span>
            <span>Tenant-scoped model</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

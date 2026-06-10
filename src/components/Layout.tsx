import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { appModules } from "../app/navigation";

const SIDEBAR_STATE_KEY = "win-sidebar-open";

export function Layout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedValue = window.localStorage.getItem(SIDEBAR_STATE_KEY);
    if (storedValue === "true" || storedValue === "false") {
      setIsSidebarOpen(storedValue === "true");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(SIDEBAR_STATE_KEY, String(isSidebarOpen));
  }, [isSidebarOpen]);

  const activeModule = appModules.find(
    (item) => pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path)),
  );
  const footerGroups = [
    {
      title: "Platform",
      links: [
        { to: "/home", label: "Overview" },
        { to: "/dashboard", label: "Analytics" },
        { to: "/simulation", label: "Simulation Studio" },
        { to: "/reports", label: "Board Exports" },
      ],
    },
    {
      title: "Operations",
      links: [
        { to: "/ingestion", label: "Source Health" },
        { to: "/ledger", label: "Ledger Integrity" },
        { to: "/optimization", label: "Optimization Engine" },
        { to: "/recommendations", label: "Next Best Actions" },
      ],
    },
    {
      title: "Enterprise",
      links: [
        { to: "/security", label: "Trust Center" },
        { to: "/enterprise", label: "Enterprise Flywheel" },
        { to: "/commercial", label: "Commercial Packages" },
        { to: "/admin", label: "Governance" },
      ],
    },
  ];

  return (
    <div className={isSidebarOpen ? "app-shell" : "app-shell sidebar-collapsed"}>
      <aside id="primary-sidebar" className={isSidebarOpen ? "sidebar" : "sidebar sidebar-collapsed"}>
        <Link to="/home" className="brand-link">
          <div className="brand">
            <div className="brand-mark">
              <span>WIN</span>
            </div>
            <div className="brand-copy">
              <strong>Material Intelligence</strong>
              <span>Cloud · Enterprise command layer</span>
            </div>
          </div>
        </Link>
        <div className="sidebar-kpi">
          <span>Verified operating system</span>
          <strong>Phase 0-8 complete</strong>
        </div>
        <nav aria-label="Primary">
          {appModules.map((item) => {
            const active = pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path));
            return (
              <Link
                key={item.id}
                to={item.path}
                className={active ? "nav-link active" : "nav-link"}
                aria-label={item.label}
                data-tooltip={item.label}
              >
                <span className="nav-icon">{item.shortLabel}</span>
                <span className="nav-copy">
                  <strong>{item.label}</strong>
                  <small>{item.phase}</small>
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="phase-card">
          <span className="nav-icon">AI</span>
          <div className="phase-copy">
            <strong>Human-approved intelligence</strong>
            <span>Every claim traces to evidence, status, and source lineage.</span>
          </div>
        </div>
      </aside>
      <div className="content-shell">
        <header className="topbar">
          <div className="topbar-rail">
            <div className="topbar-signal">
              <span className="topbar-signal-dot" aria-hidden="true" />
              Verified command layer live across sourcing, reporting, and optimization.
            </div>
            <div className="topbar-rail-links" aria-label="Platform status">
              <Link to="/security">Trust Center</Link>
              <Link to="/ingestion">Live Status</Link>
              <Link to="/reports">Board Pack</Link>
            </div>
          </div>
          <div className="topbar-main">
            <div className="topbar-context">
              <div className="topbar-context-row">
                <button
                  type="button"
                  className="sidebar-toggle"
                  onClick={() => setIsSidebarOpen((current) => !current)}
                  aria-controls="primary-sidebar"
                  aria-label={isSidebarOpen ? "Collapse side menu" : "Expand side menu"}
                >
                  <span aria-hidden="true">☰</span>
                  <span>{isSidebarOpen ? "Hide menu" : "Show menu"}</span>
                </button>
                <span className="eyebrow">WIN Material Intelligence Cloud</span>
              </div>
              <strong>{activeModule?.label ?? "Command Center"}</strong>
              <small>{activeModule?.capability ?? "Executive operating view"}</small>
              <div className="topbar-highlights" aria-label="Platform highlights">
                <span>99.98% evidence traceability</span>
                <span>Board-ready in under 5 min</span>
                <span>Tenant-scoped decision layer</span>
              </div>
            </div>
            <div className="topbar-command">
              <label className="global-search">
                <span>Search</span>
                <input placeholder="Accounts, reports, material events, source adapters" />
              </label>
              <div className="topbar-action-cluster">
                <div className="utility-actions" aria-label="Utility actions">
                  <Link to="/home">Overview</Link>
                  <Link to="/security">Trust</Link>
                  <Link to="/reports">Export</Link>
                  <Link to="/optimization">Launch action</Link>
                </div>
                <div className="tenant-pill">
                  <span>Enterprise</span>
                  <strong>Pilot Northeast</strong>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="main-content">
          <div className="route-transition">
            {children}
          </div>
        </main>
        <footer className="app-footer">
          <div className="footer-hero">
            <div className="footer-brandline">
              <div className="footer-brand-mark">WIN</div>
              <div>
                <strong>Material Intelligence Cloud</strong>
                <span>Evidence-first operating system for resilient supply chains.</span>
              </div>
            </div>
            <p>
              Bring commercial, sustainability, and operational proof into one executive-grade surface with
              traceable decisions, faster board narratives, and cleaner handoffs across teams.
            </p>
            <div className="footer-hero-actions">
              <Link to="/simulation">Explore scenarios</Link>
              <Link to="/security">Review trust model</Link>
            </div>
            <div className="footer-proof-strip" aria-label="Platform proof points">
              <span>Used for customer-ready reporting</span>
              <span>Lineage-aware decision support</span>
              <span>Executive and operator views aligned</span>
            </div>
          </div>
          <div className="footer-grid">
            {footerGroups.map((group) => (
              <section key={group.title} className="footer-column" aria-label={group.title}>
                <strong>{group.title}</strong>
                <div className="footer-link-list">
                  {group.links.map((link) => (
                    <Link key={link.to} to={link.to}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <div className="footer-status-panel">
            <span className="footer-kicker">Operational posture</span>
            <div className="footer-status-cards">
              <div>
                <strong>Accessibility</strong>
                <span>AA-ready interface patterns</span>
              </div>
              <div>
                <strong>Evidence lineage</strong>
                <span>Calculation and source context active</span>
              </div>
              <div>
                <strong>Tenant governance</strong>
                <span>Scoped model and review workflow</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>Built for executive clarity, operator velocity, and customer trust.</span>
            <div className="footer-meta-links">
              <Link to="/roadmap">Roadmap</Link>
              <Link to="/accounts">Accounts</Link>
              <Link to="/exceptions">Exceptions</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

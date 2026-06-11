import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { ReactNode, TouchEvent } from "react";
import { appModules } from "../app/navigation";

const SIDEBAR_STATE_KEY = "win-sidebar-open";
const SIDEBAR_VISIBILITY_STATE_KEY = "win-sidebar-visible";
const MOBILE_BREAKPOINT_QUERY = "(max-width: 900px)";
const MOBILE_DOCK_MODULE_IDS = ["home", "command-center", "reports", "optimization"];

export function Layout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarToggleRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuCloseRef = useRef<HTMLButtonElement | null>(null);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchCurrentXRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedValue = window.localStorage.getItem(SIDEBAR_STATE_KEY);
    if (storedValue === "true" || storedValue === "false") {
      setIsSidebarOpen(storedValue === "true");
    }

    const storedVisibility = window.localStorage.getItem(SIDEBAR_VISIBILITY_STATE_KEY);
    if (storedVisibility === "true" || storedVisibility === "false") {
      setIsSidebarVisible(storedVisibility === "true");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(SIDEBAR_STATE_KEY, String(isSidebarOpen));
  }, [isSidebarOpen]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(SIDEBAR_VISIBILITY_STATE_KEY, String(isSidebarVisible));
  }, [isSidebarVisible]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia(MOBILE_BREAKPOINT_QUERY);
    const handleMediaChange = (event: MediaQueryListEvent | MediaQueryList) => {
      const matches = "matches" in event ? event.matches : media.matches;
      setIsMobileViewport(matches);
      if (!matches) {
        setIsMobileMenuOpen(false);
      }
    };

    handleMediaChange(media);

    const listener = (event: MediaQueryListEvent) => handleMediaChange(event);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!isMobileMenuOpen) {
      document.body.style.removeProperty("overflow");
      return;
    }

    document.body.style.setProperty("overflow", "hidden");
    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isMobileViewport || !isMobileMenuOpen || !sidebarRef.current) {
      return;
    }

    const getFocusableElements = () => {
      if (!sidebarRef.current) {
        return [] as HTMLElement[];
      }

      const selector = [
        "a[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "[tabindex]:not([tabindex='-1'])",
      ].join(",");

      return Array.from(sidebarRef.current.querySelectorAll<HTMLElement>(selector)).filter((element) => {
        const isHidden = element.getAttribute("aria-hidden") === "true";
        const isDisabled = element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true";
        return !isHidden && !isDisabled;
      });
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!active || !sidebarRef.current?.contains(active)) {
        event.preventDefault();
        first.focus();
        return;
      }

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobileMenuOpen, isMobileViewport]);

  useEffect(() => {
    if (!isMobileViewport) {
      return;
    }

    if (isMobileMenuOpen) {
      mobileMenuCloseRef.current?.focus();
      return;
    }

    sidebarToggleRef.current?.focus();
  }, [isMobileMenuOpen, isMobileViewport]);

  const sidebarExpanded = isMobileViewport ? isMobileMenuOpen : isSidebarVisible;

  const handleSidebarToggle = () => {
    if (isMobileViewport) {
      setIsMobileMenuOpen((current) => !current);
      return;
    }

    if (!isSidebarVisible) {
      setIsSidebarVisible(true);
      setIsSidebarOpen(true);
      return;
    }

    setIsSidebarOpen((current) => !current);
  };

  const handleSidebarVisibilityToggle = () => {
    if (isMobileViewport) {
      return;
    }

    setIsSidebarVisible((current) => {
      const nextValue = !current;
      if (nextValue) {
        setIsSidebarOpen(true);
      }
      return nextValue;
    });
  };

  const handleSidebarTouchStart = (event: TouchEvent<HTMLElement>) => {
    if (!isMobileViewport || !isMobileMenuOpen) {
      return;
    }

    const touch = event.touches[0];
    touchStartXRef.current = touch.clientX;
    touchCurrentXRef.current = touch.clientX;
  };

  const handleSidebarTouchMove = (event: TouchEvent<HTMLElement>) => {
    if (!isMobileViewport || !isMobileMenuOpen || touchStartXRef.current === null) {
      return;
    }

    touchCurrentXRef.current = event.touches[0].clientX;
  };

  const handleSidebarTouchEnd = () => {
    if (!isMobileViewport || !isMobileMenuOpen || touchStartXRef.current === null || touchCurrentXRef.current === null) {
      touchStartXRef.current = null;
      touchCurrentXRef.current = null;
      return;
    }

    const deltaX = touchCurrentXRef.current - touchStartXRef.current;
    if (deltaX < -70) {
      setIsMobileMenuOpen(false);
    }

    touchStartXRef.current = null;
    touchCurrentXRef.current = null;
  };

  const activeModule = appModules.find(
    (item) => pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path)),
  );
  const mobileDockModules = MOBILE_DOCK_MODULE_IDS
    .map((id) => appModules.find((item) => item.id === id))
    .filter((item): item is (typeof appModules)[number] => Boolean(item));
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
    <div
      className={[
        "app-shell",
        isSidebarOpen ? "" : "sidebar-collapsed",
        !isMobileViewport && !isSidebarVisible ? "sidebar-hidden" : "",
        isMobileMenuOpen ? "mobile-nav-open" : "",
      ].filter(Boolean).join(" ")}
    >
      <button
        type="button"
        className="sidebar-overlay"
        aria-label="Close side menu"
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <aside
        id="primary-sidebar"
        ref={sidebarRef}
        className={[
          "sidebar",
          !isSidebarOpen ? "sidebar-collapsed" : "",
          !isMobileViewport && !isSidebarVisible ? "sidebar-hidden" : "",
          isMobileMenuOpen ? "mobile-open" : "",
        ].filter(Boolean).join(" ")}
        aria-label="Primary navigation"
        onTouchStart={handleSidebarTouchStart}
        onTouchMove={handleSidebarTouchMove}
        onTouchEnd={handleSidebarTouchEnd}
        onTouchCancel={handleSidebarTouchEnd}
      >
        <button
          type="button"
          ref={mobileMenuCloseRef}
          className="mobile-menu-close"
          aria-label="Close side menu"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <span aria-hidden="true">×</span>
        </button>
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
                aria-current={active ? "page" : undefined}
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
                  ref={sidebarToggleRef}
                  className="sidebar-toggle"
                  onClick={handleSidebarToggle}
                  aria-controls="primary-sidebar"
                  aria-label={sidebarExpanded ? "Collapse side menu" : "Expand side menu"}
                >
                  <span aria-hidden="true">☰</span>
                  <span>{sidebarExpanded ? "Collapse menu" : "Expand menu"}</span>
                </button>
                {!isMobileViewport ? (
                  <button
                    type="button"
                    className="sidebar-visibility-toggle"
                    onClick={handleSidebarVisibilityToggle}
                    aria-controls="primary-sidebar"
                    aria-label={isSidebarVisible ? "Slide side menu out" : "Slide side menu in"}
                  >
                    <span aria-hidden="true">↔</span>
                    <span>{isSidebarVisible ? "Slide out" : "Slide in"}</span>
                  </button>
                ) : null}
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
        <nav className="mobile-dock" aria-label="Quick navigation">
          {mobileDockModules.map((item) => {
            const active = pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path));
            return (
              <Link
                key={item.id}
                to={item.path}
                className={active ? "mobile-dock-link active" : "mobile-dock-link"}
                aria-current={active ? "page" : undefined}
                aria-label={item.label}
              >
                <span className="mobile-dock-icon" aria-hidden="true">{item.shortLabel}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            className="mobile-dock-link mobile-dock-menu"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-controls="primary-sidebar"
            aria-label="Open full navigation menu"
          >
            <span className="mobile-dock-icon" aria-hidden="true">☰</span>
            <span>Menu</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { appModules } from "../app/navigation";
import { MetricCard } from "../components/MetricCard";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { api, queryKeys } from "../lib/api";
import { formatCurrency, formatTons, recommendationValue, summarizeEvents } from "../lib/calculations";
import type { SimulationScenario } from "../types";

export function Home() {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const events = useQuery({ queryKey: queryKeys.materialEvents(), queryFn: () => api.materialEvents() });
  const recs = useQuery({ queryKey: queryKeys.recommendations(), queryFn: () => api.recommendations() });
  const exceptions = useQuery({ queryKey: queryKeys.exceptions, queryFn: api.exceptions });
  const phases = useQuery({ queryKey: queryKeys.phasePlans, queryFn: api.phasePlans });
  const simulationScenarios = useQuery({ queryKey: queryKeys.simulationScenarios, queryFn: api.simulationScenarios });

  const summary = summarizeEvents(events.data ?? []);
  const potentialValue = recommendationValue(recs.data ?? []);
  const completedPhases = phases.data?.filter((phase) => phase.status === "complete").length ?? 0;
  const totalPhases = phases.data?.length ?? 0;
  const confidenceRate = summary.verifiedCoverage;
  const featuredSimulations = (simulationScenarios.data ?? []).slice(0, 10);

  const syncActiveSlide = () => {
    const carousel = carouselRef.current;
    if (!carousel) {
      return;
    }

    const slides = Array.from(carousel.querySelectorAll<HTMLElement>(".simulation-slide"));
    if (!slides.length) {
      setActiveSlide(0);
      return;
    }

    const carouselRect = carousel.getBoundingClientRect();
    const viewportCenter = carouselRect.left + carouselRect.width / 2;

    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    slides.forEach((slide, index) => {
      const slideRect = slide.getBoundingClientRect();
      const slideCenter = slideRect.left + slideRect.width / 2;
      const distance = Math.abs(viewportCenter - slideCenter);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    setActiveSlide(nearestIndex);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || isCarouselPaused || featuredSimulations.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const carousel = carouselRef.current;
      if (!carousel) {
        return;
      }

      const step = Math.max(280, Math.floor(carousel.clientWidth * 0.46));
      const nextLeft = carousel.scrollLeft + step;
      const endReached = nextLeft >= carousel.scrollWidth - carousel.clientWidth - 8;
      carousel.scrollTo({ left: endReached ? 0 : nextLeft, behavior: "smooth" });
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, [featuredSimulations.length, isCarouselPaused]);

  useEffect(() => {
    syncActiveSlide();
    const onResize = () => syncActiveSlide();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
        scrollFrameRef.current = null;
      }
    };
  }, [featuredSimulations.length]);

  const handleCarouselScroll = () => {
    if (scrollFrameRef.current !== null) {
      return;
    }

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      syncActiveSlide();
      scrollFrameRef.current = null;
    });
  };

  const moveCarousel = (direction: "left" | "right") => {
    const carousel = carouselRef.current;
    if (!carousel) {
      return;
    }
    const step = Math.max(280, Math.floor(carousel.clientWidth * 0.52));
    const delta = direction === "left" ? -step : step;
    carousel.scrollBy({ left: delta, behavior: "smooth" });
  };

  const goToSlide = (index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) {
      return;
    }

    const slides = Array.from(carousel.querySelectorAll<HTMLElement>(".simulation-slide"));
    const target = slides[index];
    if (!target) {
      return;
    }

    carousel.scrollTo({ left: Math.max(0, target.offsetLeft - 6), behavior: "smooth" });
  };

  const leadershipReasons = [
    {
      title: "One version of truth",
      detail: "Leaders, sales, operations, and finance all read the same numbers from the same ledger.",
    },
    {
      title: "Faster decisions",
      detail: "The homepage highlights risks, value opportunities, and action links in one scroll.",
    },
    {
      title: "Stronger customer trust",
      detail: "Every claim is tied to source evidence so reports can stand up in audits and renewals.",
    },
    {
      title: "Growth without chaos",
      detail: "As more regions and accounts join, this system keeps process, governance, and performance aligned.",
    },
  ];

  const leadershipRisks = [
    "Without this platform, teams spend more time debating data than solving problems.",
    "When metrics are fragmented, customer-facing claims become risky and harder to defend.",
    "Slow, manual reporting delays executive action and leaves value on the table.",
  ];

  return (
    <>
      <PageHeader
        eyebrow="Home"
        title="WIN Operating System"
        description="It gives one trusted view of performance, risk, and opportunity so decisions happen faster, teams stay aligned, and customer value is easier to prove."
        actions={
          <div className="header-actions">
            <Link className="hero-action" to="/roadmap">
              View execution roadmap
            </Link>
            <Link className="hero-action hero-action-light" to="/simulation">
              Run leadership scenario
            </Link>
          </div>
        }
      />

      <section className="metric-grid homepage-metrics">
        <MetricCard label="Material tracked" value={formatTons(summary.totalTons)} detail="Live across active pilot accounts" icon="MT" />
        <MetricCard label="Verified confidence" value={`${confidenceRate}%`} detail="Claims already tied to evidence" icon="CF" />
        <MetricCard label="Value opportunity" value={formatCurrency(potentialValue)} detail="Annual upside from current recommendations" icon="VO" />
        <MetricCard label="Open exceptions" value={`${exceptions.data?.length ?? 0}`} detail="Items leadership can unblock fast" icon="EX" />
        <MetricCard label="Diversion rate" value={`${summary.diversionRate}%`} detail="Current non-landfill performance" icon="DV" />
        <MetricCard label="Rail movement" value={formatTons(summary.railTons)} detail="Lower-carbon transport in operation" icon="RL" />
      </section>

      <section className="panel simulation-carousel-panel">
        <div className="panel-header">
          <h2>10 executive simulation stories</h2>
          <span>Click any visual to open that scenario instantly</span>
        </div>
        <div className="simulation-carousel-toolbar" aria-label="Simulation carousel controls">
          <button
            type="button"
            className="carousel-arrow"
            onClick={() => moveCarousel("left")}
            aria-label="Scroll simulations left"
          >
            ←
          </button>
          <button
            type="button"
            className="carousel-arrow"
            onClick={() => moveCarousel("right")}
            aria-label="Scroll simulations right"
          >
            →
          </button>
        </div>
        <div
          ref={carouselRef}
          className="simulation-carousel"
          aria-label="Top simulation previews"
          onScroll={handleCarouselScroll}
          onMouseEnter={() => setIsCarouselPaused(true)}
          onMouseLeave={() => setIsCarouselPaused(false)}
          onFocusCapture={() => setIsCarouselPaused(true)}
          onBlurCapture={() => setIsCarouselPaused(false)}
        >
          {featuredSimulations.map((scenario, index) => (
            <Link
              key={scenario.id}
              to="/simulation/$scenarioId"
              params={{ scenarioId: scenario.id }}
              hash="details"
              className="simulation-slide"
            >
              <div className="simulation-slide-image-wrap">
                <img src={buildSimulationVisual(scenario, index)} alt={`${scenario.name} simulation preview`} loading="lazy" />
              </div>
              <div className="simulation-slide-content">
                <span>{scenario.realism}</span>
                <strong>{scenario.name}</strong>
                <small>{scenario.pattern}</small>
              </div>
            </Link>
          ))}
        </div>
        <div className="carousel-dots" aria-label="Simulation slide indicators">
          {featuredSimulations.map((scenario, index) => (
            <button
              key={scenario.id}
              type="button"
              className={activeSlide === index ? "carousel-dot active" : "carousel-dot"}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}: ${scenario.name}`}
              aria-current={activeSlide === index ? "true" : undefined}
            />
          ))}
        </div>
      </section>

      <section className="two-column">
        <article className="panel executive-card">
          <div className="panel-header">
            <h2>Why leadership should invest now</h2>
            <span>Direct business advantage</span>
          </div>
          <div className="value-list">
            {leadershipReasons.map((reason) => (
              <div key={reason.title}>
                <strong>{reason.title}</strong>
                <p>{reason.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel risk-panel">
          <div className="panel-header">
            <h2>Cost of not doing this</h2>
            <span>What we avoid</span>
          </div>
          <ul className="clean-list">
            {leadershipRisks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
          <div className="status-strip">
            <div>
              <strong>Phase delivery</strong>
              <StatusBadge value={`${completedPhases}/${totalPhases} complete`} />
            </div>
            <div>
              <strong>Report readiness</strong>
              <StatusBadge value="customer-ready" />
            </div>
            <div>
              <strong>Governance posture</strong>
              <StatusBadge value="approved" />
            </div>
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Start anywhere in one click</h2>
          <span>Designed for fast executive navigation</span>
        </div>
        <div className="home-link-grid">
          {appModules.filter((module) => module.path !== "/home").map((module) => (
            <Link key={module.id} to={module.path} className="home-link-card">
              <span>{module.shortLabel}</span>
              <strong>{module.label}</strong>
              <small>{module.capability}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="two-column">
        <article className="panel">
          <div className="panel-header">
            <h2>Leadership narrative for every stakeholder</h2>
            <span>Simple, repeatable story</span>
          </div>
          <ul className="clean-list">
            <li>We capture operations data once and use it everywhere with full context.</li>
            <li>We turn that data into trusted metrics that leaders and customers can both believe.</li>
            <li>We show clear actions that improve performance, margin, and reporting quality.</li>
            <li>We scale this model account by account, region by region, without losing control.</li>
          </ul>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>Immediate executive actions</h2>
            <span>3-minute path</span>
          </div>
          <div className="control-list">
            <div>
              <div>
                <strong>Review financial upside</strong>
                <span>See recommendations prioritized by annual value</span>
              </div>
              <Link to="/recommendations">Open</Link>
            </div>
            <div>
              <div>
                <strong>Validate trust posture</strong>
                <span>Confirm evidence lineage, security, and governance controls</span>
              </div>
              <Link to="/security">Open</Link>
            </div>
            <div>
              <div>
                <strong>Align commercial plan</strong>
                <span>Move from pilot to packaged enterprise rollout</span>
              </div>
              <Link to="/commercial">Open</Link>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}

const visualPalettes = [
  ["#092f35", "#1f6f5b", "#d6f06b"],
  ["#0f2b45", "#2d6ea4", "#8cd2ff"],
  ["#3d1f37", "#a0457b", "#ffb3d2"],
  ["#2f2b08", "#9b7f18", "#f4de83"],
  ["#1d2747", "#5167c5", "#b6c4ff"],
];

function buildSimulationVisual(scenario: SimulationScenario, index: number) {
  const [deep, mid, accent] = visualPalettes[index % visualPalettes.length];
  const name = shorten(scenario.name, 34);
  const tag = scenario.realism.toUpperCase();
  const savings = scenario.before.annualCost - scenario.after.annualCost;
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='960' height='560' viewBox='0 0 960 560'>
    <defs>
      <linearGradient id='g1' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${deep}'/>
        <stop offset='55%' stop-color='${mid}'/>
        <stop offset='100%' stop-color='${accent}'/>
      </linearGradient>
      <radialGradient id='glow' cx='0.85' cy='0.1' r='0.55'>
        <stop offset='0%' stop-color='rgba(255,255,255,0.55)'/>
        <stop offset='100%' stop-color='rgba(255,255,255,0)'/>
      </radialGradient>
    </defs>
    <rect width='960' height='560' fill='url(#g1)'/>
    <rect width='960' height='560' fill='url(#glow)'/>
    <g opacity='0.25'>
      <circle cx='770' cy='120' r='120' fill='#ffffff'/>
      <circle cx='860' cy='170' r='80' fill='#ffffff'/>
    </g>
    <g opacity='0.24' fill='none' stroke='#ffffff' stroke-width='2'>
      <path d='M80 430 C220 360 330 460 470 395 C610 330 710 420 880 350'/>
      <path d='M80 470 C220 400 350 500 500 440 C650 380 760 450 910 390'/>
    </g>
    <rect x='64' y='58' rx='22' ry='22' width='188' height='44' fill='rgba(255,255,255,0.18)'/>
    <text x='84' y='88' fill='#ffffff' font-family='Plus Jakarta Sans,Segoe UI,sans-serif' font-size='18' font-weight='700'>SIM ${String(index + 1).padStart(2, "0")}</text>
    <text x='64' y='156' fill='#ffffff' font-family='Sora,Plus Jakarta Sans,Segoe UI,sans-serif' font-size='42' font-weight='700'>${escapeXml(name)}</text>
    <text x='64' y='202' fill='rgba(255,255,255,0.88)' font-family='Plus Jakarta Sans,Segoe UI,sans-serif' font-size='20' font-weight='600'>${escapeXml(tag)} MODE</text>
    <rect x='64' y='420' rx='14' ry='14' width='300' height='72' fill='rgba(6,15,24,0.34)'/>
    <text x='86' y='452' fill='#ffffff' font-family='Plus Jakarta Sans,Segoe UI,sans-serif' font-size='18' font-weight='600'>Modeled Savings</text>
    <text x='86' y='481' fill='${accent}' font-family='Sora,Plus Jakarta Sans,Segoe UI,sans-serif' font-size='26' font-weight='700'>$${formatNumber(savings)}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function shorten(value: string, maxLength: number) {
  return value.length <= maxLength ? value : `${value.slice(0, maxLength - 1)}…`;
}

function formatNumber(value: number) {
  return Math.max(0, Math.round(value)).toLocaleString("en-US");
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
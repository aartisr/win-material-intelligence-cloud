import type { MaterialEvent, Recommendation } from "../types";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatTons(value: number) {
  return `${value.toLocaleString("en-US", { maximumFractionDigits: 1 })} tons`;
}

export function summarizeEvents(events: MaterialEvent[]) {
  const totalTons = events.reduce((sum, event) => sum + event.tons, 0);
  const verifiedTons = events
    .filter((event) => event.quality === "verified")
    .reduce((sum, event) => sum + event.tons, 0);
  const diversionTons = events
    .filter((event) => event.pathway !== "Landfill")
    .reduce((sum, event) => sum + event.tons, 0);
  const wteTons = events
    .filter((event) => event.pathway === "Waste-to-energy")
    .reduce((sum, event) => sum + event.tons, 0);
  const railTons = events
    .filter((event) => event.pathway === "Rail transfer")
    .reduce((sum, event) => sum + event.tons, 0);

  return {
    totalTons,
    verifiedCoverage: totalTons ? Math.round((verifiedTons / totalTons) * 100) : 0,
    diversionRate: totalTons ? Math.round((diversionTons / totalTons) * 100) : 0,
    renewableMwh: Math.round(wteTons * 0.55),
    railTons,
  };
}

export function recommendationValue(recommendations: Recommendation[]) {
  return recommendations.reduce((sum, item) => sum + item.valueEstimate, 0);
}

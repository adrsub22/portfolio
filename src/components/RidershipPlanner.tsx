"use client";

import { useMemo, useState } from "react";
import {
  chartMonths,
  defaultLevers,
  filterRoutes,
  fiscalTotals,
  routes,
  seriesFor,
  serviceTypeLabel,
  serviceTypes,
  type Levers,
  type ServiceType,
} from "@/data/forecastDemo";

const horizonColor = {
  actual: "#5c564c",
  forecast: "#2f6f62",
  scenario: "#d4652f",
};

function money(n: number) {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(n).toLocaleString()}`;
}

function riders(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${Math.round(n / 1000)}k`;
  return Math.round(n).toLocaleString();
}

function LineChart({
  values,
}: {
  values: { x: number; y: number; color: string }[];
}) {
  const w = 640;
  const h = 200;
  const pad = { l: 8, r: 8, t: 12, b: 8 };
  const max = Math.max(...values.map((v) => v.y), 1);
  const pts = values.map((v, i) => {
    const x = pad.l + (i / Math.max(values.length - 1, 1)) * (w - pad.l - pad.r);
    const y = pad.t + (1 - v.y / max) * (h - pad.t - pad.b);
    return { ...v, x, y };
  });

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="chart" role="img" aria-label="Monthly ridership">
      {pts.slice(1).map((p, i) => (
        <line
          key={chartMonths[i + 1].key}
          x1={pts[i].x}
          y1={pts[i].y}
          x2={p.x}
          y2={p.y}
          stroke={p.color}
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}

export function RidershipPlanner() {
  const [type, setType] = useState<ServiceType | "all">("all");
  const [routeId, setRouteId] = useState("all");
  const [levers, setLevers] = useState<Levers>(defaultLevers);

  const typeRoutes = useMemo(() => filterRoutes(type, "all"), [type]);
  const selected = useMemo(() => filterRoutes(type, routeId), [type, routeId]);
  const baseline = useMemo(() => seriesFor(selected, defaultLevers), [selected]);
  const scenario = useMemo(() => seriesFor(selected, levers), [selected, levers]);
  const fys = useMemo(() => fiscalTotals(scenario), [scenario]);
  const baseFys = useMemo(() => fiscalTotals(baseline), [baseline]);

  const chartVals = scenario.map((row) => ({
    x: 0,
    y: row.riders,
    color: horizonColor[row.month.horizon],
  }));

  const next12 = scenario.filter((r) => r.month.horizon === "forecast");
  const fiveYearCost = fys.reduce((a, b) => a + b.cost, 0);
  const fiveYearRiders = fys.reduce((a, b) => a + b.riders, 0);
  const baseCost = baseFys.reduce((a, b) => a + b.cost, 0);

  function setLever(key: keyof Levers, value: number) {
    setLevers((prev) => ({ ...prev, [key]: value }));
  }

  function onType(next: ServiceType | "all") {
    setType(next);
    setRouteId("all");
  }

  return (
    <div className="planner">
      <p className="kicker">Interactive · scaled demo</p>
      <h3>Route scenario workspace</h3>
      <p className="muted">
        Filter by service type or route, then change span, hours, miles, and
        demographics. Actuals stop at Aug 2026. The next 12 months are a
        short-term forecast; everything after that is a scenario. Fiscal years
        run October–September. Monthly rollups stand in for the production
        daily XGBoost grain. Illustrative elasticities — not the trained model.
      </p>

      <div className="filters">
        <label>
          Service type
          <select
            value={type}
            onChange={(e) => onType(e.target.value as ServiceType | "all")}
          >
            <option value="all">All types ({routes.length})</option>
            {serviceTypes.map((t) => (
              <option key={t} value={t}>
                {serviceTypeLabel[t]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Route
          <select value={routeId} onChange={(e) => setRouteId(e.target.value)}>
            <option value="all">All in view ({typeRoutes.length})</option>
            {typeRoutes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id} · {r.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="controls controls-4">
        {(
          [
            ["span", "Span of service", levers.span],
            ["hours", "Service hours", levers.hours],
            ["miles", "Service miles", levers.miles],
            ["demo", "Demographics", levers.demo],
          ] as const
        ).map(([key, label, value]) => (
          <label key={key}>
            {label} {value > 0 ? `+${value}%` : `${value}%`}
            <input
              type="range"
              min={-20}
              max={40}
              value={value}
              onChange={(e) => setLever(key, Number(e.target.value))}
            />
          </label>
        ))}
      </div>

      <div className="legend">
        <span>
          <i style={{ background: horizonColor.actual }} /> Actual
        </span>
        <span>
          <i style={{ background: horizonColor.forecast }} /> Short-term forecast
        </span>
        <span>
          <i style={{ background: horizonColor.scenario }} /> Scenario
        </span>
      </div>

      <LineChart values={chartVals} />
      <p className="caption">
        {chartMonths[0].label} – {chartMonths[chartMonths.length - 1].label} ·
        monthly boardings
      </p>

      <div className="kpi-row kpi-row-4">
        <div className="kpi">
          <span className="muted">Next 12 months</span>
          <b>{riders(next12.reduce((a, b) => a + b.riders, 0))}</b>
        </div>
        <div className="kpi">
          <span className="muted">FY27–FY31 boardings (Oct–Sep)</span>
          <b>{riders(fiveYearRiders)}</b>
        </div>
        <div className="kpi">
          <span className="muted">FY27–FY31 operating $</span>
          <b>{money(fiveYearCost)}</b>
        </div>
        <div className="kpi">
          <span className="muted">vs. planned service $</span>
          <b>
            {fiveYearCost - baseCost >= 0 ? "+" : ""}
            {money(fiveYearCost - baseCost)}
          </b>
        </div>
      </div>

      <table className="fy-table">
        <thead>
          <tr>
            <th>Fiscal year (Oct–Sep)</th>
            <th>Boardings</th>
            <th>Rev-hours</th>
            <th>Est. operating $</th>
          </tr>
        </thead>
        <tbody>
          {fys.map((row) => (
            <tr key={row.fy}>
              <td>FY{String(row.fy).slice(2)}</td>
              <td>{riders(row.riders)}</td>
              <td>{Math.round(row.hours).toLocaleString()}</td>
              <td>{money(row.cost)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

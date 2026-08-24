"use client";

import { useMemo, useState } from "react";
import {
  chartMonths,
  defaultLevers,
  filterRoutes,
  fyRollup,
  routes,
  scenarioFiscalYears,
  seriesFor,
  serviceTypeLabel,
  serviceTypes,
  type Horizon,
  type Levers,
  type MonthPoint,
  type ServiceType,
} from "@/data/forecastDemo";

const horizonColor: Record<Horizon | "blended", string> = {
  actual: "#5c564c",
  forecast: "#2f6f62",
  scenario: "#d4652f",
  blended: "#8a8274",
};

const costStroke = "#c45c28";

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

function yoyLabel(yoy: number | null) {
  if (yoy === null) return "—";
  const pct = yoy * 100;
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

function bandLabel(band: Horizon | "blended") {
  if (band === "actual") return "Historical";
  if (band === "forecast") return "Forecast";
  if (band === "scenario") return "Scenario";
  return "Blended";
}

type SeriesRow = {
  month: MonthPoint;
  riders: number;
  hours: number;
  cost: number;
};

function DualAxisChart({ rows }: { rows: SeriesRow[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const w = 720;
  const h = 280;
  const pad = { l: 58, r: 62, t: 28, b: 36 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const maxR = Math.max(...rows.map((r) => r.riders), 1);
  const maxC = Math.max(...rows.map((r) => r.cost), 1);
  const n = Math.max(rows.length - 1, 1);

  const pts = rows.map((row, i) => {
    const x = pad.l + (i / n) * innerW;
    return {
      ...row,
      x,
      yR: pad.t + (1 - row.riders / maxR) * innerH,
      yC: pad.t + (1 - row.cost / maxC) * innerH,
    };
  });

  const ticks = [0, 0.5, 1];
  const yearMarks = pts.filter((p) => p.month.month === 10);

  const tip = hover !== null ? pts[hover] : null;

  return (
    <div className="chart-wrap">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="chart"
        role="img"
        aria-label="Monthly ridership and operating cost"
        onMouseLeave={() => setHover(null)}
      >
        <text x={pad.l} y="16" className="chart-title">
          Monthly boardings and operating cost
        </text>
        <text
          x="14"
          y={pad.t + innerH / 2}
          className="axis-name"
          transform={`rotate(-90 14 ${pad.t + innerH / 2})`}
        >
          Boardings
        </text>
        <text
          x={w - 14}
          y={pad.t + innerH / 2}
          className="axis-name"
          transform={`rotate(90 ${w - 14} ${pad.t + innerH / 2})`}
        >
          Operating $
        </text>
        {ticks.map((t) => {
          const y = pad.t + (1 - t) * innerH;
          return (
            <g key={t}>
              <line x1={pad.l} x2={w - pad.r} y1={y} y2={y} className="grid" />
              <text x={pad.l - 8} y={y + 3} className="tick left">
                {riders(maxR * t)}
              </text>
              <text x={w - pad.r + 8} y={y + 3} className="tick right">
                {money(maxC * t)}
              </text>
            </g>
          );
        })}
        {yearMarks.map((p) => (
          <text key={p.month.key} x={p.x} y={h - 10} className="tick x">
            FY{String(p.month.fy).slice(2)}
          </text>
        ))}
        {pts.slice(1).map((p, i) => (
          <line
            key={`r-${p.month.key}`}
            x1={pts[i].x}
            y1={pts[i].yR}
            x2={p.x}
            y2={p.yR}
            stroke={horizonColor[p.month.horizon]}
            strokeWidth="2.2"
          />
        ))}
        {pts.slice(1).map((p, i) => (
          <line
            key={`c-${p.month.key}`}
            x1={pts[i].x}
            y1={pts[i].yC}
            x2={p.x}
            y2={p.yC}
            stroke={costStroke}
            strokeWidth="1.6"
            strokeDasharray="4 3"
            opacity="0.9"
          />
        ))}
        {pts.map((p, i) => (
          <rect
            key={`h-${p.month.key}`}
            x={p.x - innerW / rows.length / 2}
            y={pad.t}
            width={innerW / rows.length}
            height={innerH}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
        ))}
        {tip && (
          <>
            <line
              x1={tip.x}
              x2={tip.x}
              y1={pad.t}
              y2={pad.t + innerH}
              stroke="#1c1915"
              strokeDasharray="2 3"
              opacity="0.35"
            />
            <circle cx={tip.x} cy={tip.yR} r="3.5" fill={horizonColor[tip.month.horizon]} />
            <circle cx={tip.x} cy={tip.yC} r="3" fill={costStroke} />
          </>
        )}
      </svg>
      {tip && (
        <div
          className="chart-tooltip"
          style={{
            left: `${(tip.x / w) * 100}%`,
          }}
        >
          <strong>
            {tip.month.label} · FY{String(tip.month.fy).slice(2)}
          </strong>
          <span>{bandLabel(tip.month.horizon)}</span>
          <span>Boardings {riders(tip.riders)}</span>
          <span>Operating {money(tip.cost)}</span>
        </div>
      )}
    </div>
  );
}

export function RidershipPlanner() {
  const [type, setType] = useState<ServiceType | "all">("all");
  const [routeId, setRouteId] = useState("all");
  const [levers, setLevers] = useState<Levers>(defaultLevers);
  const [selectedFys, setSelectedFys] = useState<number[]>([
    ...scenarioFiscalYears,
  ]);

  const typeRoutes = useMemo(() => filterRoutes(type, "all"), [type]);
  const selected = useMemo(() => filterRoutes(type, routeId), [type, routeId]);
  const baseline = useMemo(() => seriesFor(selected, defaultLevers), [selected]);
  const scenario = useMemo(
    () => seriesFor(selected, levers, new Set(selectedFys)),
    [selected, levers, selectedFys],
  );
  const fys = useMemo(() => fyRollup(scenario), [scenario]);
  const baseFys = useMemo(() => fyRollup(baseline), [baseline]);

  const outlook = fys.filter((r) => r.fy >= 2027 && r.fy <= 2031);
  const baseOutlook = baseFys.filter((r) => r.fy >= 2027 && r.fy <= 2031);
  const next12 = scenario.filter((r) => r.month.horizon === "forecast");
  const fiveYearCost = outlook.reduce((a, b) => a + b.cost, 0);
  const fiveYearRiders = outlook.reduce((a, b) => a + b.riders, 0);
  const baseCost = baseOutlook.reduce((a, b) => a + b.cost, 0);

  function setLever(key: keyof Levers, value: number) {
    setLevers((prev) => ({ ...prev, [key]: value }));
  }

  function onType(next: ServiceType | "all") {
    setType(next);
    setRouteId("all");
  }

  function toggleFiscalYear(fy: number) {
    setSelectedFys((current) =>
      current.includes(fy)
        ? current.filter((year) => year !== fy)
        : [...current, fy].sort(),
    );
  }

  return (
    <div className="planner">
      <p className="kicker">Interactive · scaled demo</p>
      <h3>Route scenario workspace</h3>
      <p className="muted">
        Filter by service type or route, then change span, hours, miles,
        population, and jobs. Hover the chart for month and fiscal year. Actuals stop at
        Aug 2026. The next 12 months are a short-term forecast; everything after
        that is a scenario. Fiscal years run October–September. Monthly rollups
        stand in for the production daily XGBoost grain. The planned baseline
        adds service over time; choose which fiscal years receive your scenario
        adjustments.
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

      <div className="controls controls-5">
        {(
          [
            ["span", "Span of service", levers.span],
            ["hours", "Service hours", levers.hours],
            ["miles", "Service miles", levers.miles],
            ["population", "Population", levers.population],
            ["jobs", "Jobs", levers.jobs],
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
      <fieldset className="fy-selector">
        <legend>Apply levers to fiscal years</legend>
        <div className="fy-selector-options">
          {scenarioFiscalYears.map((fy) => (
            <label key={fy}>
              <input
                type="checkbox"
                checked={selectedFys.includes(fy)}
                onChange={() => toggleFiscalYear(fy)}
              />
              FY{String(fy).slice(2)}
            </label>
          ))}
        </div>
        <div className="fy-selector-actions">
          <button
            type="button"
            onClick={() => setSelectedFys([...scenarioFiscalYears])}
          >
            Select all
          </button>
          <button type="button" onClick={() => setSelectedFys([])}>
            Clear years
          </button>
          <button type="button" onClick={() => setLevers(defaultLevers)}>
            Reset knobs to 0%
          </button>
        </div>
      </fieldset>

      <div className="legend">
        <span>
          <i style={{ background: horizonColor.actual }} /> Historical
        </span>
        <span>
          <i style={{ background: horizonColor.forecast }} /> Short-term forecast
        </span>
        <span>
          <i style={{ background: horizonColor.scenario }} /> Scenario
        </span>
        <span>
          <i className="dash" style={{ background: costStroke }} /> Operating $
        </span>
      </div>

      <DualAxisChart rows={scenario} />
      <p className="caption">
        Left axis: boardings. Right axis: estimated operating cost. FY labels
        mark October. {chartMonths[0].label} –{" "}
        {chartMonths[chartMonths.length - 1].label}.
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
            <th>Series</th>
            <th>Boardings</th>
            <th>YoY</th>
            <th>Rev-hours</th>
            <th>Est. operating $</th>
          </tr>
        </thead>
        <tbody>
          {fys.map((row) => (
            <tr key={row.fy} className={row.band === "actual" ? "hist" : undefined}>
              <td>FY{String(row.fy).slice(2)}</td>
              <td>{bandLabel(row.band)}</td>
              <td>{riders(row.riders)}</td>
              <td
                className={
                  row.yoy === null ? undefined : row.yoy >= 0 ? "yoy-pos" : "yoy-neg"
                }
              >
                {yoyLabel(row.yoy)}
              </td>
              <td>{Math.round(row.hours).toLocaleString()}</td>
              <td>{money(row.cost)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  adoptionByRoute,
  dailyLegs,
  demoKpis,
  odFlows,
  transfers,
  zones,
  type TransferType,
} from "@/data/tripPatternsDemo";

const TripMap = dynamic(() => import("@/components/TripMap").then((m) => m.TripMap), {
  ssr: false,
  loading: () => <div className="trip-map trip-map-loading">Loading map…</div>,
});

type Tab = "about" | "od" | "transfers" | "adoption";

const tabs: { id: Tab; label: string }[] = [
  { id: "about", label: "About" },
  { id: "od", label: "7-day origin–destination" },
  { id: "transfers", label: "31-day transfers" },
  { id: "adoption", label: "App adoption" },
];

function fmt(n: number) {
  return n.toLocaleString();
}

function fmtShort(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}

export function TripPatternsDemo() {
  const [tab, setTab] = useState<Tab>("about");
  const [origin, setOrigin] = useState<string | "all">("all");
  const [xferType, setXferType] = useState<TransferType | "all">("all");

  const filteredOd = useMemo(
    () =>
      origin === "all" ? odFlows : odFlows.filter((f) => f.origin === origin),
    [origin],
  );

  const filteredXfer = useMemo(
    () =>
      xferType === "all"
        ? transfers
        : transfers.filter((t) => t.type === xferType),
    [xferType],
  );

  const linkMix = useMemo(() => {
    const busOnDemand = transfers
      .filter((t) => t.type === "Bus to On Demand")
      .reduce((a, b) => a + b.count, 0);
    const onDemandBus = transfers
      .filter((t) => t.type === "On Demand to Bus")
      .reduce((a, b) => a + b.count, 0);
    const total = busOnDemand + onDemandBus || 1;
    return {
      busOnDemandPct: (busOnDemand / total) * 100,
      onDemandBusPct: (onDemandBus / total) * 100,
    };
  }, []);

  const maxDay = Math.max(...dailyLegs.map((d) => Math.max(d.bus, d.walk)));
  const maxAdopt = Math.max(...adoptionByRoute.map((r) => r.appShare));

  return (
    <div className="planner trip-demo">
      <p className="kicker">Interactive · scaled demo</p>
      <h3>Trip patterns workspace</h3>
      <p className="muted">
        A Leaflet stand-in for the ArcGIS Experience dashboard. Four pages
        mirror production: about, 7-day OD flows, 31-day transfer hotspots, and
        app adoption. Zones, volumes, and patterns are synthetic — not the
        live agency layers.
      </p>

      <nav className="trip-tabs" aria-label="Demo pages">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tab === t.id ? "active" : undefined}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "about" && (
        <div className="trip-about">
          <div className="trip-about-copy">
            <h4>Origin–destination &amp; transfer analysis</h4>
            <p>
              Mobile trip-planning app legs land in SQL, get cleaned, then roll
              up to census block-group OD and transfer hotspots. A publisher
              script rebuilds hosted feature layers and pushes them to ArcGIS
              Online on a schedule — planners open an Experience, not a raw
              dump.
            </p>
            <ul className="plain">
              <li>7-day OD: where trips start and end (block-group pairs)</li>
              <li>31-day transfers: route-to-route and bus↔on-demand patterns</li>
              <li>3-day lag so late-arriving files do not redraw the map mid-week</li>
            </ul>
          </div>
          <div className="kpi-row kpi-row-4">
            <div className="kpi">
              <span className="muted">Leg trips (demo 7-day)</span>
              <b>{fmt(demoKpis.legs7d)}</b>
            </div>
            <div className="kpi">
              <span className="muted">App adoption (demo)</span>
              <b>{demoKpis.adoptionPct}%</b>
            </div>
            <div className="kpi">
              <span className="muted">Transfers (demo 31-day)</span>
              <b>{fmt(demoKpis.transfers31d)}</b>
            </div>
            <div className="kpi">
              <span className="muted">Top pattern</span>
              <b style={{ fontSize: 18 }}>{demoKpis.topPattern}</b>
            </div>
          </div>
          <p className="caption">Leg trips by day (synthetic week)</p>
          <div className="legend">
            <span>
              <i style={{ background: "#d4652f" }} /> Bus legs
            </span>
            <span>
              <i style={{ background: "#2f6f62" }} /> Walk legs
            </span>
          </div>
          <div className="bars trip-bars">
            {dailyLegs.map((d) => (
              <div key={d.day} className="trip-bar-col">
                <div className="trip-bar-pair">
                  <div className="trip-bar-stack">
                    <span className="trip-bar-val">{fmtShort(d.bus)}</span>
                    <i
                      className="bus"
                      style={{ height: `${(d.bus / maxDay) * 100}%` }}
                      title={`Bus ${fmt(d.bus)}`}
                    />
                  </div>
                  <div className="trip-bar-stack">
                    <span className="trip-bar-val">{fmtShort(d.walk)}</span>
                    <i
                      className="walk"
                      style={{ height: `${(d.walk / maxDay) * 100}%` }}
                      title={`Walk ${fmt(d.walk)}`}
                    />
                  </div>
                </div>
                <span>{d.day}</span>
              </div>
            ))}
          </div>
          <div className="link-mix">
            <span>
              Bus → On Demand {linkMix.busOnDemandPct.toFixed(0)}%
            </span>
            <span>
              On Demand → Bus {linkMix.onDemandBusPct.toFixed(0)}%
            </span>
          </div>
        </div>
      )}

      {tab === "od" && (
        <div className="trip-panel">
          <div className="filters">
            <label>
              Origin
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              >
                <option value="all">All</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <TripMap mode="od" flows={filteredOd} zones={zones} highlightOrigin={origin} />
          <table className="fy-table">
            <thead>
              <tr>
                <th>Origin</th>
                <th>Destination</th>
                <th>Trips</th>
                <th>Avg min</th>
                <th>Route</th>
              </tr>
            </thead>
            <tbody>
              {[...filteredOd]
                .sort((a, b) => b.trips - a.trips)
                .slice(0, 8)
                .map((f) => {
                  const o = zones.find((z) => z.id === f.origin)?.name ?? f.origin;
                  const d = zones.find((z) => z.id === f.dest)?.name ?? f.dest;
                  return (
                    <tr key={`${f.origin}-${f.dest}-${f.route}`}>
                      <td>{o}</td>
                      <td>{d}</td>
                      <td>{fmt(f.trips)}</td>
                      <td>{f.avgMin}</td>
                      <td>{f.route}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {tab === "transfers" && (
        <div className="trip-panel">
          <div className="filters">
            <label>
              Transfer type
              <select
                value={xferType}
                onChange={(e) =>
                  setXferType(e.target.value as TransferType | "all")
                }
              >
                <option value="all">All types</option>
                <option value="Bus to Bus">Bus to Bus</option>
                <option value="Bus to On Demand">Bus to On Demand</option>
                <option value="On Demand to Bus">On Demand to Bus</option>
              </select>
            </label>
          </div>
          <div className="legend">
            <span>
              <i style={{ background: "#2f6f62" }} /> Bus to Bus
            </span>
            <span>
              <i style={{ background: "#d4652f" }} /> Bus to On Demand
            </span>
            <span>
              <i style={{ background: "#8a4b2a" }} /> On Demand to Bus
            </span>
          </div>
          <TripMap mode="transfers" hotspots={filteredXfer} />
          <table className="fy-table">
            <thead>
              <tr>
                <th>Stop / hub</th>
                <th>Pattern</th>
                <th>Type</th>
                <th>Count</th>
                <th>Avg wait</th>
              </tr>
            </thead>
            <tbody>
              {[...filteredXfer]
                .sort((a, b) => b.count - a.count)
                .map((t) => (
                  <tr key={t.id}>
                    <td>{t.name}</td>
                    <td>{t.pattern}</td>
                    <td>{t.type}</td>
                    <td>{fmt(t.count)}</td>
                    <td>{t.avgWaitMin} min</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "adoption" && (
        <div className="trip-panel">
          <p className="muted">
            Share of boardings that appear in the trip-planning app vs. APC —
            a monthly table in production, shown here as a simple bar chart.
          </p>
          <div className="adopt-list">
            {adoptionByRoute.map((r) => (
              <div key={r.route} className="adopt-row">
                <span>{r.route}</span>
                <div className="adopt-track">
                  <i style={{ width: `${(r.appShare / maxAdopt) * 100}%` }} />
                </div>
                <b>{r.appShare}%</b>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

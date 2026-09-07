"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import {
  formatChanges,
  formatFeedDate,
  shortFeedName,
  type GtfsComparison,
  type GtfsStatus,
} from "@/data/gtfsDifference";

const GtfsDiffMap = dynamic(
  () => import("@/components/GtfsDiffMap").then((m) => m.GtfsDiffMap),
  {
    ssr: false,
    loading: () => <div className="gtfs-map gtfs-map-loading">Loading map…</div>,
  },
);

type Tab = "routes" | "stops" | "service" | "calendar" | "transfers" | "fares";

const tabs: { id: Tab; label: string }[] = [
  { id: "routes", label: "Routes" },
  { id: "stops", label: "Stops" },
  { id: "service", label: "Service" },
  { id: "calendar", label: "Calendar" },
  { id: "transfers", label: "Transfers" },
  { id: "fares", label: "Fares" },
];

const chips: { id: GtfsStatus | "all"; label: string }[] = [
  { id: "all", label: "All diffs" },
  { id: "added", label: "Added" },
  { id: "removed", label: "Removed" },
  { id: "changed", label: "Changed" },
  { id: "moved", label: "Moved" },
];

function matchesStatus(status: string, filter: GtfsStatus | "all") {
  if (filter === "all") return status !== "unchanged";
  if (filter === "changed") return status === "changed" || status === "moved";
  return status === filter;
}

function summarizeLabels(labels: string[]) {
  if (labels.length <= 3) return labels.join(", ");
  return `${labels.slice(0, 3).join(", ")}, and ${labels.length - 3} more`;
}

export function GtfsDifference() {
  const [data, setData] = useState<GtfsComparison | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<GtfsStatus | "all">("all");
  const [routeId, setRouteId] = useState("");
  const [tab, setTab] = useState<Tab>("routes");
  const [showRoutes, setShowRoutes] = useState(true);
  const [showStops, setShowStops] = useState(true);
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/gtfs-difference/comparison.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Could not load comparison (${res.status})`);
        return res.json();
      })
      .then((json: GtfsComparison) => {
        if (!cancelled) setData(json);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleRoutes = useMemo(() => {
    if (!data) return [];
    return data.tables.routes.filter((row) => {
      if (routeId && row.id !== routeId) return false;
      const view = row.map_status || row.status;
      if (routeId && status === "all") return true;
      return matchesStatus(view, status);
    });
  }, [data, routeId, status]);

  const visibleStops = useMemo(() => {
    if (!data) return [];
    return data.tables.stops.filter((row) => {
      if (routeId && !row.routes.includes(routeId)) return false;
      if (routeId && status === "all") return true;
      return matchesStatus(row.status, status);
    });
  }, [data, routeId, status]);

  const visibleService = useMemo(() => {
    if (!data) return [];
    return data.tables.service.filter((row) => {
      if (routeId && row.id !== routeId) return false;
      if (routeId && status === "all") return true;
      return matchesStatus(row.status, status);
    });
  }, [data, routeId, status]);

  if (error) {
    return (
      <div className="gtfs-demo">
        <p className="muted">Could not load the published comparison. {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="gtfs-demo">
        <p className="muted">Loading VIA comparison…</p>
      </div>
    );
  }

  const leftName = shortFeedName(data.left);
  const rightName = shortFeedName(data.right);

  return (
    <div className="gtfs-demo">
      <p className="kicker">Interactive · public GTFS</p>
      <h3>
        {leftName} / {rightName}
      </h3>
      <p className="muted">
        VIA Metropolitan Transit published both feeds. Feed A is dashed; Feed B
        is solid. Click a route on the map or in the list to isolate it. This
        page embeds the comparison snapshot — the local Flask app is what
        writes the Excel and lets you pick any other pair.
      </p>

      <div className="kpi-row kpi-row-4">
        <div className="kpi">
          <b>{data.counts.routes.diffs}</b>
          <span className="muted">route diffs</span>
        </div>
        <div className="kpi">
          <b>{data.counts.stops.diffs}</b>
          <span className="muted">stop diffs</span>
        </div>
        <div className="kpi">
          <b>{data.counts.service.diffs}</b>
          <span className="muted">service diffs</span>
        </div>
        <div className="kpi">
          <b>{data.counts.transfers.diffs}</b>
          <span className="muted">transfer diffs</span>
        </div>
      </div>

      <ul className="gtfs-highlights">
        {data.highlights.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>

      <p className="osm-map-actions">
        <a href="/gtfs-difference/GTFS_diff_May_2026_vs_August_2026.xlsx">
          Download Excel workbook
        </a>
      </p>

      <div className="gtfs-toolbar">
        <div className="gtfs-chips" role="group" aria-label="Status filter">
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              className={status === chip.id ? "active" : undefined}
              onClick={() => setStatus(chip.id)}
            >
              {chip.label}
            </button>
          ))}
        </div>
        <label>
          Route
          <select
            value={routeId}
            onChange={(event) => setRouteId(event.target.value)}
          >
            <option value="">All routes</option>
            {data.tables.routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.short_name} {route.long_name}
              </option>
            ))}
          </select>
        </label>
        <label className="gtfs-check">
          <input
            type="checkbox"
            checked={showRoutes}
            onChange={(event) => setShowRoutes(event.target.checked)}
          />
          Routes
        </label>
        <label className="gtfs-check">
          <input
            type="checkbox"
            checked={showStops}
            onChange={(event) => setShowStops(event.target.checked)}
          />
          Stops
        </label>
        <label className="gtfs-check">
          <input
            type="checkbox"
            checked={showLeft}
            onChange={(event) => setShowLeft(event.target.checked)}
          />
          Feed A
        </label>
        <label className="gtfs-check">
          <input
            type="checkbox"
            checked={showRight}
            onChange={(event) => setShowRight(event.target.checked)}
          />
          Feed B
        </label>
        <button
          type="button"
          className="gtfs-reset"
          onClick={() => {
            setStatus("all");
            setRouteId("");
            setShowRoutes(true);
            setShowStops(true);
            setShowLeft(true);
            setShowRight(true);
          }}
        >
          Reset
        </button>
      </div>

      <p className="caption">
        {data.left.agency} · {formatFeedDate(data.left.start_date)} –{" "}
        {formatFeedDate(data.left.end_date)} vs{" "}
        {formatFeedDate(data.right.start_date)} –{" "}
        {formatFeedDate(data.right.end_date)}
      </p>

      <div className="gtfs-workspace">
        <GtfsDiffMap
          geo={data.geo}
          status={status}
          routeId={routeId}
          showRoutes={showRoutes}
          showStops={showStops}
          showLeft={showLeft}
          showRight={showRight}
          onSelectRoute={(id) => setRouteId((current) => (current === id ? "" : id))}
        />
        <div className="gtfs-route-list" aria-label="Changed routes">
          {visibleRoutes.length === 0 ? (
            <p className="muted">No routes match the current filters.</p>
          ) : (
            visibleRoutes.map((route) => {
              const view = route.map_status || route.status;
              return (
                <button
                  key={route.id}
                  type="button"
                  className={route.id === routeId ? "active" : undefined}
                  onClick={() =>
                    setRouteId((current) => (current === route.id ? "" : route.id))
                  }
                >
                  <span>
                    <strong>{route.short_name}</strong>
                    <span className="muted">{route.long_name}</span>
                  </span>
                  <span className={`gtfs-badge ${view}`}>{view}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
      <p className="muted osm-map-credit">
        Map data © OpenStreetMap contributors. Feed A dashed, Feed B solid.
      </p>

      <nav className="trip-tabs" aria-label="Comparison tables">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            className={tab === item.id ? "active" : undefined}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="gtfs-table-wrap">
        {tab === "routes" && (
          <table className="gtfs-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Route</th>
                <th>Name</th>
                <th>Destinations</th>
                <th>Changes</th>
              </tr>
            </thead>
            <tbody>
              {visibleRoutes.map((route) => (
                <tr
                  key={route.id}
                  className={route.id === routeId ? "active" : undefined}
                >
                  <td>
                    <span className={`gtfs-badge ${route.map_status || route.status}`}>
                      {route.map_status || route.status}
                    </span>
                  </td>
                  <td>{route.id}</td>
                  <td>
                    {route.short_name} {route.long_name}
                  </td>
                  <td>{route.destinations.join(" · ")}</td>
                  <td>{formatChanges(route.changes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "stops" && (
          <table className="gtfs-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Stop</th>
                <th>Name</th>
                <th>Routes</th>
                <th>Moved (m)</th>
              </tr>
            </thead>
            <tbody>
              {visibleStops.map((stop) => (
                <tr key={stop.id}>
                  <td>
                    <span className={`gtfs-badge ${stop.status}`}>{stop.status}</span>
                  </td>
                  <td>{stop.id}</td>
                  <td>{stop.name}</td>
                  <td>{stop.routes.join(", ")}</td>
                  <td>{stop.moved_m ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "service" && (
          <table className="gtfs-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Route</th>
                <th>Trips A→B</th>
                <th>Stops A→B</th>
                <th>Pattern</th>
              </tr>
            </thead>
            <tbody>
              {visibleService.map((row) => (
                <tr key={row.id}>
                  <td>
                    <span className={`gtfs-badge ${row.status}`}>{row.status}</span>
                  </td>
                  <td>
                    {row.short_name} {row.long_name}
                  </td>
                  <td>
                    {row.left_trips} → {row.right_trips}
                  </td>
                  <td>
                    {row.left_stops} → {row.right_stops}
                  </td>
                  <td>
                    {row.shape_changed
                      ? `Alignment ${row.shape_max_m ?? ""} m`
                      : summarizeLabels([
                          ...row.stops_added_labels.map((label) => `+ ${label}`),
                          ...row.stops_removed_labels.map((label) => `− ${label}`),
                        ])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "calendar" && (
          <table className="gtfs-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Type</th>
                <th>Feed A</th>
                <th>Feed B</th>
              </tr>
            </thead>
            <tbody>
              {data.tables.calendar
                .filter((row) => matchesStatus(row.status, status) || status === "all")
                .map((row) => (
                  <tr key={row.type}>
                    <td>
                      <span className={`gtfs-badge ${row.status}`}>{row.status}</span>
                    </td>
                    <td>{row.type}</td>
                    <td>
                      {row.left
                        ? `${row.left.service_id} ${formatFeedDate(row.left.start_date)}–${formatFeedDate(row.left.end_date)}`
                        : ""}
                    </td>
                    <td>
                      {row.right
                        ? `${row.right.service_id} ${formatFeedDate(row.right.start_date)}–${formatFeedDate(row.right.end_date)}`
                        : ""}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {tab === "transfers" && (
          <table className="gtfs-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>From</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              {data.tables.transfers
                .filter((row) => matchesStatus(row.status, status) || status === "all")
                .map((row) => (
                  <tr key={`${row.status}-${row.from_stop_id}-${row.to_stop_id}`}>
                    <td>
                      <span className={`gtfs-badge ${row.status}`}>{row.status}</span>
                    </td>
                    <td>{row.from_stop_id}</td>
                    <td>{row.to_stop_id}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {tab === "fares" && (
          <table className="gtfs-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Fare</th>
                <th>Price</th>
                <th>Routes</th>
              </tr>
            </thead>
            <tbody>
              {data.tables.fares
                .filter((row) => matchesStatus(row.status, status) || status === "all")
                .map((row) => (
                  <tr key={row.fare_id}>
                    <td>
                      <span className={`gtfs-badge ${row.status}`}>{row.status}</span>
                    </td>
                    <td>{row.fare_id}</td>
                    <td>
                      {row.currency} {row.price}
                    </td>
                    <td>{row.routes || "—"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

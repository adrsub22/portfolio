"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { GtfsGeo, GtfsStatus } from "@/data/gtfsDifference";

const COLORS: Record<string, string> = {
  added: "#1b7f4e",
  removed: "#b42318",
  changed: "#b54708",
  moved: "#b54708",
  unchanged: "#7c3aed",
  left: "#1d4ed8",
  right: "#0f766e",
};

type Props = {
  geo: GtfsGeo;
  status: GtfsStatus | "all";
  routeId: string;
  showRoutes: boolean;
  showStops: boolean;
  showLeft: boolean;
  showRight: boolean;
  onSelectRoute: (id: string) => void;
};

function matchesStatus(status: string, filter: GtfsStatus | "all") {
  if (filter === "all") return status !== "unchanged";
  if (filter === "changed") return status === "changed" || status === "moved";
  return status === filter;
}

function matchesFeature(
  props: { id?: string; routes?: string[]; status: string },
  status: GtfsStatus | "all",
  routeId: string,
) {
  if (routeId && props.id !== routeId && !(props.routes || []).includes(routeId)) {
    return false;
  }
  if (routeId && status === "all") return true;
  return matchesStatus(props.status, status);
}

export function GtfsDiffMap({
  geo,
  status,
  routeId,
  showRoutes,
  showStops,
  showLeft,
  showRight,
  onSelectRoute,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const onSelectRef = useRef(onSelectRoute);
  onSelectRef.current = onSelectRoute;

  useEffect(() => {
    if (!ref.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(ref.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView([29.4241, -98.4936], 11);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);

      setTimeout(() => mapRef.current?.invalidateSize(), 50);
    }

    const map = mapRef.current;
    const layer = L.layerGroup().addTo(map);
    const bounds: L.LatLngBounds[] = [];

    if (showRoutes) {
      for (const feature of geo.routes.features) {
        const p = feature.properties;
        if (!matchesFeature(p, status, routeId)) continue;
        if (p.feed === "left" && !showLeft) continue;
        if (p.feed === "right" && !showRight) continue;
        const coords = feature.geometry.coordinates.map(
          ([lng, lat]) => [lat, lng] as L.LatLngTuple,
        );
        if (coords.length < 2) continue;
        const color =
          p.status === "changed"
            ? p.feed === "left"
              ? COLORS.left
              : COLORS.right
            : COLORS[p.status] || COLORS.unchanged;
        const line = L.polyline(coords, {
          color,
          weight: p.status === "unchanged" ? 3 : 4,
          opacity: 0.92,
          dashArray: p.feed === "left" ? "7 6" : undefined,
        })
          .bindPopup(
            `<strong>Route ${p.short_name}</strong><br/>${p.long_name}${
              p.destination ? `<br/>Destination: ${p.destination}` : ""
            }<br/>${p.status} · ${p.feed === "left" ? "Feed A (dashed)" : "Feed B (solid)"}`,
          )
          .on("click", () => onSelectRef.current(p.id));
        line.addTo(layer);
        bounds.push(line.getBounds());
      }
    }

    if (showStops) {
      for (const feature of geo.moves.features) {
        const p = feature.properties;
        if (!matchesFeature(p, status, routeId)) continue;
        const coords = feature.geometry.coordinates.map(
          ([lng, lat]) => [lat, lng] as L.LatLngTuple,
        );
        L.polyline(coords, {
          color: COLORS.moved,
          weight: 2,
          dashArray: "3 4",
        }).addTo(layer);
      }

      for (const feature of geo.stops.features) {
        const p = feature.properties;
        if (!matchesFeature(p, status, routeId)) continue;
        if (p.feed === "left" && !showLeft) continue;
        if (p.feed === "right" && !showRight) continue;
        const [lng, lat] = feature.geometry.coordinates;
        const marker = L.circleMarker([lat, lng], {
          radius: p.status === "unchanged" ? 4 : 5,
          color: "#fff",
          weight: 1,
          fillColor: COLORS[p.status] || COLORS.changed,
          fillOpacity: p.status === "unchanged" ? 0.88 : 0.95,
        }).bindPopup(
          `<strong>${p.name}</strong><br/>${p.id}<br/>${p.status}${
            p.moved_m ? `<br/>Moved ${p.moved_m} m` : ""
          }`,
        );
        marker.addTo(layer);
        bounds.push(L.latLngBounds([marker.getLatLng()]));
      }
    }

    if (bounds.length) {
      const fitted = bounds.reduce((acc, next) => acc.extend(next), bounds[0]);
      if (fitted.isValid()) map.fitBounds(fitted.pad(0.08));
    }

    return () => {
      layer.remove();
    };
  }, [geo, status, routeId, showRoutes, showStops, showLeft, showRight]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={ref} className="gtfs-map" />;
}

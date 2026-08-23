"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { OdFlow, TransferHotspot, Zone } from "@/data/tripPatternsDemo";
import { zoneById } from "@/data/tripPatternsDemo";

type Props =
  | {
      mode: "od";
      flows: OdFlow[];
      zones: Zone[];
      highlightOrigin: string | "all";
    }
  | {
      mode: "transfers";
      hotspots: TransferHotspot[];
    };

export function TripMap(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(ref.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView([29.44, -98.5], 11);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CARTO',
        maxZoom: 18,
      }).addTo(mapRef.current);

      setTimeout(() => mapRef.current?.invalidateSize(), 50);
    }

    const map = mapRef.current;
    const layer = L.layerGroup().addTo(map);

    if (props.mode === "od") {
      const max = Math.max(...props.flows.map((f) => f.trips), 1);
      for (const z of props.zones) {
        L.circleMarker([z.lat, z.lng], {
          radius: 7,
          color: "#2f6f62",
          weight: 2,
          fillColor: "#fffdf8",
          fillOpacity: 1,
        })
          .bindTooltip(z.name)
          .addTo(layer);
      }
      for (const f of props.flows) {
        if (props.highlightOrigin !== "all" && f.origin !== props.highlightOrigin) continue;
        const o = zoneById(f.origin);
        const d = zoneById(f.dest);
        if (!o || !d) continue;
        const weight = 1.5 + (f.trips / max) * 5;
        L.polyline(
          [
            [o.lat, o.lng],
            [d.lat, d.lng],
          ],
          {
            color: "#d4652f",
            weight,
            opacity: 0.75,
          },
        )
          .bindTooltip(
            `${o.name} → ${d.name}<br/>${f.trips.toLocaleString()} trips · ${f.avgMin} min avg · route ${f.route}`,
          )
          .addTo(layer);
      }
    } else {
      const max = Math.max(...props.hotspots.map((h) => h.count), 1);
      for (const h of props.hotspots) {
        const r = 6 + (h.count / max) * 14;
        const color =
          h.type === "Bus to Bus"
            ? "#2f6f62"
            : h.type === "Bus to On Demand"
              ? "#d4652f"
              : "#8a4b2a";
        L.circleMarker([h.lat, h.lng], {
          radius: r,
          color,
          weight: 2,
          fillColor: color,
          fillOpacity: 0.55,
        })
          .bindTooltip(
            `<strong>${h.name}</strong><br/>${h.pattern}<br/>${h.type}<br/>${h.count.toLocaleString()} transfers · ${h.avgWaitMin} min avg wait`,
          )
          .addTo(layer);
      }
    }

    return () => {
      layer.remove();
    };
  }, [props]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={ref} className="trip-map" />;
}

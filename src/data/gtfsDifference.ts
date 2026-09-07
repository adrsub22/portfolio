export type GtfsStatus = "added" | "removed" | "changed" | "moved" | "unchanged";

export type GtfsChange = {
  field: string;
  left: string | number | null;
  right: string | number | null;
};

export type GtfsCounts = {
  added: number;
  removed: number;
  changed: number;
  moved: number;
  unchanged: number;
  total: number;
  diffs: number;
};

export type GtfsFeedMeta = {
  file: string;
  agency: string;
  feed_version: string;
  start_date: string;
  end_date: string;
  publisher: string;
  counts: {
    routes: number;
    stops: number;
    trips: number;
    shapes: number;
  };
};

export type GtfsRouteRow = {
  id: string;
  short_name: string;
  long_name: string;
  status: GtfsStatus;
  map_status: GtfsStatus;
  destinations: string[];
  changes: GtfsChange[];
};

export type GtfsStopRow = {
  id: string;
  name: string;
  status: GtfsStatus;
  moved_m: number | null;
  routes: string[];
  changes: GtfsChange[];
};

export type GtfsServiceRow = {
  id: string;
  short_name: string;
  long_name: string;
  status: GtfsStatus;
  left_trips: number;
  right_trips: number;
  left_weekday: number;
  right_weekday: number;
  left_stops: number;
  right_stops: number;
  stops_added_labels: string[];
  stops_removed_labels: string[];
  shape_changed: boolean;
  shape_max_m: number | null;
  changes: GtfsChange[];
};

export type GtfsCalendarRow = {
  type: string;
  status: GtfsStatus;
  left: { service_id: string; start_date: string; end_date: string } | null;
  right: { service_id: string; start_date: string; end_date: string } | null;
};

export type GtfsTransferRow = {
  from_stop_id: string;
  to_stop_id: string;
  transfer_type: string;
  min_transfer_time: string;
  status: GtfsStatus;
};

export type GtfsFareRow = {
  fare_id: string;
  price: string;
  currency: string;
  routes: string;
  status: GtfsStatus;
};

export type GtfsRouteFeature = {
  type: "Feature";
  properties: {
    kind: "route";
    id: string;
    destination: string;
    short_name: string;
    long_name: string;
    status: GtfsStatus;
    feed: "left" | "right";
  };
  geometry: { type: "LineString"; coordinates: [number, number][] };
};

export type GtfsStopFeature = {
  type: "Feature";
  properties: {
    kind: "stop";
    id: string;
    name: string;
    status: GtfsStatus;
    feed: "left" | "right";
    routes: string[];
    moved_m?: number | null;
  };
  geometry: { type: "Point"; coordinates: [number, number] };
};

export type GtfsMoveFeature = {
  type: "Feature";
  properties: {
    kind: "move";
    id: string;
    name: string;
    status: "moved";
    routes: string[];
  };
  geometry: { type: "LineString"; coordinates: [number, number][] };
};

export type GtfsGeo = {
  routes: { type: "FeatureCollection"; features: GtfsRouteFeature[] };
  stops: { type: "FeatureCollection"; features: GtfsStopFeature[] };
  moves: { type: "FeatureCollection"; features: GtfsMoveFeature[] };
};

export type GtfsComparison = {
  left: GtfsFeedMeta;
  right: GtfsFeedMeta;
  counts: {
    routes: GtfsCounts;
    stops: GtfsCounts;
    service: GtfsCounts;
    calendar: GtfsCounts;
    calendar_dates: GtfsCounts;
    transfers: GtfsCounts;
    fares: GtfsCounts;
  };
  highlights: string[];
  tables: {
    routes: GtfsRouteRow[];
    stops: GtfsStopRow[];
    service: GtfsServiceRow[];
    calendar: GtfsCalendarRow[];
    transfers: GtfsTransferRow[];
    fares: GtfsFareRow[];
  };
  geo: GtfsGeo;
};

export function formatFeedDate(yyyymmdd: string) {
  if (!/^\d{8}$/.test(yyyymmdd)) return yyyymmdd;
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
}

export function shortFeedName(feed: GtfsFeedMeta) {
  const raw = String(feed.feed_version || feed.file || "")
    .replace(/\.zip$/i, "")
    .trim();
  const parts = raw.split("_");
  if (parts.length > 1 && /^\d{8}$/.test(parts[parts.length - 1] ?? "")) {
    return parts.slice(0, -1).join("_");
  }
  return raw || "feed";
}

export function formatChanges(changes: GtfsChange[] | undefined) {
  return (changes || [])
    .map((change) => {
      const left = change.left == null ? "" : String(change.left);
      const right = change.right == null ? "" : String(change.right);
      if (left && right) return `${change.field}: ${left} → ${right}`;
      if (left) return `${change.field}: ${left}`;
      if (right) return `${change.field}: ${right}`;
      return change.field;
    })
    .join("; ");
}

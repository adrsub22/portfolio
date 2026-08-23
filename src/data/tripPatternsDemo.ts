export type Zone = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

/** Synthetic planning zones — not production block groups. */
export const zones: Zone[] = [
  { id: "DT", name: "Downtown Core", lat: 29.424, lng: -98.493 },
  { id: "N", name: "North Corridor", lat: 29.52, lng: -98.5 },
  { id: "E", name: "Eastside", lat: 29.43, lng: -98.4 },
  { id: "W", name: "Westside", lat: 29.43, lng: -98.58 },
  { id: "S", name: "Southside", lat: 29.35, lng: -98.49 },
  { id: "U", name: "University", lat: 29.46, lng: -98.45 },
  { id: "A", name: "Airport", lat: 29.53, lng: -98.47 },
  { id: "M", name: "Medical Center", lat: 29.51, lng: -98.57 },
  { id: "I", name: "Industrial", lat: 29.38, lng: -98.55 },
  { id: "R", name: "River District", lat: 29.41, lng: -98.48 },
  { id: "C", name: "Mall Corridor", lat: 29.55, lng: -98.55 },
  { id: "L", name: "On Demand Hub", lat: 29.44, lng: -98.52 },
];

export type OdFlow = {
  origin: string;
  dest: string;
  trips: number;
  avgMin: number;
  route: string;
};

export const odFlows: OdFlow[] = [
  { origin: "N", dest: "DT", trips: 4200, avgMin: 28, route: "2" },
  { origin: "E", dest: "DT", trips: 3800, avgMin: 24, route: "20" },
  { origin: "W", dest: "DT", trips: 3600, avgMin: 26, route: "21" },
  { origin: "S", dest: "DT", trips: 3100, avgMin: 32, route: "34" },
  { origin: "U", dest: "DT", trips: 2900, avgMin: 18, route: "51" },
  { origin: "M", dest: "DT", trips: 2400, avgMin: 22, route: "501" },
  { origin: "A", dest: "DT", trips: 1800, avgMin: 35, route: "5X" },
  { origin: "C", dest: "M", trips: 1600, avgMin: 20, route: "8" },
  { origin: "DT", dest: "R", trips: 2200, avgMin: 12, route: "600" },
  { origin: "L", dest: "DT", trips: 1500, avgMin: 14, route: "On Demand" },
  { origin: "L", dest: "W", trips: 1200, avgMin: 16, route: "On Demand" },
  { origin: "E", dest: "U", trips: 980, avgMin: 19, route: "10L" },
  { origin: "I", dest: "DT", trips: 870, avgMin: 30, route: "90" },
  { origin: "S", dest: "I", trips: 760, avgMin: 21, route: "530" },
  { origin: "N", dest: "C", trips: 1100, avgMin: 17, route: "200" },
  { origin: "DT", dest: "A", trips: 940, avgMin: 34, route: "5X" },
  { origin: "W", dest: "M", trips: 1300, avgMin: 15, route: "504" },
  { origin: "U", dest: "R", trips: 820, avgMin: 16, route: "67" },
];

export type TransferType = "Bus to Bus" | "Bus to On Demand" | "On Demand to Bus";

export type TransferHotspot = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  fromRoute: string;
  toRoute: string;
  pattern: string;
  type: TransferType;
  count: number;
  avgWaitMin: number;
};

export const transfers: TransferHotspot[] = [
  { id: "t1", name: "Centro Plaza", lat: 29.426, lng: -98.491, fromRoute: "552", toRoute: "502", pattern: "552 to 502", type: "Bus to Bus", count: 1840, avgWaitMin: 8 },
  { id: "t2", name: "Downtown Transit Center", lat: 29.422, lng: -98.495, fromRoute: "2", toRoute: "100", pattern: "2 to 100", type: "Bus to Bus", count: 1620, avgWaitMin: 6 },
  { id: "t3", name: "On Demand Hub West", lat: 29.441, lng: -98.521, fromRoute: "21", toRoute: "On Demand", pattern: "21 to On Demand", type: "Bus to On Demand", count: 1480, avgWaitMin: 5 },
  { id: "t4", name: "Medical Transfer", lat: 29.508, lng: -98.568, fromRoute: "On Demand", toRoute: "501", pattern: "On Demand to 501", type: "On Demand to Bus", count: 1320, avgWaitMin: 7 },
  { id: "t5", name: "University Loop", lat: 29.462, lng: -98.448, fromRoute: "51", toRoute: "10L", pattern: "51 to 10L", type: "Bus to Bus", count: 990, avgWaitMin: 9 },
  { id: "t6", name: "North Park & Ride", lat: 29.518, lng: -98.502, fromRoute: "200", toRoute: "2", pattern: "200 to 2", type: "Bus to Bus", count: 870, avgWaitMin: 4 },
  { id: "t7", name: "East Hub", lat: 29.432, lng: -98.405, fromRoute: "20", toRoute: "On Demand", pattern: "20 to On Demand", type: "Bus to On Demand", count: 810, avgWaitMin: 6 },
  { id: "t8", name: "Southside Center", lat: 29.352, lng: -98.488, fromRoute: "On Demand", toRoute: "34", pattern: "On Demand to 34", type: "On Demand to Bus", count: 740, avgWaitMin: 8 },
  { id: "t9", name: "Airport Connector", lat: 29.528, lng: -98.472, fromRoute: "5X", toRoute: "2", pattern: "5X to 2", type: "Bus to Bus", count: 610, avgWaitMin: 5 },
  { id: "t10", name: "Mall Corridor", lat: 29.548, lng: -98.552, fromRoute: "8", toRoute: "On Demand", pattern: "8 to On Demand", type: "Bus to On Demand", count: 580, avgWaitMin: 7 },
];

export const dailyLegs = [
  { day: "Mon", bus: 42100, walk: 11300 },
  { day: "Tue", bus: 42400, walk: 11200 },
  { day: "Wed", bus: 40600, walk: 10600 },
  { day: "Thu", bus: 41800, walk: 11100 },
  { day: "Fri", bus: 39800, walk: 10500 },
  { day: "Sat", bus: 33200, walk: 10300 },
  { day: "Sun", bus: 29800, walk: 9900 },
];

export const adoptionByRoute = [
  { route: "200 BRT", appShare: 34 },
  { route: "2 Local", appShare: 28 },
  { route: "5X Express", appShare: 41 },
  { route: "51 University", appShare: 37 },
  { route: "On Demand", appShare: 62 },
  { route: "501 Crosstown", appShare: 22 },
  { route: "20 Eastside", appShare: 19 },
  { route: "600 Circulator", appShare: 15 },
];

export function zoneById(id: string) {
  return zones.find((z) => z.id === id);
}

export const demoKpis = {
  legs7d: dailyLegs.reduce((a, b) => a + b.bus + b.walk, 0),
  adoptionPct: 20.5,
  transfers31d: transfers.reduce((a, b) => a + b.count, 0),
  topPattern: "552 to 502",
};

export const serviceTypes = [
  "local",
  "limited",
  "express",
  "brt",
  "light-rail",
] as const;

export type ServiceType = (typeof serviceTypes)[number];

export const serviceTypeLabel: Record<ServiceType, string> = {
  local: "Local",
  limited: "Limited",
  express: "Express",
  brt: "BRT",
  "light-rail": "Light rail",
};

export type DemoRoute = {
  id: string;
  name: string;
  type: ServiceType;
  monthlyHours: number;
  monthlyMiles: number;
  spanHours: number;
  monthlyRiders: number;
  costPerHour: number;
};

/** Synthetic 32-route network. Not the production route list. */
export const routes: DemoRoute[] = [
  { id: "Green", name: "Green Line", type: "light-rail", monthlyHours: 4200, monthlyMiles: 48000, spanHours: 20, monthlyRiders: 410000, costPerHour: 210 },
  { id: "Red", name: "Red Line", type: "light-rail", monthlyHours: 3900, monthlyMiles: 44000, spanHours: 20, monthlyRiders: 365000, costPerHour: 210 },
  { id: "Orange", name: "Orange Line", type: "light-rail", monthlyHours: 2800, monthlyMiles: 31000, spanHours: 19, monthlyRiders: 240000, costPerHour: 210 },
  { id: "Yellow", name: "Yellow Line", type: "light-rail", monthlyHours: 2400, monthlyMiles: 26500, spanHours: 18, monthlyRiders: 190000, costPerHour: 210 },
  { id: "Blue", name: "Blue Line", type: "light-rail", monthlyHours: 2100, monthlyMiles: 23000, spanHours: 18, monthlyRiders: 155000, costPerHour: 210 },
  { id: "200", name: "200 MetroRapid", type: "brt", monthlyHours: 1800, monthlyMiles: 22000, spanHours: 19, monthlyRiders: 145000, costPerHour: 155 },
  { id: "201", name: "201 MetroRapid", type: "brt", monthlyHours: 1650, monthlyMiles: 20000, spanHours: 19, monthlyRiders: 128000, costPerHour: 155 },
  { id: "202", name: "202 MetroRapid", type: "brt", monthlyHours: 1500, monthlyMiles: 18500, spanHours: 18, monthlyRiders: 110000, costPerHour: 155 },
  { id: "5X", name: "5X Airport Express", type: "express", monthlyHours: 620, monthlyMiles: 9800, spanHours: 16, monthlyRiders: 28000, costPerHour: 145 },
  { id: "7X", name: "7X Peak Express", type: "express", monthlyHours: 410, monthlyMiles: 7200, spanHours: 6, monthlyRiders: 16000, costPerHour: 145 },
  { id: "16X", name: "16X Peak Express", type: "express", monthlyHours: 380, monthlyMiles: 6900, spanHours: 6, monthlyRiders: 14500, costPerHour: 145 },
  { id: "48X", name: "48X Commuter Express", type: "express", monthlyHours: 540, monthlyMiles: 8600, spanHours: 14, monthlyRiders: 22000, costPerHour: 145 },
  { id: "92X", name: "92X Peak Express", type: "express", monthlyHours: 360, monthlyMiles: 6400, spanHours: 6, monthlyRiders: 12000, costPerHour: 145 },
  { id: "3L", name: "3 Limited", type: "limited", monthlyHours: 980, monthlyMiles: 12500, spanHours: 17, monthlyRiders: 62000, costPerHour: 140 },
  { id: "10L", name: "10 Limited", type: "limited", monthlyHours: 860, monthlyMiles: 11200, spanHours: 16, monthlyRiders: 51000, costPerHour: 140 },
  { id: "14L", name: "14 Limited", type: "limited", monthlyHours: 790, monthlyMiles: 10100, spanHours: 16, monthlyRiders: 44000, costPerHour: 140 },
  { id: "40L", name: "40 Limited", type: "limited", monthlyHours: 720, monthlyMiles: 9400, spanHours: 15, monthlyRiders: 38000, costPerHour: 140 },
  { id: "2", name: "2 Downtown", type: "local", monthlyHours: 1100, monthlyMiles: 9800, spanHours: 18, monthlyRiders: 72000, costPerHour: 135 },
  { id: "8", name: "8 Crosstown", type: "local", monthlyHours: 1020, monthlyMiles: 10500, spanHours: 18, monthlyRiders: 64000, costPerHour: 135 },
  { id: "20", name: "20 Eastside", type: "local", monthlyHours: 940, monthlyMiles: 10200, spanHours: 17, monthlyRiders: 58000, costPerHour: 135 },
  { id: "21", name: "21 Westside", type: "local", monthlyHours: 900, monthlyMiles: 9900, spanHours: 17, monthlyRiders: 54000, costPerHour: 135 },
  { id: "28", name: "28 North", type: "local", monthlyHours: 860, monthlyMiles: 9600, spanHours: 17, monthlyRiders: 49000, costPerHour: 135 },
  { id: "34", name: "34 South", type: "local", monthlyHours: 820, monthlyMiles: 9200, spanHours: 16, monthlyRiders: 45000, costPerHour: 135 },
  { id: "51", name: "51 University", type: "local", monthlyHours: 780, monthlyMiles: 7800, spanHours: 18, monthlyRiders: 52000, costPerHour: 135 },
  { id: "67", name: "67 Market", type: "local", monthlyHours: 740, monthlyMiles: 8100, spanHours: 16, monthlyRiders: 41000, costPerHour: 135 },
  { id: "90", name: "90 Harbor", type: "local", monthlyHours: 700, monthlyMiles: 8800, spanHours: 16, monthlyRiders: 36000, costPerHour: 135 },
  { id: "501", name: "501 Crosstown", type: "local", monthlyHours: 880, monthlyMiles: 11400, spanHours: 17, monthlyRiders: 47000, costPerHour: 135 },
  { id: "504", name: "504 Crosstown", type: "local", monthlyHours: 840, monthlyMiles: 10800, spanHours: 17, monthlyRiders: 43000, costPerHour: 135 },
  { id: "515", name: "515 Crosstown", type: "local", monthlyHours: 760, monthlyMiles: 10100, spanHours: 16, monthlyRiders: 39000, costPerHour: 135 },
  { id: "530", name: "530 Crosstown", type: "local", monthlyHours: 720, monthlyMiles: 9700, spanHours: 16, monthlyRiders: 35000, costPerHour: 135 },
  { id: "600", name: "600 Circulator", type: "local", monthlyHours: 480, monthlyMiles: 4200, spanHours: 14, monthlyRiders: 22000, costPerHour: 125 },
  { id: "620", name: "620 Circulator", type: "local", monthlyHours: 430, monthlyMiles: 3900, spanHours: 13, monthlyRiders: 18000, costPerHour: 125 },
];

export type Horizon = "actual" | "forecast" | "scenario";

export type MonthPoint = {
  key: string;
  label: string;
  year: number;
  month: number;
  fy: number;
  horizon: Horizon;
};

/** Model “as of” date: actuals through this month. Next 12 months = short-term forecast. */
export const AS_OF = { year: 2026, month: 8 };

export function monthsInRange(
  start: { year: number; month: number },
  end: { year: number; month: number },
): MonthPoint[] {
  const out: MonthPoint[] = [];
  let y = start.year;
  let m = start.month;
  while (y < end.year || (y === end.year && m <= end.month)) {
    const idx = (y - AS_OF.year) * 12 + (m - AS_OF.month);
    let horizon: Horizon = "actual";
    if (idx > 0 && idx <= 12) horizon = "forecast";
    if (idx > 12) horizon = "scenario";
    // Fiscal year starts October 1 and is named by the calendar year it ends in
    // (Oct 2025–Sep 2026 = FY2026).
    const fy = m >= 10 ? y + 1 : y;
    out.push({
      key: `${y}-${String(m).padStart(2, "0")}`,
      label: `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1]} ${y}`,
      year: y,
      month: m,
      fy,
      horizon,
    });
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return out;
}

export const chartMonths = monthsInRange({ year: 2024, month: 1 }, { year: 2031, month: 9 });

export type Levers = {
  span: number;
  hours: number;
  miles: number;
  demo: number;
};

export const defaultLevers: Levers = { span: 0, hours: 0, miles: 0, demo: 0 };

function season(month: number) {
  const dip = month === 12 || month === 1 ? 0.9 : month === 7 || month === 8 ? 0.94 : 1;
  const spring = month === 4 || month === 5 ? 1.04 : 1;
  return dip * spring;
}

function recovery(year: number, month: number) {
  const t = year + (month - 1) / 12;
  if (t < 2024) return 0.88;
  if (t < 2026) return 0.88 + (t - 2024) * 0.05;
  return 1;
}

function hash(id: string) {
  let n = 0;
  for (const c of id) n = (n * 31 + c.charCodeAt(0)) % 997;
  return n / 997;
}

export function filterRoutes(type: ServiceType | "all", routeId: string) {
  return routes.filter((r) => {
    if (type !== "all" && r.type !== type) return false;
    if (routeId !== "all" && r.id !== routeId) return false;
    return true;
  });
}

export function seriesFor(
  selected: DemoRoute[],
  levers: Levers,
): { month: MonthPoint; riders: number; hours: number; cost: number }[] {
    const hoursFactor = 1 + levers.hours / 100 + 0.25 * (levers.span / 100);
    const ridershipLift =
    1 +
    0.55 * (levers.hours / 100) +
    0.12 * (levers.miles / 100) +
    0.18 * (levers.span / 100) +
    0.22 * (levers.demo / 100);

  return chartMonths.map((month) => {
    let riders = 0;
    let hours = 0;
    let cost = 0;
    const future = month.horizon !== "actual";
    for (const r of selected) {
      const jitter = 0.96 + hash(r.id + month.key) * 0.08;
      const base =
        r.monthlyRiders * season(month.month) * recovery(month.year, month.month) * jitter;
      const h = r.monthlyHours * (future ? hoursFactor : 1);
      riders += base * (future ? ridershipLift : 1);
      hours += h;
      cost += h * r.costPerHour;
    }
    return { month, riders, hours, cost };
  });
}

export function fiscalTotals(
  rows: { month: MonthPoint; riders: number; hours: number; cost: number }[],
) {
  const fys = [2027, 2028, 2029, 2030, 2031];
  return fys.map((fy) => {
    const slice = rows.filter((r) => r.month.fy === fy);
    return {
      fy,
      riders: slice.reduce((a, b) => a + b.riders, 0),
      hours: slice.reduce((a, b) => a + b.hours, 0),
      cost: slice.reduce((a, b) => a + b.cost, 0),
    };
  });
}

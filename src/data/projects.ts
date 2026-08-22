export type CodeSample = {
  language: "SQL" | "Python";
  caption: string;
  code: string;
};

export type Project = {
  slug: string;
  title: string;
  year: string;
  status: "live" | "draft";
  tags: string[];
  oneLiner: string;
  summary: {
    problem: string;
    who: string;
    solution: string;
    outcome: string;
    narrative: string;
  };
  problem?: {
    background: string;
    challenges: string[];
    stakeholders: string[];
    successCriteria: string[];
  };
  architecture?: {
    steps: string[];
    sources: string[];
    stack: string[];
    decisions: { q: string; a: string }[];
  };
  modeling?: {
    facts: string[];
    dimensions: string[];
    metrics: { name: string; definition: string }[];
    governance: string[];
    takeaways?: { title: string; body: string }[];
  };
  pipeline?: {
    ingestion: string[];
    transformations: string[];
    automation: string[];
    samples: CodeSample[];
  };
  analytics?: {
    deliverables: string[];
    notes?: string;
  };
  results?: {
    operational: string[];
    adoption: string[];
    lessons: string[];
  };
  interactive?: "ridership-scenario";
};

export const projects: Project[] = [
  {
    slug: "transit-ridership-forecast",
    title: "Transit ridership forecasting",
    year: "2026",
    status: "live",
    tags: ["forecasting", "XGBoost", "GTFS", "scenario planning"],
    oneLiner:
      "An XGBoost ridership forecast, written back to the database and published in Power BI, so planning, scheduling, budget, and executives can price five fiscal years of planned service.",
    summary: {
      problem:
        "Farebox history and APC counts lived in different systems; nobody could change a route’s service plan and see demand and operating cost in the same report.",
      who: "Service planning, scheduling, budget, and the executive team.",
      solution:
        "Python loads into SQL, a unified ridership table, XGBoost forecast functions, then forecast rows written back to the database and a Power BI report on that store.",
      outcome:
        "Those groups could plan to potential demand and calculate the projected dollar amount of running the planned network five fiscal years out.",
      narrative:
        "A metropolitan transit agency needed one trusted view of how service choices would land on ridership and operating dollars. Python extracts pull APC ridership from FY2018 to present and historical farebox ridership from 2014 through pre-FY2018 into the database. SQL cleans each stream, then merges them into a unified ridership table — with a small retroactive uplift on the farebox years so they sit on an APC-comparable basis (counters pick up trips farebox missed). Historical and future GTFS supply the service that produced actuals and the service that is planned. XGBoost runs at a daily grain; outputs load back to the same database; Power BI is what planners, schedulers, budget, and executives actually open. This page is a scaled monthly demo: 32 routes, filters, and levers — not a copy of the production network. The agency name is withheld.",
    },
    problem: {
      background:
        "The agency had farebox ridership back to 2014 and APC counts from FY2018 forward. Those series did not share a table, a grain, or a definition of a boarding. Planning still answered “what if we change span or hours on this route?” with a custom pull. Budget and executives needed a dollar figure for running the planned network, not only a boarding chart. Fiscal years run October 1–September 30.",
      challenges: [
        "Farebox (2014–pre-FY2018) and APC (FY2018–present) on different instruments",
        "APC under-counts vs. a farebox series that needed an APC-comparable adjustment",
        "Service supply and ridership on different calendars",
        "Short-term momentum vs. long-range scenarios that cannot share the same features",
        "Stakeholders who needed cost and a live report, not a notebook",
      ],
      stakeholders: [
        "Service planning",
        "Scheduling",
        "Budget",
        "Executive team",
      ],
      successCriteria: [
        "One unified ridership table that planning and budget could both quote",
        "Forecast written back to the database and consumed in Power BI",
        "Levers for span, hours, miles, population, and jobs",
        "A five-year operating-cost view of the planned service (Oct–Sep fiscal years)",
      ],
    },
    architecture: {
      steps: [
        "Python extract: APC FY2018–present",
        "Python extract: farebox 2014–pre-FY2018",
        "SQL clean tables",
        "SQL merge → unified ridership",
        "GTFS features + XGBoost",
        "Load forecast to database → Power BI",
      ],
      sources: [
        "APC ridership, FY2018 to present (Python extract → database)",
        "Historical farebox ridership, 2014 through pre-FY2018 (Python extract → database)",
        "Historical GTFS (baseline service)",
        "Future / planned GTFS (predicted service)",
        "Route category and calendar exceptions",
        "Demographic layers, gas prices, headway, and two-year OD patterns (tested)",
      ],
      stack: ["Python", "SQL Server", "GTFS", "XGBoost", "Power BI", "Next.js demo"],
      decisions: [
        {
          q: "Why this architecture?",
          a: "Extracts land in SQL so cleaning and the farebox-to-APC merge are governed in the warehouse. XGBoost is a pair of Python functions on that gold table. The last mile is writing predictions back and pointing Power BI at the same database.",
        },
        {
          q: "Why two forecast modes?",
          a: "The next twelve months can lean on recent ridership. Years beyond that have to be driven by service (and explicit scenario assumptions), because lags cannot be known that far out and new or consolidated routes have no history.",
        },
        {
          q: "What did we test and leave out?",
          a: "Gas prices, headway as a factor distinct from service hours, and origin–destination patterns from the prior two years were all tested against historical records. None cleared the bar for a stable, significant lift once service supply was in the model, so they stay in the diagnostics — not in the production feature set.",
        },
      ],
    },
    modeling: {
      facts: ["Fact_Ridership_Daily (production)", "Fact_Ridership_Monthly (this demo)"],
      dimensions: ["Date", "Route", "Service type", "Horizon (actual / forecast / scenario)"],
      metrics: [
        { name: "Ridership", definition: "Unified boardings: APC from FY2018; farebox 2014–pre-FY2018 with a small APC-comparable uplift." },
        { name: "Revenue hours / miles", definition: "GTFS-derived service supply for the route-day (rolled to month here)." },
        { name: "Span of service", definition: "Hours from first to last trip — a scheduling lever, not the same as revenue hours." },
        { name: "Operating $", definition: "Revenue hours × a fully allocated hourly cost, so budget can price the plan." },
      ],
      governance: [
        "Bronze extracts (APC and farebox) stay raw; SQL clean tables are the only inputs to the merge",
        "Unified series applies a small retroactive % to farebox years so they approximate trips APC would have counted",
        "Horizon labels: actual, short-term forecast (one year from model run), scenario thereafter",
        "Fiscal year starts October 1; this site uses 32 named routes and monthly totals — not the production list or daily grain",
      ],
      takeaways: [
        {
          title: "Near-term is momentum",
          body: "For the rolling year, XGBoost leaned on last week and the last 28 days of ridership. That is why the next 12 months are labeled a forecast: the best predictor of Tuesday is last Tuesday, given the route still runs.",
        },
        {
          title: "Long-range is service",
          body: "Lags cannot be known five years out, and new or consolidated routes have no history. The structural model therefore used span, revenue hours, trip count, and miles — the same levers planners actually change in GTFS.",
        },
        {
          title: "What it was not saying",
          body: "Gas prices, headway as a separate knob from hours, and two-year OD patterns were tested and did not add a stable, significant signal. They are in the diagnostics so an analyst can see they were tried, not ignored.",
        },
        {
          title: "How we scored it",
          body: "Target was log1p(boardings) so small routes were not drowned by rail. Validation was expanding-window time-series CV (train on the past, test the next slice) — not a random shuffle, which would leak the future.",
        },
      ],
    },
    pipeline: {
      ingestion: [
        "Python: APC ridership FY2018 to present → database",
        "Python: historical farebox ridership 2014 through pre-FY2018 → database",
        "GTFS zip feeds mapped across signups (historical and future)",
      ],
      transformations: [
        "SQL: clean APC and farebox into consistent route-day tables",
        "SQL: merge into a unified ridership report; farebox years receive a small % uplift for APC under-count",
        "Python: assemble GTFS service features and run XGBoost forecast functions",
        "Python: load forecast output back to the database",
      ],
      automation: [
        "Repeatable extract → SQL clean/merge → train/forecast → write-back",
        "Power BI connected to the forecast tables (not to a local workbook)",
        "Horizon and provenance columns so the report can split forecast from scenario",
      ],
      samples: [
        {
          language: "Python",
          caption: "Extract APC and farebox, then write the forecast back",
          code: `load_sql("bronze.apc_ridership", extract_apc(fy_from=2018))
load_sql("bronze.farebox_ridership", extract_farebox(year_from=2014, before_fy=2018))
forecast = run_xgboost_forecast(gold_ridership)
load_sql("gold.ridership_forecast", forecast)`,
        },
        {
          language: "SQL",
          caption: "Clean, merge, and APC-align farebox years",
          code: `insert into gold.ridership_unified
select route_id, service_date, boardings
from silver.apc_clean
union all
select route_id, service_date,
       boardings * (1 + @apc_undercount_pct)
from silver.farebox_clean;`,
        },
        {
          language: "Python",
          caption: "Two XGBoost fits: lag-rich forecast vs structural scenario",
          code: `y = np.log1p(df["boardings"])
lag_model.fit(X[lags + service], y)      # next 12 months
struct_model.fit(X[service], y)          # FY+2 and beyond
# route-day prediction; Power BI rolls to month / FY`,
        },
        {
          language: "Python",
          caption: "What the structural model actually used",
          code: `service = ["span_hours", "revenue_hours", "trip_count", "revenue_miles"]
# tested, not shipped: gas_price, headway_peak, od_share_2yr
pred = np.expm1(struct_model.predict(future[service]))`,
        },
      ],
    },
    analytics: {
      deliverables: [
        "Power BI report on the database — planners, schedulers, budget, executives",
        "Route-level forecast with type filters (local, limited, express, BRT, light rail)",
        "Levers for span, service hours, service miles, population, and jobs",
        "Five-year operating-cost table for the planned network (FY Oct–Sep)",
      ],
      notes:
        "Production is daily XGBoost; this graph is a monthly rollup on a 32-route synthetic network. Near-term (12 months) is a forecast. Beyond that is a scenario. We tested gas prices, headway as a distinct factor, and two-year OD patterns; they were not statistically significant on historical records, so they are documented, not shipped. Population and jobs sliders here are scenario factors — stop-area demographics were a weak driver compared with service supply.",
    },
    results: {
      operational: [
        "Planning could test demand against a proposed GTFS, not a one-off spreadsheet",
        "Scheduling could see span and hours as first-class inputs",
        "Budget could translate the same plan into a five-year operating-dollar figure",
        "Executives opened the same Power BI model, not a side deck of numbers",
      ],
      adoption: [
        "Service planning",
        "Scheduling",
        "Budget",
        "Executive team",
      ],
      lessons: [
        "Write the forecast back to the database; the report is only as trusted as that table.",
        "Call the first year a forecast and the rest a scenario — mixing those words burns trust.",
        "Tested-and-rejected features (gas, standalone headway, recent OD) belong in the write-up so leadership knows they were not ignored.",
      ],
    },
    interactive: "ridership-scenario",
  },
  {
    slug: "executive-kpi-lakehouse",
    title: "Executive KPI lakehouse",
    year: "2025",
    status: "draft",
    tags: ["lakehouse", "Power BI", "governance"],
    oneLiner:
      "A bronze–silver–gold path from operational systems to a semantic model leadership can quote.",
    summary: {
      problem: "Leadership lacked a trusted view of performance across multiple systems.",
      who: "Executive leadership, planning, operations.",
      solution: "Governed KPI datasets and Power BI dashboards on a medallion lakehouse.",
      outcome: "One official scorecard used in planning and executive decision-making.",
      narrative:
        "Placeholder write-up. This card is here so the project grid already shows how thinner case studies will sit beside fuller ones.",
    },
  },
  {
    slug: "gis-service-equity",
    title: "Service equity atlas",
    year: "2025",
    status: "draft",
    tags: ["GIS", "equity", "ArcGIS"],
    oneLiner: "Map coverage, wait time, and demand against community characteristics.",
    summary: {
      problem: "Coverage debates were anecdotal.",
      who: "Planning and public-facing teams.",
      solution: "A GIS layer stack joined to operational KPIs.",
      outcome: "Shared maps for board and community conversations.",
      narrative: "Placeholder. Spatial deliverables will live in Analytics & Deliverables once assets are ready.",
    },
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

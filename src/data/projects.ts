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
  interactive?: "ridership-scenario" | "trip-patterns";
};

export const projects: Project[] = [
  {
    slug: "transit-ridership-forecast",
    title: "Machine Learning Ridership Forecast",
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
    slug: "transit-app-trip-patterns",
    title: "Transit App Trip Patterns",
    year: "2025",
    status: "live",
    tags: ["ArcGIS", "OD analysis", "transfers", "automation"],
    oneLiner:
      "A scheduled Python-to-SQL-to-ArcGIS Online pipeline that turns massive mobile trip legs into 7-day OD and 31-day transfer layers planners can open in a web experience.",
    summary: {
      problem:
        "Trip-planning app data arrived as a huge raw feed; planners could not see where riders started, ended, or transferred without drowning in point noise.",
      who: "Service planning and operations.",
      solution:
        "Python loads into SQL, cleans and isolates bad legs, joins census block groups, aggregates to 7- and 31-day rollups, then an ArcGIS Pro publisher rebuilds hosted layers and overwrites ArcGIS Online on a Windows Task Scheduler job.",
      outcome:
        "Planners and operations could see origin–destination and transfer patterns across the network in an Experience Builder dashboard — without a dedicated enterprise GIS server.",
      narrative:
        "A metropolitan transit agency needed rider movement intelligence from a mobile trip-planning app: each record is a leg (origin, destination, route, mode, timestamps). The volume ruled out mapping every raw point in a public dashboard. I built the path from extract to Experience: load into SQL Server, clean and separate bad data, attach census block-group geography and demographics, aggregate to rolling 7-day OD flows and 31-day transfer hotspots (with a short data lag), then automate ArcGIS layer builds and portal overwrite so nobody re-publishes by hand. The portfolio demo below is a Leaflet stand-in with the same four pages — about, OD, transfers, adoption — on synthetic zones. Agency name withheld.",
    },
    problem: {
      background:
        "The trip-planning app produced trip-level legs at a scale that could not sit raw in a hosted feature layer for non-enterprise users. Planning still asked “where do riders go, and where do they transfer?” with one-off pulls. Census geography and demographic context lived in separate workflows.",
      challenges: [
        "Getting a massive raw extract into the reporting database reliably",
        "Cleaning duplicates, incomplete trips, and unrealistic legs",
        "Collapsing false same-route “transfers” and applying a 3-day lag",
        "Prepping block-group OD and transfer aggregates that a browser map could draw",
        "Publishing without a dedicated ArcGIS Enterprise GIS server",
        "Automating refresh so layers did not go stale between analyst runs",
      ],
      stakeholders: ["Service planning", "Operations"],
      successCriteria: [
        "7-day OD and 31-day transfer products that refresh on a schedule",
        "Hosted AGOL layers overwritten safely (refuse empty overwrites)",
        "An Experience dashboard planners can open without GIS desktop",
        "Clear filters for transfer types (bus↔bus, bus↔on-demand)",
      ],
    },
    architecture: {
      steps: [
        "Python extract → SQL Server",
        "Clean / isolate bad legs",
        "Census block groups + demographics",
        "7-day OD + 31-day transfer rollups",
        "ArcGISPro.py → FGDB → AGOL overwrite",
        "Experience Builder dashboard",
      ],
      sources: [
        "Mobile trip-planning app leg extracts",
        "SQL Server reporting database",
        "Census block-group boundaries (and vintage crosswalks)",
        "Jobs / population layers for context",
        "APC monthly route ridership (adoption share table)",
      ],
      stack: [
        "Python",
        "SQL Server",
        "pandas / pyodbc",
        "ArcPy (ArcGIS Pro)",
        "ArcGIS Online",
        "Experience Builder",
        "Windows Task Scheduler",
        "Leaflet demo (this site)",
      ],
      decisions: [
        {
          q: "Why aggregate to 7 and 31 days?",
          a: "Full raw geometry was too large for hosted layers without enterprise GIS. Rolling windows keep the map readable and the overwrite job predictable.",
        },
        {
          q: "Why publish from ArcGIS Pro instead of editing AGOL row-by-row?",
          a: "Feature-service overwrite from a built FGDB is faster and safer at this volume than thousands of REST edits. The publisher refuses empty overwrites so a bad run cannot wipe the portal.",
        },
        {
          q: "Why Task Scheduler?",
          a: "The same machine that runs ArcGIS Pro can rebuild and push layers overnight. Planners always open yesterday’s window, not last month’s one-off publish.",
        },
      ],
    },
    modeling: {
      facts: [
        "Fact_Leg_Trips (cleaned)",
        "Fact_OD_BG_Daily (7-day window)",
        "Fact_Transfer_Hotspots (31-day window)",
      ],
      dimensions: [
        "Trip date",
        "Origin / destination block group",
        "Route / transfer pattern",
        "Transfer type (bus–bus, bus–on-demand, on-demand–bus)",
      ],
      metrics: [
        {
          name: "OD trip volume",
          definition: "Count of cleaned legs between origin and destination block groups in the rolling 7-day window.",
        },
        {
          name: "Transfer count",
          definition: "Journeys sharing a transfer stop and route pattern in the rolling 31-day window.",
        },
        {
          name: "Wait / travel time",
          definition: "Average gap (wait) and in-vehicle time/distance along transfer chains.",
        },
        {
          name: "App adoption share",
          definition: "Transit-app boardings as a share of APC monthly route ridership.",
        },
      ],
      governance: [
        "Deduplicate inserts; filter incomplete and unrealistic legs",
        "Collapse false same-route transfers under a short gap threshold",
        "3-day portal lag so late files do not redraw mid-window",
        "Refuse AGOL overwrite when the local feature class has zero rows",
        "This site uses synthetic zones — not production block groups or live counts",
      ],
      takeaways: [
        {
          title: "Aggregation is the product",
          body: "The insight was never “draw every leg.” It was OD pairs and transfer hotspots at a grain a browser map and a planner can use.",
        },
        {
          title: "Clean before you map",
          body: "Duplicates, broken timestamps, and fake same-route transfers will invent corridors that do not exist. QA is spatial accuracy.",
        },
        {
          title: "Publish is part of the pipeline",
          body: "If the last step is a person clicking Share in Pro, the dashboard goes stale. Task Scheduler + overwrite made the Experience a living system.",
        },
      ],
    },
    pipeline: {
      ingestion: [
        "Python extract of trip-planning app legs into SQL Server",
        "Incremental / rolling windows with overlap days to catch late arrivals",
        "Census block-group boundaries and demographic joins",
      ],
      transformations: [
        "Clean and isolate bad data; standardize route and stop fields",
        "Build origin–destination pairs at block-group level (7-day)",
        "Build transfer chains and hotspot points (31-day)",
        "Materialize ArcGIS-ready tables for flows, transfers, walk egress",
      ],
      automation: [
        "Windows Task Scheduler runs the job on a fixed cadence",
        "ArcGISPro.py builds FGDB feature classes and overwrites AGOL hosted layers",
        "Experience Builder reads the hosted services (no manual layer rebuild)",
      ],
      samples: [
        {
          language: "Python",
          caption: "Load legs, then refuse an empty portal overwrite",
          code: `legs = read_sql("dbo.TransitApp_Leg_Trips", window)
od = aggregate_od(legs, days=7, lag_days=3)
transfers = aggregate_transfers(legs, days=31, lag_days=3)
if count_rows(od_fc) == 0:
    raise RuntimeError("Refuse AGOL overwrite: empty OD layer")
overwrite_agol(od_fc, "TransitApp7Day")`,
        },
        {
          language: "SQL",
          caption: "Window extract for dashboard-grade aggregates",
          code: `select trip_date, origin_bg, dest_bg, route_no,
       count(*) as trips,
       avg(travel_min) as avg_min
from transitapp.LegTrips_Clean
where trip_date >= dateadd(day, -10, cast(getdate() as date))
group by trip_date, origin_bg, dest_bg, route_no;`,
        },
      ],
    },
    analytics: {
      deliverables: [
        "ArcGIS Experience: About, 7-day OD, 31-day transfers, adoption",
        "Hosted OD line / polygon layers and transfer hotspot points",
        "Monthly route app-share table vs APC",
        "Leaflet demo below (synthetic network, same page structure)",
      ],
      notes:
        "Production is ArcGIS Online + Experience Builder. This page cannot host the live org layers, so the interactive below uses Leaflet, twelve synthetic zones, and scaled counts. Filters mimic the Experience: origin zone on OD, transfer type on transfers.",
    },
    results: {
      operational: [
        "Planners could see where riders were going to and from within the network",
        "Operations could spot transfer hubs and bus↔on-demand handoffs",
        "No dedicated enterprise GIS server required for the end-user experience",
      ],
      adoption: ["Service planning", "Operations"],
      lessons: [
        "Raw trip firehoses do not belong in a dashboard — rollups do.",
        "Automated publish (and empty-overwrite guards) matter as much as the SQL.",
        "A short data lag buys trust: better a stable window than a twitchy map.",
      ],
    },
    interactive: "trip-patterns",
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

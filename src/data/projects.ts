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
    visual?: { src: string; alt: string; caption: string };
  };
  modeling?: {
    facts: string[];
    dimensions: string[];
    metrics: { name: string; definition: string }[];
    governance: string[];
    takeawaysHeading?: string;
    takeawaysIntro?: string;
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
  repoUrl?: string;
  disclaimer?: string;
  interactive?: "ridership-scenario" | "trip-patterns" | "ecommerce-analytics";
};

export const projects: Project[] = [
  {
    slug: "ecommerce-analytics-engineering",
    title: "E-Commerce Analytics Engineering",
    year: "2026",
    status: "live",
    tags: [
      "Python",
      "PostgreSQL",
      "dbt",
      "Dimensional Modeling",
      "Data Quality",
    ],
    oneLiner:
      "Built and validated a PostgreSQL analytical warehouse for a simulated e-commerce business, then modernized the transformation layer with dbt while preserving exact business logic and outputs.",
    repoUrl:
      "https://github.com/adrsub22/e-commerce-analytics-engineering",
    disclaimer:
      "This case study uses a deterministic synthetic dataset for a simulated e-commerce business. Findings demonstrate analytics-engineering methodology; they are not real-market behavior.",
    summary: {
      problem:
        "A simulated retailer needed a governed warehouse for sales, customer, product, retention, promotion, and fulfillment analysis — then a way to introduce dbt without drifting validated metrics or keys.",
      who: "A simulated merchandising, finance, and customer-analytics audience, plus technical reviewers of the migration.",
      solution:
        "Python generated and loaded 13 PostgreSQL source tables; SQL built a validated control warehouse; dbt reproduced staging, dimensions, facts, intermediates, and marts beside that control until outputs matched exactly.",
      outcome:
        "37 dbt models, 215 dbt tests, 167 pytest tests, and 375 PostgreSQL quality checks passed, with zero control-versus-dbt differences across dimensions, facts, and marts.",
      narrative:
        "A simulated e-commerce business needed a trusted analytical foundation, not another dashboard on raw transactions. Orders, items, shipments, returns, and reviews sit at different grains and observation windows, so naive joins can multiply revenue and immature return windows can understate risk. I first built a tested PostgreSQL warehouse with conformed dimensions, foundational facts, and governed marts. I then modernized the transformation layer with dbt — sources, thin staging, reusable intermediates, tests, and generated lineage — while keeping the original warehouse as a control. The candidate was accepted only after exact side-by-side reconciliation. The dataset is deterministic and synthetic; this is a portfolio demonstration of analytics-engineering and migration discipline.",
    },
    problem: {
      background:
        "Raw transactional tables were not enough for reliable commercial, customer, product, promotion, fulfillment, and retention analysis. The first implementation solved that with PostgreSQL, SQL, and Python orchestration. The next problem was introducing dbt without changing validated metric definitions, surrogate keys, maturity rules, or analytical outputs.",
      challenges: [
        "Orders, items, payments, shipments, returns, and reviews have different grains and cannot be joined naively",
        "Percentages stored at one grain misstate results if they are averaged instead of recomputed from additive components",
        "Recent purchases have incomplete return opportunity; immature rates must stay null rather than look like zero risk",
        "Surrogate keys and Type 1 dimension behavior had to survive a transformation-layer rewrite",
        "dbt had to match the validated control exactly rather than replace it on trust",
      ],
      stakeholders: [
        "Simulated merchandising and finance users of sales, margin, and product marts",
        "Simulated customer-analytics users of RFM, cohort, and repeat-purchase views",
        "Analytics engineering reviewers of tests, lineage, and migration parity",
      ],
      successCriteria: [
        "Governed marts for daily sales, product, customer, promotion, fulfillment, RFM, and cohorts",
        "Exact control-versus-dbt parity for dimensions, facts, and marts",
        "Passing dbt, pytest, and PostgreSQL data-quality suites on deterministic rebuilds",
        "Clear synthetic-data disclosure and no causal promotion or churn claims",
      ],
    },
    architecture: {
      steps: [
        "Python synthetic generation",
        "PostgreSQL core (13 tables)",
        "dbt staging",
        "Conformed dimensions",
        "Facts + intermediates",
        "Governed marts",
        "Tests, docs, analysis",
      ],
      sources: [
        "Deterministic Python generation into 13 PostgreSQL core tables (customers, products, orders, items, payments, shipments, returns, reviews, and reference data)",
        "Original analytics schema retained as the validated SQL/Python control",
        "dbt sources declared against core; candidate objects built in analytics_dbt schemas",
      ],
      stack: ["Python", "PostgreSQL", "SQL", "dbt", "Jupyter", "Git"],
      visual: {
        src: "/ecommerce-analytics/architecture_flow.svg",
        alt: "Flow from deterministic Python generation through PostgreSQL core, dbt staging, dimensions, facts, governed marts, and validation, with the original analytics schema retained as a side-by-side control.",
        caption:
          "The original warehouse stays beside the dbt DAG as a reconciliation control. No production cutover is claimed.",
      },
      decisions: [
        {
          q: "Why keep the original warehouse?",
          a: "The SQL/Python analytics schema was already validated. dbt was accepted only after exact bidirectional row, key, type, and value parity — not after a leap-of-faith cutover.",
        },
        {
          q: "Why thin staging?",
          a: "Staging views align names and types to the 13 sources. Business grain, surrogate keys, and metric contracts live downstream so lineage stays explicit.",
        },
        {
          q: "Why marts instead of a dashboard-first design?",
          a: "Daily sales, customer RFM, cohorts, product months, promotion, and fulfillment needed reusable, tested definitions before any presentation layer. Power BI was not a completed core phase.",
        },
      ],
    },
    modeling: {
      facts: [
        "fact_order",
        "fact_order_item",
        "fact_payment",
        "fact_shipment",
        "fact_return",
        "fact_review",
      ],
      dimensions: [
        "dim_date",
        "dim_customer",
        "dim_product",
        "dim_promotion",
        "dim_geography",
      ],
      metrics: [
        {
          name: "Net merchandise sales",
          definition:
            "Item net sales after discounts and before returns, tax, and shipping. Checkout totals, payments, and refunds are related but not interchangeable.",
        },
        {
          name: "Gross margin",
          definition:
            "Gross profit divided by net merchandise sales, recomputed from additive components rather than averaged from stored percentages.",
        },
        {
          name: "Mature unit return rate",
          definition:
            "Completed returned units over purchased units only after a full 45-day observation window; immature cohorts stay null, not zero.",
        },
        {
          name: "RFM segment",
          definition:
            "Descriptive recency, frequency, and monetary labels as of a configured snapshot date. Not CLV and not a churn model.",
        },
      ],
      governance: [
        "Successful activity means Completed plus Refunded orders",
        "Configured as-of date 2026-07-31; models do not use the system clock",
        "Promotion comparisons are observational, not lift or ROI",
        "Zero-purchase customers remain in customer and RFM marts as No Purchase",
        "The dataset is deterministic synthetic data at starter scale (5,000 customers, 1,000 products)",
      ],
      takeawaysHeading: "Technical highlights",
      takeawaysIntro:
        "A few modeling rules that kept the dbt migration honest against the original warehouse.",
      takeaways: [
        {
          title: "Governed metric definitions",
          body: "Weighted rates are recomputed from additive components so a monthly margin is not an average of daily percentages.",
        },
        {
          title: "Return maturity",
          body: "Product return cohorts need a complete 45-day window. Incomplete windows stay null so recent volume cannot masquerade as low risk.",
        },
        {
          title: "Stable surrogate keys",
          body: "The dbt migration preserved identity-backed key mappings and Type 1 behavior instead of reallocating keys on rebuild.",
        },
        {
          title: "Side-by-side migration",
          body: "The original warehouse remained the control while dbt was developed, tested, and reconciled to exact parity.",
        },
      ],
    },
    pipeline: {
      ingestion: [
        "Deterministic Python generation and load of 13 core PostgreSQL tables",
        "Fixed seed, source window, and as-of date so rebuilds are repeatable",
        "dbt source declarations against core; core is not a dbt-owned schema",
      ],
      transformations: [
        "13 thin staging views, then five conformed dimensions and six foundational facts",
        "Six intermediate models for shared order, item, successful-activity, return, and review context",
        "Seven governed marts: daily sales, product monthly, customer summary, promotion monthly, fulfillment monthly, RFM, and cohort",
      ],
      automation: [
        "dbt build for models and 215 tests; pytest for 167 contracts; 375 PostgreSQL data-quality checks",
        "Controlled dimension bootstrap copies validated natural-ID to surrogate-key mappings, then durable sequences take over",
        "Generated dbt documentation and lineage; analysis notebooks stay read-only downstream of marts",
      ],
      samples: [
        {
          language: "SQL",
          caption: "Recompute gross margin from additive components",
          code: `round(
    items.gross_profit / nullif(items.net_merchandise_sales, 0), 6
) as gross_margin_pct`,
        },
        {
          language: "SQL",
          caption: "Keep immature return rates null until the 45-day window closes",
          code: `case when (
    (month_start_date + interval '1 month' - interval '1 day')::date
        + {{ var('return_maturity_days') }}
) <= '{{ var('as_of_date') }}'::date then round(
    coalesce(completed_returned_units, 0)::numeric
        / nullif(units_sold, 0), 6
) end as unit_return_rate`,
        },
      ],
    },
    analytics: {
      deliverables: [
        "Governed marts for commercial, customer, product, promotion, fulfillment, RFM, and cohort analysis",
        "Phase 4 findings on value concentration, maturity-aware repeat purchase, and product economics",
        "Selected portfolio visuals below; Jupyter notebooks remain in the public repository",
      ],
      notes:
        "Headline figures use the documented starter-scale synthetic dataset. RFM is descriptive. Repeat-purchase association is not causality. Promotion analysis is observational.",
    },
    results: {
      operational: [
        "37 dbt models and 215 dbt tests passed on deterministic rebuilds",
        "167 pytest tests and 375 PostgreSQL data-quality checks passed",
        "Exact control-versus-dbt parity across all migrated dimensions, facts, and governed marts — zero bidirectional row-level differences",
        "Surrogate-key mappings, types, precision, and null semantics preserved",
      ],
      adoption: [
        "Portfolio demonstration for analytics engineer, data/analytics engineer, senior analyst, and BI developer roles",
        "Public GitHub repository with dbt project, tests, and analysis notebooks",
      ],
      lessons: [
        "Migration discipline is the product: keep the validated warehouse as a control until parity is proven.",
        "Metric contracts belong in marts. Dashboards cannot repair averaged rates or immature return windows.",
        "A minority of customers and a few categories can dominate a synthetic commercial base; that is a modeling result, not market evidence.",
      ],
    },
    interactive: "ecommerce-analytics",
  },
  {
    slug: "transit-ridership-forecast",
    title: "Machine Learning Ridership Forecast",
    year: "2026",
    status: "live",
    tags: [
      "Python",
      "SQL Server",
      "Machine Learning",
      "Power BI",
      "Decision Support",
    ],
    oneLiner:
      "An XGBoost ridership forecast, written back to the database and published in Power BI, so users can price five fiscal years of planned service.",
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
    tags: [
      "Python",
      "SQL Server",
      "ESRI",
      "Data Automation",
      "Geospatial Analytics",
    ],
    oneLiner:
      "A scheduled Python-to-SQL-to-ArcGIS Online pipeline that turns Transit app mobile trip data into 7-day travel and 31-day transfer patterns users can analyze in an ESRI web experience site.",
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
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

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
    tags: ["forecasting", "public transit", "scenario planning"],
    oneLiner:
      "A planning model that lets operators test service and fare changes against future ridership.",
    summary: {
      problem:
        "Planners could not quickly see how service frequency, fare policy, and network changes would move ridership.",
      who: "Planning, operations, finance, and executive leadership.",
      solution:
        "A Python/SQL pipeline feeding a governed ridership model and an interactive scenario workspace.",
      outcome:
        "Scenario answers in minutes instead of a multi-week analyst cycle, with shared metric definitions.",
      narrative:
        "Leadership needed a trusted view of how policy choices would land on the network. I designed a forecasting stack that turns operational history into a scenario tool: change a lever, see boardings, revenue, and crowding move together.",
    },
    problem: {
      background:
        "A transit agency reported ridership from several source systems, with planning still running one-off spreadsheet forecasts for board workshops.",
      challenges: [
        "Ridership, schedules, and fare data lived in separate systems",
        "Manual reporting delayed scenario work",
        "Inconsistent definitions of a boarding vs. an unlinked trip",
        "Limited visibility into how service hours traded against demand",
      ],
      stakeholders: [
        "Executive leadership",
        "Service planning",
        "Operations",
        "Finance",
        "Public-facing communications",
      ],
      successCriteria: [
        "One official ridership definition used in every view",
        "Planners can run a scenario without a custom model rebuild",
        "Outputs explainable enough for a board packet",
      ],
    },
    architecture: {
      steps: [
        "Source systems",
        "Bronze",
        "Silver",
        "Gold",
        "Semantic model",
        "Dashboard / API / scenario UI",
      ],
      sources: [
        "CAD/AVL vehicle locations",
        "APC boardings",
        "GTFS schedules",
        "Fare collection extracts",
        "Census / land-use layers",
      ],
      stack: [
        "Python",
        "SQL Server",
        "dbt-style transforms",
        "Power BI",
        "Next.js scenario UI",
      ],
      decisions: [
        {
          q: "Why this architecture?",
          a: "Separate raw capture from curated gold tables so the forecast never reads unvalidated APC dumps.",
        },
        {
          q: "Why these tools?",
          a: "SQL for governed metrics, Python for the model, a browser UI so planners can pull levers without a notebook.",
        },
        {
          q: "Why this data model?",
          a: "Route-day facts with calendar, route, and stop dimensions keep elasticity estimates aligned with how service is actually scheduled.",
        },
      ],
    },
    modeling: {
      facts: ["Fact_Ridership", "Fact_ServiceHours", "Fact_Farebox"],
      dimensions: ["Date", "Route", "Stop", "FareProduct"],
      metrics: [
        { name: "Ridership", definition: "Unlinked passenger trips, validated against APC and fareboard." },
        { name: "Boardings / hour", definition: "Passenger boardings divided by in-service hours." },
        { name: "On-time performance", definition: "Trips arriving within the agency on-time window." },
      ],
      governance: [
        "Range and null checks on APC loads",
        "Published data dictionary for board-facing metrics",
        "Lineage from source extract to gold table",
      ],
    },
    pipeline: {
      ingestion: ["Nightly APC and GTFS pulls", "Weekly farebox file drop", "On-demand GIS refresh"],
      transformations: [
        "Stop-id standardization",
        "Calendar alignment",
        "Route-day aggregation",
      ],
      automation: ["Scheduled loads", "Freshness monitors", "Failed-load alerts", "Incremental date partitions"],
      samples: [
        {
          language: "SQL",
          caption: "Gold route-day ridership",
          code: `select
  service_date,
  route_id,
  sum(boardings) as ridership,
  sum(in_service_hours) as service_hours
from silver.apc_trips
group by 1, 2;`,
        },
        {
          language: "Python",
          caption: "Elasticity applied to a scenario",
          code: `def forecast(base, freq_delta, fare_delta):
    return base * (1 + 0.35 * freq_delta) * (1 - 0.22 * fare_delta)`,
        },
      ],
    },
    analytics: {
      deliverables: [
        "Executive scorecard",
        "Route-level forecast chart",
        "Interactive scenario planner (below)",
      ],
      notes: "Screenshots and maps will replace these placeholders as case-study assets land.",
    },
    results: {
      operational: [
        "Scenario cycle time: weeks → same meeting",
        "One ridership definition across planning and finance",
      ],
      adoption: [
        "Planning as primary user",
        "Finance using the same fare-sensitivity output",
      ],
      lessons: [
        "Governance matters more than chart polish.",
        "Trust comes from consistent metric definitions.",
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

export const metadata = { title: "Resume" };

type IconKind = "summary" | "skills" | "work" | "projects" | "education";

function ResumeIcon({ kind }: { kind: IconKind }) {
  if (kind === "summary") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21c0-4 3-7 7-7s7 3 7 7" />
      </svg>
    );
  }
  if (kind === "skills") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20V7" />
      </svg>
    );
  }
  if (kind === "work") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <rect x="3" y="7" width="18" height="13" rx="1" />
        <path d="M8 7V4h8v3M3 12h18" />
      </svg>
    );
  }
  if (kind === "projects") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="m2 9 10-5 10 5-10 5L2 9Z" />
      <path d="M6 11v6c3 3 9 3 12 0v-6M22 9v7" />
    </svg>
  );
}

function SectionHeading({
  icon,
  children,
}: {
  icon: IconKind;
  children: React.ReactNode;
}) {
  return (
    <h2 className="resume-section-heading">
      <span className="resume-section-icon">
        <ResumeIcon kind={icon} />
      </span>
      {children}
    </h2>
  );
}

const strengths = [
  {
    name: "Analytics Engineering",
    detail:
      "SQL-first transformation, dbt staging/marts/tests/snapshots, dimensional modeling, source-to-report lineage, metric definitions, and reusable analytical datasets",
  },
  {
    name: "Data Engineering & Automation",
    detail:
      "Python/pandas, REST APIs, ETL/ELT, incremental loads, scheduled pipelines, exception handling, schema reconciliation, validation, and Git/GitHub",
  },
  {
    name: "Business Intelligence",
    detail:
      "Power BI, DAX, Power Query, semantic models, Tableau, Looker Studio, executive dashboards, self-service reporting, and KPI frameworks",
  },
  {
    name: "Advanced Analytics",
    detail:
      "Forecasting, regression, hypothesis testing, segmentation, cohort/trend analysis, anomaly detection, benchmarking, and scenario analysis",
  },
  {
    name: "Data Platforms",
    detail:
      "Snowflake, AWS Redshift, SQL Server, PostgreSQL/PostGIS, Azure, Microsoft Fabric/OneLake testing, and Salesforce-integrated data",
  },
  {
    name: "Spatial & Market Analytics",
    detail:
      "ArcGIS Pro/Online, QGIS, GeoPandas, Shapely, geocoding, spatial joins/overlays, demographic analysis, and location intelligence",
  },
];

const roles = [
  {
    title: "Senior Data Analyst — Analytics Engineering & Decision Support",
    organization: "VIA Metropolitan Transit",
    location: "San Antonio, TX",
    dates: "Aug 2024 – Present",
    bullets: [
      "Own end-to-end analytics for operations, planning, and executive leadership, translating ambiguous business questions into defined metrics, analytical approaches, and reusable reporting products.",
      "Built and maintain production Python/SQL pipelines and self-service Power BI/GIS products, replacing recurring manual preparation with validated, repeatable workflows.",
      "Design curated analytical tables and reporting models that combine vendor platforms, operational databases, mobile-app event data, workforce records, public datasets, and internal systems while preserving traceability to source.",
      "Lead data-quality and metric-governance work including schema checks, record reconciliation, validation rules, exception handling, lineage notes, data dictionaries, and plain-language runbooks.",
      "Conduct forecasting, customer-experience, behavioral, demographic, performance, and spatial analysis; support Microsoft Fabric modernization/testing and governed self-service access to internal data.",
    ],
  },
  {
    title: "Service Analyst — Analytics, Forecasting & Data Products",
    organization: "Chicago Transit Authority",
    location: "Chicago, IL",
    dates: "May 2023 – Aug 2024",
    bullets: [
      "Built self-service dashboards adopted by users across operations, scheduling, and planning, improving access to recurring performance metrics and reducing routine analyst requests.",
      "Automated four recurring analytical workflows using Python, SQL, and AWS Redshift, recovering 4–6 hours per reporting cycle while improving consistency and reproducibility.",
      "Developed forecasting, scenario, performance, behavioral, and geospatial analyses from large operational, customer-demand, demographic, and external datasets to support resource allocation and planning decisions.",
      "Partnered with cross-functional teams to define success measures, investigate unexpected changes, validate assumptions, and translate findings into decision-ready recommendations.",
    ],
  },
  {
    title: "Data Engineer / Data Analyst — Client Analytics & Data Products",
    organization: "mySidewalk",
    location: "Kansas City, MO / Remote",
    dates: "Aug 2022 – May 2023",
    bullets: [
      "Built Snowflake, Python, and SQL pipelines that acquired, standardized, and refreshed large public datasets spanning demographic, labor, health, economic, infrastructure, and community indicators for client-facing products.",
      "Partnered with clients and internal product teams to define KPIs, analytical requirements, and data products; developed dashboards, Flask tools, and interactive applications used by 100+ users.",
      "Monitored releases for schema drift, missing values, geographic coverage, and anomalies; built fuzzy-matching and geocoding workflows to convert inconsistent records into reliable analytical datasets.",
      "Performed customer-experience and demographic segmentation analysis, forecasting, statistical analysis, and location-based research for public-sector and community-focused clients.",
    ],
  },
  {
    title: "Data Analyst — Strategy, Performance & Public Data",
    organization: "City of Dallas",
    location: "Dallas, TX",
    dates: "Jun 2021 – Aug 2022",
    bullets: [
      "Built reproducible Python/SQL workflows that reconciled large, inconsistent multi-file state and federal datasets into standardized analytical tables for recurring reporting and strategic analysis.",
      "Designed KPI frameworks, dashboards, benchmarking analyses, and statistical/geospatial models used to identify performance gaps, trends, safety risks, and investment priorities.",
      "Delivered validated outputs through Power BI, Tableau, ArcGIS Online, and public-facing analytical products while documenting data limitations and business logic.",
    ],
  },
  {
    title: "Data Engineer / GIS Analyst — Market & Infrastructure Analytics",
    organization: "Modus LLC",
    location: "Portland, OR / Remote",
    dates: "Mar 2020 – Jun 2021",
    bullets: [
      "Built Azure, Python, SQL, and enterprise GIS workflows for clients including Verizon, AT&T, and Google, integrating Salesforce sales/work-order records with assets, parcels, demographic, infrastructure, permitting, zoning, and rights-of-way data.",
      "Developed market-segmentation and location-intelligence analyses that ranked expansion opportunities and translated complex commercial, spatial, and infrastructure data into client recommendations.",
      "Automated spatial and data-quality workflows in ArcGIS Pro and QGIS, resolving schema, coordinate, and source-quality issues while documenting repeatable methods for client teams.",
    ],
  },
  {
    title: "Business Analyst / Data Engineer — Enterprise Reporting",
    organization: "Opus Agency",
    location: "Portland, OR",
    dates: "Jan 2018 – Mar 2020",
    bullets: [
      "Integrated Salesforce CRM, workforce, finance, legal, and marketing-platform data using SQL Server, Azure, Python, and APIs to support revenue, budgeting, client delivery, and executive reporting.",
      "Designed relational structures, recurring data flows, operational KPIs, and Power BI/Tableau reporting; investigated anomalies and documented business logic so outputs remained traceable and maintainable.",
    ],
  },
];

const selectedWork = [
  "Analytics engineering portfolio: Built a reproducible PostgreSQL analytical warehouse with dimensional facts/dimensions, validated marts, customer RFM and cohort models, business-analysis notebooks, and a documented Power BI semantic model.",
  "High-volume ingestion and warehousing: Automated source extraction, validation, incremental loading, exception handling, and SQL warehousing for an operational dataset exceeding 137 million records across 860+ service days.",
  "Behavioral and location analytics: Built Python/SQL/GIS workflows that reconstruct activity patterns from mobile-app event data, validate spatial records, enrich results with contextual data, and publish analysis-ready outputs.",
  "Data quality and governance: Designed repeatable validation suites covering row counts, schema expectations, business-rule reconciliation, freshness, lifecycle checks, and documented exceptions so downstream metrics remain trustworthy.",
  "Analytical delivery: Build end-to-end products that move from raw source data through modeled datasets to Power BI/Tableau dashboards, automated reports, interactive web tools, and plain-language documentation for non-technical users.",
];

export default function ResumePage() {
  return (
    <>
      <p className="kicker">Resume</p>
      <h1>Experience...</h1>

      <div className="resume">
        <SectionHeading icon="summary">Professional Summary</SectionHeading>
        <p>
          Data and analytics professional with 8+ years of experience building
          reliable pipelines, analytical models, self-service reporting, and
          decision-support tools from complex operational, customer, financial,
          demographic, and spatial data. Advanced SQL and Python practitioner
          with hands-on experience across Snowflake, AWS Redshift, SQL Server,
          PostgreSQL, Power BI, Tableau, dbt, APIs, and modern analytics
          workflows. Comfortable owning work end to end—from source-system
          discovery and data quality through transformation, modeling, analysis,
          automation, documentation, and stakeholder delivery.
        </p>

        <SectionHeading icon="skills">Technical Strengths</SectionHeading>
        <div className="resume-strengths">
          {strengths.map((strength) => (
            <div key={strength.name}>
              <h3>{strength.name}</h3>
              <p className="muted">{strength.detail}</p>
            </div>
          ))}
        </div>

        <SectionHeading icon="work">Professional Experience</SectionHeading>
        <div className="resume-timeline">
          {roles.map((role) => (
            <article key={`${role.organization}-${role.dates}`} className="resume-role">
              <div className="resume-role-head">
                <div>
                  <h3>{role.title}</h3>
                  <p>
                    <strong>{role.organization}</strong> · {role.location}
                  </p>
                </div>
                <span>{role.dates}</span>
              </div>
              <ul className="plain">
                {role.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <SectionHeading icon="projects">Selected Technical Work</SectionHeading>
        <ul className="plain resume-selected-work">
          {selectedWork.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <SectionHeading icon="education">Education</SectionHeading>
        <div className="resume-education">
          <p>
            <strong>Master of Urban Planning</strong>
            <br />
            <span className="muted">Portland State University</span>
          </p>
          <p>
            <strong>B.A., Economics &amp; Finance</strong>
            <br />
            <span className="muted">Texas A&amp;M University–Corpus Christi</span>
          </p>
        </div>
      </div>
    </>
  );
}

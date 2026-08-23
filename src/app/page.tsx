import Image from "next/image";
import { site } from "@/data/site";

function IconChart() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className="about-icon-svg">
      <rect x="8" y="28" width="8" height="12" fill="currentColor" opacity="0.85" />
      <rect x="20" y="18" width="8" height="22" fill="currentColor" />
      <rect x="32" y="10" width="8" height="30" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

function IconDatabase() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className="about-icon-svg">
      <ellipse cx="24" cy="12" rx="14" ry="6" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M10 12v10c0 3.3 6.3 6 14 6s14-2.7 14-6V12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M10 22v10c0 3.3 6.3 6 14 6s14-2.7 14-6V22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function IconPipeline() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className="about-icon-svg">
      <circle cx="10" cy="24" r="5" fill="currentColor" />
      <circle cx="24" cy="24" r="5" fill="currentColor" opacity="0.8" />
      <circle cx="38" cy="24" r="5" fill="currentColor" opacity="0.6" />
      <path d="M15 24h4M29 24h4" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

function IconMap() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className="about-icon-svg">
      <path
        d="M24 8c-6 0-11 5-11 11 0 9 11 21 11 21s11-12 11-21c0-6-5-11-11-11z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <circle cx="24" cy="19" r="3.5" fill="currentColor" />
    </svg>
  );
}

const highlights = [
  {
    title: "Metrics & models",
    body: "Governed KPIs and forecasts stakeholders can quote in a planning or budget meeting.",
    Icon: IconChart,
  },
  {
    title: "Data pipelines",
    body: "Extracts into SQL, cleaning, and rollups that keep dashboards honest at scale.",
    Icon: IconDatabase,
  },
  {
    title: "Automation",
    body: "Scheduled jobs and publish steps so the report refreshes without a manual rebuild.",
    Icon: IconPipeline,
  },
  {
    title: "Spatial analysis",
    body: "Geospatial analysis that combines movement, demographic, operational, and location data to uncover patterns, relationships, and opportunities across places.",
    Icon: IconMap,
  },
];

export default function AboutPage() {
  return (
    <>
      <p className="kicker">About Me</p>
      <div className="about-hero">
        <div className="about-photo-ring">
          <div className="about-photo-inner">
            <Image
              src="/andrew-reyna-circle.jpg"
              alt="Andrew Reyna"
              width={160}
              height={160}
              priority
              className="about-photo"
            />
          </div>
        </div>
        <div className="about-hero-copy">
          <h1>{site.tagline}</h1>
          <p className="lede">
            I work across analytics engineering, data automation, and business
            intelligence — transforming messy data into trusted analytical
            products.
          </p>
        </div>
      </div>

      <div className="about-icons">
        {highlights.map(({ title, body, Icon }) => (
          <div key={title} className="about-icon-card">
            <div className="about-icon-mark">
              <Icon />
            </div>
            <h3>{title}</h3>
            <p className="muted">{body}</p>
          </div>
        ))}
      </div>
    </>
  );
}

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

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="contact-icon">
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="contact-icon contact-icon-github"
    >
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.69c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.5 9.5 0 0 1 12 7.01c.85 0 1.71.11 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.58c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
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
            Analytics engineering, data automation, business intelligence,
            forecasting, and spatial analysis.
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

      <div className="about-details">
        <section className="about-detail-block">
          <h2>More About Me</h2>
          <p>
            I’m a data analyst and analytics engineer who enjoys turning
            complex data into practical tools and insights people can actually
            use. My background in economics, finance, and urban planning has
            shaped how I approach problems: I tend to look at the bigger
            picture and think about how a solution can create value for the
            greatest number of people. That perspective has followed me
            throughout my career, whether I’m building data pipelines,
            analytical models, dashboards, or automated workflows.
          </p>
          <p>
            I live in San Antonio, Texas with my wife and daughter. Outside of
            work, I enjoy traveling with my family, collecting vinyl,
            photography, and reading science fiction whenever I can find the
            time.
          </p>
        </section>

        <section className="about-detail-block">
          <h2>Contact</h2>
          <div className="about-contact-links">
            <a href="mailto:andrewdreynadata@gmail.com">
              <IconMail />
              andrewdreynadata@gmail.com
            </a>
            <a href="https://github.com/adrsub22">
              <IconGitHub />
              github.com/adrsub22
            </a>
          </div>
        </section>
      </div>
    </>
  );
}

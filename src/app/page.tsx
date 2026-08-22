import { site } from "@/data/site";

export default function AboutPage() {
  return (
    <>
      <p className="kicker">About Me</p>
      <h1>{site.tagline}</h1>
      <p className="lede">
        This page is the biography slot. Swap the paragraphs below for your
        story: domain, how you work with stakeholders, and what you want this
        site to be hired for.
      </p>
      <div className="grid-2">
        <div className="card">
          <h3>Focus</h3>
          <p className="muted">
            Analytics engineering, governed metrics, and tools that let
            planners and executives pull levers—not just read a static chart.
          </p>
        </div>
        <div className="card">
          <h3>How to read this site</h3>
          <p className="muted">
            Use the left nav. Projects share one seven-section template. Some
            case studies are full; others are drafts with the same skeleton.
          </p>
        </div>
      </div>
    </>
  );
}

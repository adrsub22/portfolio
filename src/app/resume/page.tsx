export const metadata = { title: "Resume" };

export default function ResumePage() {
  return (
    <>
      <p className="kicker">Resume</p>
      <h1>Experience, compressed</h1>
      <p className="lede">
        This is a web resume, not a PDF clone. Replace the sample rows with
        roles, tools, and proof points. A downloadable PDF can sit beside it
        later.
      </p>
      <div className="resume">
        <h2>Selected experience</h2>
        <p>
          <strong>Role title — Organization</strong>
          <br />
          <span className="muted">Years · City</span>
        </p>
        <ul className="plain">
          <li>Owned metric definitions used in executive reporting.</li>
          <li>Built pipelines from operational systems to gold models.</li>
          <li>Shipped planner-facing tools, not only internal notebooks.</li>
        </ul>
        <h2>Tools</h2>
        <div className="tags">
          {["Python", "SQL", "Power BI", "Fabric", "ArcGIS", "dbt"].map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
        <h2>Education</h2>
        <p className="muted">Degree, school, year — placeholder.</p>
      </div>
    </>
  );
}

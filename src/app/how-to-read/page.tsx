export const metadata = { title: "How to Read This Site" };

export default function HowToReadPage() {
  return (
    <>
      <p className="kicker">How to Read · 05</p>
      <h1>How to Read This Site</h1>

      <div className="about-details">
        <section className="about-detail-block">
          <h2>Finding Your Way Around</h2>
          <p>
            The left navigation separates the site into five areas: About Me,
            Projects, Resume, Thoughts, and How to Read. Projects contains the
            detailed case studies; Resume provides a concise career overview;
            and Thoughts contains shorter notes about data, analytics, and the
            work behind the projects.
          </p>
        </section>

        <section className="about-detail-block">
          <h2>Reading the Case Studies</h2>
          <p>
            Each case study follows the same seven-part structure: Executive
            Summary, Business Problem, Solution Architecture, Data Modeling,
            Pipeline &amp; Engineering, Analytics &amp; Deliverables, and
            Results &amp; Impact.
          </p>
          <p>
            The consistent format makes it easy to move from the problem and
            stakeholders through the technical decisions to the final outcome.
            Interactive demos use synthetic data so the experience can be
            explored without exposing agency information.
          </p>
        </section>
      </div>
    </>
  );
}

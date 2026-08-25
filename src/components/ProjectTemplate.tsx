import Image from "next/image";
import { projectSectionNav } from "@/data/site";
import type { Project } from "@/data/projects";
import { RidershipPlanner } from "@/components/RidershipPlanner";
import { TripPatternsDemo } from "@/components/TripPatternsDemo";
import { EcommerceAnalytics } from "@/components/EcommerceAnalytics";

function Block({
  id,
  n,
  title,
  children,
}: {
  id: string;
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="block" id={id}>
      <header>
        <span className="num">{n}</span>
        <h2>{title}</h2>
      </header>
      {children}
    </section>
  );
}

export function ProjectTemplate({ project }: { project: Project }) {
  const s = project.summary;
  const thin = !project.problem;

  return (
    <article>
      <p className="kicker">
        {project.year} · {project.status === "live" ? "Case study" : "Draft"}
      </p>
      <h1>{project.title}</h1>
      <p className="lede">{project.oneLiner}</p>
      {project.disclaimer && (
        <p className="muted project-disclaimer">{project.disclaimer}</p>
      )}
      {project.repoUrl && (
        <p className="project-links">
          <a href={project.repoUrl} target="_blank" rel="noreferrer">
            GitHub repository
          </a>
        </p>
      )}
      <nav className="section-nav" aria-label="Project sections">
        {projectSectionNav.map((item) => (
          <a key={item.id} href={`#${item.id}`}>
            {item.n} {item.label}
          </a>
        ))}
      </nav>

      <Block id="summary" n="01" title="Executive Summary">
        <p>{s.narrative}</p>
        <dl className="dl">
          <div>
            <dt>Problem</dt>
            <dd>{s.problem}</dd>
          </div>
          <div>
            <dt>Who</dt>
            <dd>{s.who}</dd>
          </div>
          <div>
            <dt>Solution</dt>
            <dd>{s.solution}</dd>
          </div>
          <div>
            <dt>Outcome</dt>
            <dd>{s.outcome}</dd>
          </div>
        </dl>
      </Block>

      <Block id="problem" n="02" title="Business Problem">
        {project.problem ? (
          <>
            <h3>Background</h3>
            <p>{project.problem.background}</p>
            <h3>Challenges</h3>
            <ul className="plain">
              {project.problem.challenges.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <h3>Stakeholders</h3>
            <ul className="plain">
              {project.problem.stakeholders.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <h3>Success criteria</h3>
            <ul className="plain">
              {project.problem.successCriteria.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="placeholder">
            This case study is thinner on purpose. Background, challenges,
            stakeholders, and success criteria will fill in as the write-up
            matures. The seven-section shell stays the same.
          </p>
        )}
      </Block>

      <Block id="architecture" n="03" title="Solution Architecture">
        {project.architecture ? (
          <>
            <div className="flow" aria-label="Architecture flow">
              {project.architecture.steps.map((step, i) => (
                <span key={step}>
                  {i > 0 && <em> → </em>}
                  {step}
                </span>
              ))}
            </div>
            {project.architecture.visual && (
              <figure className="ecom-figure architecture-figure">
                <Image
                  src={project.architecture.visual.src}
                  alt={project.architecture.visual.alt}
                  width={1800}
                  height={460}
                  unoptimized
                  className="ecom-figure-img"
                />
                <figcaption className="muted">
                  {project.architecture.visual.caption}
                </figcaption>
              </figure>
            )}
            <h3>Data sources</h3>
            <ul className="plain">
              {project.architecture.sources.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <h3>Stack</h3>
            <div className="tags">
              {project.architecture.stack.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
            <h3>Design decisions</h3>
            {project.architecture.decisions.map((d) => (
              <p key={d.q}>
                <strong>{d.q}</strong> {d.a}
              </p>
            ))}
          </>
        ) : (
          <p className="placeholder">
            Diagram, sources, stack, and design decisions TBD.
          </p>
        )}
      </Block>

      <Block id="modeling" n="04" title="Data Modeling">
        {project.modeling ? (
          <>
            <div className="flow">
              <span>{project.modeling.facts.join(" · ")}</span>
              <em>→</em>
              <span>{project.modeling.dimensions.join(" / ")}</span>
            </div>
            <h3>Business metrics</h3>
            <dl className="dl">
              {project.modeling.metrics.map((m) => (
                <div key={m.name}>
                  <dt>{m.name}</dt>
                  <dd>{m.definition}</dd>
                </div>
              ))}
            </dl>
            <h3>Governance</h3>
            <ul className="plain">
              {project.modeling.governance.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            {project.modeling.takeaways && (
              <>
                <h3>
                  {project.modeling.takeawaysHeading ??
                    "What the model was telling us"}
                </h3>
                <p className="muted">
                  {project.modeling.takeawaysIntro ??
                    "Plain-language readout for analysts. Snippets below are the shape of the fit, not the agency notebook."}
                </p>
                {project.modeling.takeaways.map((t) => (
                  <p key={t.title}>
                    <strong>{t.title}.</strong> {t.body}
                  </p>
                ))}
              </>
            )}
          </>
        ) : (
          <p className="placeholder">Schema, metrics, and governance TBD.</p>
        )}
      </Block>

      <Block id="pipeline" n="05" title="Pipeline & Engineering">
        {project.pipeline ? (
          <>
            <h3>Ingestion</h3>
            <ul className="plain">
              {project.pipeline.ingestion.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <h3>Transformations</h3>
            <ul className="plain">
              {project.pipeline.transformations.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <h3>Automation</h3>
            <ul className="plain">
              {project.pipeline.automation.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            {project.pipeline.samples.map((sample) => (
              <div key={sample.caption}>
                <p className="caption">
                  {sample.language} · {sample.caption}
                </p>
                <pre>
                  <code>{sample.code}</code>
                </pre>
              </div>
            ))}
          </>
        ) : (
          <p className="placeholder">
            Ingestion, transforms, automation, and code samples TBD.
          </p>
        )}
      </Block>

      <Block id="analytics" n="06" title="Analytics & Deliverables">
        {project.analytics ? (
          <>
            <ul className="plain">
              {project.analytics.deliverables.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            {project.analytics.notes && (
              <p className="muted">{project.analytics.notes}</p>
            )}
          </>
        ) : (
          <p className="placeholder">
            Dashboards, maps, and scorecards will sit here.
          </p>
        )}
        {project.interactive === "ridership-scenario" && <RidershipPlanner />}
        {project.interactive === "trip-patterns" && <TripPatternsDemo />}
        {project.interactive === "ecommerce-analytics" && <EcommerceAnalytics />}
      </Block>

      <Block id="results" n="07" title="Results & Impact">
        {project.results ? (
          <>
            <h3>Operational outcomes</h3>
            <ul className="plain">
              {project.results.operational.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <h3>Adoption</h3>
            <ul className="plain">
              {project.results.adoption.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <h3>Lessons learned</h3>
            <ul className="plain">
              {project.results.lessons.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="placeholder">
            Outcomes, adoption, and lessons TBD. {thin ? "" : ""}
          </p>
        )}
      </Block>
    </article>
  );
}

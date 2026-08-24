import Link from "next/link";
import { projects } from "@/data/projects";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <>
      <p className="kicker">Projects</p>
      <h1>Case Studies</h1>
      <div className="project-list">
        {projects.map((p) => (
          <Link key={p.slug} href={`/projects/${p.slug}`} className="project-row">
            <span className="muted">{p.year}</span>
            <div>
              <h2>{p.title}</h2>
              <p className="muted">{p.oneLiner}</p>
              <div className="tags">
                {p.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

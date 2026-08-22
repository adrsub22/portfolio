import Link from "next/link";
import { projects } from "@/data/projects";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <>
      <p className="kicker">Projects</p>
      <h1>Case studies</h1>
      <p className="lede">
        Five or six projects will live here. Every one uses the same seven
        sections so readers can compare how you think, not just what you built.
      </p>
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
            <span className="status">{p.status}</span>
          </Link>
        ))}
      </div>
    </>
  );
}

export const site = {
  name: "Andrew Reyna",
  role: "Data Analytics and Engineering",
  location: "United States",
  email: "hello@example.com",
  tagline:
    "I turn messy operational data into trusted metrics, models, and tools that stakeholders use to inform their decisions.",
  copyright: "© Andrew Reyna 2026–2027",
};

export const nav = [
  { href: "/", label: "About Me", id: "about" },
  { href: "/projects", label: "Projects", id: "projects" },
  { href: "/resume", label: "Resume", id: "resume" },
  { href: "/thoughts", label: "Thoughts", id: "thoughts" },
] as const;

export const projectSectionNav = [
  { id: "summary", label: "Executive Summary", n: "01" },
  { id: "problem", label: "Business Problem", n: "02" },
  { id: "architecture", label: "Solution Architecture", n: "03" },
  { id: "modeling", label: "Data Modeling", n: "04" },
  { id: "pipeline", label: "Pipeline & Engineering", n: "05" },
  { id: "analytics", label: "Analytics & Deliverables", n: "06" },
  { id: "results", label: "Results & Impact", n: "07" },
] as const;

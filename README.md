# Portfolio

Personal site highlighting projects, resume, and notes. Project samples share a seven-section case-study template. Interactive pieces (starting with a transit ridership scenario planner) live inside a project, not as a separate app.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Where to edit

| What | File |
| --- | --- |
| Name, nav | `src/data/site.ts` |
| Case studies | `src/data/projects.ts` |
| Blog list | `src/data/thoughts.ts` |
| Page chrome | `src/components/Sidebar.tsx`, `src/app/layout.tsx` |
| Project layout | `src/components/ProjectTemplate.tsx` |
| Ridership demo | `src/components/RidershipPlanner.tsx` |

The left sidebar is always visible. Each item loads the matching view in the main column. Project pages keep the same seven headings even when a section is still a placeholder.

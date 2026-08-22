"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, site } from "@/data/site";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/" className="brand">
        <div className="brand-kicker">Portfolio</div>
        <p className="brand-name">{site.name}</p>
        <p className="brand-role">{site.role}</p>
      </Link>
      <nav className="nav" aria-label="Primary">
        {nav.map((item, i) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? "active" : undefined}
            >
              {item.label}
              <span className="idx">0{i + 1}</span>
            </Link>
          );
        })}
      </nav>
      <p className="sidebar-foot">
        Skeleton site. Content and live project assets still to land.
      </p>
    </aside>
  );
}

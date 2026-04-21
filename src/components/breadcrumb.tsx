import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** "light" = on cream bg; "dark" = on navy bg */
  variant?: "light" | "dark";
}

export function Breadcrumb({ items, variant = "light" }: BreadcrumbProps) {
  const base =
    variant === "dark"
      ? { muted: "text-white/50", strong: "text-white/80", hover: "hover:text-white" }
      : { muted: "text-navy/50", strong: "text-navy", hover: "hover:text-electric-blue" };

  return (
    <nav
      aria-label="Breadcrumb"
      className={`font-mono text-xs tracking-[0.1em] mb-6 ${base.muted}`}
    >
      <ol className="flex items-center gap-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className={`transition-colors ${base.hover}`}>
                {item.label}
              </Link>
            ) : (
              <span className={base.strong}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

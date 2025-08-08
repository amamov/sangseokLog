import Link from "next/link"

type SortOrder = "desc" | "asc"

export function SortControl({ current }: { current: SortOrder }) {
  const items: { key: SortOrder; label: string; href: string }[] = [
    { key: "desc", label: "최신순", href: "/?sort=desc" },
    { key: "asc", label: "오래된순", href: "/?sort=asc" },
  ]

  return (
    <div className="flex items-center justify-end gap-2 text-[13px]">
      <ul className="flex items-center gap-1">
        {items.map((it) => {
          const active = it.key === current
          return (
            <li key={it.key}>
              <Link
                href={it.href}
                aria-current={active ? "true" : undefined}
                className={[
                  "px-3 py-1 border bg-[color:var(--paper)]",
                  "border-[color:var(--news-rule-soft)] hover:bg-[color:var(--paper-tint)]",
                  active ? "bg-[color:var(--paper-tint)] text-[color:var(--ink-headline)]" : "text-[color:var(--ink-main)]",
                ].join(" ")}
              >
                {it.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

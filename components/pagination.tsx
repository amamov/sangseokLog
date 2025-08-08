import Link from "next/link"

type SortOrder = "desc" | "asc"

type PaginationProps = {
  currentPage: number
  totalPages: number
  sort?: SortOrder
}

function pageHref(n: number, sort?: SortOrder) {
  const base = n <= 1 ? "/" : `/?page=${n}`
  if (!sort) return base
  if (n <= 1) return `/?sort=${sort}`
  return `${base}&sort=${sort}`
}

export function Pagination({ currentPage, totalPages, sort }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-center gap-2 text-[13px]"
    >
      {/* Prev */}
      <Link
        href={pageHref(Math.max(1, currentPage - 1), sort)}
        aria-label="Previous page"
        className={`px-3 py-1 border border-[color:var(--news-rule-soft)] bg-[color:var(--paper)] hover:bg-[color:var(--paper-tint)] ${
          currentPage === 1 ? "pointer-events-none opacity-50" : ""
        }`}
      >
        {'Prev'}
      </Link>

      {/* Numbers */}
      <ul className="flex items-center gap-1">
        {pages.map((n) => {
          const isActive = n === currentPage
          return (
            <li key={n}>
              <Link
                href={pageHref(n, sort)}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "px-3 py-1 border bg-[color:var(--paper)]",
                  "border-[color:var(--news-rule-soft)] hover:bg-[color:var(--paper-tint)]",
                  isActive ? "bg-[color:var(--paper-tint)] text-[color:var(--ink-headline)]" : "text-[color:var(--ink-main)]",
                ].join(" ")}
              >
                {n}
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Next */}
      <Link
        href={pageHref(Math.min(totalPages, currentPage + 1), sort)}
        aria-label="Next page"
        className={`px-3 py-1 border border-[color:var(--news-rule-soft)] bg-[color:var(--paper)] hover:bg-[color:var(--paper-tint)] ${
          currentPage === totalPages ? "pointer-events-none opacity-50" : ""
        }`}
      >
        {'Next'}
      </Link>
    </nav>
  )
}

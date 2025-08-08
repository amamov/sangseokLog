import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ReactNode } from "react"
import { notoSans } from "@/app/fonts"

export function BlogShell({ children }: { children: ReactNode }) {
  // Newsprint palette
  const newsprint = {
    '--paper': '#EFEDE8',
    '--paper-tint': '#E6E3DC',
    '--ink-main': '#222222',
    '--ink-headline': '#151515',
    '--ink-muted': '#5E5E5E',
    '--news-rule': '#121212',
    '--news-rule-soft': '#C0BCB3',
    '--news-link': '#143459',
  } as React.CSSProperties

  return (
    <div
      className={`${notoSans.className} min-h-screen antialiased text-[color:var(--ink-main)]`}
      style={{
        ...newsprint,
        backgroundColor: 'var(--paper)',
        // Subtle halftone only (keep readability high)
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.035) 1px, rgba(0,0,0,0) 1px)',
        backgroundSize: '6px 6px',
      }}
    >
      <a href="#main" className="sr-only focus:not-sr-only">{'Skip to content'}</a>

      <SiteHeader />

      {/* Strong masthead rule */}
      <div aria-hidden="true" className="border-b-2 border-[color:var(--news-rule)]" />

      <div id="main">{children}</div>

      <SiteFooter />
    </div>
  )
}

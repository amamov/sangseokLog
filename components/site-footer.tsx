import { Copy, Slash } from 'lucide-react'

function NoCopyIcon() {
  return (
    <span className="relative inline-block h-4 w-4 align-middle ml-1" aria-hidden>
      <Copy className="absolute inset-0 h-4 w-4 opacity-80" />
      <Slash className="absolute inset-0 h-4 w-4 opacity-95" />
    </span>
  )
}

export function SiteFooter() {
  return (
    <footer className="w-full mt-10">
      <div aria-hidden="true" className="h-px w-full bg-[color:var(--news-rule)]" />
      <div className="mx-auto w-full max-w-[600px] px-4 py-6">
        <p className="text-center text-xs sm:text-sm text-[color:var(--ink-muted)]">
          {'© 2025 SANGSEOK LOG. All rights reserved.'}
          <NoCopyIcon />
          <span className="sr-only">{'복사 금지'}</span>
        </p>
      </div>
    </footer>
  )
}

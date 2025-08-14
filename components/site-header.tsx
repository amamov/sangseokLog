"use client";

import Link from "next/link";
import { NewsprintLogo } from "@/components/newsprint-logo";

export function SiteHeader() {
  return (
    <header className="w-full">
      <div className="mx-auto flex w-full max-w-[600px] items-center justify-between px-4 py-4">
        {/* Left: Logo */}
        <Link
          href="/"
          aria-label="Go to home"
          className="inline-flex items-center gap-2 text-[color:var(--ink-main)]"
        >
          <NewsprintLogo />
          <span className="sr-only">SANGSEOK LOG</span>
        </Link>

        {/* Right: Contact email */}
        <a
          href="mailto:endupfree@gmail.com"
          className="text-sm text-[color:var(--ink-main)] underline-offset-2 hover:underline"
        >
          {"endupfree@gmail.com"}
        </a>
      </div>
    </header>
  );
}

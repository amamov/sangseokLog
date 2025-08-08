"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, ReactNode, useTransition } from "react"

interface PostLinkProps {
  href: string
  children: ReactNode
  className?: string
}

export function PostLink({ href, children, className }: PostLinkProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    startTransition(() => {
      router.push(href)
    })
  }

  return (
    <>
      <Link href={href} onClick={handleClick} className={className}>
        {children}
      </Link>
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--paper)] bg-opacity-90">
          <div className="space-y-4 text-center">
            <div className="relative mx-auto h-12 w-12">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-[color:var(--news-rule-soft)] border-t-[color:var(--news-rule)]"></div>
            </div>
            <p className="text-sm text-[color:var(--ink-muted)] animate-pulse">
              포스트를 불러오는 중...
            </p>
          </div>
        </div>
      )}
    </>
  )
}
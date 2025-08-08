"use client"

import React from "react"
import { notoSerif } from "@/app/fonts"

export function NotionRenderer({ blocks }: { blocks: any[] }) {
if (!blocks || blocks.length === 0) return null
let firstParagraphSeen = false

return (
  <div className="space-y-4">
    {blocks.map((block) => {
      const isParagraph = block.type === "paragraph"
      const isFirstPara = isParagraph && !firstParagraphSeen
      if (isParagraph && !firstParagraphSeen) firstParagraphSeen = true
      return <Block key={block.id} block={block} dropCap={isFirstPara} />
    })}
  </div>
)
}

function Block({ block, dropCap = false }: { block: any; dropCap?: boolean }) {
const { type } = block
const value = block[type]

switch (type) {
  case "paragraph": {
    return (
      <p
        className={
          dropCap
            ? "leading-relaxed first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-5xl sm:first-letter:text-6xl first-letter:font-black first-letter:leading-[0.8] first-letter:text-[color:var(--ink-headline)]"
            : "leading-relaxed"
        }
        style={{ fontKerning: 'normal' as any, textRendering: 'optimizeLegibility' as any }}
      >
        {richText(value?.rich_text)}
      </p>
    )
  }
  case "heading_1": {
    return <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-snug text-[color:var(--ink-headline)]`}>{richText(value?.rich_text)}</h2>
  }
  case "heading_2": {
    return <h3 className={`text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-snug text-[color:var(--ink-headline)]`}>{richText(value?.rich_text)}</h3>
  }
  case "heading_3": {
    return <h4 className={`text-lg sm:text-xl md:text-2xl font-bold tracking-tight leading-snug text-[color:var(--ink-headline)]`}>{richText(value?.rich_text)}</h4>
  }
  case "quote": {
    return (
      <blockquote className="relative my-4 border-l-4 border-[color:var(--news-rule-soft)] pl-4 italic text-[color:var(--ink-muted)]">
        <span aria-hidden className="absolute -left-3 -top-2 text-3xl text-[color:var(--news-rule-soft)]">{'“'}</span>
        {richText(value?.rich_text)}
        <span aria-hidden className="ml-1 text-2xl text-[color:var(--news-rule-soft)] align-baseline">{'”'}</span>
      </blockquote>
    )
  }
  case "code": {
    const lang = value?.language || "plain text"
    const code = (value?.rich_text || []).map((t: any) => t?.plain_text ?? "").join("")
    return (
      <pre className="overflow-x-auto rounded-none border border-[color:var(--news-rule-soft)] bg-[color:var(--paper-tint)] p-4 text-sm">
        <code className="block">
          <span className="mb-2 inline-block text-[color:var(--ink-muted)]">{lang}</span>
          {"\n"}
          {code}
        </code>
      </pre>
    )
  }
  case "image": {
    const src = value?.type === "file" ? value?.file?.url : value?.external?.url
    const caption = (value?.caption || []).map((t: any) => t?.plain_text ?? "").join("")
    if (!src) return null
    return (
      <figure className="my-4 break-inside-avoid">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src || "/placeholder.svg"} alt={caption || "Notion image"} className="w-full grayscale-[40%] contrast-110" loading="lazy" />
        {caption ? <figcaption className="mt-2 text-center text-xs text-[color:var(--ink-muted)]">{caption}</figcaption> : null}
      </figure>
    )
  }
  case "divider": {
    return <hr className="my-6 border-[color:var(--news-rule-soft)] border-dashed" />
  }
  default:
    return <p className="leading-relaxed">{richText(value?.rich_text)}</p>
}
}

function richText(rich: any[]) {
if (!Array.isArray(rich)) return null
return rich.map((r, idx) => {
  const text = r?.plain_text ?? ""
  const url = r?.href
  let el: React.ReactNode = text

  if (r.annotations?.code) {
    el = <code className="rounded-none border border-[color:var(--news-rule-soft)] bg-[color:var(--paper-tint)] px-1 py-0.5 text-[0.95em]">{text}</code>
  }
  if (r.annotations?.bold) el = <strong>{el}</strong>
  if (r.annotations?.italic) el = <em>{el}</em>
  if (r.annotations?.underline) el = <span className="underline underline-offset-2">{el}</span>
  if (r.annotations?.strikethrough) el = <span className="line-through">{el}</span>

  if (url) {
    el = (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-2 decoration-[color:var(--news-link)] text-[color:var(--news-link)]"
      >
        {el}
      </a>
    )
  }

  return <React.Fragment key={idx}>{el}</React.Fragment>
})
}

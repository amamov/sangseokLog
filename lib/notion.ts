type NotionProperty = any
type NotionPage = any
type NotionBlock = any

const NOTION_VERSION = "2022-06-28"

// Derive the database id from provided link if env is not set
// Link: https://www.notion.so/endupfree/9dcab0525deb49bea25e252a24fc48d4?v=c6b88191945f4c62b43242ddc3f9e146
const FALLBACK_DB_ID = "9dcab0525deb49bea25e252a24fc48d4"

// --- SECURITY WARNING ---
// Hardcoding secrets is insecure and not recommended for production.
// This token will be visible in your source code.
// Please use Environment Variables for better security.
const NOTION_TOKEN = process.env.NEXT_NOTION_API_TOKEN

const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || FALLBACK_DB_ID

async function notionFetch(path: string, init?: RequestInit) {
  if (!NOTION_TOKEN) {
    throw new Error(
      "NOTION_TOKEN is not set. Please add it as an Environment Variable or hardcode it in lib/notion.ts."
    )
  }
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${NOTION_TOKEN}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    // Route handlers run on the server; no edge runtime here.
    cache: "no-store",
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Notion API error (${res.status}): ${text}`)
  }
  return res.json()
}

function getPlainText(richText: any[] | undefined) {
  if (!richText || !Array.isArray(richText)) return ""
  return richText.map((t: any) => t?.plain_text ?? "").join("")
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function first<T>(arr: T[] | undefined | null): T | undefined {
  if (!arr || arr.length === 0) return undefined
  return arr[0]
}

function extractCover(page: NotionPage): { url: string; alt?: string } | null {
  const cover = page.cover
  if (!cover) return null
  if (cover.type === "external") return { url: cover.external.url }
  if (cover.type === "file") return { url: cover.file.url }
  return null
}

function extractTitle(page: NotionPage): string {
  // Find the 'title' property dynamically
  const properties = page.properties || {}
  for (const key of Object.keys(properties)) {
    const prop = properties[key]
    if (prop?.type === "title") {
      return getPlainText(prop.title) || "Untitled"
    }
  }
  return "Untitled"
}

function extractExcerpt(page: NotionPage): string | undefined {
  const properties = page.properties || {}
  const possible = ["Summary", "Excerpt", "Description"]
  for (const name of possible) {
    const prop = properties[name]
    if (prop?.type === "rich_text") {
      const text = getPlainText(prop.rich_text)
      if (text) return text
    }
  }
  // Fallback to any first rich_text property
  for (const key of Object.keys(properties)) {
    const prop = properties[key]
    if (prop?.type === "rich_text") {
      const text = getPlainText(prop.rich_text)
      if (text) return text
    }
  }
  return undefined
}

function extractTags(page: NotionPage): string[] {
  const properties = page.properties || {}
  const prop =
    properties["Tags"] && properties["Tags"].type === "multi_select"
      ? properties["Tags"]
      : Object.values(properties).find((p: any) => p?.type === "multi_select")
  if (!prop) return []
  return (prop.multi_select || []).map((o: any) => o.name).filter(Boolean)
}

function extractDate(page: NotionPage): string | undefined {
  const properties = page.properties || {}
  const prop =
    (properties["Date"] && properties["Date"].type === "date" && properties["Date"]) ||
    Object.values(properties).find((p: any) => p?.type === "date")
  if (!prop) return undefined
  return prop.date?.start || undefined
}

function extractSlug(page: NotionPage, title: string): string {
  const properties = page.properties || {}
  const maybe =
    (properties["Slug"] && properties["Slug"].type === "rich_text" && properties["Slug"]) ||
    (properties["Slug"] && properties["Slug"].type === "title" && properties["Slug"])
  if (maybe?.type === "rich_text") {
    const text = getPlainText(maybe.rich_text)
    if (text) return slugify(text)
  }
  // If a dedicated title 'Slug' exists (rare)
  if (maybe?.type === "title") {
    const text = getPlainText(maybe.title)
    if (text) return slugify(text)
  }
  return slugify(title)
}

function isPublished(page: NotionPage): boolean {
  const properties = page.properties || {}
  const prop = properties["Published"] || properties["published"] || properties["Public"]
  if (prop?.type === "checkbox") return !!prop.checkbox
  // No checkbox property found => default to true (or change to false if you want strict gating)
  return true
}

export type PostSummary = {
  id: string
  slug: string
  title: string
  excerpt?: string
  date?: string
  tags?: string[]
  cover?: { url: string; alt?: string } | null
}

export async function queryPosts(): Promise<PostSummary[]> {
  if (!NOTION_DATABASE_ID) {
    throw new Error("NOTION_DATABASE_ID is not set.")
  }

  // Try to sort by 'Date' if property exists. We'll attempt a query with a sort; if it fails, do without sort.
  let data: any
  try {
    data = await notionFetch(`/databases/${NOTION_DATABASE_ID}/query`, {
      method: "POST",
      body: JSON.stringify({
        sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
        page_size: 50,
      }),
    })
  } catch {
    data = await notionFetch(`/databases/${NOTION_DATABASE_ID}/query`, {
      method: "POST",
      body: JSON.stringify({ page_size: 50 }),
    })
  }

  const pages: NotionPage[] = data.results || []
  const posts = pages
    .filter(isPublished)
    .map((page) => {
      const title = extractTitle(page)
      const post: PostSummary = {
        id: page.id,
        slug: extractSlug(page, title),
        title,
        excerpt: extractExcerpt(page),
        date: extractDate(page),
        tags: extractTags(page),
        cover: extractCover(page),
      }
      return post
    })

  return posts
}

async function getBlocksRecursive(blockId: string, acc: any[] = []): Promise<any[]> {
  const data: any = await notionFetch(`/blocks/${blockId}/children?page_size=100`, { method: "GET" })
  const blocks: any[] = data.results || []
  acc.push(...blocks)
  // Notion pagination
  if (data.has_more && data.next_cursor) {
    // There's no cursor param for block children endpoint; the new API uses start_cursor
    const nextData: any = await notionFetch(
      `/blocks/${blockId}/children?page_size=100&start_cursor=${encodeURIComponent(data.next_cursor)}`,
      { method: "GET" }
    )
    acc.push(...(nextData.results || []))
  }
  // Fetch children for blocks that have children (e.g., toggles)
  for (const b of blocks) {
    if (b.has_children) {
      const children = await getBlocksRecursive(b.id, [])
      ;(b as any).children = children
    }
  }
  return acc
}

export async function getPostBySlug(slug: string): Promise<{
  id: string
  slug: string
  title: string
  excerpt?: string
  date?: string
  tags?: string[]
  cover?: { url: string; alt?: string } | null
  blocks: any[]
} | null> {
  if (!NOTION_DATABASE_ID) throw new Error("NOTION_DATABASE_ID is not set.")

  // First try direct filter on 'Slug' if exists
  let page: NotionPage | null = null
  try {
    const filtered = await notionFetch(`/databases/${NOTION_DATABASE_ID}/query`, {
      method: "POST",
      body: JSON.stringify({
        filter: {
          property: "Slug",
          rich_text: { equals: slug },
        },
        page_size: 1,
      }),
    })
    if (filtered.results && filtered.results.length > 0) {
      page = filtered.results[0]
    }
  } catch {
    // ignore and fallback
  }

  if (!page) {
    // Fallback: fetch batch and find by computed slug
    const posts = await queryPosts()
    const match = posts.find((p) => p.slug === slug)
    if (!match) return null
    // Retrieve page by id to ensure properties are available
    const got = await notionFetch(`/pages/${match.id}`, { method: "GET" })
    page = got
  }

  if (!page || !isPublished(page)) return null

  const title = extractTitle(page)
  const post = {
    id: page.id,
    slug: extractSlug(page, title),
    title,
    excerpt: extractExcerpt(page),
    date: extractDate(page),
    tags: extractTags(page),
    cover: extractCover(page),
    blocks: await getBlocksRecursive(page.id),
  }
  return post
}

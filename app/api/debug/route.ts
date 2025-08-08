import { NextResponse } from "next/server"
import { queryPosts } from "@/lib/notion"

export async function GET() {
  try {
    const posts = await queryPosts()
    console.log("All posts:", posts.map(p => ({
      id: p.id,
      title: p.title
    })))
    
    return NextResponse.json({ 
      totalPosts: posts.length,
      posts: posts.map(p => ({
        id: p.id,
        title: p.title,
        url: `/posts/${p.id}`,
        oldSlug: p.slug
      }))
    })
  } catch (e: any) {
    console.error("Error fetching posts:", e)
    return NextResponse.json({ error: e?.message ?? "Failed to load posts" }, { status: 500 })
  }
}
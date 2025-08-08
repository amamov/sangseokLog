import { NextResponse } from "next/server"
import { queryPosts } from "@/lib/notion"

// GET /api/posts
export async function GET() {
  try {
    const posts = await queryPosts()
    return NextResponse.json({ posts })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to load posts" }, { status: 500 })
  }
}

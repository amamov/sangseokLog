import { NextResponse } from "next/server"
import { getPostBySlug } from "@/lib/notion"

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    const post = await getPostBySlug(params.slug)
    if (!post) {
      return NextResponse.json({ post: null }, { status: 404 })
    }
    return NextResponse.json({ post })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to load post" }, { status: 500 })
  }
}

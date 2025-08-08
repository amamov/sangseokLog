import { NextResponse } from "next/server"
import { getPostById } from "@/lib/notion"

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug: id } = await params
    const post = await getPostById(id)
    if (!post) {
      return NextResponse.json({ post: null }, { status: 404 })
    }
    return NextResponse.json({ post })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to load post" }, { status: 500 })
  }
}

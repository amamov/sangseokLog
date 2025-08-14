import { notFound } from "next/navigation";
import { BlogShell } from "@/components/blog-shell";
import { NotionRenderer } from "@/components/notion-renderer";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { getPostById } from "@/lib/notion";

export const revalidate = 60;

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: id } = await params;
  const post = await getPostById(id);
  if (!post) return notFound();

  return (
    <BlogShell>
      <main className="mx-auto w-full max-w-[600px] px-4">
        <div className="py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[color:var(--news-link)] hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            {"목록으로"}
          </Link>
        </div>

        <article className="pb-20">
          <header className="mb-6">
            <div className="mb-2 flex justify-between items-center">
              {post.tags && post.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="rounded-none border border-[color:var(--news-rule-soft)] bg-transparent text-[color:var(--ink-main)] text-[11px] tracking-wide uppercase px-2 py-0.5"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div></div> // Empty div to maintain flex behavior if no tags
              )}
              {post.notionPageUrl && (
                <Link
                  href={post.notionPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--news-link)] hover:underline text-xs sm:text-sm"
                >
                  Notion
                </Link>
              )}
            </div>
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[color:var(--ink-headline)] leading-tight`}
            >
              {post.title}
            </h1>
            {post.date ? (
              <p className="mt-2 text-[13px] uppercase tracking-wider text-[color:var(--ink-muted)]">
                {format(new Date(post.date), "yyyy.MM.dd")}
              </p>
            ) : null}
          </header>

          {post.cover?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover.url || "/placeholder.svg"}
              alt={post.cover.alt ?? post.title}
              className="mb-6 max-h-[360px] w-full object-cover grayscale-[40%] contrast-110"
              loading="lazy"
            />
          ) : null}

          {/* Two-column flow at medium widths for classic newspaper feel */}
          <div className="prose max-w-none text-[color:var(--ink-main)] prose-headings:text-[color:var(--ink-headline)]">
            <NotionRenderer blocks={post.blocks} />
          </div>
        </article>
      </main>
    </BlogShell>
  );
}

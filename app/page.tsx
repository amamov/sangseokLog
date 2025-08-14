import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogShell } from "@/components/blog-shell";
import { Pagination } from "@/components/pagination";
import { SortControl } from "@/components/sort-control";
import { PostLink } from "@/components/post-link";
import { format } from "date-fns";
import { notoSerif } from "@/app/fonts";
import { queryPosts, type PostSummary } from "@/lib/notion";

export const revalidate = 60;
const PER_PAGE = 5;

function formatDateline() {
  const now = new Date();
  return `South Korea — ${format(now, "yyyy.MM.dd")} — Morning Edition — Price 50¢`;
}

type SortOrder = "desc" | "asc";

function sortPosts(posts: PostSummary[], order: SortOrder) {
  const arr = [...posts];
  if (order === "desc") {
    // 최신순: 큰 날짜 먼저. 날짜 없는 글은 끝으로.
    return arr.sort((a, b) => {
      const at = a.date ? new Date(a.date).getTime() : Number.NEGATIVE_INFINITY;
      const bt = b.date ? new Date(b.date).getTime() : Number.NEGATIVE_INFINITY;
      return bt - at;
    });
  }
  // 오래된순
  return arr.sort((a, b) => {
    const at = a.date ? new Date(a.date).getTime() : Number.POSITIVE_INFINITY;
    const bt = b.date ? new Date(b.date).getTime() : Number.POSITIVE_INFINITY;
    return at - bt;
  });
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const all = await queryPosts();

  const sortParam = (params?.sort === "asc" ? "asc" : "desc") as SortOrder;
  const sorted = sortPosts(all, sortParam);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const currentPage = Math.min(
    totalPages,
    Math.max(1, Number(params?.page ?? "1") || 1)
  );
  const start = (currentPage - 1) * PER_PAGE;
  const pagePosts = sorted.slice(start, start + PER_PAGE);
  return (
    <BlogShell>
      <main className="mx-auto w-full max-w-[600px] px-4">
        {/* Dateline */}
        <div className="mt-6 text-center">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[color:var(--ink-muted)]">
            {formatDateline()}
          </p>
        </div>

        {/* Masthead */}
        <header className="py-8 text-center">
          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[color:var(--ink-headline)] ${notoSerif.className}`}
          >
            {"SANGSEOK LOG"}
          </h1>
          {/* Ornamented rule */}
          <div
            className="mx-auto mt-3 flex items-center justify-center gap-2"
            aria-hidden="true"
          >
            <span className="inline-block h-[2px] w-20 bg-[color:var(--news-rule)]" />
            <span
              className="text-xs text-[color:var(--ink-muted)]"
              style={{ fontVariantCaps: "small-caps" }}
            >
              {"Established 2020"}
            </span>
            <span className="inline-block h-[2px] w-20 bg-[color:var(--news-rule)]" />
          </div>
          <p className="mt-3 text-[15px] sm:text-base text-[color:var(--ink-muted)]">
            {"그냥 기록. 인생은 가까이서 보면 비극이지만 멀리서 보면 희극."}
          </p>
        </header>

        {/* Sort control (no label) */}
        <div className="mb-3 flex justify-end">
          <SortControl current={sortParam} />
        </div>

        <section className="space-y-5 pb-10">
          {pagePosts.map((post) => {
            const kicker =
              post.tags && post.tags.length
                ? post.tags.join(" • ").toUpperCase()
                : undefined;

            return (
              <article key={post.id} className="group">
                <PostLink href={`/posts/${post.id}`} className="block">
                  <Card className="rounded-none border-2 border-[color:var(--news-rule-soft)] bg-[color:var(--paper)] shadow-none transition-colors group-hover:border-[color:var(--news-rule)]">
                    {post.cover?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.cover.url || "/placeholder.svg"}
                        alt={post.cover.alt ?? post.title}
                        className="h-44 w-full object-cover grayscale-[65%] contrast-110 group-hover:grayscale-0 transition-[filter]"
                        loading="lazy"
                      />
                    ) : null}

                    <CardHeader className="pb-2">
                      {kicker ? (
                        <p
                          className="mb-1 text-[11px] tracking-widest uppercase text-[color:var(--ink-muted)]"
                          style={{ fontVariantCaps: "all-small-caps" as any }}
                        >
                          {kicker}
                        </p>
                      ) : null}
                      <CardTitle
                        className={`text-lg sm:text-xl md:text-2xl font-bold leading-snug text-[color:var(--ink-headline)]`}
                      >
                        {post.title}
                      </CardTitle>
                      {post.date ? (
                        <p className="mt-1 text-[13px] uppercase tracking-wider text-[color:var(--ink-muted)]">
                          {format(new Date(post.date), "yyyy.MM.dd")}
                        </p>
                      ) : null}
                    </CardHeader>

                    <CardContent className="space-y-3 pb-4">
                      {post.excerpt ? (
                        <p className="text-[15px] leading-relaxed">
                          {post.excerpt}
                        </p>
                      ) : null}

                      {post.tags && post.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              className="rounded-none border border-[color:var(--news-rule-soft)] bg-transparent text-[11px] tracking-wide uppercase text-[color:var(--ink-main)] px-2 py-0.5"
                              variant="outline"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                </PostLink>
              </article>
            );
          })}
        </section>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          sort={sortParam}
        />
      </main>
    </BlogShell>
  );
}

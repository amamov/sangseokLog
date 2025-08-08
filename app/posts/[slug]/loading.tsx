export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="relative mx-auto h-12 w-12">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-[color:var(--news-rule-soft)] border-t-[color:var(--news-rule)]"></div>
        </div>
        <p className="text-sm text-[color:var(--ink-muted)] animate-pulse">
          포스트를 불러오는 중...
        </p>
      </div>
    </div>
  )
}
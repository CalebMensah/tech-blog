import { prisma } from '@/lib/db/prisma'

export default async function AdminDashboard() {
  const [articleCount, reviewCount, comparisonCount, draftCount] = await Promise.all([
    prisma.article.count(),
    prisma.review.count(),
    prisma.comparison.count(),
    prisma.article.count({ where: { status: 'DRAFT' } }),
  ])

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="mt-6 grid grid-cols-4 gap-4">
        <StatCard label="Articles" value={articleCount} />
        <StatCard label="Reviews" value={reviewCount} />
        <StatCard label="Comparisons" value={comparisonCount} />
        <StatCard label="Drafts" value={draftCount} />
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-neutral-200 p-4">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-sm text-neutral-500">{label}</div>
    </div>
  )
}
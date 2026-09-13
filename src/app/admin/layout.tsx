import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { LogoutButton } from '@/components/admin/logout-button'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-neutral-200 bg-neutral-50 p-4">
        <div className="mb-6 px-2 text-sm font-semibold">Admin</div>
        <nav className="space-y-1 text-sm">
          <Link href="/admin" className="block rounded-md px-2 py-1.5 hover:bg-neutral-200">
            Dashboard
          </Link>
          <Link href="/admin/articles" className="block rounded-md px-2 py-1.5 hover:bg-neutral-200">
            Articles
          </Link>
          <Link href="/admin/reviews" className="block rounded-md px-2 py-1.5 hover:bg-neutral-200">
            Reviews
          </Link>
          <Link href="/admin/comparisons" className="block rounded-md px-2 py-1.5 hover:bg-neutral-200">
            Comparisons
          </Link>
          <Link href="/admin/categories" className="block rounded-md px-2 py-1.5 hover:bg-neutral-200">
            Categories
          </Link>
          <Link href="/admin/tags" className="block rounded-md px-2 py-1.5 hover:bg-neutral-200">
            Tags
          </Link>
          <Link href="/admin/authors" className="block rounded-md px-2 py-1.5 hover:bg-neutral-200">
            Authors
          </Link>
          <Link href="/admin/media" className="block rounded-md px-2 py-1.5 hover:bg-neutral-200">
            Media
          </Link>
        </nav>
        <div className="mt-6 border-t border-neutral-200 pt-4">
          <div className="px-2 text-xs text-neutral-500">{user.email}</div>
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
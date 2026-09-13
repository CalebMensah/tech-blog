'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="mt-2 w-full rounded-md px-2 py-1.5 text-left text-sm text-neutral-600 hover:bg-neutral-200"
    >
      Sign out
    </button>
  )
}
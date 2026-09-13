import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db/prisma'
type UserRole = string

export class AuthError extends Error {}

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { author: true },
  })

  return dbUser
}

// performs a mutation. Throws if the user isn't logged in or lacks role.
export async function requireRole(allowedRoles: UserRole[]) {
  const user = await getCurrentUser()

  if (!user) {
    throw new AuthError('Not authenticated')
  }

  if (!allowedRoles.includes(user.role)) {
    throw new AuthError('Insufficient permissions')
  }

  return user
}
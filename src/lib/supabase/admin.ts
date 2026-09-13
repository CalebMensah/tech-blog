import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// This file must never be imported from a Client Component.
// The service role key bypasses Row Level Security entirely.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
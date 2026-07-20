import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // During build/prerender, env vars may not be available — skip gracefully
  if (process.env.NODE_ENV === 'production') {
    console.warn('Supabase env vars missing. Skipping client creation.')
  }
}

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    supabaseUrl ?? 'https://placeholder.supabase.co',
    supabaseAnonKey ?? 'placeholder-key',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Can be ignored if handled by middleware refreshing user sessions.
          }
        },
      },
    }
  )
}

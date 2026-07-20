import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if logged in
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    // Bypass admin login route itself to prevent infinite loop
    if (pathname === '/admin/login') {
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        
        if (profile?.role === 'admin') {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
      }
      return supabaseResponse
    }

    // Redirect to login if not logged in
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Verify admin role in profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      // Redirect customers back to home page
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}

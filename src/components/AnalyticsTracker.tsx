'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    // Avoid logging analytics in admin pages
    if (pathname.startsWith('/admin')) return

    const trackPageView = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventType: 'page_view',
            pagePath: pathname,
            userId: session?.user?.id || null,
          }),
        })
      } catch (err) {
        // Silent error
      }
    }

    trackPageView()
  }, [pathname, supabase])

  return null
}

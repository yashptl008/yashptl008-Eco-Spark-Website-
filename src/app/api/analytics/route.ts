import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
  
  // Rate limit: Max 120 analytics actions per minute per IP
  if (!rateLimit(ip, 120)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const body = await request.json()
    const { eventType, productId, pagePath, userId } = body

    if (!['page_view', 'product_view', 'whatsapp_click'].includes(eventType)) {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.from('analytics_events').insert({
      event_type: eventType,
      product_id: productId || null,
      page_path: pagePath || null,
      user_id: userId || null,
    })

    if (error) {
      console.error('Analytics DB Error:', error.message)
      return NextResponse.json({ error: 'Analytics logging failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

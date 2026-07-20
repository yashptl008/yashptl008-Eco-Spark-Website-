import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'
import { z } from 'zod'

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  message: z.string().min(5, 'Message must be at least 5 characters'),
  sourcePage: z.string().optional(),
  honeypot: z.string().optional(), // Honeypot field for bot protection
})

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'

  // Rate Limiting: Max 5 lead submissions per minute per IP
  if (!rateLimit(ip, 5)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  try {
    const json = await request.json()
    const validatedData = leadSchema.safeParse(json)

    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.issues.map(e => e.message).join(', ') },
        { status: 400 }
      )
    }

    const { name, email, phone, message, sourcePage, honeypot } = validatedData.data

    // If honeypot field is filled, it is a bot. Silently return success to avoid bot warnings.
    if (honeypot && honeypot.trim() !== '') {
      console.warn('Bot submission caught via honeypot:', { name, email })
      return NextResponse.json({ success: true, message: 'Message sent successfully' })
    }

    const supabase = await createClient()
    const { error } = await supabase.from('leads').insert({
      name,
      email,
      phone,
      message,
      source_page: sourcePage || 'contact',
    })

    if (error) {
      console.error('Lead Database Insert Error:', error.message)
      return NextResponse.json({ error: 'Failed to process inquiry' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully' })
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

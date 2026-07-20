import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Admin checking helper
async function isAdmin(supabase: any): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return profile?.role === 'admin'
}

const productCreateSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(2, 'Slug is required'),
  category: z.string().min(1, 'Category is required'),
  short_description: z.string().optional(),
  full_description: z.string().optional(),
  specs: z.array(
    z.object({
      label: z.string().min(1, 'Label is required'),
      value: z.string().min(1, 'Value is required'),
    })
  ).default([]),
  features: z.array(z.string()).default([]),
  applications: z.array(z.string()).default([]),
  warranty: z.string().optional(),
  images: z.array(z.string()).default([]),
  brochure_url: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  status: z.enum(['active', 'draft']).default('draft'),
})

export async function POST(request: Request) {
  const supabase = await createClient()

  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const json = await request.json()
    const validated = productCreateSchema.safeParse(json)

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues.map(e => e.message).join(', ') },
        { status: 400 }
      )
    }

    const { data: { user } } = await supabase.auth.getUser()

    const { error, data } = await supabase
      .from('products')
      .insert({
        ...validated.data,
        created_by: user?.id,
      })
      .select('id')
      .single()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json({ error: 'Product slug is already in use.' }, { status: 400 })
      }
      throw error
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

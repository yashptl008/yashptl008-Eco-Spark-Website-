import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Verify that user is an admin
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

const productUpdateSchema = z.object({
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error

    return NextResponse.json({ success: true, message: 'Product deleted' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { status, featured } = body

    const updateFields: any = {}
    if (status !== undefined) {
      if (!['active', 'draft'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      }
      updateFields.status = status
    }
    if (featured !== undefined) {
      updateFields.featured = featured
    }

    updateFields.updated_at = new Date().toISOString()

    const { error } = await supabase
      .from('products')
      .update(updateFields)
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true, message: 'Product updated' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const json = await request.json()
    const validated = productUpdateSchema.safeParse(json)

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues.map(e => e.message).join(', ') },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('products')
      .update({
        ...validated.data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Product slug is already in use.' }, { status: 400 })
      }
      throw error
    }

    return NextResponse.json({ success: true, message: 'Product updated successfully' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

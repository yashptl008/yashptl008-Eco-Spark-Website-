import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductForm from '@/components/ProductForm'

export const revalidate = 0 // Disable cache for edit page

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  let product: any = null

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (data) {
      product = data
      // Ensure specs is parsed properly
      product.specs = Array.isArray(data.specs) ? data.specs : []
    }
  } catch (err) {
    console.error('Error loading product details for edit page:', err)
  }

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-poppins text-3xl font-bold text-dark">
          Edit Product: {product.name}
        </h1>
        <p className="text-dark/70 text-sm mt-1">
          Modify the catalog specifications, images, features, and active status.
        </p>
      </div>

      <ProductForm initialData={product} />
    </div>
  )
}

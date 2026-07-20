import { createClient } from '@/lib/supabase/server'
import AdminProductsList from '@/components/AdminProductsList'

export const revalidate = 0 // Disable cache for Admin products page

export default async function AdminProductsPage() {
  let products: any[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('id, name, category, status, featured, created_at')
      .order('created_at', { ascending: false })

    if (data) {
      products = data
    }
  } catch (err) {
    console.error('Error fetching admin products:', err)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-poppins text-3xl font-bold text-dark">
          Manage Catalog Products
        </h1>
        <p className="text-dark/70 text-sm mt-1">
          Add, edit, delete, or toggle draft visibility of products in your active catalog database.
        </p>
      </div>

      <AdminProductsList initialProducts={products} />
    </div>
  )
}

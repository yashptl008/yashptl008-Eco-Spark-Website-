import { createClient } from '@/lib/supabase/server'
import ProductCatalogClient, { type CatalogProduct } from '@/components/ProductCatalogClient'

export const revalidate = 0 // Disable cache for products catalog

export default async function ProductsPage() {
  let products: CatalogProduct[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('id, name, slug, category, short_description, images, featured')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (data) {
      products = data
    }
  } catch (err) {
    console.error('Error fetching product catalog:', err)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-primary/20">
          Product Catalog
        </span>
        <h1 className="font-poppins text-4xl sm:text-5xl font-bold text-dark tracking-tight">
          Smart Energy Storage Solutions
        </h1>
        <p className="text-dark/70 text-sm sm:text-base leading-relaxed">
          Discover our range of Grade-A LiFePO4 batteries, modular battery energy storage cabinets, solar backup systems, and customized industrial packs tailored for Gujarat's industrial operations.
        </p>
      </div>

      {/* Catalog Grid (Interactive) */}
      <ProductCatalogClient initialProducts={products} />
    </div>
  )
}

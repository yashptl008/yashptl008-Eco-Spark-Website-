import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Battery } from 'lucide-react'
import ProductDetailClient from '@/components/ProductDetailClient'

export const revalidate = 0 // Disable cache for product detail

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params
  
  let product: any = null
  let relatedProducts: any[] = []

  const supabase = await createClient()

  // 1. Fetch current product
  try {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .single()

    if (data) {
      product = data
      // Ensure specs is parsed
      product.specs = Array.isArray(data.specs) ? data.specs : []
    }
  } catch (err) {
    console.error('Error fetching product detail:', err)
  }

  if (!product) {
    notFound()
  }

  // 2. Fetch related products (same category, excluding current, active only, limit 3)
  try {
    const { data } = await supabase
      .from('products')
      .select('id, name, slug, category, short_description, images')
      .eq('category', product.category)
      .eq('status', 'active')
      .neq('id', product.id)
      .limit(3)

    if (data) {
      relatedProducts = data
    }
  } catch (err) {
    console.error('Error fetching related products:', err)
  }

  // 3. Environment configuration
  const whatsappNumber = process.env.WHATSAPP_NUMBER_1 || '+919924878518'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Back button */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center space-x-2 text-sm font-semibold text-dark/60 hover:text-primary transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Main Detail Client Component */}
      <ProductDetailClient
        product={product}
        whatsappNumber={whatsappNumber}
        siteUrl={siteUrl}
      />

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-dark/10 pt-16 space-y-8">
          <h2 className="font-poppins text-2xl font-bold text-dark tracking-tight">
            Related Solutions
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((rel) => {
              const imageToShow = rel.images?.[0] || '/images/battery-placeholder.jpg'
              return (
                <div
                  key={rel.id}
                  className="bg-white rounded-2xl border border-dark/5 p-6 hover:shadow-lg hover:border-primary/20 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Related Image */}
                    <div className="relative aspect-video bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl overflow-hidden flex items-center justify-center p-4">
                      {rel.images?.length > 0 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageToShow} alt={rel.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Battery className="h-8 w-8 text-primary/30" />
                      )}
                    </div>
                    
                    <span className="inline-block bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border border-primary/10">
                      {rel.category}
                    </span>
                    <h3 className="font-poppins text-base font-bold text-dark leading-snug line-clamp-1">
                      {rel.name}
                    </h3>
                    <p className="text-dark/70 text-xs line-clamp-2 leading-relaxed">
                      {rel.short_description}
                    </p>
                  </div>
                  
                  <div className="pt-6 border-t border-dark/5 mt-6">
                    <Link
                      href={`/products/${rel.slug}`}
                      className="text-xs font-bold text-primary hover:text-secondary transition-all"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

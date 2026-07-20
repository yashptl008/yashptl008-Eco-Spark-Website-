'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, Battery, Info } from 'lucide-react'

export interface CatalogProduct {
  id: string
  slug: string
  name: string
  category: string
  short_description: string
  images: string[]
  featured: boolean
}

interface ProductCatalogClientProps {
  initialProducts: CatalogProduct[]
}

const CATEGORIES = [
  'All',
  'LiFePO4 Batteries',
  'BESS',
  'Solar Battery Solutions',
  'Industrial Batteries',
  'Telecom Batteries',
  'UPS Batteries',
  'EV Charging Solutions',
  'Battery Monitoring Systems',
]

export default function ProductCatalogClient({ initialProducts }: ProductCatalogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.short_description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesCategory && matchesSearch
    })
  }, [initialProducts, selectedCategory, searchQuery])

  return (
    <div className="space-y-12">
      {/* Search & Category Filter Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products by name or feature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-dark/10 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm bg-white shadow-sm"
            />
          </div>
          
          <div className="flex items-center space-x-2 text-xs font-bold text-dark/50 uppercase tracking-wider">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filter Results</span>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none flex space-x-2">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase shrink-0 transition-all border ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-dark/70 border-dark/10 hover:border-dark/20'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Products Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => {
            const imageToShow = product.images?.[0] || '/images/battery-placeholder.jpg'
            
            return (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl overflow-hidden border border-dark/5 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image wrapper */}
                  <div className="relative aspect-video bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-6 border-b border-dark/5">
                    {product.images?.length > 0 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageToShow}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg shadow-sm"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-primary/40 space-y-2">
                        <Battery className="h-10 w-10 animate-pulse" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Eco Spark Battery</span>
                      </div>
                    )}
                    {product.featured && (
                      <span className="absolute top-3 right-3 bg-secondary text-dark text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Body details */}
                  <div className="p-6 space-y-3">
                    <span className="inline-block bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border border-primary/10">
                      {product.category}
                    </span>
                    <h3 className="font-poppins text-lg font-bold text-dark leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-dark/70 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {product.short_description}
                    </p>
                  </div>
                </div>

                {/* Footer action button */}
                <div className="px-6 pb-6 pt-3 border-t border-dark/5 flex items-center justify-between">
                  <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary hover:text-secondary transition-all"
                  >
                    <span>View Specifications</span>
                    <Info className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-primary/5 rounded-3xl border border-primary/10 p-12 max-w-xl mx-auto space-y-4">
          <Battery className="h-12 w-12 text-primary/40 mx-auto" />
          <h3 className="font-poppins text-xl font-bold text-dark">No Products Found</h3>
          <p className="text-dark/75 text-sm">
            We couldn't find any products matching your filters or search query. Try clearing your search or selecting a different category.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All')
              setSearchQuery('')
            }}
            className="inline-flex items-center space-x-2 bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary/95 transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowRightCircle } from 'lucide-react'

export interface Product {
  id: string
  slug: string
  name: string
  category: string
  short_description: string
  images: string[]
  specs: { label: string; value: string }[]
}

interface FeaturedCarouselProps {
  products: Product[]
}

export default function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!products || products.length === 0) {
    // Elegant placeholder state
    return (
      <div className="bg-primary/5 rounded-2xl border border-primary/10 p-12 text-center max-w-3xl mx-auto">
        <h3 className="font-poppins text-xl font-bold text-primary mb-2">Sustainable Energy Solutions</h3>
        <p className="text-dark/70 text-sm">
          Eco Spark specializes in high-performance lithium energy storage systems. Browse our catalog to explore our range.
        </p>
        <Link href="/products" className="mt-6 inline-flex items-center space-x-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/95 transition-all">
          <span>View Catalog</span>
          <ArrowRightCircle className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length)
  }

  const currentProduct = products[currentIndex]
  const imageToShow = currentProduct.images?.[0] || '/images/battery-placeholder.jpg'

  return (
    <div className="relative max-w-6xl mx-auto bg-white rounded-3xl overflow-hidden border border-dark/5 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[450px]">
        {/* Visual Content Column */}
        <div className="relative bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 p-8 flex items-center justify-center min-h-[300px] md:min-h-[auto]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="relative w-full max-w-[320px] aspect-square rounded-2xl overflow-hidden shadow-lg border border-white"
            >
              {/* Fallback pattern if no image */}
              {currentProduct.images?.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageToShow}
                  alt={currentProduct.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-primary to-secondary flex flex-col items-center justify-center p-6 text-white text-center">
                  <span className="font-poppins text-lg font-bold uppercase tracking-wider">{currentProduct.category}</span>
                  <span className="text-xs opacity-80 mt-1">High Performance LiFePO4</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent pointer-events-none" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Text Details Column */}
        <div className="p-8 md:p-12 flex flex-col justify-between relative bg-white">
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProduct.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <span className="inline-block bg-secondary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-secondary/20">
                  {currentProduct.category}
                </span>
                <h3 className="font-poppins text-2xl md:text-3xl font-bold text-dark leading-tight">
                  {currentProduct.name}
                </h3>
                <p className="text-dark/80 text-sm md:text-base leading-relaxed">
                  {currentProduct.short_description}
                </p>

                {/* Short specs list */}
                {currentProduct.specs && currentProduct.specs.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-dark/40 uppercase tracking-widest mb-2">Key Specs</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {currentProduct.specs.slice(0, 4).map((spec, i) => (
                        <div key={i} className="bg-dark/5 p-2.5 rounded-lg border border-dark/5">
                          <span className="block text-[10px] text-dark/60 font-medium uppercase">{spec.label}</span>
                          <span className="block text-sm text-primary font-bold">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action Row */}
          <div className="mt-8 pt-6 border-t border-dark/5 flex items-center justify-between">
            <Link
              href={`/products/${currentProduct.slug}`}
              className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/95 text-white px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide shadow-sm transition-all"
            >
              <span>Explore Specs</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Slider arrows */}
            {products.length > 1 && (
              <div className="flex space-x-2">
                <button
                  onClick={handlePrev}
                  aria-label="Previous featured product"
                  className="p-2 border border-dark/10 rounded-full hover:bg-dark/5 hover:border-dark/20 text-dark/70 hover:text-dark transition-all focus:outline-none"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next featured product"
                  className="p-2 border border-dark/10 rounded-full hover:bg-dark/5 hover:border-dark/20 text-dark/70 hover:text-dark transition-all focus:outline-none"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

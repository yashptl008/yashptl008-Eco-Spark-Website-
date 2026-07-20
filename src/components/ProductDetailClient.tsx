'use client'

import { useState } from 'react'
import { FileText, Shield, Sparkles, MessageCircle, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface SpecItem {
  label: string
  value: string
}

interface Product {
  id: string
  slug: string
  name: string
  category: string
  short_description: string
  full_description: string
  specs: SpecItem[]
  features: string[]
  applications: string[]
  warranty: string
  images: string[]
  brochure_url: string
}

interface ProductDetailClientProps {
  product: Product
  whatsappNumber: string
  siteUrl: string
}

export default function ProductDetailClient({ product, whatsappNumber, siteUrl }: ProductDetailClientProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [hoveredImage, setHoveredImage] = useState(false)
  const [zoomCoords, setZoomCoords] = useState({ x: 0, y: 0 })

  const mainImage = product.images?.[activeImageIndex] || '/images/battery-placeholder.jpg'

  // Build WhatsApp pre-filled text
  const handleWhatsAppOrder = () => {
    const topSpec = product.specs?.[0] ? `${product.specs[0].label}: ${product.specs[0].value}` : 'High performance capacity'
    const productLink = `${siteUrl}/products/${product.slug}`
    
    const message = `Hello Eco Spark Green Energy 👋

I'm interested in the following product from your website:

🔋 Product: ${product.name}
📂 Category: ${product.category}
⚙️ Key Spec: ${topSpec}
🔗 Product Link: ${productLink}

Could you please share more details, pricing, and availability?

Thank you!`

    const encodedText = encodeURIComponent(message)
    const waUrl = `https://wa.me/${whatsappNumber.replace(/[\s+]/g, '')}?text=${encodedText}`

    // Fire analytics event (fire-and-forget, do not block)
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'whatsapp_click',
        productId: product.id,
        pagePath: `/products/${product.slug}`,
      }),
    }).catch(() => {})

    // Open WhatsApp in a new tab
    window.open(waUrl, '_blank', 'noopener,noreferrer')
  }

  // Handle image mouse move for zoom effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setZoomCoords({ x, y })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Visual / Image Gallery Column (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        {/* Main Zoomable Image Card */}
        <div
          className="relative bg-gradient-to-br from-primary/5 to-secondary/5 border border-dark/5 rounded-2xl overflow-hidden aspect-square flex items-center justify-center p-6 cursor-zoom-in group shadow-sm"
          onMouseEnter={() => setHoveredImage(true)}
          onMouseLeave={() => setHoveredImage(false)}
          onMouseMove={handleMouseMove}
        >
          {product.images?.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mainImage}
              alt={product.name}
              style={
                hoveredImage
                  ? {
                      transform: 'scale(1.8)',
                      transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                    }
                  : undefined
              }
              className="w-full h-full object-contain rounded-lg transition-transform duration-100 ease-out"
            />
          ) : (
            <div className="text-center text-primary/40 font-poppins text-lg font-bold">
              ECO SPARK BATTERY
            </div>
          )}
          
          <div className="absolute bottom-4 left-4 bg-dark/60 text-white/90 text-[10px] font-medium px-2 py-1 rounded backdrop-blur-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            Hover to zoom
          </div>
        </div>

        {/* Gallery Thumbnails */}
        {product.images && product.images.length > 1 && (
          <div className="flex space-x-3 overflow-x-auto py-1">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIndex(i)}
                className={`w-20 h-20 bg-dark/5 border rounded-lg overflow-hidden shrink-0 transition-all ${
                  activeImageIndex === i ? 'border-primary ring-2 ring-primary/20' : 'border-dark/10 hover:border-dark/20'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`${product.name} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Details & Specifications Column (7 cols) */}
      <div className="lg:col-span-7 space-y-8">
        {/* Title details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-primary/20">
              {product.category}
            </span>
            {product.warranty && (
              <span className="flex items-center space-x-1.5 text-xs text-secondary font-bold">
                <Shield className="h-4 w-4" />
                <span>{product.warranty} Warranty</span>
              </span>
            )}
          </div>
          <h1 className="font-poppins text-3xl sm:text-4xl font-bold text-dark tracking-tight">
            {product.name}
          </h1>
          <p className="text-dark/80 text-sm sm:text-base leading-relaxed">
            {product.full_description}
          </p>
        </div>

        {/* Specs Table */}
        {product.specs && product.specs.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-poppins text-lg font-bold text-dark flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Technical Specifications</span>
            </h3>
            <div className="border border-dark/10 rounded-xl overflow-hidden bg-white shadow-sm">
              <table className="w-full text-sm border-collapse text-left">
                <tbody>
                  {product.specs.map((spec, i) => (
                    <tr
                      key={i}
                      className="border-b border-dark/5 last:border-b-0 hover:bg-dark/5 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-semibold text-dark/70 bg-dark/5 w-1/3 border-r border-dark/5">
                        {spec.label}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-primary">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Features & Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* Key Features */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-poppins text-sm font-bold uppercase tracking-wider text-dark/85">Key Features</h4>
              <ul className="space-y-2">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start space-x-2.5 text-xs sm:text-sm text-dark/85">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Applications */}
          {product.applications && product.applications.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-poppins text-sm font-bold uppercase tracking-wider text-dark/85">Applications</h4>
              <ul className="space-y-2">
                {product.applications.map((app, i) => (
                  <li key={i} className="flex items-start space-x-2.5 text-xs sm:text-sm text-dark/85">
                    <CheckCircle className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-dark/5">
          {/* WhatsApp Direct Inquiry CTA */}
          <button
            onClick={handleWhatsAppOrder}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-secondary hover:bg-secondary/95 text-dark px-8 py-4 rounded-xl text-base font-bold tracking-wide shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Order via WhatsApp</span>
          </button>

          {/* Brochure PDF Link */}
          {product.brochure_url && (
            <a
              href={product.brochure_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-dark/5 hover:bg-dark/10 border border-dark/10 text-dark/80 hover:text-dark px-6 py-4 rounded-xl text-sm font-semibold transition-all"
            >
              <FileText className="h-4 w-4" />
              <span>Download Brochure PDF</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

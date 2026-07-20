'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, PlusCircle, Pencil, Trash2, ShieldCheck, Power, Star } from 'lucide-react'

interface ProductItem {
  id: string
  name: string
  category: string
  status: 'active' | 'draft'
  featured: boolean
  created_at: string
}

interface AdminProductsListProps {
  initialProducts: ProductItem[]
}

export default function AdminProductsList({ initialProducts }: AdminProductsListProps) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deletingName, setDeletingName] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  // Filter products by query
  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [products, searchQuery])

  // Toggle status
  const handleToggleStatus = async (id: string, currentStatus: 'active' | 'draft') => {
    const nextStatus = currentStatus === 'active' ? 'draft' : 'active'
    setActionLoading(`${id}-status`)
    setErrorMsg('')

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to update status')
      }

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p))
      )
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  // Toggle featured status
  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    const nextFeatured = !currentFeatured
    setActionLoading(`${id}-featured`)
    setErrorMsg('')

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: nextFeatured }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to update featured status')
      }

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured: nextFeatured } : p))
      )
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  // Delete product
  const handleDeleteProduct = async () => {
    if (!deletingId) return
    setActionLoading('delete')
    setErrorMsg('')

    try {
      const res = await fetch(`/api/admin/products/${deletingId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to delete product')
      }

      setProducts((prev) => prev.filter((p) => p.id !== deletingId))
      setDeletingId(null)
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40 h-4.5 w-4.5" />
          <input
            type="text"
            placeholder="Search catalog products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-dark/10 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm bg-white"
          />
        </div>

        {/* Add Product button */}
        <Link
          href="/admin/products/new"
          className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/95 text-white px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all shadow-sm shrink-0 w-full sm:w-auto justify-center"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          <span>Add Product</span>
        </Link>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs text-center font-medium">
          {errorMsg}
        </div>
      )}

      {/* Table grid layout */}
      <div className="bg-white border border-dark/5 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-dark/5 border-b border-dark/5 text-dark/60 font-bold uppercase tracking-wider text-[10px]">
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Featured</th>
                <th className="px-6 py-4 text-center">Added On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark/5">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-dark/5 transition-colors">
                  {/* Name */}
                  <td className="px-6 py-4 font-semibold text-dark">
                    {p.name}
                  </td>
                  
                  {/* Category */}
                  <td className="px-6 py-4 text-dark/70 text-xs">
                    {p.category}
                  </td>

                  {/* Status Toggle */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(p.id, p.status)}
                      disabled={actionLoading === `${p.id}-status`}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                        p.status === 'active'
                          ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                          : 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100'
                      }`}
                    >
                      <Power className="h-3 w-3" />
                      <span>{p.status}</span>
                    </button>
                  </td>

                  {/* Featured Toggle */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleFeatured(p.id, p.featured)}
                      disabled={actionLoading === `${p.id}-featured`}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                        p.featured
                          ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                          : 'bg-dark/5 border-dark/10 text-dark/50 hover:bg-dark/10'
                      }`}
                    >
                      <Star className="h-3 w-3 fill-current" />
                      <span>{p.featured ? 'Featured' : 'Standard'}</span>
                    </button>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-center text-xs text-dark/50">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right space-x-2 shrink-0">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="inline-flex p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 rounded-lg transition-all"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => {
                        setDeletingId(p.id)
                        setDeletingName(p.name)
                      }}
                      className="inline-flex p-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg transition-all focus:outline-none"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-xs text-dark/40">
                    No products matching filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-dark/5 p-8 rounded-2xl max-w-sm w-full space-y-6 shadow-2xl">
            <div className="text-center space-y-3">
              <div className="mx-auto bg-red-50 text-red-600 w-12 h-12 rounded-full flex items-center justify-center border border-red-200">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="font-poppins text-lg font-bold text-dark">Confirm Deletion</h3>
              <p className="text-dark/70 text-xs sm:text-sm">
                Are you sure you want to permanently delete <strong>{deletingName}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setDeletingId(null)
                  setDeletingName('')
                }}
                disabled={actionLoading === 'delete'}
                className="flex-1 py-3 bg-dark/5 hover:bg-dark/10 border border-dark/10 rounded-xl text-xs sm:text-sm font-semibold text-dark/80"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={actionLoading === 'delete'}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md disabled:opacity-50"
              >
                {actionLoading === 'delete' ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

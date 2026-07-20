'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Upload, AlertCircle, FileText, CheckCircle } from 'lucide-react'

interface SpecItem {
  label: string
  value: string
}

interface ProductFormData {
  name: string
  slug: string
  category: string
  short_description: string
  full_description: string
  specs: SpecItem[]
  features: string[]
  applications: string[]
  warranty: string
  images: string[]
  brochure_url: string | null
  featured: boolean
  status: 'active' | 'draft'
}

interface ProductFormProps {
  initialData?: ProductFormData & { id?: string }
}

const CATEGORIES = [
  'LiFePO4 Batteries',
  'BESS',
  'Solar Battery Solutions',
  'Industrial Batteries',
  'Telecom Batteries',
  'UPS Batteries',
  'EV Charging Solutions',
  'Battery Monitoring Systems',
]

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const isEditing = !!initialData?.id

  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    category: initialData?.category || CATEGORIES[0],
    short_description: initialData?.short_description || '',
    full_description: initialData?.full_description || '',
    specs: initialData?.specs || [],
    features: initialData?.features || [],
    applications: initialData?.applications || [],
    warranty: initialData?.warranty || '',
    images: initialData?.images || [],
    brochure_url: initialData?.brochure_url || null,
    featured: initialData?.featured || false,
    status: initialData?.status || 'draft',
  })

  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingBrochure, setUploadingBrochure] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Generate slug based on Name if not editing
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nameValue = e.target.value
    setFormData((prev) => {
      const update: any = { name: nameValue }
      if (!isEditing) {
        // Auto slugify name
        update.slug = nameValue
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
      }
      return { ...prev, ...update }
    })
  }

  // Dynamic Specs Row mutations
  const addSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specs: [...prev.specs, { label: '', value: '' }],
    }))
  }

  const removeSpec = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }))
  }

  const handleSpecChange = (index: number, field: 'label' | 'value', value: string) => {
    setFormData((prev) => {
      const updatedSpecs = [...prev.specs]
      updatedSpecs[index] = { ...updatedSpecs[index], [field]: value }
      return { ...prev, specs: updatedSpecs }
    })
  }

  // Dynamic lists mutations (features & apps)
  const addListItem = (field: 'features' | 'applications') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }))
  }

  const removeListItem = (field: 'features' | 'applications', index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleListItemChange = (field: 'features' | 'applications', index: number, value: string) => {
    setFormData((prev) => {
      const updated = [...prev[field]]
      updated[index] = value
      return { ...prev, [field]: updated }
    })
  }

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingImage(true)
    setErrorMsg('')

    try {
      const uploadedUrls: string[] = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Validation: Limit to jpg, png, webp and max size 4MB
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          throw new Error('Images must be JPEG, PNG, or WebP format.')
        }
        if (file.size > 4 * 1024 * 1024) {
          throw new Error('Image size must be smaller than 4MB.')
        }

        const fileExt = file.name.split('.').pop()
        // Sanitize and create random filename
        const safeName = file.name.replace(/[^a-zA-Z0-9]/g, '')
        const fileName = `${safeName}-${Math.random().toString(36).substring(2, 8)}-${Date.now()}.${fileExt}`

        const { error: uploadErr } = await supabase.storage
          .from('product-images')
          .upload(fileName, file)

        if (uploadErr) throw uploadErr

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName)

        uploadedUrls.push(publicUrl)
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }))
    } catch (err: any) {
      setErrorMsg(err.message || 'Image upload failed')
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  // Brochure upload handler
  const handleBrochureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingBrochure(true)
    setErrorMsg('')

    try {
      const file = files[0]

      // Validation: Limit to PDF and max size 8MB
      if (file.type !== 'application/pdf') {
        throw new Error('Brochure must be in PDF format.')
      }
      if (file.size > 8 * 1024 * 1024) {
        throw new Error('Brochure size must be smaller than 8MB.')
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `brochure-${Math.random().toString(36).substring(2, 8)}-${Date.now()}.${fileExt}`

      const { error: uploadErr } = await supabase.storage
        .from('brochures')
        .upload(fileName, file)

      if (uploadErr) throw uploadErr

      const { data: { publicUrl } } = supabase.storage
        .from('brochures')
        .getPublicUrl(fileName)

      setFormData((prev) => ({
        ...prev,
        brochure_url: publicUrl,
      }))
    } catch (err: any) {
      setErrorMsg(err.message || 'Brochure upload failed')
    } finally {
      setUploadingBrochure(false)
    }
  }

  const removeBrochure = () => {
    setFormData((prev) => ({
      ...prev,
      brochure_url: null,
    }))
  }

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    // Double check inputs
    if (formData.name.trim() === '' || formData.slug.trim() === '') {
      setErrorMsg('Name and Slug are required.')
      setLoading(false)
      return
    }

    try {
      const apiUrl = isEditing ? `/api/admin/products/${initialData.id}` : '/api/admin/products'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(apiUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product.')
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      setErrorMsg(err.message || 'Saving product failed.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-4xl bg-white border border-dark/5 p-8 rounded-2xl shadow-sm">
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center space-x-3 text-sm">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Basic product identity info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Product Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={handleNameChange}
            placeholder="e.g. LiFePO4 Battery pack 48V 100Ah"
            className="w-full px-4 py-3 rounded-lg border border-dark/15 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Unique Slug (URL Path)</label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
            placeholder="e.g. lifepo4-battery-pack-48v-100ah"
            className="w-full px-4 py-3 rounded-lg border border-dark/15 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Category Selection</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-dark/15 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm bg-white"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Warranty (Warranty Text)</label>
          <input
            type="text"
            value={formData.warranty}
            onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
            placeholder="e.g. 5 Years replacement cover"
            className="w-full px-4 py-3 rounded-lg border border-dark/15 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm bg-white"
          />
        </div>
      </div>

      {/* Descriptions */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Short Description Tagline</label>
          <textarea
            rows={2}
            value={formData.short_description}
            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
            placeholder="Short tagline summary (displayed in grid catalog list views)..."
            className="w-full px-4 py-3 rounded-lg border border-dark/15 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm bg-white resize-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Detailed Specifications Text</label>
          <textarea
            rows={5}
            value={formData.full_description}
            onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
            placeholder="Complete overview details regarding safety layers, configurations, structure and parameters..."
            className="w-full px-4 py-3 rounded-lg border border-dark/15 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm bg-white resize-none"
          />
        </div>
      </div>

      {/* Media Upload (Images & Brochure) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-y border-dark/5 py-8">
        {/* Upload Images */}
        <div className="space-y-4">
          <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider">Product Images</label>
          <div className="flex items-center justify-center border-2 border-dashed border-dark/10 hover:border-primary/50 rounded-xl p-6 transition-colors bg-white relative">
            <input
              type="file"
              multiple
              accept="image/*"
              disabled={uploadingImage}
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="text-center space-y-2">
              <Upload className="h-6 w-6 text-dark/40 mx-auto" />
              <span className="block text-xs font-semibold text-dark/70">
                {uploadingImage ? 'Uploading Cells...' : 'Upload Product images'}
              </span>
              <span className="block text-[10px] text-dark/40">JPEG, PNG, WebP &middot; Max 4MB</span>
            </div>
          </div>

          {/* Images preview grid */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {formData.images.map((img, i) => (
                <div key={i} className="relative aspect-square border border-dark/5 rounded-lg overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="Product upload preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded p-1 hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Brochure */}
        <div className="space-y-4">
          <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider">Brochure PDF Document</label>
          {!formData.brochure_url ? (
            <div className="flex items-center justify-center border-2 border-dashed border-dark/10 hover:border-primary/50 rounded-xl p-6 transition-colors bg-white relative">
              <input
                type="file"
                accept="application/pdf"
                disabled={uploadingBrochure}
                onChange={handleBrochureUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="text-center space-y-2">
                <FileText className="h-6 w-6 text-dark/40 mx-auto" />
                <span className="block text-xs font-semibold text-dark/70">
                  {uploadingBrochure ? 'Uploading document...' : 'Upload brochure PDF'}
                </span>
                <span className="block text-[10px] text-dark/40">PDF format only &middot; Max 8MB</span>
              </div>
            </div>
          ) : (
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-primary font-semibold">
                <CheckCircle className="h-5 w-5" />
                <span>Brochure Uploaded successfully</span>
              </div>
              <button
                type="button"
                onClick={removeBrochure}
                className="text-red-500 hover:text-red-600 p-1 hover:bg-red-50 rounded"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Specs grid */}
      <div className="space-y-4 border-b border-dark/5 pb-8">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider">Technical Spec Table</label>
          <button
            type="button"
            onClick={addSpec}
            className="inline-flex items-center space-x-1 bg-dark/5 hover:bg-dark/10 px-3 py-1.5 rounded-lg text-xs font-semibold text-dark/80"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Row</span>
          </button>
        </div>

        {formData.specs.length > 0 ? (
          <div className="space-y-3">
            {formData.specs.map((spec, i) => (
              <div key={i} className="flex gap-4 items-center">
                <input
                  type="text"
                  required
                  placeholder="e.g. Nominal Voltage"
                  value={spec.label}
                  onChange={(e) => handleSpecChange(i, 'label', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-dark/15 text-xs bg-white focus:outline-none focus:border-primary"
                />
                <input
                  type="text"
                  required
                  placeholder="e.g. 51.2 V"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-dark/15 text-xs bg-white focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => removeSpec(i)}
                  className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-dark/10 rounded-xl text-xs text-dark/40">
            No specifications added yet. Add rows to define details like Voltage, Capacity, Cycle Life, etc.
          </div>
        )}
      </div>

      {/* Dynamic Key Features & Applications lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Features */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider">Key Features List</label>
            <button
              type="button"
              onClick={() => addListItem('features')}
              className="inline-flex items-center space-x-1 bg-dark/5 hover:bg-dark/10 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-dark/80"
            >
              <Plus className="h-3 w-3" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-2">
            {formData.features.map((feat, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  required
                  placeholder="e.g. Integrated Smart BMS safety"
                  value={feat}
                  onChange={(e) => handleListItemChange('features', i, e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-dark/15 text-xs bg-white focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => removeListItem('features', i)}
                  className="text-red-500 hover:text-red-600 p-1 rounded"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Applications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider">Applications List</label>
            <button
              type="button"
              onClick={() => addListItem('applications')}
              className="inline-flex items-center space-x-1 bg-dark/5 hover:bg-dark/10 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-dark/80"
            >
              <Plus className="h-3 w-3" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-2">
            {formData.applications.map((app, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  required
                  placeholder="e.g. Telecom infrastructure backup"
                  value={app}
                  onChange={(e) => handleListItemChange('applications', i, e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-dark/15 text-xs bg-white focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => removeListItem('applications', i)}
                  className="text-red-500 hover:text-red-600 p-1 rounded"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Control Toggles (Featured & Status) */}
      <div className="flex flex-wrap gap-8 border-t border-dark/5 pt-8">
        {/* Featured */}
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4.5 h-4.5 text-primary border-dark/20 rounded focus:ring-primary focus:ring-1"
          />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-dark">Featured Product</span>
            <span className="text-[10px] text-dark/50">Display in the home page carousel slider.</span>
          </div>
        </label>

        {/* Status */}
        <div className="flex items-center space-x-3">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-dark">Catalog Status</span>
            <span className="text-[10px] text-dark/50">Draft (hidden from public catalog) vs Active (published)</span>
          </div>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'draft' })}
            className="px-3 py-2 rounded-lg border border-dark/15 text-xs bg-white focus:outline-none"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-6 border-t border-dark/5">
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          disabled={loading}
          className="flex-1 py-3.5 bg-dark/5 hover:bg-dark/10 border border-dark/10 text-dark/80 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || uploadingImage || uploadingBrochure}
          className="flex-1 py-3.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-sm font-bold shadow-md transition-all disabled:opacity-50"
        >
          {loading ? 'Saving Data...' : isEditing ? 'Update Product' : 'Publish Product'}
        </button>
      </div>
    </form>
  )
}

import ProductForm from '@/components/ProductForm'

export default function NewProductPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-poppins text-3xl font-bold text-dark">
          Add New Product
        </h1>
        <p className="text-dark/70 text-sm mt-1">
          Create a new catalog item, upload cell photos, and enter specs rows.
        </p>
      </div>

      <ProductForm />
    </div>
  )
}

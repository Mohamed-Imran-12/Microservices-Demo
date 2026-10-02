import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { productApi } from '../../api/productApi'
import { getApiErrorMessage } from '../../lib/utils'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import toast from 'react-hot-toast'

export function AdminProductNewPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    imageUrl: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Product name is required'
    if (!form.category.trim()) errs.category = 'Category is required'
    if (!form.price) errs.price = 'Price is required'
    else if (isNaN(Number(form.price)) || Number(form.price) <= 0) errs.price = 'Price must be positive'
    if (!form.stock) errs.stock = 'Stock is required'
    else if (!Number.isInteger(Number(form.stock)) || Number(form.stock) <= 0) errs.stock = 'Stock must be a positive integer'
    if (!form.imageUrl.trim()) errs.imageUrl = 'Image URL is required'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    try {
      await productApi.createProduct({
        name: form.name.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        stock: Math.floor(Number(form.stock)),
        imageUrl: form.imageUrl.trim(),
      })
      toast.success('Product created successfully')
      navigate('/admin/products')
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(p => ({ ...p, [key]: e.target.value })),
    error: errors[key],
  })

  return (
    <div className="max-w-xl animate-fade-in">
      <Link to="/admin/products" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition-colors mb-6">
        <ArrowLeft size={15} /> Back to Products
      </Link>

      <h1 className="text-2xl font-bold text-slate-100 mb-6">New Product</h1>

      <div className="glass p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Product Name" placeholder="e.g. Running Shoes" {...field('name')} id="new-prod-name" />
          <Input label="Category" placeholder="e.g. Footwear" {...field('category')} id="new-prod-cat" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price (USD)" type="number" step="0.01" min="0.01" placeholder="0.00" {...field('price')} id="new-prod-price" />
            <Input label="Initial Stock" type="number" step="1" min="1" placeholder="0" {...field('stock')} id="new-prod-stock" />
          </div>
          <Input label="Image URL" type="url" placeholder="https://..." {...field('imageUrl')} id="new-prod-img" />

          {/* Image preview */}
          {form.imageUrl && (
            <div className="mt-2">
              <p className="text-xs text-slate-500 mb-1.5">Preview</p>
              <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/10">
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => navigate('/admin/products')}>Cancel</Button>
            <Button type="submit" loading={loading}>Create Product</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

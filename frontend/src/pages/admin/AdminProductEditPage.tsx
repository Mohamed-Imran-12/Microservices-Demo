import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { productApi } from '../../api/productApi'
import { getApiErrorMessage } from '../../lib/utils'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { ErrorState } from '../../components/ui/EmptyState'
import toast from 'react-hot-toast'

export function AdminProductEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', category: '', price: '', imageUrl: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      setLoading(true)
      setFetchError(null)
      try {
        const res = await productApi.getProduct(Number(id))
        const p = res.data
        setForm({
          name: p.name,
          category: p.category,
          price: String(p.price),
          imageUrl: p.imageUrl,
        })
      } catch (err) {
        setFetchError(getApiErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Product name is required'
    if (!form.category.trim()) errs.category = 'Category is required'
    if (!form.price) errs.price = 'Price is required'
    else if (isNaN(Number(form.price)) || Number(form.price) <= 0) errs.price = 'Price must be positive'
    if (!form.imageUrl.trim()) errs.imageUrl = 'Image URL is required'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSaving(true)
    try {
      // PUT /product-service/product — ProductUpdateRequest (id, name, category, price, imageUrl)
      // Note: stock is NOT part of ProductUpdateRequest — use restock endpoint for that
      await productApi.updateProduct({
        id: Number(id),
        name: form.name.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        imageUrl: form.imageUrl.trim(),
      })
      toast.success('Product updated successfully')
      navigate('/admin/products')
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(p => ({ ...p, [key]: e.target.value })),
    error: errors[key],
  })

  if (loading) return <PageLoader />
  if (fetchError) return <ErrorState message={fetchError} />

  return (
    <div className="max-w-xl animate-fade-in">
      <Link to="/admin/products" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition-colors mb-6">
        <ArrowLeft size={15} /> Back to Products
      </Link>

      <h1 className="text-2xl font-bold text-slate-100 mb-1">Edit Product</h1>
      <p className="text-sm text-slate-400 mb-6">
        ID #{id} — to change stock, use the{' '}
        <Link to="/admin/inventory" className="text-indigo-400 hover:underline">Inventory page</Link>
      </p>

      <div className="glass p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Product Name" placeholder="e.g. Running Shoes" {...field('name')} id="edit-prod-name" />
          <Input label="Category" placeholder="e.g. Footwear" {...field('category')} id="edit-prod-cat" />
          <Input label="Price (USD)" type="number" step="0.01" min="0.01" placeholder="0.00" {...field('price')} id="edit-prod-price" />
          <Input label="Image URL" type="url" placeholder="https://..." {...field('imageUrl')} id="edit-prod-img" />

          {form.imageUrl && (
            <div>
              <p className="text-xs text-slate-500 mb-1.5">Preview</p>
              <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/10">
                <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => navigate('/admin/products')}>Cancel</Button>
            <Button type="submit" loading={saving}>Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

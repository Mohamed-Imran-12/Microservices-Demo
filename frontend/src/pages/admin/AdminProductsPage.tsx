import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Search } from 'lucide-react'
import { productApi } from '../../api/productApi'
import { formatCurrency, getApiErrorMessage } from '../../lib/utils'
import { StockBadge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { EmptyState, ErrorState } from '../../components/ui/EmptyState'
import type { ProductResponse } from '../../types'

export function AdminProductsPage() {
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await productApi.getProducts()
        setProducts(res.data)
      } catch (err) {
        setError(getApiErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <PageLoader />
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Products</h1>
          <p className="text-sm text-slate-400">{products.length} products in catalog</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 w-52"
            />
          </div>
          <Link to="/admin/products/new">
            <Button size="sm" className="flex items-center gap-1.5">
              <Plus size={15} /> New Product
            </Button>
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No products found" description="Create your first product to get started" />
      ) : (
        <div className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Product</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Price</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Stock</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, i) => (
                  <tr
                    key={product.id}
                    className={`hover:bg-white/5 transition-colors ${i < filtered.length - 1 ? 'border-b border-white/5' : ''}`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=6366f1&color=fff&size=80`
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-slate-100">{product.name}</p>
                          <p className="text-xs text-slate-500">ID #{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-300">{product.category}</td>
                    <td className="px-5 py-4 text-right font-semibold text-indigo-400">{formatCurrency(product.price)}</td>
                    <td className="px-5 py-4"><StockBadge stock={product.stock} /></td>
                    <td className="px-5 py-4 text-right">
                      <Link to={`/admin/products/${product.id}/edit`}>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
                          <Pencil size={13} /> Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

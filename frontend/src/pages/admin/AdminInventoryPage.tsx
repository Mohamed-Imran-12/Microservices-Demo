import { useState, useEffect } from 'react'
import { AlertTriangle, Plus } from 'lucide-react'
import { productApi } from '../../api/productApi'
import { getApiErrorMessage } from '../../lib/utils'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { ErrorState } from '../../components/ui/EmptyState'
import type { ProductLowStockResponse, ProductResponse } from '../../types'
import toast from 'react-hot-toast'

export function AdminInventoryPage() {
  const [lowStock, setLowStock] = useState<ProductLowStockResponse[]>([])
  const [allProducts, setAllProducts] = useState<ProductResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [restockModal, setRestockModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null)
  const [restockQty, setRestockQty] = useState('')
  const [restocking, setRestocking] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [lowRes, allRes] = await Promise.all([
        productApi.getLowStockProducts(),
        productApi.getProducts(),
      ])
      setLowStock(lowRes.data)
      setAllProducts(allRes.data)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const openRestock = (product: ProductResponse) => {
    setSelectedProduct(product)
    setRestockQty('')
    setRestockModal(true)
  }

  const handleRestock = async () => {
    if (!selectedProduct || !restockQty) return
    const qty = parseInt(restockQty)
    if (isNaN(qty) || qty <= 0) {
      toast.error('Quantity must be a positive integer')
      return
    }
    setRestocking(true)
    try {
      // PUT /product-service/product/stock — type must be "RESTOCK"
      await productApi.restockProduct({
        id: selectedProduct.id,
        quantity: qty,
        type: 'RESTOCK',
      })
      toast.success(`Restocked ${selectedProduct.name} by ${qty} units`)
      setRestockModal(false)
      load()
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setRestocking(false)
    }
  }

  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <PageLoader />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Inventory</h1>
        <p className="text-sm text-slate-400">Manage stock levels and restock products</p>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="glass border-amber-500/20 p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-amber-400" />
            <h2 className="text-sm font-semibold text-amber-400">{lowStock.length} Low Stock Products</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStock.map(p => {
              const full = allProducts.find(ap => ap.id === p.id)
              return (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{p.name}</p>
                    <p className="text-xs text-amber-400">{p.stock} units remaining</p>
                  </div>
                  {full && (
                    <Button size="sm" variant="outline" onClick={() => openRestock(full)} className="flex items-center gap-1">
                      <Plus size={12} /> Restock
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* All products with restock */}
      <div className="glass overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-white/10">
          <h2 className="text-sm font-semibold text-slate-300">All Products</h2>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 w-full sm:w-60"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Product</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Stock</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, i) => (
                <tr
                  key={product.id}
                  className={`hover:bg-white/5 transition-colors ${i < filtered.length - 1 ? 'border-b border-white/5' : ''}`}
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-100">{product.name}</p>
                    <p className="text-xs text-slate-500">ID #{product.id}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-300">{product.category}</td>
                  <td className="px-5 py-4 text-right">
                    <span className={`font-semibold ${product.stock < 10 ? 'text-amber-400' : product.stock === 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button size="sm" variant="outline" onClick={() => openRestock(product)} className="flex items-center gap-1 ml-auto">
                      <Plus size={12} /> Restock
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock modal */}
      <Modal isOpen={restockModal} onClose={() => setRestockModal(false)} title="Restock Product" size="sm">
        {selectedProduct && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
              <p className="text-sm font-medium text-slate-200">{selectedProduct.name}</p>
              <p className="text-xs text-slate-500">Current stock: {selectedProduct.stock} units</p>
            </div>
            <Input
              label="Quantity to Add"
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 50"
              value={restockQty}
              onChange={e => setRestockQty(e.target.value)}
              id="restock-qty"
            />
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setRestockModal(false)} disabled={restocking}>Cancel</Button>
              <Button onClick={handleRestock} loading={restocking}>Confirm Restock</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

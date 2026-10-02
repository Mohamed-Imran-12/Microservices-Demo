import { useState, useEffect } from 'react'
import { productApi } from '../../api/productApi'
import { formatDate, getApiErrorMessage } from '../../lib/utils'
import { Badge } from '../../components/ui/Badge'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { EmptyState, ErrorState } from '../../components/ui/EmptyState'
import type { ProductResponse, ProductTransactionResponse } from '../../types'
import { ArrowLeftRight } from 'lucide-react'

const TRANSACTION_COLORS: Record<string, string> = {
  RESTOCK: 'success',
  SALE: 'info',
  RETURN: 'warning',
  PURCHASE: 'admin',
}

export function AdminTransactionsPage() {
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<ProductTransactionResponse[]>([])
  const [loadingProds, setLoadingProds] = useState(true)
  const [loadingTxns, setLoadingTxns] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoadingProds(true)
      setError(null)
      try {
        const res = await productApi.getProducts()
        setProducts(res.data)
      } catch (err) {
        setError(getApiErrorMessage(err))
      } finally {
        setLoadingProds(false)
      }
    }
    load()
  }, [])

  const loadTransactions = async (productId: number) => {
    setSelectedProductId(productId)
    setLoadingTxns(true)
    setTransactions([])
    try {
      const res = await productApi.getProductTransactions(productId)
      setTransactions(res.data.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ))
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoadingTxns(false)
    }
  }

  if (loadingProds) return <PageLoader />
  if (error) return <ErrorState message={error} />

  const selectedProduct = products.find(p => p.id === selectedProductId)

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Stock Transactions</h1>
        <p className="text-sm text-slate-400">View stock movement history per product</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Product selector */}
        <div className="lg:col-span-1 glass p-4 space-y-2 max-h-[600px] overflow-y-auto">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Select Product</h2>
          {products.map(p => (
            <button
              key={p.id}
              onClick={() => loadTransactions(p.id)}
              className={`w-full text-left p-3 rounded-xl text-sm transition-all ${
                selectedProductId === p.id
                  ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300'
                  : 'hover:bg-white/5 text-slate-300 border border-transparent'
              }`}
            >
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">Stock: {p.stock} — {p.category}</p>
            </button>
          ))}
        </div>

        {/* Transactions list */}
        <div className="lg:col-span-2">
          {!selectedProductId ? (
            <EmptyState
              title="Select a product"
              description="Choose a product from the list to view its stock transactions"
              icon={<ArrowLeftRight size={26} />}
            />
          ) : loadingTxns ? (
            <PageLoader />
          ) : transactions.length === 0 ? (
            <EmptyState
              title="No transactions"
              description={`${selectedProduct?.name} has no stock transactions yet`}
            />
          ) : (
            <div className="glass overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h2 className="font-semibold text-slate-200">{selectedProduct?.name}</h2>
                <p className="text-xs text-slate-500">{transactions.length} transaction{transactions.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">ID</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Quantity</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn, i) => (
                      <tr
                        key={txn.id}
                        className={`hover:bg-white/5 transition-colors ${i < transactions.length - 1 ? 'border-b border-white/5' : ''}`}
                      >
                        <td className="px-5 py-3.5 text-slate-500">#{txn.id}</td>
                        <td className="px-5 py-3.5">
                          <Badge variant={TRANSACTION_COLORS[txn.type] as 'success' | 'info' | 'warning' | 'admin' | 'default'}>
                            {txn.type}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span className={txn.type === 'SALE' ? 'text-red-400' : 'text-emerald-400'}>
                            {txn.type === 'SALE' ? '−' : '+'}{txn.quantity}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-400">{formatDate(txn.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

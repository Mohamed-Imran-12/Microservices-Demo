import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ShoppingBag, Search } from 'lucide-react'
import { userApi } from '../../api/userApi'
import { orderApi } from '../../api/orderApi'
import { formatCurrency, formatDate, getApiErrorMessage } from '../../lib/utils'
import { OrderStatusBadge } from '../../components/ui/Badge'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { EmptyState, ErrorState } from '../../components/ui/EmptyState'
import type { OrderDetails } from '../../types'

export function AdminOrdersPage() {
  const [allOrders, setAllOrders] = useState<(OrderDetails & { userName: string; userEmail: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const usersRes = await userApi.getUsers()

        // Load orders for all users concurrently
        const orderPromises = usersRes.data.map(u =>
          orderApi.getOrdersByUser(u.id)
            .then(r => r.data.map(o => ({ ...o, userName: u.name, userEmail: u.email })))
            .catch(() => [] as (OrderDetails & { userName: string; userEmail: string })[])
        )
        const results = await Promise.all(orderPromises)
        const flattened = results.flat().sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setAllOrders(flattened)
      } catch (err) {
        setError(getApiErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const statuses = ['All', 'CONFIRMED', 'CANCELLED', 'CREATED']
  const filtered = allOrders.filter(o => {
    const matchSearch = search
      ? o.userName.toLowerCase().includes(search.toLowerCase()) ||
        String(o.id).includes(search)
      : true
    const matchStatus = statusFilter === 'All' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  if (loading) return <PageLoader />
  if (error) return <ErrorState message={error} />

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Orders</h1>
        <p className="text-sm text-slate-400">{allOrders.length} total orders across all users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
          />
        </div>
        <div className="flex gap-2">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No orders found" icon={<ShoppingBag size={26} />} />
      ) : (
        <div className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Order</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Total</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3.5"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => (
                  <tr
                    key={order.id}
                    className={`hover:bg-white/5 transition-colors ${i < filtered.length - 1 ? 'border-b border-white/5' : ''}`}
                  >
                    <td className="px-5 py-4 font-medium text-slate-100">#{order.id}</td>
                    <td className="px-5 py-4">
                      <p className="text-slate-200">{order.userName}</p>
                      <p className="text-xs text-slate-500">{order.userEmail}</p>
                    </td>
                    <td className="px-5 py-4"><OrderStatusBadge status={order.status} /></td>
                    <td className="px-5 py-4 text-right font-semibold text-indigo-400">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-5 py-4 text-slate-400 text-xs">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-4">
                      <Link to={`/admin/orders/${order.id}`} className="text-slate-500 hover:text-indigo-400 transition-colors">
                        <ChevronRight size={16} />
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

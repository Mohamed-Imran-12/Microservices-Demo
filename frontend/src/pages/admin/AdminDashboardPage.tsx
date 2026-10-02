import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag, Package, DollarSign, TrendingUp,
  Users, BarChart3, ArrowRight
} from 'lucide-react'
import { analyticsApi } from '../../api/analyticsApi'
import { productApi } from '../../api/productApi'
import { userApi } from '../../api/userApi'
import { formatCurrency, getApiErrorMessage, toLocalDateString } from '../../lib/utils'
import { StatCard } from '../../components/ui/Card'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { ErrorState } from '../../components/ui/EmptyState'
import type { DashboardData, ProductLowStockResponse, UserResponse } from '../../types'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'

export function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [trendData, setTrendData] = useState<{ date: string; revenue: number; orders: number }[]>([])
  const [lowStock, setLowStock] = useState<ProductLowStockResponse[]>([])
  const [users, setUsers] = useState<UserResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const today = new Date()
        const thirtyDaysAgo = new Date(today)
        thirtyDaysAgo.setDate(today.getDate() - 29)
        const from = toLocalDateString(thirtyDaysAgo)
        const to = toLocalDateString(today)

        const [dashRes, trendRes, lowStockRes, usersRes] = await Promise.all([
          analyticsApi.getDashboard(),
          analyticsApi.getSalesTrend(from, to),
          productApi.getLowStockProducts(),
          userApi.getUsers(),
        ])

        setDashboard(dashRes.data)
        setTrendData(trendRes.data.map(d => ({
          date: d.date,
          revenue: Number(d.revenue),
          orders: Number(d.totalOrders),
        })))
        setLowStock(lowStockRes.data)
        setUsers(usersRes.data)
      } catch (err) {
        setError(getApiErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <PageLoader />
  if (error) return <ErrorState message={error} />

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Welcome to the admin panel</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(dashboard?.totalRevenue ?? 0)}
          icon={<DollarSign size={18} />}
        />
        <StatCard
          title="Total Orders"
          value={dashboard?.totalOrders?.toLocaleString() ?? '—'}
          icon={<ShoppingBag size={18} />}
        />
        <StatCard
          title="Total Items Sold"
          value={dashboard?.totalItems?.toLocaleString() ?? '—'}
          icon={<Package size={18} />}
        />
        <StatCard
          title="Avg Order Value"
          value={formatCurrency(dashboard?.averageOrderValue ?? 0)}
          icon={<TrendingUp size={18} />}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue trend */}
        <div className="xl:col-span-2 glass p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-300">Revenue Trend (Last 30 Days)</h2>
            <Link to="/admin/analytics" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          {trendData.length === 0 ? (
            <p className="text-sm text-slate-500 py-12 text-center">No sales data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '0.75rem', color: '#e2e8f0' }}
                  formatter={(v) => [formatCurrency(Number(v)), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Low stock */}
        <div className="glass p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-300">Low Stock Alert</h2>
            <Link to="/admin/inventory" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View <ArrowRight size={12} />
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">All products well stocked</p>
          ) : (
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {lowStock.map(p => (
                <div key={p.id} className="flex items-center justify-between p-2.5 rounded-lg bg-red-500/5 border border-red-500/10">
                  <span className="text-sm text-slate-300 truncate mr-2">{p.name}</span>
                  <span className="text-xs font-bold text-red-400 flex-shrink-0">{p.stock} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { to: '/admin/users', icon: Users, label: 'Manage Users', count: users.length, color: 'indigo' },
          { to: '/admin/products', icon: Package, label: 'Manage Products', count: null, color: 'purple' },
          { to: '/admin/analytics', icon: BarChart3, label: 'View Analytics', count: null, color: 'pink' },
        ].map(item => (
          <Link
            key={item.to}
            to={item.to}
            className="glass p-5 hover:border-indigo-500/30 transition-all group flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform flex-shrink-0">
              <item.icon size={18} />
            </div>
            <div>
              <p className="font-medium text-slate-200">{item.label}</p>
              {item.count !== null && (
                <p className="text-xs text-slate-500">{item.count} total</p>
              )}
            </div>
            <ArrowRight size={16} className="ml-auto text-slate-600 group-hover:text-indigo-400 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  )
}

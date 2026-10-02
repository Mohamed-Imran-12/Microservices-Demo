import { useState, useEffect } from 'react'
import { analyticsApi } from '../../api/analyticsApi'
import { formatCurrency, getApiErrorMessage, toLocalDateString } from '../../lib/utils'
import { StatCard } from '../../components/ui/Card'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { ErrorState, EmptyState } from '../../components/ui/EmptyState'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import type {
  DashboardData, SalesTrendData, ProductSalesData,
  SalesDataByCategory, RevenueByRangeData
} from '../../types'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts'
import { DollarSign, ShoppingBag, Package, TrendingUp, RefreshCw } from 'lucide-react'

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#06b6d4', '#10b981', '#f59e0b']

export function AdminAnalyticsPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [trend, setTrend] = useState<SalesTrendData[]>([])
  const [topProducts, setTopProducts] = useState<ProductSalesData[]>([])
  const [categories, setCategories] = useState<SalesDataByCategory[]>([])
  const [revenueRange, setRevenueRange] = useState<RevenueByRangeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const today = new Date()
  const thirtyAgo = new Date(today)
  thirtyAgo.setDate(today.getDate() - 29)

  const [fromDate, setFromDate] = useState(toLocalDateString(thirtyAgo))
  const [toDate, setToDate] = useState(toLocalDateString(today))
  const [topLimit, setTopLimit] = useState(10)
  const [rangeLoading, setRangeLoading] = useState(false)

  const loadAll = async () => {
    setLoading(true)
    setError(null)
    try {
      const [dashRes, trendRes, topRes, catRes] = await Promise.all([
        analyticsApi.getDashboard(),
        analyticsApi.getSalesTrend(fromDate, toDate),
        analyticsApi.getTopProducts(topLimit),
        analyticsApi.getSalesByCategory(),
      ])
      setDashboard(dashRes.data)
      setTrend(trendRes.data)
      setTopProducts(topRes.data)
      setCategories(catRes.data)

      // Revenue by range
      try {
        const rangeRes = await analyticsApi.getRevenueByRange(fromDate, toDate)
        setRevenueRange(rangeRes.data)
      } catch {
        setRevenueRange(null)
      }
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const loadRange = async () => {
    setRangeLoading(true)
    try {
      const [trendRes, rangeRes] = await Promise.all([
        analyticsApi.getSalesTrend(fromDate, toDate),
        analyticsApi.getRevenueByRange(fromDate, toDate),
      ])
      setTrend(trendRes.data)
      setRevenueRange(rangeRes.data)
    } catch (err) {
      // show partial error inline
    } finally {
      setRangeLoading(false)
    }
  }

  useEffect(() => { loadAll() }, [])

  if (loading) return <PageLoader />
  if (error) return <ErrorState message={error} onRetry={loadAll} />

  const trendChartData = trend.map(d => ({
    date: d.date,
    revenue: Number(d.revenue),
    orders: Number(d.totalOrders),
  }))

  const topProdData = topProducts.map(p => ({
    name: p.productName.length > 15 ? p.productName.substring(0, 15) + '…' : p.productName,
    sold: Number(p.quantitySold),
    revenue: Number(p.revenue),
  }))

  const catData = categories.map(c => ({
    name: c.category,
    value: Number(c.revenue),
    sold: Number(c.quantitySold),
  }))

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Analytics</h1>
          <p className="text-sm text-slate-400">Real-time sales and performance data</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadAll} className="flex items-center gap-1.5">
          <RefreshCw size={14} /> Refresh
        </Button>
      </div>

      {/* Overall stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={formatCurrency(dashboard?.totalRevenue ?? 0)} icon={<DollarSign size={18} />} />
        <StatCard title="Total Orders" value={(dashboard?.totalOrders ?? 0).toLocaleString()} icon={<ShoppingBag size={18} />} />
        <StatCard title="Total Items Sold" value={(dashboard?.totalItems ?? 0).toLocaleString()} icon={<Package size={18} />} />
        <StatCard title="Avg Order Value" value={formatCurrency(dashboard?.averageOrderValue ?? 0)} icon={<TrendingUp size={18} />} />
      </div>

      {/* Date range picker */}
      <div className="glass p-5">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">Date Range Filter</h2>
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <Input label="From" type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} id="analytics-from" className="sm:w-44" />
          <Input label="To" type="date" value={toDate} onChange={e => setToDate(e.target.value)} id="analytics-to" className="sm:w-44" />
          <Button onClick={loadRange} loading={rangeLoading} variant="outline">Apply</Button>
        </div>

        {revenueRange && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
            {[
              { label: 'Revenue', value: formatCurrency(revenueRange.totalRevenue) },
              { label: 'Orders', value: revenueRange.totalOrders.toLocaleString() },
              { label: 'Items', value: revenueRange.totalItems.toLocaleString() },
              { label: 'Avg Order', value: formatCurrency(revenueRange.averageOrderValue) },
            ].map(item => (
              <div key={item.label} className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="text-lg font-bold text-slate-100 mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revenue trend chart */}
      <div className="glass p-5">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">Revenue Trend</h2>
        {trendChartData.length === 0 ? (
          <EmptyState title="No trend data" description="No sales in the selected date range" />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trendChartData}>
              <defs>
                <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} yAxisId="left" tickFormatter={v => `$${v}`} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} yAxisId="right" orientation="right" />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '0.75rem', color: '#e2e8f0' }}
                formatter={(v, name) => [
                  name === 'revenue' ? formatCurrency(Number(v)) : v,
                  name === 'revenue' ? 'Revenue' : 'Orders'
                ]}
              />
              <Legend formatter={v => v === 'revenue' ? 'Revenue' : 'Orders'} />
              <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revGrad2)" />
              <Area yAxisId="right" type="monotone" dataKey="orders" stroke="#a855f7" strokeWidth={2} fill="url(#orderGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top products + Categories pie */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Top products bar chart */}
        <div className="glass p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-300">Top Products by Sales</h2>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={50}
                value={topLimit}
                onChange={e => setTopLimit(Math.max(1, parseInt(e.target.value) || 10))}
                className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-100 text-center focus:outline-none"
              />
              <Button size="sm" variant="ghost" onClick={() => analyticsApi.getTopProducts(topLimit).then(r => setTopProducts(r.data))}>Go</Button>
            </div>
          </div>
          {topProdData.length === 0 ? (
            <EmptyState title="No product data" />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topProdData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} width={90} />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '0.75rem', color: '#e2e8f0' }}
                  formatter={(v, name) => [v, String(name) === 'sold' ? 'Units Sold' : 'Revenue']}
                />
                <Bar dataKey="sold" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category pie chart */}
        <div className="glass p-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Revenue by Category</h2>
          {catData.length === 0 ? (
            <EmptyState title="No category data" />
          ) : (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={catData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {catData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '0.75rem', color: '#e2e8f0' }}
                    formatter={(v) => [formatCurrency(Number(v)), 'Revenue']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 w-full mt-2">
                {catData.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs text-slate-400 truncate">{c.name}</span>
                    <span className="text-xs text-slate-500 ml-auto">{formatCurrency(c.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top products table */}
      {topProducts.length > 0 && (
        <div className="glass p-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Top Products Detail</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">#</th>
                  <th className="text-left py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Product</th>
                  <th className="text-left py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                  <th className="text-right py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Units Sold</th>
                  <th className="text-right py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr key={p.productId} className={`${i < topProducts.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/5`}>
                    <td className="py-3 text-slate-500 w-8">{i + 1}</td>
                    <td className="py-3 font-medium text-slate-200">{p.productName}</td>
                    <td className="py-3 text-slate-400">{p.category}</td>
                    <td className="py-3 text-right text-slate-300">{Number(p.quantitySold).toLocaleString()}</td>
                    <td className="py-3 text-right font-semibold text-indigo-400">{formatCurrency(p.revenue)}</td>
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

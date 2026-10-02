import { useState, useEffect } from 'react'
import { userApi } from '../../api/userApi'
import { formatCurrency, getApiErrorMessage } from '../../lib/utils'
import { Badge } from '../../components/ui/Badge'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { EmptyState, ErrorState } from '../../components/ui/EmptyState'
import { analyticsApi } from '../../api/analyticsApi'
import { Users, Search } from 'lucide-react'
import type { UserResponse, SalesDataByUser } from '../../types'

export function AdminUsersPage() {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [userSales, setUserSales] = useState<Record<number, SalesDataByUser>>({})

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await userApi.getUsers()
        setUsers(res.data)
        // Load sales data for each user concurrently (fire-and-forget per user)
        res.data.forEach(async (u) => {
          try {
            const s = await analyticsApi.getUserSales(u.id)
            setUserSales(prev => ({ ...prev, [u.id]: s.data }))
          } catch {
            // User might have no orders — just skip
          }
        })
      } catch (err) {
        setError(getApiErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <PageLoader />
  if (error) return <ErrorState message={error} />

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Users</h1>
          <p className="text-sm text-slate-400">{users.length} total accounts</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No users found" icon={<Users size={26} />} />
      ) : (
        <div className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">City</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Spent</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Orders</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, i) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-white/5 transition-colors ${i < filtered.length - 1 ? 'border-b border-white/5' : ''}`}
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-slate-100">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={user.role === 'ADMIN' ? 'admin' : 'info'}>{user.role}</Badge>
                    </td>
                    <td className="px-5 py-4 text-slate-300">{user.city}</td>
                    <td className="px-5 py-4 text-slate-300">{user.phone}</td>
                    <td className="px-5 py-4 text-right text-slate-300">
                      {userSales[user.id]
                        ? formatCurrency(userSales[user.id].totalSpent)
                        : <span className="text-slate-600">—</span>
                      }
                    </td>
                    <td className="px-5 py-4 text-right text-slate-300">
                      {userSales[user.id]
                        ? userSales[user.id].totalOrders
                        : <span className="text-slate-600">—</span>
                      }
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

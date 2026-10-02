import { Link } from 'react-router-dom'
import { ShieldOff, ArrowLeft } from 'lucide-react'

export function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a] px-4">
      <div className="text-center animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <ShieldOff size={36} className="text-red-400" />
        </div>
        <h1 className="text-4xl font-bold text-slate-100 mb-2">403</h1>
        <h2 className="text-xl font-semibold text-slate-300 mb-3">Access Denied</h2>
        <p className="text-slate-500 mb-8">You don't have permission to view this page.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors"
        >
          <ArrowLeft size={15} /> Go Home
        </Link>
      </div>
    </div>
  )
}

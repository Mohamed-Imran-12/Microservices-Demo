import { Link } from 'react-router-dom'
import { PackageSearch, ArrowLeft } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a] px-4">
      <div className="text-center animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
          <PackageSearch size={36} className="text-indigo-400" />
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-2">404</h1>
        <h2 className="text-xl font-semibold text-slate-300 mb-3">Page Not Found</h2>
        <p className="text-slate-500 mb-8">The page you're looking for doesn't exist.</p>
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

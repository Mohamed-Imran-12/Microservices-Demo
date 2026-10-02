import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Package, LogOut, User,
  ShieldCheck, Menu, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-indigo-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? '/products' : '/'} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">ShopMS</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className="text-slate-300 hover:text-indigo-400 transition-colors text-sm font-medium">
              Products
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/orders" className="text-slate-300 hover:text-indigo-400 transition-colors text-sm font-medium">
                  My Orders
                </Link>
                <Link to="/profile" className="text-slate-300 hover:text-indigo-400 transition-colors text-sm font-medium">
                  Profile
                </Link>
                {/* Admin Panel link — prominent for admins in customer view */}
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    id="navbar-admin-panel-link"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-purple-300 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 transition-all"
                  >
                    <ShieldCheck size={15} />
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart — show for both regular users AND admin in customer view */}
            {isAuthenticated && (
              <Link to="/cart" className="relative p-2 rounded-lg text-slate-300 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <User size={14} className="text-indigo-400" />
                  <span className="text-sm text-slate-300 max-w-24 truncate">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  id="navbar-logout-btn"
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="px-4 py-1.5 text-sm text-slate-300 hover:text-indigo-400 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-1.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-indigo-500/10 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-indigo-500/10 bg-[#0f0f1a]/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-2">
            <Link to="/products" className="block py-2 text-slate-300 hover:text-indigo-400 transition-colors" onClick={() => setMobileOpen(false)}>Products</Link>
            {isAuthenticated && (
              <>
                <Link to="/orders" className="block py-2 text-slate-300 hover:text-indigo-400 transition-colors" onClick={() => setMobileOpen(false)}>My Orders</Link>
                <Link to="/profile" className="block py-2 text-slate-300 hover:text-indigo-400 transition-colors" onClick={() => setMobileOpen(false)}>Profile</Link>
                <Link to="/cart" className="block py-2 text-slate-300 hover:text-indigo-400 transition-colors" onClick={() => setMobileOpen(false)}>Cart ({totalItems})</Link>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-2 py-2 text-purple-400 font-semibold"
                    onClick={() => setMobileOpen(false)}
                  >
                    <ShieldCheck size={15} />
                    Admin Panel
                  </Link>
                )}
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block py-2 text-red-400 w-full text-left">Logout</button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link to="/login" className="block py-2 text-slate-300" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/register" className="block py-2 text-indigo-400" onClick={() => setMobileOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

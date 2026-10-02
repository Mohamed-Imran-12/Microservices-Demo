import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Package, Warehouse, ArrowLeftRight,
  ShoppingBag, BarChart3, LogOut, ChevronRight, X, PlusSquare, Store,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

interface AdminSidebarProps {
  onClose?: () => void;
}

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/products/new', icon: PlusSquare, label: 'Add Product' },
  { to: '/admin/inventory', icon: Warehouse, label: 'Inventory' },
  { to: '/admin/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
];

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCustomerView = () => {
    if (onClose) onClose();
    navigate('/products');
  };

  return (
    <aside className="flex flex-col h-full min-h-screen w-64 bg-[#0d0d1f] border-r border-indigo-500/10">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-indigo-500/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <BarChart3 size={16} className="text-white" />
          </div>
          <span className="font-bold gradient-text text-lg">Admin Panel</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-indigo-500/10 text-slate-400 lg:hidden">
            <X size={16} />
          </button>
        )}
      </div>

      {/* User info */}
      <div className="p-4 m-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
        <p className="text-xs text-slate-500 mb-0.5">Logged in as</p>
        <p className="text-sm font-semibold text-slate-200 truncate">{user?.name}</p>
        <p className="text-xs text-indigo-400 truncate">{user?.email}</p>
      </div>

      {/* Customer View button */}
      <div className="px-4 mb-2">
        <button
          onClick={handleCustomerView}
          id="admin-customer-view-btn"
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all"
        >
          <Store size={16} />
          <span className="flex-1 text-left">Customer View</span>
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin/products'}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                isActive
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              )
            }
          >
            <item.icon size={17} />
            <span className="flex-1">{item.label}</span>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-indigo-500/10">
        <button
          onClick={handleLogout}
          id="admin-logout-btn"
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/orderApi';
import { formatCurrency, formatDate, getApiErrorMessage } from '../lib/utils';
import { OrderStatusBadge } from '../components/ui/Badge';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { EmptyState, ErrorState } from '../components/ui/EmptyState';
import type { OrderDetails } from '../types';

export function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await orderApi.getOrdersByUser(user.id);
        setOrders(res.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) return <PageLoader />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Your order history will appear here after you make your first purchase"
          icon={<ShoppingBag size={28} />}
          action={
            <Link to="/products" className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-500 transition-colors">
              Shop Now
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="glass flex items-center justify-between p-5 hover:border-indigo-500/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                  <ShoppingBag size={18} className="text-indigo-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-100">Order #{order.id}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{formatDate(order.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <OrderStatusBadge status={order.status} />
                <span className="text-indigo-400 font-bold">{formatCurrency(order.totalAmount)}</span>
                <ChevronRight size={16} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

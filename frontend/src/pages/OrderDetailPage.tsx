import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/orderApi';
import { formatCurrency, formatDate, getApiErrorMessage } from '../lib/utils';
import { OrderStatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/Modal';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/EmptyState';
import type { OrderResponse } from '../types';
import toast from 'react-hot-toast';

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await orderApi.getOrder(Number(id));
        setOrder(res.data);
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleCancel = async () => {
    if (!id) return;
    setCancelling(true);
    try {
      const res = await orderApi.cancelOrder(Number(id));
      setOrder(res.data);
      toast.success('Order cancelled successfully');
      setCancelOpen(false);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <PageLoader />;
  if (error || !order) return <ErrorState message={error ?? 'Order not found'} />;

  const canCancel = order.status !== 'CANCELLED';

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <Link
        to={user?.role === 'ADMIN' ? '/admin/orders' : '/orders'}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition-colors mb-6"
      >
        <ArrowLeft size={15} /> Back to Orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Order #{order.id}</h1>
          <p className="text-sm text-slate-400 mt-1">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          {canCancel && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setCancelOpen(true)}
              className="flex items-center gap-1.5"
            >
              <XCircle size={14} /> Cancel Order
            </Button>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="glass p-6 mb-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Package size={14} /> Order Items
        </h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/5">
              <div>
                <p className="font-medium text-slate-100">{item.productName}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {formatCurrency(item.price)} × {item.quantity} units
                </p>
              </div>
              <span className="font-bold text-indigo-400 flex-shrink-0">{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-white/10 mt-5 pt-4">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Subtotal ({order.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span className="text-slate-100">Total</span>
            <span className="text-indigo-400">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="glass p-6">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Order Info</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Order ID</p>
            <p className="text-slate-200 font-medium">#{order.id}</p>
          </div>
          <div>
            <p className="text-slate-500">Customer ID</p>
            <p className="text-slate-200 font-medium">#{order.userId}</p>
          </div>
          <div>
            <p className="text-slate-500">Status</p>
            <p className="text-slate-200 font-medium">{order.status}</p>
          </div>
          <div>
            <p className="text-slate-500">Placed At</p>
            <p className="text-slate-200 font-medium">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-slate-500">Total Amount</p>
            <p className="text-slate-200 font-medium">{formatCurrency(order.totalAmount)}</p>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancel}
        title="Cancel Order"
        message={`Are you sure you want to cancel Order #${order.id}? This will restore stock for all items.`}
        confirmLabel="Cancel Order"
        loading={cancelling}
      />
    </div>
  );
}

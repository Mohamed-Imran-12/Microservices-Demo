import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/orderApi';
import { formatCurrency, getApiErrorMessage } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

export function CheckoutPage() {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-100 mb-6">Checkout</h1>
        <EmptyState
          title="Your cart is empty"
          description="Add some products before checking out"
          icon={<ShoppingBag size={28} />}
          action={<Link to="/products"><Button>Browse Products</Button></Link>}
        />
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Build the exact OrderRequest the backend expects
      const orderRequest = {
        userId: user.id,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };
      const res = await orderApi.createOrder(orderRequest);
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${res.data.id}`);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 mb-6 transition-colors">
        <ArrowLeft size={15} /> Back to Cart
      </Link>

      <h1 className="text-2xl font-bold text-slate-100 mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Order items */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass p-5">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Order Items</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(item.productName)}&background=6366f1&color=fff&size=96`;
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 line-clamp-1">{item.productName}</p>
                    <p className="text-xs text-slate-500">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                  </div>
                  <span className="text-sm font-bold text-slate-100">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery info (display only) */}
          <div className="glass p-5">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Delivery Info</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-500">Name</p>
                <p className="text-slate-200">{user?.name}</p>
              </div>
              <div>
                <p className="text-slate-500">City</p>
                <p className="text-slate-200">{user?.city}</p>
              </div>
              <div>
                <p className="text-slate-500">Email</p>
                <p className="text-slate-200">{user?.email}</p>
              </div>
              <div>
                <p className="text-slate-500">Phone</p>
                <p className="text-slate-200">{user?.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-2">
          <div className="glass p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Summary</h2>

            <div className="space-y-2 text-sm mb-5">
              <div className="flex justify-between text-slate-400">
                <span>Items ({items.reduce((s, i) => s + i.quantity, 0)})</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className="text-emerald-400">Free</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between font-bold">
                <span className="text-slate-100">Total</span>
                <span className="text-indigo-400 text-lg">{formatCurrency(subtotal)}</span>
              </div>
            </div>

            <Button
              className="w-full flex items-center gap-2"
              size="lg"
              onClick={handlePlaceOrder}
              loading={loading}
            >
              <CheckCircle size={16} />
              Place Order
            </Button>

            <p className="text-xs text-slate-500 text-center mt-3">
              By placing your order, you agree to our terms of service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

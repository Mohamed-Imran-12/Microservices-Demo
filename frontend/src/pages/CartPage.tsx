import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

export function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, subtotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-100 mb-6">Cart</h1>
        <EmptyState
          title="Your cart is empty"
          description="Browse products and add items to your cart"
          icon={<ShoppingBag size={28} />}
          action={
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-100">
          Cart <span className="text-slate-500 text-lg font-normal">({totalItems} items)</span>
        </h1>
        <Button variant="ghost" size="sm" onClick={clearCart} className="text-red-400 hover:text-red-300">
          <Trash2 size={15} /> Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="glass flex gap-4 p-4 items-center">
              {/* Image */}
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(item.productName)}&background=6366f1&color=fff&size=128`;
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.productId}`} className="font-medium text-slate-100 hover:text-indigo-400 transition-colors line-clamp-1">
                  {item.productName}
                </Link>
                <p className="text-sm text-indigo-400 font-semibold mt-0.5">
                  {formatCurrency(item.price)}
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-all"
                >
                  <Minus size={12} />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-slate-100">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-all disabled:opacity-40"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right min-w-16">
                <p className="text-sm font-bold text-slate-100">{formatCurrency(item.price * item.quantity)}</p>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.productId)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="glass p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-slate-100 mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-slate-400 truncate mr-2">{item.productName} ×{item.quantity}</span>
                  <span className="text-slate-300 flex-shrink-0">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-3 flex justify-between font-bold">
                <span className="text-slate-200">Subtotal</span>
                <span className="text-indigo-400 text-lg">{formatCurrency(subtotal)}</span>
              </div>
            </div>
            <Button
              className="w-full flex items-center gap-2"
              size="lg"
              onClick={() => navigate('/checkout')}
            >
              Checkout <ArrowRight size={16} />
            </Button>
            <Link to="/products" className="block text-center text-sm text-slate-400 hover:text-indigo-400 mt-4 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

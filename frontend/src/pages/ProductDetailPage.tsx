import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Package } from 'lucide-react';
import { productApi } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, getApiErrorMessage } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { StockBadge } from '../components/ui/Badge';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/EmptyState';
import type { ProductResponse } from '../types';
import toast from 'react-hot-toast';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { addItem, items } = useCart();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await productApi.getProduct(Number(id));
        setProduct(res.data);
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <PageLoader />;
  if (error || !product) return <ErrorState message={error ?? 'Product not found'} />;

  const cartItem = items.find((i) => i.productId === product.id);
  const inCart = cartItem ? cartItem.quantity : 0;
  const maxQty = product.stock - inCart;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in first');
      return;
    }
    if (qty > maxQty) {
      toast.error(`Only ${maxQty} more units available`);
      return;
    }
    addItem({
      productId: product.id,
      productName: product.name,
      price: Number(product.price),
      quantity: qty,
      imageUrl: product.imageUrl,
      stock: product.stock,
    });
    toast.success(`${qty}x ${product.name} added to cart!`);
  };

  return (
    <div className="animate-fade-in">
      <Link to="/products" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition-colors mb-6">
        <ArrowLeft size={16} /> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="glass p-2 overflow-hidden rounded-2xl">
          <div className="relative h-80 lg:h-[450px] rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=6366f1&color=fff&size=600`;
              }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <span className="px-3 py-1 text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold text-slate-100 mt-3">{product.name}</h1>
            <p className="text-3xl font-bold text-indigo-400 mt-3">{formatCurrency(product.price)}</p>
          </div>

          <div className="flex items-center gap-3">
            <StockBadge stock={product.stock} />
            <span className="text-sm text-slate-500">ID: #{product.id}</span>
          </div>

          {/* Quantity picker */}
          {product.stock > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-all"
                >
                  −
                </button>
                <span className="w-12 text-center font-semibold text-slate-100">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                  disabled={qty >= maxQty}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-all disabled:opacity-40"
                >
                  +
                </button>
              </div>
              {inCart > 0 && (
                <p className="text-xs text-slate-500">{inCart} already in cart</p>
              )}
            </div>
          )}

          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || maxQty <= 0}
            className="w-full flex items-center gap-2"
          >
            <ShoppingCart size={18} />
            {product.stock === 0 ? 'Out of Stock' : maxQty <= 0 ? 'Max in Cart' : 'Add to Cart'}
          </Button>

          {/* Product details card */}
          <div className="glass p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Package size={15} /> Product Details
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-500">Product ID</p>
                <p className="text-slate-200 font-medium">#{product.id}</p>
              </div>
              <div>
                <p className="text-slate-500">Category</p>
                <p className="text-slate-200 font-medium">{product.category}</p>
              </div>
              <div>
                <p className="text-slate-500">Stock</p>
                <p className="text-slate-200 font-medium">{product.stock} units</p>
              </div>
              <div>
                <p className="text-slate-500">Price</p>
                <p className="text-slate-200 font-medium">{formatCurrency(product.price)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

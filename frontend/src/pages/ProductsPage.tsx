import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, X } from 'lucide-react';
import { productApi } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, getApiErrorMessage } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { StockBadge } from '../components/ui/Badge';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { EmptyState, ErrorState } from '../components/ui/EmptyState';
import type { ProductResponse, ProductSearchResponse } from '../types';
import toast from 'react-hot-toast';

export function ProductsPage() {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProductSearchResponse[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [addingId, setAddingId] = useState<number | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productApi.getProducts();
      setProducts(res.data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    try {
      const res = await productApi.searchProducts(searchQuery.trim());
      setSearchResults(res.data);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const displayedProducts = searchResults
    ? products.filter((p) => searchResults.some((s) => s.id === p.id))
    : selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const handleAddToCart = async (product: ProductResponse) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      return;
    }
    if (product.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }
    setAddingId(product.id);
    addItem({
      productId: product.id,
      productName: product.name,
      price: Number(product.price),
      quantity: 1,
      imageUrl: product.imageUrl,
      stock: product.stock,
    });
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAddingId(null), 500);
  };

  if (loading) return <PageLoader />;
  if (error) return <ErrorState message={error} onRetry={loadProducts} />;

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Our Products</h1>
        <p className="text-slate-400">Discover our curated collection</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
            />
          </div>
          <Button onClick={handleSearch} loading={searching} size="md" variant="outline">
            Search
          </Button>
          {searchResults && (
            <Button onClick={clearSearch} variant="ghost" size="md">
              <X size={16} />
            </Button>
          )}
        </div>

        {/* Category filter (not shown when searching) */}
        {!searchResults && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search result label */}
      {searchResults && (
        <p className="text-sm text-slate-400 mb-4">
          {displayedProducts.length} result{displayedProducts.length !== 1 ? 's' : ''} for "{searchQuery}"
        </p>
      )}

      {/* Product grid */}
      {displayedProducts.length === 0 ? (
        <EmptyState title="No products found" description="Try adjusting your search or filters" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {displayedProducts.map((product) => (
            <div key={product.id} className="glass hover:border-indigo-500/30 transition-all group overflow-hidden flex flex-col">
              {/* Image */}
              <Link to={`/products/${product.id}`} className="block">
                <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=6366f1&color=fff&size=400`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-0.5 text-xs bg-indigo-600/80 backdrop-blur-sm text-white rounded-md">
                      {product.category}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <Link to={`/products/${product.id}`}>
                  <h3 className="font-semibold text-slate-100 hover:text-indigo-400 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-2 mb-3">
                  <StockBadge stock={product.stock} />
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg font-bold text-indigo-400">{formatCurrency(product.price)}</span>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0 || addingId === product.id}
                    className="flex items-center gap-1.5"
                  >
                    <ShoppingCart size={13} />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState, useRef } from 'react';
import api from '../lib/api';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cart';
import { formatMAD } from '../lib/currency';

export default function Products() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingTerm, setPendingTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const { addItem } = useCartStore();
 
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const lastTriggeredPageRef = useRef(0);

 
  const categories = [];

 
  const isValidObjectId = (val) => typeof val === 'string' && /^[0-9a-fA-F]{24}$/.test(val);

  const fetchPage = async (targetPage) => {
    const { data } = await api.get('/comprehensive/products', {
      params: {
        page: targetPage,
        limit,
        search: searchTerm || undefined,
        sort: sortBy,
      },
    });
    const products = (data?.products || [])
      .map(mapBackendProduct)
      .filter((p) => p && isValidObjectId(p._id));
    setItems(products);
    setFilteredItems(products);
    setPage(Number(data?.pagination?.currentPage || targetPage));
    setTotalPages(Number(data?.pagination?.totalPages || 1));
    setHasMore((data?.pagination?.currentPage || targetPage) < (data?.pagination?.totalPages || 1));
  };

 
  useEffect(() => {
    const loadFromBackend = async () => {
      try {
        setLoading(true);
        await fetchPage(1);
      } catch (e) {
        console.error('Error loading products:', e);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadFromBackend();
  }, [limit]);


  useEffect(() => {
    const refresh = async () => {
      try {
        setLoading(true);
        await fetchPage(1);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
   
    const t = setTimeout(() => { refresh(); }, 150);
    lastTriggeredPageRef.current = 0;
    return () => clearTimeout(t);
  }, [selectedCategory, searchTerm]);

  const mapBackendProduct = (p) => {
    return {
      _id: p._id,
      name: p.name,
      description: p.description || '',
      price: Math.max(0, Number(p.price) || 0),
      category: mapCategory(p.category || p.categoryName || 'other'),
      image: p.image || p.thumbnail || (Array.isArray(p.images) && p.images[0]) || 'https://via.placeholder.com/300',
      stock: Number(p.stock ?? p.countInStock ?? 100),
      unit: p.unit || 'piece',
      rating: Number(p.rating ?? p.rating?.rate ?? 0),
      reviewCount: Number(p.numReviews ?? p.reviewCount ?? 0),
      createdAt: p.createdAt || new Date().toISOString(),
    };
  };

  const mapCategory = (cat) => {
    const c = String(cat || '').toLowerCase();
    if (['smartphones','laptops','tablets','mobile-accessories'].some(k=>c.includes(k))) return 'electronics';
    if (['mens-shirts','mens-shoes','mens-watches'].some(k=>c.includes(k))) return 'men';
    if (['womens-dresses','womens-shoes','womens-watches','womens-bags','tops'].some(k=>c.includes(k))) return 'women';
    if (['womens-jewellery','jewellery','jewelry'].some(k=>c.includes(k))) return 'jewelery';
    if (['sunglasses'].some(k=>c.includes(k))) return 'clothing';
    if (['groceries'].some(k=>c.includes(k))) return 'pantry';
    if (['fragrances','skincare'].some(k=>c.includes(k))) return 'health';
    if (['home-decoration','furniture','lighting'].some(k=>c.includes(k))) return 'home';
    if (['automotive','motorcycle'].some(k=>c.includes(k))) return 'automotive';
    if (['toys','gaming'].some(k=>c.includes(k))) return 'toys';
    return 'other';
  };

  useEffect(() => {
    let filtered = Array.isArray(items)
      ? items.filter((p) => p && isValidObjectId(p._id))
      : [];


    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

  
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  }, [items, searchTerm, selectedCategory, sortBy]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading unlimited products...</p>
        <p className="text-sm text-gray-500">Discovering thousands of amazing items for you</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center text-red-600">
        <p className="text-xl mb-2">Oops! Something went wrong</p>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 border-b border-gray-800 animate-fade-in-up">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">UNLIMITED PRODUCTS</h1>
          <p className="text-xl text-neutral-300 mb-8">Thousands of products across all categories with a sleek dark UI.</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input 
                type="text"
                placeholder="Search for ANYTHING: food, electronics, clothes, jewelry, home, sports..."
                value={pendingTerm}
                onChange={(e) => setPendingTerm(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); setSearchTerm(pendingTerm); } }}
                className="w-full px-6 py-4 bg-white text-gray-900 rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-gray-300 shadow-lg placeholder:text-gray-400"
              />
              <button type="button" onClick={() => setSearchTerm(pendingTerm)} className="absolute right-2 top-2 bg-black text-white p-2 rounded-full hover:bg-gray-900 transition-colors">
                🔍
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in-up">
        {/* Product Count */}
        <div className="text-center mb-6">
          <p className="text-lg text-neutral-300">
            Discover <span className="font-bold text-neutral-100">{items.length}</span>+ amazing products across all categories!
          </p>
          <p className="text-sm text-neutral-400">From groceries to gadgets, fashion to furniture - everything you need!</p>
        </div>

        {/* Filters and Categories */}
        <div className="mb-8">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  selectedCategory === category.value
                    ? 'bg-black text-white border-black shadow-lg scale-105'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:scale-105'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center justify-center gap-4 mb-6 animate-fade-in-up">
            <span className="text-gray-700 font-medium">Sort by</span>
            <div className="inline-flex bg-white border border-gray-300 rounded-full p-1 shadow-sm">
              {[
                { key: 'name', label: 'Name' },
                { key: 'price-low', label: 'Price ↑' },
                { key: 'price-high', label: 'Price ↓' },
                { key: 'rating', label: 'Rating' },
                { key: 'newest', label: 'Newest' }
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSortBy(opt.key)}
                  className={`px-3 md:px-4 py-1.5 rounded-full text-sm transition-all duration-200 ${
                    sortBy === opt.key
                      ? 'bg-black text-white shadow'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <span className="text-gray-600">
              {filteredItems.length} of {items.length}
            </span>
          </div>
        </div>

        {/* Products Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-neutral-200 mb-2">No products found</h3>
            <p className="text-neutral-400">Try adjusting your search or category filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredItems.map(product => (
              <Link key={product._id} to={`/products/${product._id}`} className="group bg-white rounded-2xl shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-200 animate-fade-in-up">
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image} 
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&q=80&auto=format&fit=crop'; }}
                    alt={product.name} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-900 transition-colors transform hover:scale-110"
                      title="Add to cart"
                    >
                      🛒
                    </button>
                  </div>
                  {/* Stock badges removed in unlimited mode */}
                  {product.rating > 0 && (
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      ⭐ {product.rating}
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  {/* Category pill removed */}
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-black transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatMAD(product.price)}
                    </div>
                    <div className="text-sm text-gray-500">Stock: Unlimited</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="mt-8 flex items-center justify-center gap-2 select-none">
          <button
            onClick={() => page > 1 && fetchPage(page - 1)}
            disabled={page <= 1}
            className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
            let start = Math.max(1, page - 3);
            let end = Math.min(totalPages, start + 6);
            start = Math.max(1, end - 6);
            const p = start + i;
            if (p > end) return null;
            return (
              <button
                key={p}
                onClick={() => fetchPage(p)}
                className={`px-3 py-2 rounded-md border ${p === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => page < totalPages && fetchPage(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

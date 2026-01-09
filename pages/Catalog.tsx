
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { ProductSkeleton } from '../components/Skeleton';

const Catalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isConfigured, setIsConfigured] = useState(apiService.isConfigured());
  
  const categoryFilter = searchParams.get('category') || 'All';

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    const loadProducts = async () => {
      try {
        const data = await apiService.fetchProducts();
        setProducts(data);
      } catch (err: any) {
        if (err.message.includes('not configured')) {
          setIsConfigured(false);
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [isConfigured]);

  useEffect(() => {
    let result = products;
    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }
    if (search) {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    setFilteredProducts(result);
  }, [products, categoryFilter, search]);

  const categories = ['All', 'Shoes', 'Clothing', 'Beauty', 'Tech'];

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Search Bar */}
      <div className="sticky top-[72px] bg-white/80 backdrop-blur-md z-30 -mx-6 px-6 py-2">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="What are you looking for?" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 pl-12 pr-6 py-5 rounded-[24px] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:bg-white transition-all shadow-sm"
          />
          <svg className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2.5 overflow-x-auto hide-scrollbar -mx-6 px-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSearchParams({ category: cat })}
            className={`px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all active:scale-95 ${
              categoryFilter === cat 
              ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
              : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10">
          {[1,2,3,4].map(i => <ProductSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {filteredProducts.length === 0 && !loading && (
        <div className="py-24 text-center px-8 flex flex-col items-center animate-slideUp">
          <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 text-slate-200 shadow-inner">
             <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          {!isConfigured ? (
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-slate-900 leading-tight">Catalog Offline</h3>
              <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">Please configure your backend URL in Account Settings to view the live product catalog.</p>
              <Button onClick={() => navigate('/profile')} variant="primary" fullWidth className="h-16">
                Go to Settings
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">No matches found</h3>
              <p className="text-slate-400 font-medium text-sm">Try adjusting your filters or search terms.</p>
              <button onClick={() => {setSearch(''); setSearchParams({category: 'All'})}} className="mt-6 text-blue-600 font-black text-[10px] uppercase tracking-widest">Clear All Filters</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Catalog;


import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { ProductSkeleton, Skeleton } from '../components/Skeleton';

const Home: React.FC = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(apiService.isConfigured());
  const navigate = useNavigate();

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    const loadFeatured = async () => {
      try {
        const data = await apiService.fetchFeaturedProducts();
        setFeatured(data.slice(0, 4));
      } catch (err: any) {
        if (err.message.includes('not configured')) {
          setIsConfigured(false);
        }
        console.error('Error loading featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, [isConfigured]);

  return (
    <div className="space-y-10 pb-12 animate-fadeIn">
      {/* Hero Section */}
      <section className="relative h-[260px] rounded-[40px] overflow-hidden bg-slate-900 p-8 flex flex-col justify-end group shadow-2xl shadow-slate-200">
        <div className="absolute top-0 left-0 w-full h-full opacity-60">
           <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800" 
            alt="Hero Background" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
        </div>
        <div className="relative z-10 space-y-4">
          <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
            Season Sale 2025
          </div>
          <h1 className="text-3xl font-black text-white leading-tight">Elevate Your<br/>Everyday Style.</h1>
          <a 
            href="https://wa.me/yournumber" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-900/30 active:scale-95 transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.996-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.464c1.547.917 3.075 1.403 4.813 1.403 5.4 0 9.786-4.386 9.788-9.787 0-2.615-1.02-5.074-2.871-6.928-1.851-1.854-4.31-2.87-6.923-2.87-5.401 0-9.787 4.386-9.789 9.788 0 1.848.52 3.555 1.504 5.122l-.993 3.62 3.713-.974zm11.367-7.374c-.157-.263-.58-.419-1.217-.738-.639-.32-3.774-1.863-4.358-2.077-.583-.214-1.007-.321-1.429.321-.424.643-1.636 2.077-2.003 2.505-.367.428-.735.481-1.372.162-.637-.319-2.688-1.047-5.118-3.32-1.891-1.688-3.167-3.773-3.539-4.413-.372-.64-.04-.986.279-1.303.288-.283.639-.738.958-1.107.319-.369.424-.633.637-1.056.212-.424.106-.797-.053-1.116-.16-.319-1.429-3.444-1.957-4.714-.514-1.24-.104-1.707.158-2.042.262-.336.58-.419.897-.419.317 0 .633.003.897.003.454 0 .935-.12 1.353.491.464.678 1.585 3.844 1.724 4.13.14.286.233.619.047.994-.187.375-.281.604-.563.941-.281.336-.59.75-.844.994-.254.244-.52.511-.222.955.298.444 1.32 2.174 2.828 3.518 1.94 1.73 3.58 2.27 4.09 2.528.511.259.81.215 1.113-.127.303-.342 1.3-1.523 1.649-2.046.348-.523.696-.438 1.166-.263.47.175 2.977 1.401 3.492 1.658.514.257.857.385.983.6.126.215.126 1.24-.378 2.646-.504 1.405-2.943 2.76-4.037 2.822z"/></svg>
            Chat to Shop
          </a>
        </div>
      </section>

      {/* Onboarding / Setup Banner */}
      {!isConfigured && (
        <section className="bg-slate-900 rounded-[32px] p-8 text-white space-y-6 shadow-2xl shadow-slate-200 animate-slideUp">
           <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
           </div>
           <div className="space-y-2">
             <h3 className="text-xl font-black">Ready to go live?</h3>
             <p className="text-sm text-white/50 leading-relaxed font-medium">Connect your n8n backend to start syncing products and orders instantly.</p>
           </div>
           <Button variant="secondary" fullWidth onClick={() => navigate('/profile')} className="bg-emerald-500 hover:bg-emerald-600 border-none h-14">
             Setup My Store
           </Button>
        </section>
      )}

      {/* Categories Grid */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900">Departments</h3>
          <Link to="/products" className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">Browse All</Link>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[
            { id: 'Shoes', icon: '👟', label: 'Shoes' },
            { id: 'Clothing', icon: '👕', label: 'Style' },
            { id: 'Beauty', icon: '💄', label: 'Beauty' },
            { id: 'Tech', icon: '📱', label: 'Gadgets' }
          ].map((cat) => (
            <Link to={`/products?category=${cat.id}`} key={cat.id} className="flex flex-col items-center gap-2 group">
              <div className="w-full aspect-square bg-slate-50 rounded-[24px] flex items-center justify-center border border-slate-100 shadow-sm active:scale-90 group-hover:bg-white group-hover:shadow-lg transition-all duration-300">
                <span className="text-2xl">{cat.icon}</span>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Handpicked Section */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900">Featured Collections</h3>
          <div className="flex gap-1">
             <div className="w-4 h-1 rounded-full bg-slate-900"></div>
             <div className="w-1.5 h-1 rounded-full bg-slate-200"></div>
             <div className="w-1.5 h-1 rounded-full bg-slate-200"></div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex gap-4 overflow-hidden -mx-6 px-6">
            {[1, 2].map(i => (
              <div key={i} className="min-w-[280px]">
                <ProductSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-6 pt-2">
            {featured.map(product => (
              <div key={product.id} className="min-w-[280px]">
                <ProductCard product={product} />
              </div>
            ))}
            {isConfigured && featured.length === 0 && (
               <div className="w-full py-20 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  </div>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-widest">No Featured Items</p>
               </div>
            )}
            {!isConfigured && (
              <div className="flex gap-4 w-full">
                {[1,2].map(i => (
                  <div key={i} className="min-w-[280px] aspect-[4/5] bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-4 group">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-200 shadow-sm transition-transform group-hover:scale-110">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     </div>
                     <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Preview Only</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Trust & Loyalty Banner */}
      <section className="bg-slate-900 rounded-[40px] p-8 flex flex-col gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full translate-x-10 -translate-y-10 transition-transform group-hover:scale-150"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center text-emerald-400 border border-white/10">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-black text-white">WhatsStore Verify</h4>
            <p className="text-xs text-white/50 font-medium leading-relaxed">Shop with 100% confidence. Every order is verified and tracked via WhatsApp.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

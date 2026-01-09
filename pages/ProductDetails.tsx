
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import QuantitySelector from '../components/QuantitySelector';
import { formatCurrency } from '../utils/formatters';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    const loadProduct = async () => {
      try {
        const data = await apiService.fetchProductById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleCreateOrder = async () => {
    if (!product) return;
    
    if (!user?.isAuthenticated) {
      navigate('/login');
      return;
    }

    setOrderLoading(true);
    try {
      await apiService.createOrder({
        customer_phone: user.phone,
        items: [{ product_id: product.id, qty: quantity }],
        total: product.price * quantity
      });

      const message = `🛍️ *New Order from WhatsStore*\n\n` +
        `Product: ${product.name}\n` +
        `Quantity: ${quantity}\n` +
        `Total: ${formatCurrency(product.price * quantity)}\n\n` +
        `ID: ${product.id}\n` +
        `Customer: ${user.phone}\n\n` +
        `Please confirm availability!`;
        
      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/yournumber?text=${encoded}`, '_blank');
      
    } catch (err) {
      alert('Failed to place order. Please check your connection.');
    } finally {
      setOrderLoading(false);
    }
  };

  const triggerAIChat = () => {
    if (!product) return;
    window.dispatchEvent(new CustomEvent('open-ai-chat', {
      detail: {
        product: product,
        initialMessage: `I have a question about the ${product.name}.`
      }
    }));
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
      <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading Product...</p>
    </div>
  );
  
  if (!product) return (
    <div className="py-20 text-center flex flex-col items-center px-8">
      <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center text-slate-200 mb-6">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-2">Oops! Product Missing</h3>
      <p className="text-slate-500 font-medium text-sm mb-8">This item might have been removed or moved to another section.</p>
      <Button variant="primary" fullWidth onClick={() => navigate('/')}>Return to Store</Button>
    </div>
  );

  const images = product.images || [product.image_url];

  return (
    <div className="flex flex-col h-full -mx-6 px-6 pb-40 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between py-4 mb-4">
        <button onClick={() => navigate(-1)} className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 active:scale-90 transition-transform">
          <svg className="w-5 h-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="font-black text-xs uppercase tracking-[0.2em] text-slate-900">Explore Item</span>
        <button onClick={triggerAIChat} className="w-12 h-12 flex items-center justify-center bg-slate-900 text-white rounded-2xl shadow-lg shadow-slate-200 active:scale-90 transition-transform">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </button>
      </div>

      {/* Product Image Carousel */}
      <div className="relative mb-8">
        <div className="relative aspect-[4/5] rounded-[48px] overflow-hidden shadow-2xl shadow-slate-200 bg-slate-50">
          <img 
            src={images[activeImage] || `https://picsum.photos/seed/${product.id}-${activeImage}/800/1000`} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            {images.slice(0, 4).map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-14 h-14 rounded-[20px] overflow-hidden border-2 transition-all active:scale-90 ${activeImage === idx ? 'border-white scale-110 shadow-xl' : 'border-white/20 opacity-60'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="Thumb" />
              </button>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-4 right-8 bg-slate-900 text-white px-8 py-4 rounded-[24px] font-black text-2xl shadow-2xl shadow-slate-900/20">
          {formatCurrency(product.price)}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-8 pt-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">{product.category}</p>
            <button 
              onClick={triggerAIChat}
              className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-full border border-slate-100 transition-colors"
            >
              <svg className="w-3 h-3 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">Ask AI</span>
            </button>
          </div>
          <h1 className="text-3xl font-black text-slate-900 leading-tight">{product.name}</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center text-yellow-500 font-black">★</div>
            <span className="text-sm font-black text-slate-900">{product.rating || 4.8}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
            </div>
            <span className="text-sm font-black text-slate-400 uppercase tracking-widest text-[10px]">Fast Delivery</span>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Select Quantity</h3>
          <QuantitySelector value={quantity} onChange={setQuantity} className="max-w-[180px] h-14" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">The Details</h3>
            <button onClick={triggerAIChat} className="text-[10px] font-black text-blue-600 uppercase underline decoration-2 underline-offset-4">Dimension Help?</button>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">
            {product.description || "Premium materials carefully curated for maximum comfort and durability. This limited edition piece represents our commitment to modern craftsmanship and timeless design."}
          </p>
        </div>
      </div>

      {/* Action Tray */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 flex gap-4 z-50">
        <button 
          onClick={() => addToCart({ ...product, quantity })}
          className="w-16 h-16 bg-white border-2 border-slate-100 rounded-[28px] flex items-center justify-center text-slate-900 active:scale-95 transition-all shadow-xl shadow-slate-100"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        </button>
        <button 
          onClick={handleCreateOrder}
          disabled={orderLoading}
          className="flex-1 bg-emerald-500 text-white rounded-[28px] font-black text-lg shadow-2xl shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 h-16"
        >
          {orderLoading ? (
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.996-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.464c1.547.917 3.075 1.403 4.813 1.403 5.4 0 9.786-4.386 9.788-9.787 0-2.615-1.02-5.074-2.871-6.928-1.851-1.854-4.31-2.87-6.923-2.87-5.401 0-9.787 4.386-9.789 9.788 0 1.848.52 3.555 1.504 5.122l-.993 3.62 3.713-.974zm11.367-7.374c-.157-.263-.58-.419-1.217-.738-.639-.32-3.774-1.863-4.358-2.077-.583-.214-1.007-.321-1.429.321-.424.643-1.636 2.077-2.003 2.505-.367.428-.735.481-1.372.162-.637-.319-2.688-1.047-5.118-3.32-1.891-1.688-3.167-3.773-3.539-4.413-.372-.64-.04-.986.279-1.303.288-.283.639-.738.958-1.107.319-.369.424-.633.637-1.056.212-.424.106-.797-.053-1.116-.16-.319-1.429-3.444-1.957-4.714-.514-1.24-.104-1.707.158-2.042.262-.336.58-.419.897-.419.317 0 .633.003.897.003.454 0 .935-.12 1.353.491.464.678 1.585 3.844 1.724 4.13.14.286.233.619.047.994-.187.375-.281.604-.563.941-.281.336-.59.75-.844.994-.254.244-.52.511-.222.955.298.444 1.32 2.174 2.828 3.518 1.94 1.73 3.58 2.27 4.09 2.528.511.259.81.215 1.113-.127.303-.342 1.3-1.523 1.649-2.046.348-.523.696-.438 1.166-.263.47.175 2.977 1.401 3.492 1.658.514.257.857.385.983.6.126.215.126 1.24-.378 2.646-.504 1.405-2.943 2.76-4.037 2.822z"/></svg>
              Chat to Buy
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;

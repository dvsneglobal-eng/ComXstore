
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';

const Cart: React.FC = () => {
  const { cart, removeFromCart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    if (!user?.isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customer_phone: user.phone,
        items: cart.map(item => ({
          product_id: item.id,
          qty: item.quantity
        })),
        total: totalPrice
      };

      await apiService.createOrder(payload);

      const itemsList = cart.map(item => `• ${item.name} (x${item.quantity})`).join('\n');
      const message = `🛍️ *New Order from WhatsStore*\n\n` +
        `*Items:*\n${itemsList}\n\n` +
        `*Total:* ${formatCurrency(totalPrice)}\n` +
        `*Customer:* ${user.phone}\n\n` +
        `Please confirm this order!`;
        
      const encoded = encodeURIComponent(message);
      
      setOrdered(true);
      clearCart();
      
      setTimeout(() => {
        window.open(`https://wa.me/yournumber?text=${encoded}`, '_blank');
      }, 1200);

    } catch (err) {
      alert('Order failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (ordered) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] pt-20 text-center animate-fadeIn px-8">
        <div className="w-28 h-28 bg-emerald-50 text-emerald-500 rounded-[44px] flex items-center justify-center mb-10 shadow-2xl shadow-emerald-50 relative overflow-hidden group">
           <svg className="w-14 h-14 relative z-10 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
           <div className="absolute inset-0 bg-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Order Confirmed!</h2>
        <p className="text-slate-500 font-medium mb-12 max-w-[240px] mx-auto leading-relaxed">Your request is logged. We're launching WhatsApp to finalize your delivery details.</p>
        <button 
          onClick={() => navigate('/')}
          className="w-full h-16 bg-slate-900 text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-slate-200 active:scale-95 transition-all"
        >
          Back to Collections
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center animate-fadeIn px-8">
        <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[40px] flex items-center justify-center mb-8 shadow-inner">
           <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Your Cart is Empty</h2>
        <p className="text-slate-400 mb-10 font-medium leading-relaxed max-w-[220px]">Looks like you haven't added anything to your bag yet.</p>
        <button 
          onClick={() => navigate('/products')}
          className="w-full h-16 bg-slate-900 text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-100 active:scale-95 transition-all"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fadeIn pb-12">
      <header className="pt-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your Bag</h2>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">{cart.length} Handpicked items</p>
      </header>
      
      <div className="space-y-4">
        {cart.map(item => (
          <div key={item.id} className="flex gap-4 items-center bg-white p-5 rounded-[32px] border border-slate-50 shadow-sm active:bg-slate-50 transition-colors">
            <div className="relative group">
              <img src={item.image_url} alt={item.name} className="w-22 h-22 min-w-[88px] min-h-[88px] rounded-[24px] object-cover bg-slate-50 group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-slate-900 truncate text-sm mb-1">{item.name}</h3>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-3">{item.category}</p>
              <p className="text-slate-900 font-black text-lg">{formatCurrency(item.price)}</p>
            </div>
            <div className="flex flex-col items-end gap-4">
              <button 
                onClick={() => removeFromCart(item.id)}
                className="w-10 h-10 flex items-center justify-center text-slate-200 hover:text-red-500 transition-colors bg-slate-50 rounded-xl active:scale-90"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
              <div className="text-[10px] font-black bg-slate-900 text-white px-4 py-1.5 rounded-full shadow-lg">x{item.quantity}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 text-white p-8 rounded-[48px] space-y-8 shadow-2xl shadow-slate-200">
        <div className="space-y-4">
          <div className="flex justify-between text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
             <span>Subtotal</span>
             <span className="text-white">{formatCurrency(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
             <span>Doorstep Delivery</span>
             <span className="text-emerald-400">FREE</span>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex justify-between items-end">
           <div className="space-y-2">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Grand Total</span>
              <span className="text-4xl font-black block">{formatCurrency(totalPrice)}</span>
           </div>
           <div className="w-14 h-14 bg-white/10 rounded-3xl flex items-center justify-center border border-white/10">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
           </div>
        </div>
      </div>

      <button 
        disabled={loading}
        onClick={handleCheckout}
        className="w-full h-20 bg-emerald-500 text-white rounded-[32px] font-black text-lg shadow-2xl shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
      >
        {loading ? (
          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.996-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.464c1.547.917 3.075 1.403 4.813 1.403 5.4 0 9.786-4.386 9.788-9.787 0-2.615-1.02-5.074-2.871-6.928-1.851-1.854-4.31-2.87-6.923-2.87-5.401 0-9.787 4.386-9.789 9.788 0 1.848.52 3.555 1.504 5.122l-.993 3.62 3.713-.974zm11.367-7.374c-.157-.263-.58-.419-1.217-.738-.639-.32-3.774-1.863-4.358-2.077-.583-.214-1.007-.321-1.429.321-.424.643-1.636 2.077-2.003 2.505-.367.428-.735.481-1.372.162-.637-.319-2.688-1.047-5.118-3.32-1.891-1.688-3.167-3.773-3.539-4.413-.372-.64-.04-.986.279-1.303.288-.283.639-.738.958-1.107.319-.369.424-.633.637-1.056.212-.424.106-.797-.053-1.116-.16-.319-1.429-3.444-1.957-4.714-.514-1.24-.104-1.707.158-2.042.262-.336.58-.419.897-.419.317 0 .633.003.897.003.454 0 .935-.12 1.353.491.464.678 1.585 3.844 1.724 4.13.14.286.233.619.047.994-.187.375-.281.604-.563.941-.281.336-.59.75-.844.994-.254.244-.52.511-.222.955.298.444 1.32 2.174 2.828 3.518 1.94 1.73 3.58 2.27 4.09 2.528.511.259.81.215 1.113-.127.303-.342 1.3-1.523 1.649-2.046.348-.523.696-.438 1.166-.263.47.175 2.977 1.401 3.492 1.658.514.257.857.385.983.6.126.215.126 1.24-.378 2.646-.504 1.405-2.943 2.76-4.037 2.822z"/></svg>
            Confirm on WhatsApp
          </>
        )}
      </button>
    </div>
  );
};

export default Cart;


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Order, CartItem } from '../types';
import { formatCurrency, formatPhoneNumber } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import QuantitySelector from '../components/QuantitySelector';

const STORE_WHATSAPP_NUMBER = '1234567890'; // Replace with your business number

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItems, setEditedItems] = useState<CartItem[]>([]);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    const loadOrder = async () => {
      try {
        const data = await apiService.fetchOrderById(id);
        setOrder(data);
        setEditedItems(data.items);
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  const handleFollowUp = () => {
    if (!order) return;
    
    const itemsList = order.items
      .map(item => `• ${item.name} (x${item.quantity}) @ ${formatCurrency(item.price)}`)
      .join('\n');

    const message = `👋 *Order Follow-up*\n\n` +
      `Hello! I'm reaching out regarding my order:\n\n` +
      `📦 *Order ID:* #${order.id.slice(-8)}\n` +
      `✅ *Status:* ${(order.status || 'pending').toUpperCase()}\n` +
      `👤 *Customer Phone:* ${formatPhoneNumber(order.customer_phone)}\n\n` +
      `🛒 *Items:*\n${itemsList}\n\n` +
      `💰 *Total Amount:* ${formatCurrency(order.total)}\n\n` +
      `Please provide an update on delivery/confirmation. Thank you!`;
      
    window.open(`https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const calculateTotal = (items: CartItem[]) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleUpdateQuantity = (idx: number, newQty: number) => {
    const newItems = [...editedItems];
    newItems[idx] = { ...newItems[idx], quantity: newQty };
    setEditedItems(newItems);
  };

  const handleSaveChanges = async () => {
    if (!order || !id) return;
    setUpdating(true);
    try {
      const total = calculateTotal(editedItems);
      await apiService.updateOrder(id, {
        items: editedItems.map(i => ({ product_id: i.id, quantity: i.quantity })),
        total
      });
      setOrder({ ...order, items: editedItems, total });
      setIsEditing(false);
      alert('Order updated successfully!');
    } catch (err) {
      alert('Failed to update order. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!id || !order) return;
    setUpdating(true);
    try {
      await apiService.updateOrder(id, {
        items: order.items.map(i => ({ product_id: i.id, quantity: i.quantity })),
        total: order.total,
        status: 'confirmed'
      });
      setOrder({ ...order, status: 'confirmed' });
      alert('Order marked as confirmed! ✅');
    } catch (err) {
      alert('Failed to confirm order.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
      <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Locating Order...</p>
    </div>
  );

  if (!order) return (
    <div className="py-20 text-center px-8">
      <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center mx-auto mb-6 text-slate-200">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-2">Order Not Found</h3>
      <p className="text-slate-500 text-sm mb-8">We couldn't find an order with that ID. It may have been archived.</p>
      <Button variant="primary" fullWidth onClick={() => navigate(-1)}>Go Back</Button>
    </div>
  );

  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-100',
    delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };

  const currentStatus = order.status || 'pending';
  const isAdmin = user?.isAdmin;
  const showEditButton = isAdmin && currentStatus === 'pending';
  const displayItems = isEditing ? editedItems : order.items;
  const displayTotal = isEditing ? calculateTotal(editedItems) : order.total;

  return (
    <div className="space-y-8 pb-32 animate-fadeIn max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl border border-slate-100 shadow-sm active:scale-90 transition-transform">
            <svg className="w-5 h-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Order Receipt</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking ID: #{order.id.slice(-12)}</p>
          </div>
        </div>
        
        {showEditButton && (
          <button 
            onClick={() => {
              if (isEditing) setEditedItems(order.items);
              setIsEditing(!isEditing);
            }} 
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${isEditing ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-900 text-white border-slate-900'}`}
          >
            {isEditing ? 'Cancel' : 'Edit Order'}
          </button>
        )}
      </div>

      {/* Hero Status & Total */}
      <div className={`p-8 rounded-[40px] border relative overflow-hidden shadow-xl shadow-slate-100 transition-colors ${statusColors[currentStatus as keyof typeof statusColors]}`}>
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Current Status</p>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${currentStatus === 'delivered' ? 'bg-emerald-500' : currentStatus === 'confirmed' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                <p className="text-2xl font-black capitalize tracking-tight">{currentStatus}</p>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/40 backdrop-blur-md flex items-center justify-center">
              {currentStatus === 'pending' && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              {currentStatus === 'confirmed' && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
              {currentStatus === 'delivered' && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            </div>
          </div>
          
          <div className="pt-6 border-t border-current/10">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Grand Total</p>
            <p className="text-4xl font-black tracking-tight">{formatCurrency(displayTotal)}</p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-[0.03] rounded-full translate-x-10 -translate-y-10"></div>
      </div>

      {/* Items Breakdown */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Itemized Breakdown</h3>
          <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full">{displayItems.length} Products</span>
        </div>
        <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden divide-y divide-slate-50 shadow-xl shadow-slate-50">
          {displayItems.map((item, idx) => (
            <div key={idx} className="p-6 flex gap-5 items-center hover:bg-slate-50/50 transition-colors">
              <div className="relative">
                <img src={item.image_url} alt={item.name} className="w-20 h-20 rounded-[24px] object-cover bg-slate-50 shadow-sm" />
                {!isEditing && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-lg">
                    {item.quantity}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <p className="font-black text-slate-900 text-base leading-tight truncate">{item.name}</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg border border-blue-100">
                    <span className="text-[10px] font-black uppercase">{formatCurrency(item.price)}</span>
                  </div>
                  <span className="text-slate-200 text-xs">×</span>
                  <div className="flex items-center bg-slate-50 text-slate-500 px-2 py-0.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-black uppercase">Qty: {item.quantity}</span>
                  </div>
                </div>
                {isEditing && (
                  <div className="pt-2">
                    <QuantitySelector 
                      value={item.quantity} 
                      onChange={(val) => handleUpdateQuantity(idx, val)} 
                      className="h-10 px-1 border-none shadow-none bg-slate-100/50"
                    />
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="font-black text-slate-900 text-lg tracking-tight">{formatCurrency(item.price * item.quantity)}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Subtotal</p>
              </div>
            </div>
          ))}
          
          <div className="p-8 bg-slate-50/50 space-y-4">
            <div className="flex justify-between items-center text-slate-400">
               <span className="text-[10px] font-black uppercase tracking-widest">Subtotal Items</span>
               <span className="font-bold">{formatCurrency(displayTotal)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
               <span className="text-[10px] font-black uppercase tracking-widest">Handling & Delivery</span>
               <span className="text-emerald-500 font-bold uppercase text-[10px] tracking-widest">Free</span>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Order Total</span>
              <span className="text-3xl font-black text-slate-900 tracking-tight">{formatCurrency(displayTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50 flex flex-col gap-3">
        {isEditing ? (
          <Button 
            onClick={handleSaveChanges} 
            isLoading={updating} 
            fullWidth 
            className="h-20 bg-blue-600 text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 active:scale-95 transition-all"
          >
            Update Order
          </Button>
        ) : (
          <>
            {showEditButton && (
              <Button 
                onClick={handleConfirmOrder} 
                isLoading={updating} 
                fullWidth 
                className="h-20 bg-slate-900 text-white rounded-[32px] font-black text-lg shadow-2xl shadow-slate-900/10 active:scale-95 transition-all"
              >
                Confirm Order Payment
              </Button>
            )}
            <button 
              onClick={handleFollowUp}
              className={`w-full h-20 bg-emerald-500 text-white rounded-[32px] font-black text-lg shadow-2xl shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-4 group ${currentStatus === 'delivered' ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
              disabled={currentStatus === 'delivered'}
            >
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.996-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.464c1.547.917 3.075 1.403 4.813 1.403 5.4 0 9.786-4.386 9.788-9.787 0-2.615-1.02-5.074-2.871-6.928-1.851-1.854-4.31-2.87-6.923-2.87-5.401 0-9.787 4.386-9.789 9.788 0 1.848.52 3.555 1.504 5.122l-.993 3.62 3.713-.974zm11.367-7.374c-.157-.263-.58-.419-1.217-.738-.639-.32-3.774-1.863-4.358-2.077-.583-.214-1.007-.321-1.429.321-.424.643-1.636 2.077-2.003 2.505-.367.428-.735.481-1.372.162-.637-.319-2.688-1.047-5.118-3.32-1.891-1.688-3.167-3.773-3.539-4.413-.372-.64-.04-.986.279-1.303.288-.283.639-.738.958-1.107.319-.369.424-.633.637-1.056.212-.424.106-.797-.053-1.116-.16-.319-1.429-3.444-1.957-4.714-.514-1.24-.104-1.707.158-2.042.262-.336.58-.419.897-.419.317 0 .633.003.897.003.454 0 .935-.12 1.353.491.464.678 1.585 3.844 1.724 4.13.14.286.233.619.047.994-.187.375-.281.604-.563.941-.281.336-.59.75-.844.994-.254.244-.52.511-.222.955.298.444 1.32 2.174 2.828 3.518 1.94 1.73 3.58 2.27 4.09 2.528.511.259.81.215 1.113-.127.303-.342 1.3-1.523 1.649-2.046.348-.523.696-.438 1.166-.263.47.175 2.977 1.401 3.492 1.658.514.257.857.385.983.6.126.215.126 1.24-.378 2.646-.504 1.405-2.943 2.76-4.037 2.822z"/></svg>
              </div>
              Follow Up on WhatsApp
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;

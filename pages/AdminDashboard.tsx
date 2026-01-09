
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import { apiService } from '../services/api';
import { Product, Order } from '../types';
import { formatCurrency, formatPhoneNumber } from '../utils/formatters';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Orders' | 'Products'>('Overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.isAdmin) return;
      try {
        setLoading(true);
        const [prodData, orderData] = await Promise.allSettled([
          apiService.fetchProducts(),
          apiService.fetchOrders()
        ]);
        
        if (prodData.status === 'fulfilled') setProducts(prodData.value);
        if (orderData.status === 'fulfilled') setOrders(orderData.value);
      } catch (err) {
        console.error('Error loading admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  if (!user?.isAuthenticated || !user?.isAdmin) return <Navigate to="/login" />;

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
    const s = status || 'pending';
    const styles = {
      pending: 'bg-yellow-100 text-yellow-600 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-600 border-blue-200',
      delivered: 'bg-emerald-100 text-emerald-600 border-emerald-200',
    };
    return (
      <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${styles[s as keyof typeof styles]}`}>
        {s}
      </span>
    );
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-slate-50 flex flex-col animate-fadeIn">
      {/* Admin Top Header */}
      <header className="bg-slate-900 p-8 pb-12 rounded-b-[40px] text-white space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="p-2.5 bg-white/10 rounded-2xl active:scale-95 transition-transform text-white">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-sm font-black uppercase tracking-[0.2em]">Management</h1>
          <div className="w-10 h-10 bg-slate-800 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.phone}`} alt="admin" />
          </div>
        </div>
        
        <div>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Estimated Revenue</p>
          <h2 className="text-4xl font-black">{formatCurrency(totalRevenue)}</h2>
        </div>
      </header>

      {/* Stats Cards Overview */}
      <div className="px-6 -mt-8 grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-5 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100">
             <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Products</p>
             <p className="text-2xl font-black text-slate-900">{products.length}</p>
             <span className="text-emerald-500 text-[10px] font-bold">Live Catalog</span>
          </div>
          <div className="bg-white p-5 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100">
             <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Orders</p>
             <p className="text-2xl font-black text-slate-900">{orders.length}</p>
             <span className="text-blue-500 text-[10px] font-bold">Total Sales</span>
          </div>
      </div>

      {/* Tabs Menu */}
      <div className="px-6 mb-6">
        <div className="flex bg-slate-200/50 p-1.5 rounded-[24px]">
          {(['Overview', 'Orders', 'Products'] as const).map(t => (
            <button 
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-[18px] transition-all ${activeTab === t ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 px-6 space-y-6 pb-28 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 w-full bg-slate-100 animate-pulse rounded-[32px]" />)}
          </div>
        ) : (
          <>
            {activeTab === 'Overview' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Recent Orders</h3>
                  <button onClick={() => setActiveTab('Orders')} className="text-blue-600 text-[10px] font-black uppercase tracking-widest">View All</button>
                </div>
                <div className="space-y-4">
                  {orders.slice(0, 5).map(order => (
                    <Link key={order.id} to={`/order/${order.id}`} className="bg-white p-5 rounded-[32px] border border-slate-100 flex items-center gap-4 shadow-sm active:bg-slate-50 transition-colors">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-sm text-slate-900 truncate">Order #{order.id.slice(-4)}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{formatPhoneNumber(order.customer_phone)}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-black text-slate-900 text-sm">{formatCurrency(order.total)}</p>
                        <StatusBadge status={order.status} />
                      </div>
                    </Link>
                  ))}
                  {orders.length === 0 && (
                    <div className="py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest italic">No orders yet</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'Orders' && (
              <div className="space-y-4">
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Full Order History</h3>
                {orders.map(order => (
                  <Link key={order.id} to={`/order/${order.id}`} className="bg-white p-5 rounded-[32px] border border-slate-100 space-y-4 shadow-sm block active:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-black text-sm text-slate-900">Order #{order.id.slice(-6)}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(order.created_at || Date.now()).toLocaleDateString()}</p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
                       <p className="text-xs font-bold text-slate-500">{order.items.length} Items</p>
                       <p className="font-black text-slate-900">{formatCurrency(order.total)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {activeTab === 'Products' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Catalog Items</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {products.map(product => (
                    <div key={product.id} className="bg-white p-4 rounded-[32px] border border-slate-100 flex items-center gap-4 shadow-sm">
                      <img src={product.image_url} alt={product.name} className="w-16 h-16 rounded-2xl object-cover bg-slate-50" />
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-sm text-slate-900 truncate">{product.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.category}</p>
                        <p className="text-blue-600 font-black text-xs mt-1">{formatCurrency(product.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-900">{product.stock}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">In Stock</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6">
        <Button variant="primary" fullWidth className="h-16 rounded-[28px] shadow-2xl shadow-slate-900/10">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
           {activeTab === 'Products' ? 'Add New Product' : 'Dashboard Action'}
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;

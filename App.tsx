
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import OrderDetails from './pages/OrderDetails';
import Support from './pages/Support';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/products" element={<MainLayout><Catalog /></MainLayout>} />
            <Route path="/product/:id" element={<MainLayout><ProductDetails /></MainLayout>} />
            <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
            <Route path="/support" element={<MainLayout><Support /></MainLayout>} />
            <Route path="/order/:id" element={<MainLayout><OrderDetails /></MainLayout>} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;

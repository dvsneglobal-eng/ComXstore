
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all duration-500 group">
      <Link to={`/product/${product.id}`} className="block relative">
        <img 
          src={product.image_url || `https://picsum.photos/seed/${product.id}/500/600`} 
          alt={product.name}
          className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur rounded-xl text-[10px] font-black text-slate-900 shadow-sm uppercase tracking-widest">
          {product.category}
        </div>
        <div className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
           <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        </div>
      </Link>
      <div className="p-5">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-slate-900 text-sm line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5 mb-4">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{product.rating || 4.5}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-black text-slate-900">{formatCurrency(product.price)}</span>
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="w-11 h-11 flex items-center justify-center bg-slate-900 text-white rounded-2xl active:scale-90 transition-transform shadow-lg shadow-slate-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

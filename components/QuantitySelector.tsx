
import React from 'react';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ value, onChange, className = '' }) => {
  return (
    <div className={`flex items-center gap-4 bg-slate-50 p-2 rounded-[22px] border border-slate-100 shadow-inner ${className}`}>
      <button 
        onClick={() => onChange(Math.max(1, value - 1))}
        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-900 active:scale-90 transition-transform font-bold text-xl"
      >
        −
      </button>
      <span className="w-8 text-center font-black text-slate-900 text-lg">{value}</span>
      <button 
        onClick={() => onChange(value + 1)}
        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-900 active:scale-90 transition-transform font-bold text-xl"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;

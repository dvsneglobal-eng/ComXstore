
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  fullWidth, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-4 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100";
  
  const variants = {
    primary: "bg-slate-900 text-white shadow-xl shadow-slate-200 hover:bg-slate-800",
    secondary: "bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700",
    outline: "bg-transparent border-2 border-slate-100 text-slate-900 hover:bg-slate-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </button>
  );
};

export default Button;

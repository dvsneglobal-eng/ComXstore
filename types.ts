
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  images?: string[]; // Supporting gallery
  stock: number;
  rating?: number;
  featured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customer_phone: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered';
  created_at: string;
}

export interface User {
  phone: string;
  isAuthenticated: boolean;
  isAdmin?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

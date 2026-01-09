
/**
 * Centralized API Service Layer
 * Handles all communication with the n8n backend.
 */

export const getBaseUrl = (): string => {
  // Try Vite environment variable first
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  // Fallback to local storage configuration (set in Profile page)
  return envUrl || localStorage.getItem('ws_backend_url') || '';
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('ws_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Generic request helper for standardized error handling
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getBaseUrl();
  
  if (!baseUrl) {
    throw new Error('Backend URL not configured. Please set it in Settings/Profile.');
  }

  // Ensure endpoint starts with /
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${path}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // Try to extract a meaningful error message from n8n or standard HTTP error
      const errorMessage = data?.message || data?.error || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data as T;
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

export const apiService = {
  isConfigured: () => !!getBaseUrl(),

  /**
   * Fetch all products for the catalog
   */
  async fetchProducts(): Promise<any[]> {
    return apiRequest<any[]>('/products');
  },

  /**
   * Fetch a single product by its unique ID
   */
  async fetchProductById(id: string): Promise<any> {
    return apiRequest<any>(`/product?id=${id}`);
  },

  /**
   * Fetch products marked as featured
   */
  async fetchFeaturedProducts(): Promise<any[]> {
    return apiRequest<any[]>('/featured-products');
  },

  /**
   * Request a 6-digit OTP via WhatsApp
   */
  async requestOtp(phone: string): Promise<{ success: boolean; message?: string }> {
    return apiRequest<{ success: boolean; message?: string }>('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  /**
   * Verify the received OTP
   */
  async verifyOtp(phone: string, otp: string): Promise<{ token: string; isAdmin?: boolean }> {
    return apiRequest<{ token: string; isAdmin?: boolean }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });
  },

  /**
   * Submit a new order
   */
  async createOrder(payload: { 
    customer_phone: string; 
    items: Array<{ product_id: string; qty: number }>;
    total: number;
  }): Promise<{ success: boolean; order_id: string }> {
    return apiRequest<{ success: boolean; order_id: string }>('/order', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update an existing order (Admin only)
   */
  async updateOrder(id: string, payload: { 
    items: Array<{ product_id: string; quantity: number }>;
    total: number;
    status?: string;
  }): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/order?id=${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Admin: Fetch all orders
   */
  async fetchOrders(): Promise<any[]> {
    return apiRequest<any[]>('/orders');
  },

  /**
   * Fetch a single order by ID
   */
  async fetchOrderById(id: string): Promise<any> {
    return apiRequest<any>(`/order?id=${id}`);
  }
};

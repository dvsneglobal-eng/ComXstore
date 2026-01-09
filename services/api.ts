
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getBaseUrl = async (): Promise<string> => {
  return (await AsyncStorage.getItem('ws_backend_url')) || '';
};

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('ws_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = await getBaseUrl();
  
  if (!baseUrl) {
    throw new Error('Backend URL not configured');
  }

  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const headers = await getAuthHeaders();
    const response = await fetch(url, {
      ...options,
      headers: { ...headers, ...options.headers },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || `Request failed: ${response.status}`);
    }

    return data as T;
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

export const apiService = {
  // Fix: returns a promise, so callers must await or use .then()
  async isConfigured() {
    return !!(await getBaseUrl());
  },

  async fetchProducts(): Promise<any[]> {
    return apiRequest<any[]>('/products');
  },

  async fetchFeaturedProducts(): Promise<any[]> {
    return apiRequest<any[]>('/featured-products');
  },

  async fetchProductById(id: string): Promise<any> {
    return apiRequest<any>(`/product?id=${id}`);
  },

  // Fix: Added fetchOrders for admin and context awareness
  async fetchOrders(): Promise<any[]> {
    return apiRequest<any[]>('/orders');
  },

  // Fix: Added fetchOrderById for detailed order tracking
  async fetchOrderById(id: string): Promise<any> {
    return apiRequest<any>(`/order?id=${id}`);
  },

  async requestOtp(phone: string): Promise<any> {
    return apiRequest('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  async verifyOtp(phone: string, otp: string): Promise<any> {
    return apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });
  },

  async createOrder(payload: any): Promise<any> {
    return apiRequest('/order', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Fix: Added updateOrder to allow status updates and edits
  async updateOrder(id: string, payload: any): Promise<any> {
    return apiRequest(`/order?id=${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  }
};

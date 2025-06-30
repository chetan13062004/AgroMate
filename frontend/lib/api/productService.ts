import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // allow sending/receiving http-only cookies, if present
});

// Add request interceptor to include token in every request
api.interceptors.request.use(
  (config: any) => {
    // Ensure we always have a headers object
    if (!config.headers) config.headers = {} as any;

    // Prefer localStorage token, but gracefully fall back to cookie if you decide to store it there
    const token = getAuthToken();
    if (token) {
      (config.headers as any).Authorization = `Bearer ${token}`;
    }

    // Set Content-Type header conditionally
    if (config.data instanceof FormData) {
      // Do not set Content-Type header for FormData, Axios will set it automatically
    } else {
      (config.headers as any)['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Product service
export const productService = {
  // Get all products for the logged-in farmer
  getFarmerProducts: async () => {
    try {
      const response = await api.get('/products/farmer');
      return response.data.data.products;
    } catch (error) {
      console.error('Error fetching farmer products:', error);
      throw error;
    }
  },

  // Get a single product by ID
  getProduct: async (id: string) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data.data.product;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // Create a new product
  createProduct: async (formData: FormData) => {
    try {
      console.log('Creating product with form data');
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      console.log('Sending request to /products with form data');
      console.log('Form data entries:');
      // Log form data entries for debugging
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      // Do NOT set the `Content-Type` header manually here. When a `FormData` instance
      // is passed, Axios will automatically set it to `multipart/form-data` **with** the
      // correct `boundary` value. Manually overriding it strips the boundary and causes
      // the request body to be parsed incorrectly on the server, resulting in a 400 error.
      const response = await api.post('/products', formData);
      
      if (!response.data || !response.data.data || !response.data.data.product) {
        throw new Error('Invalid response format from server');
      }
      
      console.log('Product created successfully:', response.data.data.product);
      return response.data.data.product;
    } catch (error: any) {
      console.error('Detailed error creating product:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
      throw error;
    }
  },

  // Update an existing product
  updateProduct: async (id: string, productData: any) => {
    try {
      const formData = new FormData();
      
      // Append all product data to formData
      Object.keys(productData).forEach(key => {
        if (key === 'image' && productData[key]) {
          formData.append('image', productData[key]);
        } else if (productData[key] !== undefined && productData[key] !== null) {
          formData.append(key, productData[key]);
        }
      });

      const response = await api.patch(`/products/${id}`, formData);
      
      return response.data.data.product;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  // Delete a product
  deleteProduct: async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },

  // Update product stock
  updateStock: async (id: string, stock: number) => {
    try {
      const response = await api.patch(`/products/${id}`, { stock });
      return response.data.data.product;
    } catch (error) {
      console.error(`Error updating stock for product ${id}:`, error);
      throw error;
    }
  },

  // Toggle product featured status
  toggleFeatured: async (id: string, featured: boolean) => {
    try {
      const response = await api.patch(`/products/${id}`, { featured });
      return response.data.data.product;
    } catch (error) {
      console.error(`Error toggling featured status for product ${id}:`, error);
      throw error;
    }
  },
};

export default productService;

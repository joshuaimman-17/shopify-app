import axios from 'axios';

// Base API URL
const api = axios.create({
  baseURL: 'http://localhost:5277/api',
  timeout: 10000,
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== AUTH API ==========
export const login = (credentials) => api.post('/Auth/login', credentials);
export const registerCustomer = (data) => api.post('/Auth/register-customer', data);
export const registerAgent = (data) => api.post('/Auth/register-agent', data);
export const registerAdmin = (data) => api.post('/Auth/register-admin', data);

// ========== PRODUCT API ==========
export const getAllProducts = () => api.get('/Product/all');
export const getProductById = (id) => api.get(`/Product/get/${id}`);
export const addProduct = (data) => api.post('/Product/add', data);
export const updateProduct = (data) => api.put('/Product/update', data);
export const deleteProduct = (id) => api.delete(`/Product/delete/${id}`);

// ========== ORDER API ==========
export const placeOrder = (data) => api.post('/Order/place', data);
export const getAllOrders = () => api.get('/Order/all');
export const getOrdersOfCustomer = (customerId) => api.get(`/Order/customer/${customerId}`);

export const getOrderById = (id) => api.get(`/order/${id}`);
export const cancelOrder = (id) => api.delete(`/order/cancel/${id}`);
export const updateOrderStatus = (data) => api.put('/order/update-status', data);
export const updateOrderDelivery = (data) => api.put('/order/update-delivery', data);
export const assignAgentToOrder = (data) => api.post('/order/assign-agent', data);
export const getOrderStatus = (id) => api.get(`/Order/GET-order-status/${id}`);
export const getOrderallStatus = () => api.get('/Order/all-status');
// ========== CUSTOMER API ==========
export const getCustomerById = (id) => api.get(`/Customer/user/${id}`);
export const getAllCustomers = () => api.get('/Customer/all');
export const updateCustomerName = (data) => api.put('/Customer/update-name', data);
export const updateCustomerUsername = (data) => api.put('/Customer/update-username', data);
export const updateCustomerPassword = (data) => api.put('/Customer/update-password', data);
export const updateCustomerEmail = (data) => api.put('/Customer/update-email', data);
export const updateCustomerPhone = (data) => api.put('/Customer/update-phone', data);

// ========== AGENT API ==========
export const getAgentById = (id) => api.get(`/Agent/${id}`);
export const getAllAgents = () => api.get('/Agent/all');
export const updateAgentName = (data) => api.put('/Agent/update-name', data);
export const updateAgentUsername = (data) => api.put('/Agent/update-username', data);
export const updateAgentPassword = (data) => api.put('/Agent/update-password', data);
export const updateAgentEmail = (data) => api.put('/Agent/update-email', data);
export const updateAgentPhone = (data) => api.put('/Agent/update-phone', data);

// ========== ADMIN API ==========
export const getAdminById = (id) => api.get(`/Admin/admin/${id}`);
export const updateAdminName = (data) => api.put('/Admin/update-name', data);
export const updateAdminUsername = (data) => api.put('/Admin/update-username', data);
export const updateAdminPassword = (data) => api.put('/Admin/update-password', data);
export const updateAdminEmail = (data) => api.put('/Admin/update-email', data);
export const updateAdminPhone = (data) => api.put('/Admin/update-phone', data);

// ========== UTILITY FUNCTIONS ==========
export const testApiConnection = async () => {
  try {
    const response = await api.get('/');
    console.log('API Root Response:', response.data);
    return response;
  } catch (error) {
    console.error('API Connection Test Failed:', error);
    throw error;
  }
};

// Clear mock data (for development)
export const clearMockData = () => {
  localStorage.removeItem('mockOrders');
  console.log('Mock data cleared');
};

export default api;

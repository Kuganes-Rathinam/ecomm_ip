import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// ── Users ───────────────────────────────────────────────────
export const userApi = {
  register: (data) => api.post('/users/register', data),
  login:    (data) => api.post('/users/login', data),
  getById:  (id)   => api.get(`/users/${id}`),
  update:   (id, data) => api.put(`/users/${id}`, data),
}

// ── Categories ──────────────────────────────────────────────
export const categoryApi = {
  getAll:  ()       => api.get('/categories'),
  getById: (id)     => api.get(`/categories/${id}`),
  create:  (data)   => api.post('/categories', data),
  update:  (id, d)  => api.put(`/categories/${id}`, d),
  delete:  (id)     => api.delete(`/categories/${id}`),
}

// ── Products ────────────────────────────────────────────────
export const productApi = {
  getAll:        (params)  => api.get('/products', { params }),
  getById:       (id)      => api.get(`/products/${id}`),
  getBySlug:     (slug)    => api.get(`/products/slug/${slug}`),
  getByCategory: (catId)   => api.get(`/products/category/${catId}`),
  create:        (data)    => api.post('/products', data),
  update:        (id, d)   => api.put(`/products/${id}`, d),
  delete:        (id)      => api.delete(`/products/${id}`),
}

// ── Attributes ──────────────────────────────────────────────
export const attributeApi = {
  getAll:  ()      => api.get('/attributes'),
  getById: (id)    => api.get(`/attributes/${id}`),
  create:  (data)  => api.post('/attributes', data),
  update:  (id, d) => api.put(`/attributes/${id}`, d),
  delete:  (id)    => api.delete(`/attributes/${id}`),
}

// ── Terms ───────────────────────────────────────────────────
export const termApi = {
  getAll:           ()      => api.get('/terms'),
  getByAttribute:   (atId)  => api.get(`/terms/attribute/${atId}`),
  create:           (data)  => api.post('/terms', data),
  update:           (id, d) => api.put(`/terms/${id}`, d),
  delete:           (id)    => api.delete(`/terms/${id}`),
}

// ── Cart ────────────────────────────────────────────────────
export const cartApi = {
  getCart:        (userId)              => api.get(`/carts/${userId}`),
  addItem:        (userId, productId, quantity) =>
                    api.post(`/carts/${userId}/items`, { productId, quantity }),
  updateItem:     (userId, productId, quantity) =>
                    api.put(`/carts/${userId}/items/${productId}`, { quantity }),
  removeItem:     (userId, productId)   => api.delete(`/carts/${userId}/items/${productId}`),
  clearCart:      (userId)              => api.delete(`/carts/${userId}`),
}

// ── Orders ──────────────────────────────────────────────────
export const orderApi = {
  placeOrder:   (userId)   => api.post(`/orders/place/${userId}`),
  getByUser:    (userId)   => api.get(`/orders/user/${userId}`),
  getById:      (orderId)  => api.get(`/orders/${orderId}`),
  updateStatus: (orderId, status) => api.patch(`/orders/${orderId}/status`, { status }),
}

// ── Payments ────────────────────────────────────────────────
export const paymentApi = {
  create:       (data)       => api.post('/payments', data),
  getById:      (id)         => api.get(`/payments/${id}`),
  getByOrder:   (orderId)    => api.get(`/payments/order/${orderId}`),
  updateStatus: (id, status) => api.patch(`/payments/${id}/status`, { status }),
}

export default api

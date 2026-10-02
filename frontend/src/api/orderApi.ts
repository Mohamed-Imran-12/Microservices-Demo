import apiClient from './client';
import type { OrderRequest, OrderResponse, OrderDetails } from '../types';

export const orderApi = {
  // Authenticated: create order (backend validates X-User-Email from JWT)
  createOrder: (data: OrderRequest) =>
    apiClient.post<OrderResponse>('/order-service/order', data),

  // Authenticated: get all orders for a user (backend validates role/email)
  getOrdersByUser: (userId: number) =>
    apiClient.get<OrderDetails[]>(`/order-service/orders/user/${userId}`),

  // Authenticated: get single order details (backend validates role/email)
  getOrder: (orderId: number) =>
    apiClient.get<OrderResponse>(`/order-service/order/${orderId}`),

  // Authenticated: cancel an order (backend validates role/email)
  cancelOrder: (orderId: number) =>
    apiClient.put<OrderResponse>(`/order-service/order/cancel/${orderId}`),
};

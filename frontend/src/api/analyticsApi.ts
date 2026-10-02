import apiClient from './client';
import type {
  DashboardData,
  SalesTrendData,
  ProductSalesData,
  SalesDataByCategory,
  SalesDataByUser,
  ProductSalesByRangeData,
  RevenueByRangeData,
} from '../types';

export const analyticsApi = {
  // ADMIN only
  getDashboard: () =>
    apiClient.get<DashboardData>('/analytics-service/analytics/dashboard'),

  // ADMIN only: sales trend by date range
  getSalesTrend: (from: string, to: string) =>
    apiClient.get<SalesTrendData[]>('/analytics-service/analytics/sales/trend', {
      params: { from, to },
    }),

  // ADMIN only: top-selling products
  getTopProducts: (limit = 10) =>
    apiClient.get<ProductSalesData[]>('/analytics-service/analytics/products/top', {
      params: { limit },
    }),

  // ADMIN only: sales data by category
  getSalesByCategory: () =>
    apiClient.get<SalesDataByCategory[]>('/analytics-service/analytics/categories'),

  // ADMIN only: sales data for a specific product
  getProductSales: (productId: number) =>
    apiClient.get<ProductSalesData>(`/analytics-service/analytics/product/${productId}`),

  // ADMIN only: sales data for a specific user
  getUserSales: (userId: number) =>
    apiClient.get<SalesDataByUser>(`/analytics-service/analytics/user/${userId}`),

  // ADMIN only: product sales by date range
  getProductSalesByRange: (productId: number, from: string, to: string) =>
    apiClient.get<ProductSalesByRangeData>(`/analytics-service/analytics/product/${productId}/sales`, {
      params: { from, to },
    }),

  // ADMIN only: revenue by date range
  getRevenueByRange: (from: string, to: string) =>
    apiClient.get<RevenueByRangeData>('/analytics-service/analytics/revenue', {
      params: { from, to },
    }),
};

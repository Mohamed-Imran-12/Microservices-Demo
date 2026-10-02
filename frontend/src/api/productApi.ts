import apiClient from './client';
import type {
  ProductRequest,
  ProductResponse,
  ProductUpdateRequest,
  ProductStockUpdateRequest,
  ProductLowStockResponse,
  ProductSearchResponse,
  ProductTransactionResponse,
} from '../types';

export const productApi = {
  // Public (authenticated): list all products
  getProducts: () =>
    apiClient.get<ProductResponse[]>('/product-service/products'),

  // Public (authenticated): get single product
  getProduct: (id: number) =>
    apiClient.get<ProductResponse>(`/product-service/product/${id}`),

  // Public (authenticated): search products by keyword
  searchProducts: (keyword: string) =>
    apiClient.get<ProductSearchResponse[]>(`/product-service/product/search/${encodeURIComponent(keyword)}`),

  // ADMIN only: create product
  createProduct: (data: ProductRequest) =>
    apiClient.post<ProductResponse>('/product-service/product', data),

  // ADMIN only: update product (no stock change)
  updateProduct: (data: ProductUpdateRequest) =>
    apiClient.put<ProductResponse>('/product-service/product', data),

  // ADMIN only: restock product (type must be RESTOCK)
  restockProduct: (data: ProductStockUpdateRequest) =>
    apiClient.put<ProductResponse>('/product-service/product/stock', data),

  // ADMIN only: get low-stock products
  getLowStockProducts: () =>
    apiClient.get<ProductLowStockResponse[]>('/product-service/products/low-stock'),

  // ADMIN only: get stock transactions for a product
  getProductTransactions: (productId: number) =>
    apiClient.get<ProductTransactionResponse[]>(`/product-service/product/transactions/${productId}`),
};

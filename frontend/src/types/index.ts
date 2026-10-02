// Types matching the real backend DTOs exactly

// ===== USER SERVICE =====

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  name: string;
  email: string;
  city: string;
  role: string;
  phone: string;
  jwt: string;
}

export interface UserRequest {
  name: string;
  email: string;
  password: string;
  city: string;
  phone: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  city: string;
  role: string;
  phone: string;
}

export interface UserUpdateRequest {
  id: number;
  name: string;
  email: string;
  city: string;
  phone: string;
}

// ===== PRODUCT SERVICE =====

export interface ProductRequest {
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export interface ProductResponse {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export interface ProductUpdateRequest {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
}

export interface ProductStockUpdateRequest {
  id: number;
  quantity: number;
  type: 'RESTOCK';
}

export interface ProductLowStockResponse {
  id: number;
  name: string;
  stock: number;
}

export interface ProductSearchResponse {
  id: number;
  name: string;
  category: string;
}

export type StockTransactionType = 'PURCHASE' | 'SALE' | 'RESTOCK' | 'RETURN';

export interface ProductTransactionResponse {
  id: number;
  productId: number;
  type: StockTransactionType;
  quantity: number;
  createdAt: string;
}

// ===== ORDER SERVICE =====

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderRequest {
  userId: number;
  items: OrderItemRequest[];
}

export interface OrderItemResponse {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  amount: number;
}

export type OrderStatus = 'CREATED' | 'CONFIRMED' | 'CANCELLED';

export interface OrderResponse {
  id: number;
  userId: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderItemResponse[];
}

export interface OrderDetails {
  id: number;
  userId: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

// ===== ANALYTICS SERVICE =====

export interface DashboardData {
  totalOrders: number;
  totalItems: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface SalesTrendData {
  date: string;
  totalOrders: number;
  totalItems: number;
  revenue: number;
}

export interface ProductSalesData {
  productId: number;
  productName: string;
  category: string;
  quantitySold: number;
  revenue: number;
}

export interface SalesDataByCategory {
  category: string;
  quantitySold: number;
  revenue: number;
}

export interface SalesDataByUser {
  userId: number;
  totalOrders: number;
  totalItems: number;
  totalSpent: number;
  averageOrderValue: number;
}

export interface ProductSalesByRangeData {
  productId: number;
  productName: string;
  category: string;
  quantitySold: number;
  revenue: number;
  from: string;
  to: string;
}

export interface RevenueByRangeData {
  totalRevenue: number;
  totalOrders: number;
  totalItems: number;
  averageOrderValue: number;
  from: string;
  to: string;
}

// ===== CART (frontend-only) =====

export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
  stock: number;
}

// ===== AUTH CONTEXT =====

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  city: string;
  role: string;
  phone: string;
  jwt: string;
}

import { OrderDetailPage } from '../OrderDetailPage'

// Admin order detail reuses the same OrderDetailPage component
// The backend handles authorization — ADMIN can see any order
export function AdminOrderDetailPage() {
  return <OrderDetailPage />
}

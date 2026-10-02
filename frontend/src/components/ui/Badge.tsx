import { cn } from '../../lib/utils';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'admin';
  children: React.ReactNode;
  className?: string;
}

const variants = {
  default: 'bg-slate-700/60 text-slate-300 border-slate-600/30',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger: 'bg-red-500/10 text-red-400 border-red-500/20',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  admin: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeProps['variant']> = {
    CONFIRMED: 'success',
    CANCELLED: 'danger',
    CREATED: 'warning',
  };
  return <Badge variant={map[status] ?? 'default'}>{status}</Badge>;
}

export function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <Badge variant="danger">Out of Stock</Badge>;
  if (stock < 10) return <Badge variant="warning">Low Stock ({stock})</Badge>;
  return <Badge variant="success">In Stock ({stock})</Badge>;
}

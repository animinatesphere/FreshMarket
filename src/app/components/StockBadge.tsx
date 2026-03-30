import { AlertCircle, CheckCircle, Package } from 'lucide-react';

interface StockBadgeProps {
  stockQuantity?: number;
  inStock: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StockBadge({ stockQuantity, inStock, size = 'sm' }: StockBadgeProps) {
  if (!inStock) {
    return (
      <div className={`flex items-center gap-1 text-red-600 ${
        size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
      }`}>
        <AlertCircle className={size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'} />
        <span>Out of Stock</span>
      </div>
    );
  }

  if (!stockQuantity) {
    return (
      <div className={`flex items-center gap-1 text-green-600 ${
        size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
      }`}>
        <CheckCircle className={size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'} />
        <span>In Stock</span>
      </div>
    );
  }

  // Low stock warning (less than 10 items)
  if (stockQuantity < 10) {
    return (
      <div className={`flex items-center gap-1 text-orange-600 ${
        size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
      }`}>
        <AlertCircle className={size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'} />
        <span>Only {stockQuantity} left!</span>
      </div>
    );
  }

  // Regular stock
  return (
    <div className={`flex items-center gap-1 text-green-600 ${
      size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
    }`}>
      <Package className={size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'} />
      <span>{stockQuantity} in stock</span>
    </div>
  );
}

import { AlertCircle, CheckCircle, Package } from 'lucide-react';

interface StockBadgeProps {
  stockQuantity?: number;
  inStock: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StockBadge({ stockQuantity, inStock, size = 'sm' }: StockBadgeProps) {
  const textSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base';
  const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5';

  if (!inStock) {
    return (
      <div className={`flex items-center gap-1 text-destructive ${textSize}`}>
        <AlertCircle className={iconSize} />
        <span>Out of Stock</span>
      </div>
    );
  }

  if (!stockQuantity) {
    return (
      <div className={`flex items-center gap-1 text-primary ${textSize}`}>
        <CheckCircle className={iconSize} />
        <span>In Stock</span>
      </div>
    );
  }

  // Low stock warning (less than 10 items)
  if (stockQuantity < 10) {
    return (
      <div className={`flex items-center gap-1 text-accent ${textSize}`}>
        <AlertCircle className={iconSize} />
        <span>Only {stockQuantity} left!</span>
      </div>
    );
  }

  // Regular stock
  return (
    <div className={`flex items-center gap-1 text-primary ${textSize}`}>
      <Package className={iconSize} />
      <span>{stockQuantity} in stock</span>
    </div>
  );
}

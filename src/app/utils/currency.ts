export const formatCurrency = (amount: number): string => {
  // Format with 2 decimal places and add thousand separators
  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const CURRENCY_SYMBOL = '₦';

// ==============================|| PAB UTILS ||============================== //

/**
 * Get label from options array
 */
export function getLabelFromOptions<T extends string>(value: T | undefined, options: Array<{ value: T; label: string }>): string {
  if (!value) return '-';
  const option = options.find((opt) => opt.value === value);
  return option?.label || value;
}

/**
 * Format currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
}

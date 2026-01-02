// ==============================|| MATERIAL RECEIPTS UTILS ||============================== //

/**
 * Get label from options array by value
 */
export function getLabelFromOptions<T extends { value: unknown; label: string }>(value: T['value'], options: T[]): string {
  const option = options.find((opt) => opt.value === value);
  return option?.label || value || '-';
}

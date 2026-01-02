// ==============================|| PARTNERS UTILS ||============================== //

/**
 * Get label from options array
 */
export function getLabelFromOptions<T extends string>(value: T | undefined, options: Array<{ value: T; label: string }>): string {
  if (!value) return '-';
  const option = options.find((opt) => opt.value === value);
  return option?.label || value;
}

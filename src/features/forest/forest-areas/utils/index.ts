// ==============================|| FOREST AREA UTILS ||============================== //

/**
 * Get label from options array
 * @param value - The value to find
 * @param options - Array of { value, label } options
 * @returns The label string or '-' if not found
 */
export function getLabelFromOptions<T extends string>(value: T | undefined, options: { value: T; label: string }[]): string {
  if (!value) return '-';
  const option = options.find((opt) => opt.value === value);
  return option?.label || value;
}

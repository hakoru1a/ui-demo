// ==============================|| LEGAL CERTIFICATE UTILITIES ||============================== //

import type { CertificateStatus } from '../types';
import { EXPIRY_WARNING_DAYS } from '../types';

/**
 * Calculate certificate status based on expiry date
 *
 * @param expiryDate - Expiry date
 * @returns Certificate status
 */
export function calculateCertificateStatus(expiryDate: Date | string): CertificateStatus {
  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
  const now = new Date();
  const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) {
    return 'expired';
  } else if (daysUntilExpiry <= EXPIRY_WARNING_DAYS) {
    return 'expiring_soon';
  } else {
    return 'active';
  }
}

/**
 * Check if certificate is expiring soon
 *
 * @param expiryDate - Expiry date
 * @returns True if expiring within warning days
 */
export function isExpiringSoon(expiryDate: Date | string): boolean {
  return calculateCertificateStatus(expiryDate) === 'expiring_soon';
}

/**
 * Check if certificate is expired
 *
 * @param expiryDate - Expiry date
 * @returns True if expired
 */
export function isExpired(expiryDate: Date | string): boolean {
  return calculateCertificateStatus(expiryDate) === 'expired';
}

/**
 * Get days until expiry
 *
 * @param expiryDate - Expiry date
 * @returns Number of days until expiry (negative if expired)
 */
export function getDaysUntilExpiry(expiryDate: Date | string): number {
  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
  const now = new Date();
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Format date for display
 *
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | undefined): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * Get label from options array
 *
 * @param value - Value to find
 * @param options - Options array
 * @returns Label or value if not found
 */
export function getLabelFromOptions<T extends { value: unknown; label: string }>(value: unknown, options: T[]): string {
  const option = options.find((opt) => opt.value === value);
  return option?.label || (typeof value === 'string' ? value : '-') || '-';
}

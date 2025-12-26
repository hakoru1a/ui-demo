// ==============================|| LEGAL CERTIFICATES CONSTANTS ||============================== //

import type { CertificateStatus, CertificateType, RenewalStatus } from './enums';

export const CERTIFICATE_TYPE_OPTIONS: { value: CertificateType; label: string }[] = [
  { value: 'FSC', label: 'FSC' },
  { value: 'PEFC', label: 'PEFC' }
];

export const CERTIFICATE_STATUS_OPTIONS: { value: CertificateStatus; label: string }[] = [
  { value: 'active', label: 'Còn hiệu lực' },
  { value: 'expiring_soon', label: 'Sắp hết hạn' },
  { value: 'expired', label: 'Đã hết hạn' },
  { value: 'inactive', label: 'Không hoạt động' }
];

export const RENEWAL_STATUS_OPTIONS: { value: RenewalStatus; label: string }[] = [
  { value: 'pending', label: 'Yêu cầu' },
  { value: 'under_review', label: 'Đang duyệt' },
  { value: 'approved', label: 'Duyệt thành công' },
  { value: 'rejected', label: 'Từ chối' },
  { value: 'cancelled', label: 'Đã hủy' }
];

// Route path segments
export const LEGAL_CERTIFICATE_PATHS = {
  ROOT: '/legal-certificates',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const LEGAL_CERTIFICATE_URLS = {
  LIST: LEGAL_CERTIFICATE_PATHS.ROOT,
  NEW: `${LEGAL_CERTIFICATE_PATHS.ROOT}/${LEGAL_CERTIFICATE_PATHS.NEW}`,
  DETAIL: (id: string) => `${LEGAL_CERTIFICATE_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${LEGAL_CERTIFICATE_PATHS.ROOT}/${id}/edit`
} as const;

// Days before expiry to show warning
export const EXPIRY_WARNING_DAYS = 90; // Cảnh báo 90 ngày trước khi hết hạn

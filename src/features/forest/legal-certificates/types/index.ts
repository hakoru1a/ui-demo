// ==============================|| LEGAL CERTIFICATES TYPES - PUBLIC EXPORTS ||============================== //

/**
 * Central export file for all Legal Certificates types
 * Import from here: import type { LegalCertificate, LegalCertificateFormData } from './types';
 */

// Export enums
export type { CertificateType, CertificateStatus, RenewalStatus } from './enums';

// Export entity types
export type { LegalCertificate, CertificateRenewal, CertificateApprovalHistory } from './entity';

// Export form types
export type { LegalCertificateFormData, CertificateRenewalFormData } from './form';

// Export constants
export {
  CERTIFICATE_TYPE_OPTIONS,
  CERTIFICATE_STATUS_OPTIONS,
  RENEWAL_STATUS_OPTIONS,
  LEGAL_CERTIFICATE_PATHS,
  LEGAL_CERTIFICATE_URLS,
  EXPIRY_WARNING_DAYS
} from './constants';

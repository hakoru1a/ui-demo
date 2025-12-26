// ==============================|| LEGAL CERTIFICATES MOCK DATA ||============================== //

import type { CertificateApprovalHistory, CertificateRenewal, LegalCertificate } from '../types/entity';

/**
 * Mock data for Legal Certificates
 */

// Helper to create dates
const createDate = (year: number, month: number, day: number): Date => {
  return new Date(year, month - 1, day);
};

// Helper to create date string
const dateStr = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Mock certificates
export const mockCertificates: LegalCertificate[] = [
  {
    id: 'cert-001',
    certificateType: 'FSC',
    certificateNumber: 'FSC-C-123456',
    issuingOrganization: 'Forest Stewardship Council',
    issueDate: dateStr(createDate(2022, 1, 15)),
    expiryDate: dateStr(createDate(2025, 1, 15)),
    certificateFile: '/files/certificates/fsc-001.pdf',
    certificateFileName: 'FSC-Certificate-2022.pdf',
    status: 'active',
    legalNotes: 'Chứng chỉ FSC cho vùng trồng tại Đắk Lắk',
    createdAt: dateStr(createDate(2022, 1, 15)),
    updatedAt: dateStr(createDate(2022, 1, 15)),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: 'cert-002',
    certificateType: 'PEFC',
    certificateNumber: 'PEFC-789012',
    issuingOrganization: 'Programme for the Endorsement of Forest Certification',
    issueDate: dateStr(createDate(2021, 6, 20)),
    expiryDate: dateStr(createDate(2024, 6, 20)),
    certificateFile: '/files/certificates/pefc-001.pdf',
    certificateFileName: 'PEFC-Certificate-2021.pdf',
    status: 'expired',
    legalNotes: 'Chứng chỉ PEFC đã hết hạn, cần gia hạn',
    createdAt: dateStr(createDate(2021, 6, 20)),
    updatedAt: dateStr(createDate(2024, 6, 20)),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: 'cert-003',
    certificateType: 'FSC',
    certificateNumber: 'FSC-C-345678',
    issuingOrganization: 'Forest Stewardship Council',
    issueDate: dateStr(createDate(2023, 3, 10)),
    expiryDate: dateStr(createDate(2026, 3, 10)),
    certificateFile: '/files/certificates/fsc-002.pdf',
    certificateFileName: 'FSC-Certificate-2023.pdf',
    status: 'active',
    legalNotes: 'Chứng chỉ FSC cho vùng trồng tại Gia Lai',
    createdAt: dateStr(createDate(2023, 3, 10)),
    updatedAt: dateStr(createDate(2023, 3, 10)),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: 'cert-004',
    certificateType: 'PEFC',
    certificateNumber: 'PEFC-901234',
    issuingOrganization: 'Programme for the Endorsement of Forest Certification',
    issueDate: dateStr(createDate(2022, 9, 5)),
    // Set expiry date to 60 days from now (sắp hết hạn)
    expiryDate: dateStr(new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)),
    certificateFile: '/files/certificates/pefc-002.pdf',
    certificateFileName: 'PEFC-Certificate-2022.pdf',
    status: 'expiring_soon', // Sắp hết hạn (trong vòng 90 ngày)
    legalNotes: 'Chứng chỉ PEFC sắp hết hạn, cần chuẩn bị gia hạn',
    createdAt: dateStr(createDate(2022, 9, 5)),
    updatedAt: dateStr(createDate(2022, 9, 5)),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: 'cert-005',
    certificateType: 'FSC',
    certificateNumber: 'FSC-C-567890',
    issuingOrganization: 'Forest Stewardship Council',
    issueDate: dateStr(createDate(2024, 1, 1)),
    expiryDate: dateStr(createDate(2027, 1, 1)),
    certificateFile: '/files/certificates/fsc-003.pdf',
    certificateFileName: 'FSC-Certificate-2024.pdf',
    status: 'active',
    legalNotes: 'Chứng chỉ FSC mới được cấp',
    createdAt: dateStr(createDate(2024, 1, 1)),
    updatedAt: dateStr(createDate(2024, 1, 1)),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: 'cert-006',
    certificateType: 'PEFC',
    certificateNumber: 'PEFC-123456',
    issuingOrganization: 'Programme for the Endorsement of Forest Certification',
    issueDate: dateStr(createDate(2020, 5, 15)),
    expiryDate: dateStr(createDate(2023, 5, 15)),
    certificateFile: '/files/certificates/pefc-003.pdf',
    certificateFileName: 'PEFC-Certificate-2020.pdf',
    status: 'expired',
    legalNotes: 'Chứng chỉ PEFC đã hết hạn từ năm 2023',
    createdAt: dateStr(createDate(2020, 5, 15)),
    updatedAt: dateStr(createDate(2023, 5, 15)),
    createdBy: 'admin',
    updatedBy: 'admin'
  }
];

// Mock renewals
export const mockRenewals: CertificateRenewal[] = [
  {
    id: 'renewal-001',
    certificateId: 'cert-002',
    status: 'approved',
    requestedDate: dateStr(createDate(2024, 5, 1)),
    requestedBy: 'user-001',
    reviewDate: dateStr(createDate(2024, 5, 5)),
    reviewedBy: 'admin',
    approvedDate: dateStr(createDate(2024, 5, 10)),
    approvedBy: 'admin',
    newExpiryDate: dateStr(createDate(2027, 6, 20)),
    notes: 'Gia hạn thành công, chứng chỉ mới đã được cấp',
    certificateFile: '/files/certificates/pefc-001-renewed.pdf',
    createdAt: dateStr(createDate(2024, 5, 1)),
    updatedAt: dateStr(createDate(2024, 5, 10))
  },
  {
    id: 'renewal-002',
    certificateId: 'cert-004',
    status: 'under_review',
    requestedDate: dateStr(createDate(2024, 11, 1)),
    requestedBy: 'user-002',
    reviewDate: dateStr(createDate(2024, 11, 2)),
    reviewedBy: 'admin',
    newExpiryDate: dateStr(createDate(2028, 9, 5)),
    notes: 'Đang chờ phê duyệt từ ban quản lý',
    certificateFile: '/files/certificates/pefc-002-renewal.pdf',
    createdAt: dateStr(createDate(2024, 11, 1)),
    updatedAt: dateStr(createDate(2024, 11, 2))
  },
  {
    id: 'renewal-003',
    certificateId: 'cert-006',
    status: 'pending',
    requestedDate: dateStr(createDate(2024, 12, 1)),
    requestedBy: 'user-003',
    newExpiryDate: dateStr(createDate(2026, 5, 15)),
    notes: 'Yêu cầu gia hạn chứng chỉ PEFC',
    createdAt: dateStr(createDate(2024, 12, 1)),
    updatedAt: dateStr(createDate(2024, 12, 1))
  }
];

// Mock approval history
export const mockApprovalHistory: CertificateApprovalHistory[] = [
  {
    id: 'history-001',
    certificateId: 'cert-001',
    action: 'created',
    actionDate: dateStr(createDate(2022, 1, 15)),
    performedBy: 'admin',
    notes: 'Tạo chứng chỉ FSC mới'
  },
  {
    id: 'history-002',
    certificateId: 'cert-002',
    action: 'created',
    actionDate: dateStr(createDate(2021, 6, 20)),
    performedBy: 'admin',
    notes: 'Tạo chứng chỉ PEFC mới'
  },
  {
    id: 'history-003',
    certificateId: 'cert-002',
    action: 'renewed',
    actionDate: dateStr(createDate(2024, 5, 10)),
    performedBy: 'admin',
    notes: 'Gia hạn chứng chỉ thành công',
    renewalId: 'renewal-001',
    previousExpiryDate: dateStr(createDate(2024, 6, 20)),
    newExpiryDate: dateStr(createDate(2027, 6, 20))
  },
  {
    id: 'history-004',
    certificateId: 'cert-003',
    action: 'created',
    actionDate: dateStr(createDate(2023, 3, 10)),
    performedBy: 'admin',
    notes: 'Tạo chứng chỉ FSC mới'
  },
  {
    id: 'history-005',
    certificateId: 'cert-004',
    action: 'created',
    actionDate: dateStr(createDate(2022, 9, 5)),
    performedBy: 'admin',
    notes: 'Tạo chứng chỉ PEFC mới'
  },
  {
    id: 'history-006',
    certificateId: 'cert-005',
    action: 'created',
    actionDate: dateStr(createDate(2024, 1, 1)),
    performedBy: 'admin',
    notes: 'Tạo chứng chỉ FSC mới'
  },
  {
    id: 'history-007',
    certificateId: 'cert-006',
    action: 'created',
    actionDate: dateStr(createDate(2020, 5, 15)),
    performedBy: 'admin',
    notes: 'Tạo chứng chỉ PEFC mới'
  }
];

/**
 * Get mock certificate by ID
 */
export function getMockCertificateById(id: string): LegalCertificate | undefined {
  return mockCertificates.find((cert) => cert.id === id);
}

/**
 * Get mock renewals by certificate ID
 */
export function getMockRenewalsByCertificateId(certificateId: string): CertificateRenewal[] {
  return mockRenewals.filter((renewal) => renewal.certificateId === certificateId);
}

/**
 * Get mock approval history by certificate ID
 */
export function getMockApprovalHistoryByCertificateId(certificateId: string): CertificateApprovalHistory[] {
  return mockApprovalHistory.filter((history) => history.certificateId === certificateId);
}

/**
 * Get all mock certificates
 */
export function getMockCertificates(): LegalCertificate[] {
  return mockCertificates;
}

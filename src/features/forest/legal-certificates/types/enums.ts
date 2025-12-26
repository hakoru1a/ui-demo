// ==============================|| LEGAL CERTIFICATES ENUMS ||============================== //

export type CertificateType = 'FSC' | 'PEFC'; // Loại chứng chỉ

export type CertificateStatus = 'active' | 'expired' | 'expiring_soon' | 'inactive'; // Trạng thái hiệu lực

export type RenewalStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'cancelled'; // Trạng thái gia hạn

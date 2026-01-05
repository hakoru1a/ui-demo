// ==============================|| PAB ENUMS ||============================== //

// Trạng thái PAB
export type PabStatus = 'draft' | 'pending-approval' | 'approved' | 'rejected' | 'cancelled';

// Đơn vị
export type PabUnit = 'ton' | 'kg' | 'm3' | 'piece';

// Cấp duyệt
export type ApprovalLayer = 'business' | 'finance' | 'management';

// Quyết định duyệt
export type ApprovalDecision = 'approved' | 'rejected';

// Trạng thái giao dịch
export type TransactionStatus = 'negotiating' | 'confirmed' | 'cancelled';

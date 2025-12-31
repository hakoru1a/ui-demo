// ==============================|| SUPPLIERS ENUMS ||============================== //

export type SupplierType = 'individual' | 'business'; // Loại nhà cung cấp: Cá nhân / Doanh nghiệp
export type CertificateType = 'FSC' | 'PEFC'; // Loại chứng chỉ
export type TransactionType = 'import' | 'adjustment'; // Loại giao dịch: Nhập gỗ / Điều chỉnh
export type TransactionStatus = 'completed' | 'cancelled'; // Trạng thái giao dịch: Hoàn thành / Hủy
export type SupplierStatus = 'pending' | 'active' | 'inactive' | 'rejected'; // Trạng thái nhà cung cấp: Chờ duyệt / Hoạt động / Tạm ngưng / Từ chối

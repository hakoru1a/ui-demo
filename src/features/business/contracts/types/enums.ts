// ==============================|| CONTRACTS ENUMS ||============================== //

export type ContractType = 'buy' | 'sell'; // Loại hợp đồng: Mua / Bán
export type ContractStatus = 'draft' | 'active' | 'expired' | 'cancelled'; // Trạng thái: Nháp / Hiệu lực / Hết hạn / Hủy
export type PricingMethod = 'fixed' | 'formula'; // Phương thức giá: Cố định / Theo công thức
export type PartnerType = 'supplier' | 'customer'; // Đối tác: Nhà cung cấp / Khách hàng

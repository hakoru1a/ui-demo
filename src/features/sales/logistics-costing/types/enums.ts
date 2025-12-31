// ==============================|| LOGISTICS COSTING ENUMS ||============================== //

export type CostType = 'logistics' | 'service'; // Loại chi phí: Logistics / Dịch vụ
export type ServiceCategory = 'transport' | 'loading' | 'customs'; // Nhóm dịch vụ: Vận chuyển / Bốc xếp / Hải quan
export type AllocationMethod = 'by-shipment' | 'by-order'; // Phân bổ: Theo lô / Theo đơn
export type LogisticsCostStatus = 'draft' | 'recorded'; // Trạng thái: Nháp / Đã ghi nhận
export type Currency = 'VND' | 'USD' | 'EUR'; // Tiền tệ

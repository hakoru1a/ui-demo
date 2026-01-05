// ==============================|| PAYMENT ORDERS ENUMS ||============================== //

export type PaymentOrderType = 'payment' | 'expense'; // Loại phiếu: Thanh toán / Chi
export type PaymentOrderStatus = 'draft' | 'pending' | 'paid'; // Trạng thái: Nháp / Chờ duyệt / Đã thanh toán
export type PaymentMethod = 'cash' | 'transfer'; // Phương thức: Tiền mặt / Chuyển khoản
export type PartnerType = 'customer' | 'supplier'; // Đối tác: Khách hàng / NCC

// ==============================|| INVENTORY RECEIPTS ENUMS ||============================== //

export type ReceiptType = 'material' | 'finished'; // Loại nhập: Nguyên liệu / Thành phẩm (NL / TP)
export type ReceiptStatus = 'draft' | 'received' | 'cancelled'; // Trạng thái: Nháp / Đã nhập / Hủy
export type ReceiptSource = 'production' | 'purchase'; // Nguồn nhập: SX / Mua ngoài

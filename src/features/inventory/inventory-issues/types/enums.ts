// ==============================|| INVENTORY ISSUES ENUMS ||============================== //

export type IssueType = 'warehouse' | 'port'; // Loại xuất: Xuất kho / Xuất cảng
export type IssueStatus = 'draft' | 'issued' | 'cancelled'; // Trạng thái: Nháp / Đã xuất / Hủy
export type DestinationType = 'warehouse' | 'port'; // Điểm nhận: Kho nội bộ / Cảng

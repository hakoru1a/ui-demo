// ==============================|| TIMEKEEPING PAYROLL ENUMS ||============================== //

export type WorkShiftType = 'morning' | 'afternoon' | 'night' | 'overtime'; // Loại ca: Sáng / Chiều / Đêm / Tăng ca
export type TimekeepingStatus = 'pending' | 'confirmed' | 'locked'; // Trạng thái: Chờ xác nhận / Đã xác nhận / Đã khóa
export type PayrollStatus = 'draft' | 'calculated' | 'approved' | 'paid'; // Trạng thái bảng lương: Nháp / Đã tính / Đã duyệt / Đã thanh toán

// ==============================|| PAB ENTITY ||============================== //

import type { PabStatus, PabUnit, ApprovalLayer, ApprovalDecision, TransactionStatus } from './enums';

// Lịch sử phê duyệt
export interface ApprovalHistory {
  id: string;
  approvalLayer: ApprovalLayer;
  approverId: string;
  approverName: string;
  decision: ApprovalDecision;
  comment?: string;
  approvalDate: Date | string;
}

// PAB Entity
export interface Pab {
  id: string;
  code: string; // Mã PAB (Auto-generate, Read-only)
  customerId: string; // Khách hàng ID
  customerName: string; // Tên khách hàng
  productId: string; // Sản phẩm/Nguyên liệu ID
  productName: string; // Tên sản phẩm/Nguyên liệu
  quantity: number; // Số lượng (> 0)
  unit: PabUnit; // Đơn vị (Tấn, kg, m³, ...)
  expectedDeliveryDate: Date | string; // Ngày giao dự kiến
  estimatedCost: number; // Chi phí ước tính (default: 0)
  estimatedTime: number; // Thời gian thực hiện (ngày)
  margin?: number; // Biên lợi nhuận (%)
  notes?: string; // Ghi chú
  status: PabStatus; // Trạng thái: Nháp / Chờ duyệt / Đã duyệt / Từ chối / Hủy
  contractRef?: string; // Hợp đồng tham chiếu
  transactionStatus?: TransactionStatus; // Trạng thái giao dịch: Đàm phán / Đã chốt / Hủy
  relatedOrderIds?: string[]; // Danh sách ID đơn hàng liên quan
  relatedOrderCodes?: string[]; // Danh sách mã đơn hàng liên quan
  approvalHistory?: ApprovalHistory[]; // Lịch sử phê duyệt
  lastUpdate?: Date | string; // Cập nhật gần nhất
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
  createdBy?: string; // Người tạo
  updatedBy?: string; // Người cập nhật
}

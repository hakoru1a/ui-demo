// ==============================|| CONTRACTS ENTITY ||============================== //

import type { ContractType, ContractStatus, PricingMethod, PartnerType } from './enums';

export interface Contract {
  id: string; // ID hợp đồng
  code: string; // Mã hợp đồng (Auto-generate, Read-only)
  type: ContractType; // Loại hợp đồng: Mua / Bán
  partnerType: PartnerType; // Đối tác: Nhà cung cấp / Khách hàng
  partnerId: string; // ID đối tác
  partnerName: string; // Tên đối tác (for display)
  productId?: string; // ID sản phẩm/nguyên liệu
  productName?: string; // Tên sản phẩm/nguyên liệu (for display)
  pricingMethod: PricingMethod; // Phương thức giá: Cố định / Theo công thức
  unitPrice?: number; // Đơn giá (Bắt buộc nếu giá cố định)
  priceFormula?: string; // Công thức giá (Chỉ hiển thị khi chọn công thức)
  currency: string; // Tiền tệ (Default: VND)
  contractQuantity?: number; // Sản lượng cam kết
  effectiveDate: Date | string; // Ngày hiệu lực
  expiryDate: Date | string; // Ngày hết hạn
  paymentTerms?: string; // Điều khoản thanh toán
  attachment?: string; // URL file hợp đồng (PDF / Scan)
  status: ContractStatus; // Trạng thái: Nháp / Hiệu lực / Hết hạn / Hủy
  notes?: string; // Ghi chú
  contractValue?: number; // Giá trị hợp đồng (calculated)
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}

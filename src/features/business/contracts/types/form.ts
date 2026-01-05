// ==============================|| CONTRACTS FORM TYPES ||============================== //

import type { ContractType, ContractStatus, PricingMethod, PartnerType } from './enums';

export interface ContractFormData {
  code: string; // Mã hợp đồng (Auto-generate, Read-only)
  type: ContractType; // Loại hợp đồng - Required
  partnerType: PartnerType; // Đối tác - Required
  partnerId: string; // ID đối tác - Required
  productId: string; // ID sản phẩm/nguyên liệu - Required
  pricingMethod: PricingMethod; // Phương thức giá - Required, Default: 'fixed'
  unitPrice?: number; // Đơn giá - Required nếu pricingMethod = 'fixed'
  priceFormula?: string; // Công thức giá - Required nếu pricingMethod = 'formula'
  currency: string; // Tiền tệ - Required, Default: 'VND'
  contractQuantity?: number; // Sản lượng cam kết
  effectiveDate: Date | string; // Ngày hiệu lực - Required
  expiryDate: Date | string; // Ngày hết hạn - Required
  paymentTerms?: string; // Điều khoản thanh toán
  attachment?: string | File; // File hợp đồng (PDF / Scan)
  status: ContractStatus; // Trạng thái - Required, Default: 'draft'
  notes?: string; // Ghi chú
}

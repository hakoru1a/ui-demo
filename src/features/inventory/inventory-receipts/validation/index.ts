// ==============================|| INVENTORY RECEIPT VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { InventoryReceiptFormData } from '../types/form';

/**
 * Validation schema for Inventory Receipt form
 * Using Yup for schema validation
 */
export const inventoryReceiptSchema = yup.object<InventoryReceiptFormData>().shape({
  code: yup.string().required('Mã phiếu nhập là bắt buộc'),

  receiptDate: yup.date().required('Ngày nhập là bắt buộc').typeError('Ngày nhập không hợp lệ'),

  receiptType: yup.string().oneOf(['material', 'finished'], 'Loại nhập không hợp lệ').required('Loại nhập là bắt buộc'),

  warehouseId: yup.string().required('Kho nhập là bắt buộc'),

  productId: yup.string().required('Hàng hóa là bắt buộc'),

  batchId: yup.string().optional(),

  quantity: yup.number().required('Số lượng là bắt buộc').min(0.01, 'Số lượng phải lớn hơn 0').typeError('Số lượng phải là số'),

  unit: yup.string().required('Đơn vị là bắt buộc'),

  source: yup.string().oneOf(['production', 'purchase'], 'Nguồn nhập không hợp lệ').optional(),

  referenceDoc: yup.array().optional(),

  status: yup.string().oneOf(['draft', 'received', 'cancelled'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc'),

  notes: yup.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional()
});

/**
 * Default values for Inventory Receipt form
 */
export const inventoryReceiptDefaultValues: InventoryReceiptFormData = {
  code: '',
  receiptDate: new Date(),
  receiptType: 'material',
  warehouseId: '',
  productId: '',
  batchId: undefined,
  quantity: 0,
  unit: 'Kg',
  source: undefined,
  referenceDoc: undefined,
  status: 'draft',
  notes: undefined
};

/**
 * Type inference from schema
 */
export type InventoryReceiptSchemaType = yup.InferType<typeof inventoryReceiptSchema>;

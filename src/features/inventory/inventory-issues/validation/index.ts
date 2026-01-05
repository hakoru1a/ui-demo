// ==============================|| INVENTORY ISSUE VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { InventoryIssueFormData } from '../types';

/**
 * Validation schema for Inventory Issue form
 * Using Yup for schema validation
 */
export const inventoryIssueSchema = yup.object<InventoryIssueFormData>().shape({
  code: yup.string().required('Mã phiếu xuất là bắt buộc'),

  issueDate: yup.date().required('Ngày xuất là bắt buộc').typeError('Ngày xuất không hợp lệ'),

  issueType: yup.string().oneOf(['material', 'finished'], 'Loại xuất không hợp lệ').required('Loại xuất là bắt buộc'),

  warehouseId: yup.string().required('Kho xuất là bắt buộc'),

  productId: yup.string().required('Hàng hóa là bắt buộc'),

  batchId: yup.string().optional(),

  quantity: yup.number().required('Số lượng là bắt buộc').min(0.01, 'Số lượng phải lớn hơn 0').typeError('Số lượng phải là số'),

  unit: yup.string().required('Đơn vị là bắt buộc'),

  destination: yup.string().max(200, 'Điểm nhận không được quá 200 ký tự').optional(),

  referenceDoc: yup.array().optional(),

  status: yup.string().oneOf(['draft', 'issued', 'cancelled'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc'),

  notes: yup.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional()
});

/**
 * Default values for Inventory Issue form
 */
export const inventoryIssueDefaultValues: InventoryIssueFormData = {
  code: '',
  issueDate: new Date(),
  issueType: 'material',
  warehouseId: '',
  productId: '',
  batchId: undefined,
  quantity: 0,
  unit: 'Kg',
  destination: undefined,
  referenceDoc: undefined,
  status: 'draft',
  notes: undefined
};

/**
 * Type inference from schema
 */
export type InventoryIssueSchemaType = yup.InferType<typeof inventoryIssueSchema>;

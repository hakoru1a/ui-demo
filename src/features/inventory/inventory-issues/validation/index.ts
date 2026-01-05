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

  issueType: yup.string().oneOf(['warehouse', 'port'], 'Loại xuất không hợp lệ').required('Loại xuất là bắt buộc'),

  warehouseId: yup.string().required('Kho xuất là bắt buộc'),

  destinationId: yup.string().required('Điểm nhận là bắt buộc'),

  destinationType: yup
    .string()
    .oneOf(['warehouse', 'port'], 'Loại điểm nhận không hợp lệ')
    .when('destinationId', {
      is: (value: string) => !!value,
      then: (schema) => schema.required('Loại điểm nhận là bắt buộc'),
      otherwise: (schema) => schema.optional()
    }),

  customerId: yup.string().optional(),

  productId: yup.string().required('Sản phẩm / Nguyên liệu là bắt buộc'),

  batchId: yup.string().optional(),

  quantity: yup.number().required('Khối lượng là bắt buộc').positive('Khối lượng phải lớn hơn 0').typeError('Khối lượng phải là số'),

  transportRef: yup.string().max(200, 'Thông tin vận chuyển không được quá 200 ký tự').optional(),

  referenceDoc: yup.mixed<File | string>().optional(),

  status: yup.string().oneOf(['draft', 'issued', 'cancelled'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc'),

  notes: yup.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional()
});

/**
 * Default values for Inventory Issue form
 */
export const inventoryIssueDefaultValues: InventoryIssueFormData = {
  code: '',
  issueDate: new Date(),
  issueType: 'warehouse',
  warehouseId: '',
  destinationId: '',
  destinationType: undefined,
  customerId: undefined,
  productId: '',
  batchId: undefined,
  quantity: 0,
  transportRef: undefined,
  referenceDoc: undefined,
  status: 'draft',
  notes: ''
};

/**
 * Type inference from schema
 */
export type InventoryIssueSchemaType = yup.InferType<typeof inventoryIssueSchema>;

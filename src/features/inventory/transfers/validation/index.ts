// ==============================|| TRANSFER VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { TransferFormData } from '../types';

/**
 * Validation schema for Transfer Item Form Data
 */
const transferItemSchema = yup.object().shape({
  skuId: yup.string().required('SKU là bắt buộc'),
  skuCode: yup.string().required('Mã SKU là bắt buộc'),
  skuName: yup.string().required('Tên hàng hóa là bắt buộc'),
  batchId: yup.string().optional(),
  quantity: yup.number().required('Số lượng là bắt buộc').min(0.01, 'Số lượng phải lớn hơn 0').typeError('Số lượng phải là số'),
  unit: yup.string().required('Đơn vị là bắt buộc')
});

/**
 * Validation schema for Transfer form
 * Using Yup for schema validation
 */
export const transferSchema = yup.object<TransferFormData>().shape({
  code: yup.string().required('Mã phiếu chuyển là bắt buộc'),

  transferDate: yup.date().required('Ngày chuyển là bắt buộc').typeError('Ngày chuyển không hợp lệ'),

  sourceWarehouseId: yup.string().required('Kho nguồn là bắt buộc'),

  destinationWarehouseId: yup
    .string()
    .required('Kho đích là bắt buộc')
    .notOneOf([yup.ref('sourceWarehouseId')], 'Kho đích phải khác kho nguồn'),

  itemType: yup.string().oneOf(['material', 'finished'], 'Loại hàng không hợp lệ').required('Loại hàng là bắt buộc'),

  items: yup.array().of(transferItemSchema).min(1, 'Phải có ít nhất một SKU').required('Danh sách SKU là bắt buộc'),

  transportRef: yup.string().max(200, 'Thông tin vận chuyển không được quá 200 ký tự').optional(),

  status: yup.string().oneOf(['draft', 'transferred', 'cancelled'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc'),

  notes: yup.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional()
});

/**
 * Default values for Transfer form
 */
export const transferDefaultValues: TransferFormData = {
  code: '',
  transferDate: new Date(),
  sourceWarehouseId: '',
  destinationWarehouseId: '',
  itemType: 'material',
  items: [],
  transportRef: undefined,
  status: 'draft',
  notes: undefined
};

/**
 * Type inference from schema
 */
export type TransferSchemaType = yup.InferType<typeof transferSchema>;

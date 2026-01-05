// ==============================|| SKU VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { SkuFormData } from '../types';

/**
 * Validation schema for SKU form
 * Using Yup for schema validation
 */
export const skuSchema = yup.object<SkuFormData>().shape({
  code: yup.string().required('Mã SKU là bắt buộc'),

  name: yup.string().required('Tên hàng hóa là bắt buộc'),

  itemType: yup.string().oneOf(['material', 'finished'], 'Loại hàng không hợp lệ').required('Loại hàng là bắt buộc'),

  warehouseId: yup.string().required('Kho là bắt buộc'),

  systemQuantity: yup
    .number()
    .required('Số lượng hệ thống là bắt buộc')
    .min(0, 'Số lượng hệ thống không được âm')
    .typeError('Số lượng hệ thống phải là số'),

  reservedQuantity: yup.number().min(0, 'Số lượng giữ chỗ không được âm').typeError('Số lượng giữ chỗ phải là số').optional(),

  availableQuantity: yup
    .number()
    .required('Số lượng khả dụng là bắt buộc')
    .min(0, 'Số lượng khả dụng không được âm')
    .typeError('Số lượng khả dụng phải là số'),

  lastInventoryDate: yup.date().optional().typeError('Ngày kiểm kê không hợp lệ'),

  notes: yup.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional()
});

/**
 * Default values for SKU form
 */
export const skuDefaultValues: SkuFormData = {
  code: '',
  name: '',
  itemType: 'material',
  warehouseId: '',
  systemQuantity: 0,
  reservedQuantity: 0,
  availableQuantity: 0,
  lastInventoryDate: undefined,
  notes: undefined
};

/**
 * Type inference from schema
 */
export type SkuSchemaType = yup.InferType<typeof skuSchema>;

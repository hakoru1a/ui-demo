// ==============================|| BATCH VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { BatchFormData } from '../types';

/**
 * Validation schema for Batch form
 * Using Yup for schema validation
 */
export const batchSchema = yup.object<BatchFormData>().shape({
  code: yup.string().required('Mã lô là bắt buộc'),

  productionOrderId: yup.string().required('Lệnh SX là bắt buộc'),

  productId: yup.string().required('Sản phẩm / Nguyên liệu là bắt buộc'),

  plannedQuantity: yup
    .number()
    .required('Sản lượng kế hoạch là bắt buộc')
    .positive('Sản lượng kế hoạch phải lớn hơn 0')
    .integer('Sản lượng kế hoạch phải là số nguyên'),

  actualQuantity: yup
    .number()
    .optional()
    .min(0, 'Sản lượng thực tế phải lớn hơn hoặc bằng 0')
    .integer('Sản lượng thực tế phải là số nguyên')
    .typeError('Sản lượng thực tế phải là số'),

  startDate: yup.date().required('Ngày bắt đầu là bắt buộc').typeError('Ngày bắt đầu không hợp lệ'),

  endDate: yup
    .date()
    .optional()
    .typeError('Ngày kết thúc không hợp lệ')
    .min(yup.ref('startDate'), 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu'),

  status: yup.string().oneOf(['in-progress', 'completed', 'cancelled'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc'),

  notes: yup.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional()
});

/**
 * Default values for Batch form
 */
export const batchDefaultValues: BatchFormData = {
  code: '',
  productionOrderId: '',
  productId: '',
  plannedQuantity: 0,
  actualQuantity: undefined,
  startDate: new Date(),
  endDate: undefined,
  status: 'in-progress',
  notes: ''
};

/**
 * Type inference from schema
 */
export type BatchSchemaType = yup.InferType<typeof batchSchema>;

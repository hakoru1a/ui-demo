// ==============================|| PRODUCTION PLAN VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { ProductionPlanFormData } from '../types';

/**
 * Validation schema for Production Plan form
 * Using Yup for schema validation
 */
export const productionPlanSchema = yup.object<ProductionPlanFormData>().shape({
  code: yup.string().required('Mã kế hoạch/lệnh là bắt buộc'),

  type: yup.string().oneOf(['plan', 'order'], 'Loại không hợp lệ').required('Loại là bắt buộc'),

  productId: yup.string().required('Sản phẩm là bắt buộc'),

  plannedQuantity: yup
    .number()
    .required('Sản lượng dự kiến là bắt buộc')
    .positive('Sản lượng dự kiến phải lớn hơn 0')
    .integer('Sản lượng dự kiến phải là số nguyên'),

  startDate: yup.date().required('Ngày bắt đầu là bắt buộc').typeError('Ngày bắt đầu không hợp lệ'),

  endDate: yup
    .date()
    .required('Ngày kết thúc là bắt buộc')
    .typeError('Ngày kết thúc không hợp lệ')
    .min(yup.ref('startDate'), 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu'),

  estimatedCost: yup.number().optional().min(0, 'Chi phí ước tính phải lớn hơn hoặc bằng 0').typeError('Chi phí ước tính phải là số'),

  productionLineId: yup.string().optional(),

  status: yup.string().oneOf(['draft', 'in-progress', 'completed'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc'),

  notes: yup.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional()
});

/**
 * Default values for Production Plan form
 */
export const productionPlanDefaultValues: ProductionPlanFormData = {
  code: '',
  type: 'plan',
  productId: '',
  plannedQuantity: 0,
  startDate: new Date(),
  endDate: new Date(),
  estimatedCost: undefined,
  productionLineId: undefined,
  status: 'draft',
  notes: ''
};

/**
 * Type inference from schema
 */
export type ProductionPlanSchemaType = yup.InferType<typeof productionPlanSchema>;

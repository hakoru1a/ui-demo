// ==============================|| PRODUCTION CALENDAR VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { ProductionShiftFormData } from '../types';

/**
 * Validation schema for Production Shift form
 * Using Yup for schema validation
 */
export const productionShiftSchema = yup.object<ProductionShiftFormData>().shape({
  batchId: yup.string().required('Lô sản xuất là bắt buộc'),

  productionLineId: yup.string().required('Dây chuyền là bắt buộc'),

  startTime: yup.date().required('Thời gian bắt đầu là bắt buộc').typeError('Thời gian bắt đầu không hợp lệ'),

  endTime: yup
    .date()
    .required('Thời gian kết thúc là bắt buộc')
    .typeError('Thời gian kết thúc không hợp lệ')
    .test('is-after-start', 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu', function (value) {
      const { startTime } = this.parent;
      if (!value || !startTime) return true;
      return new Date(value) > new Date(startTime);
    }),

  status: yup
    .string()
    .oneOf(['scheduled', 'in-progress', 'completed', 'cancelled'], 'Trạng thái không hợp lệ')
    .required('Trạng thái là bắt buộc'),

  notes: yup.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional()
});

/**
 * Default values for Production Shift form
 */
export const productionShiftDefaultValues: ProductionShiftFormData = {
  batchId: '',
  productionLineId: '',
  startTime: new Date(),
  endTime: new Date(),
  status: 'scheduled',
  notes: ''
};

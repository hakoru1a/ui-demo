// ==============================|| SHIFT LOG VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { ShiftLogFormData } from '../types';

/**
 * Validation schema for Shift Log form
 * Using Yup for schema validation
 */
export const shiftLogSchema = yup.object<ShiftLogFormData>().shape({
  batchId: yup.string().required('Lô sản xuất là bắt buộc'),

  shiftId: yup.string().optional(),

  workDate: yup.date().required('Ngày làm việc là bắt buộc'),

  shiftTime: yup
    .string()
    .required('Thời gian ca là bắt buộc')
    .matches(/^\d{2}:\d{2}\s*-\s*\d{2}:\d{2}$/, 'Thời gian ca phải có định dạng HH:mm - HH:mm'),

  outputQuantity: yup.number().required('Sản lượng ca là bắt buộc').min(0, 'Sản lượng ca phải lớn hơn hoặc bằng 0'),

  hasIncident: yup.boolean().default(false),

  status: yup.string().oneOf(['running', 'completed'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc'),

  notes: yup.string().optional()
});

/**
 * Default values for Shift Log form
 */
export const shiftLogDefaultValues: ShiftLogFormData = {
  batchId: '',
  shiftId: undefined,
  workDate: new Date(),
  shiftTime: '',
  outputQuantity: 0,
  hasIncident: false,
  status: 'running',
  notes: undefined
};

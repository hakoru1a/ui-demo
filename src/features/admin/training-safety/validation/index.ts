// ==============================|| TRAINING & SAFETY VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { TrainingFormData } from '../types/form';

/**
 * Validation schema for Training form
 * Using Yup for schema validation
 */
export const trainingSchema = yup.object<TrainingFormData>().shape({
  name: yup
    .string()
    .required('Tên khóa đào tạo là bắt buộc')
    .min(2, 'Tên khóa đào tạo phải có ít nhất 2 ký tự')
    .max(200, 'Tên khóa đào tạo không được quá 200 ký tự'),

  type: yup.string().oneOf(['skill', 'safety'], 'Loại đào tạo không hợp lệ').required('Loại đào tạo là bắt buộc'),

  department: yup.string().oneOf(['production', 'warehouse', 'qc', 'hr', 'admin'], 'Bộ phận không hợp lệ').required('Bộ phận là bắt buộc'),

  startDate: yup.date().required('Ngày bắt đầu là bắt buộc').nullable(),

  endDate: yup.date().required('Ngày kết thúc là bắt buộc').nullable().min(yup.ref('startDate'), 'Ngày kết thúc phải sau ngày bắt đầu'),

  participantCount: yup
    .number()
    .required('Số người tham gia là bắt buộc')
    .min(0, 'Số người tham gia phải lớn hơn hoặc bằng 0')
    .integer('Số người tham gia phải là số nguyên'),

  status: yup.string().oneOf(['open', 'completed', 'cancelled'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc')
});

/**
 * Default values for Training form
 */
export const trainingDefaultValues: TrainingFormData = {
  name: '',
  type: 'skill',
  department: 'production',
  startDate: undefined,
  endDate: undefined,
  participantCount: 0,
  status: 'open'
};

/**
 * Type inference from schema
 */
export type TrainingSchemaType = yup.InferType<typeof trainingSchema>;

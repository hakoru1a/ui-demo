// ==============================|| COMPLAINTS VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { ComplaintFormData } from '../types/form';

/**
 * Validation schema for Complaint form
 * Using Yup for schema validation
 */
export const complaintSchema = yup.object<ComplaintFormData>().shape({
  code: yup
    .string()
    .required('Mã khiếu nại là bắt buộc')
    .min(2, 'Mã khiếu nại phải có ít nhất 2 ký tự')
    .max(50, 'Mã khiếu nại không được quá 50 ký tự'),

  sender: yup
    .string()
    .required('Người gửi là bắt buộc')
    .min(2, 'Người gửi phải có ít nhất 2 ký tự')
    .max(200, 'Người gửi không được quá 200 ký tự'),

  relatedEmployeeId: yup.string().optional(),

  type: yup.string().oneOf(['labor', 'production', 'safety'], 'Loại khiếu nại không hợp lệ').required('Loại khiếu nại là bắt buộc'),

  receivedDate: yup.date().required('Ngày tiếp nhận là bắt buộc').nullable(),

  status: yup.string().oneOf(['new', 'processing', 'resolved'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc'),

  description: yup.string().max(1000, 'Mô tả không được quá 1000 ký tự').optional(),

  resolution: yup.string().max(1000, 'Giải pháp không được quá 1000 ký tự').optional()
});

/**
 * Default values for Complaint form
 */
export const complaintDefaultValues: ComplaintFormData = {
  code: '',
  sender: '',
  relatedEmployeeId: undefined,
  type: 'labor',
  receivedDate: '',
  status: 'new',
  description: '',
  resolution: ''
};

/**
 * Type inference from schema
 */
export type ComplaintSchemaType = yup.InferType<typeof complaintSchema>;

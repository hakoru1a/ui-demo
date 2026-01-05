// ==============================|| ADVANCE VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { AdvanceFormData, AdvanceApprovalFormData } from '../types/form';

/**
 * Validation schema for Advance form
 * Using Yup for schema validation
 */
export const advanceSchema = yup.object<AdvanceFormData>().shape({
  code: yup.string().required('Mã tạm ứng là bắt buộc'),

  requesterId: yup.string().required('Người đề nghị là bắt buộc'),

  requestedDate: yup.date().required('Ngày đề nghị là bắt buộc').typeError('Ngày đề nghị không hợp lệ'),

  requestedAmount: yup.number().required('Số tiền là bắt buộc').min(0.01, 'Số tiền phải lớn hơn 0').typeError('Số tiền phải là số'),

  purpose: yup.string().required('Mục đích là bắt buộc').max(1000, 'Mục đích không được quá 1000 ký tự'),

  status: yup.string().oneOf(['pending', 'approved', 'rejected'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc')
});

/**
 * Validation schema for Advance Approval form
 */
export const advanceApprovalSchema = yup.object<AdvanceApprovalFormData>().shape({
  code: yup.string().required('Mã tạm ứng là bắt buộc'),

  requesterName: yup.string().required('Người đề nghị là bắt buộc'),

  requestedAmount: yup.number().required('Số tiền là bắt buộc').min(0.01, 'Số tiền phải lớn hơn 0').typeError('Số tiền phải là số'),

  purpose: yup.string().required('Mục đích là bắt buộc'),

  approvalDecision: yup.string().oneOf(['approve', 'reject'], 'Quyết định không hợp lệ').required('Quyết định là bắt buộc'),

  comment: yup.string().when('approvalDecision', {
    is: 'reject',
    then: (schema) => schema.required('Ý kiến là bắt buộc khi từ chối').max(1000, 'Ý kiến không được quá 1000 ký tự'),
    otherwise: (schema) => schema.optional().max(1000, 'Ý kiến không được quá 1000 ký tự')
  }),

  approvalDate: yup.date().required('Ngày duyệt là bắt buộc').typeError('Ngày duyệt không hợp lệ'),

  status: yup.string().oneOf(['pending', 'approved', 'rejected'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc')
});

/**
 * Default values for Advance form
 */
export const advanceDefaultValues: AdvanceFormData = {
  code: '',
  requesterId: '',
  requestedDate: new Date(),
  requestedAmount: 0,
  purpose: '',
  status: 'pending'
};

/**
 * Default values for Advance Approval form
 */
export const advanceApprovalDefaultValues: AdvanceApprovalFormData = {
  code: '',
  requesterName: '',
  requestedAmount: 0,
  purpose: '',
  approvalDecision: 'approve',
  comment: '',
  approvalDate: new Date(),
  status: 'pending'
};

/**
 * Type inference from schema
 */
export type AdvanceSchemaType = yup.InferType<typeof advanceSchema>;
export type AdvanceApprovalSchemaType = yup.InferType<typeof advanceApprovalSchema>;

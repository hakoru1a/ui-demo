// ==============================|| PAB VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { PabFormData, PabApprovalFormData, PabTransactionFormData, ApprovalLayer, ApprovalDecision } from '../types';

/**
 * Validation schema for PAB form (SD-1-1)
 */
export const pabSchema = yup.object<PabFormData>().shape({
  code: yup.string().required('Mã PAB là bắt buộc'),

  customerId: yup.string().required('Khách hàng là bắt buộc'),

  productId: yup.string().required('Sản phẩm/Nguyên liệu là bắt buộc'),

  quantity: yup.number().required('Số lượng là bắt buộc').positive('Số lượng phải lớn hơn 0').typeError('Số lượng phải là số'),

  unit: yup.string().oneOf(['ton', 'kg', 'm3', 'piece'], 'Đơn vị không hợp lệ').required('Đơn vị là bắt buộc'),

  expectedDeliveryDate: yup.date().required('Ngày giao dự kiến là bắt buộc').typeError('Ngày không hợp lệ'),

  estimatedCost: yup
    .number()
    .required('Chi phí ước tính là bắt buộc')
    .min(0, 'Chi phí ước tính phải lớn hơn hoặc bằng 0')
    .typeError('Chi phí ước tính phải là số'),

  estimatedTime: yup
    .number()
    .required('Thời gian thực hiện là bắt buộc')
    .positive('Thời gian thực hiện phải lớn hơn 0')
    .typeError('Thời gian thực hiện phải là số'),

  margin: yup.number().min(0, 'Biên lợi nhuận phải lớn hơn hoặc bằng 0').max(100, 'Biên lợi nhuận không được vượt quá 100%').optional(),

  notes: yup.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional(),

  status: yup
    .string()
    .oneOf(['draft', 'pending-approval', 'approved', 'rejected', 'cancelled'], 'Trạng thái không hợp lệ')
    .required('Trạng thái là bắt buộc')
});

/**
 * Validation schema for PAB approval form (SD-1-2)
 */
export const pabApprovalSchema = yup.object<PabApprovalFormData>().shape({
  pabCode: yup.string().required('Mã PAB là bắt buộc'),

  approvalLayer: yup.string().oneOf(['business', 'finance', 'management'], 'Cấp duyệt không hợp lệ').required('Cấp duyệt là bắt buộc'),

  approverId: yup.string().required('Người duyệt là bắt buộc'),

  decision: yup.string().oneOf(['approved', 'rejected'], 'Quyết định không hợp lệ').required('Quyết định là bắt buộc'),

  comment: yup.string().when('decision', {
    is: 'rejected',
    then: (schema) => schema.required('Ý kiến là bắt buộc khi từ chối').max(1000, 'Ý kiến không được quá 1000 ký tự'),
    otherwise: (schema) => schema.max(1000, 'Ý kiến không được quá 1000 ký tự').optional()
  }),

  approvalDate: yup.date().required('Ngày duyệt là bắt buộc').typeError('Ngày không hợp lệ')
});

/**
 * Validation schema for PAB transaction form (SD-1-3)
 */
export const pabTransactionSchema = yup.object<PabTransactionFormData>().shape({
  pabCode: yup.string().required('Mã PAB là bắt buộc'),

  contractRef: yup.string().max(200, 'Hợp đồng không được quá 200 ký tự').optional(),

  transactionStatus: yup
    .string()
    .oneOf(['negotiating', 'confirmed', 'cancelled'], 'Trạng thái giao dịch không hợp lệ')
    .required('Trạng thái giao dịch là bắt buộc'),

  relatedOrderIds: yup.array().of(yup.string()).optional(),

  notes: yup.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional()
});

/**
 * Default values for PAB form
 */
export const pabDefaultValues: PabFormData = {
  code: '',
  customerId: '',
  productId: '',
  quantity: 0,
  unit: 'ton',
  expectedDeliveryDate: new Date(),
  estimatedCost: 0,
  estimatedTime: 0,
  margin: undefined,
  notes: '',
  status: 'draft'
};

/**
 * Default values for PAB approval form
 */
export const pabApprovalDefaultValues: PabApprovalFormData = {
  pabCode: '',
  approvalLayer: 'business' as ApprovalLayer,
  approverId: '',
  decision: 'approved' as ApprovalDecision,
  comment: '',
  approvalDate: new Date()
};

/**
 * Default values for PAB transaction form
 */
export const pabTransactionDefaultValues: PabTransactionFormData = {
  pabId: '',
  pabCode: '',
  transactionType: 'execute',
  contractRef: '',
  transactionStatus: 'negotiating',
  relatedOrderIds: [],
  notes: ''
};

/**
 * Type inference from schemas
 */
export type PabSchemaType = yup.InferType<typeof pabSchema>;
export type PabApprovalSchemaType = yup.InferType<typeof pabApprovalSchema>;
export type PabTransactionSchemaType = yup.InferType<typeof pabTransactionSchema>;

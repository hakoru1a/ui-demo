// ==============================|| PAYMENT ORDER VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { PaymentOrderFormData } from '../types/form';

/**
 * Validation schema for Payment Order form
 * Using Yup for schema validation
 */
export const paymentOrderSchema = yup.object<PaymentOrderFormData>().shape({
  code: yup.string().required('Mã PO là bắt buộc'),

  type: yup.string().oneOf(['payment', 'expense'], 'Loại phiếu không hợp lệ').required('Loại phiếu là bắt buộc'),

  partnerType: yup.string().oneOf(['customer', 'supplier'], 'Loại đối tác không hợp lệ').required('Đối tác là bắt buộc'),

  partnerId: yup.string().required('Đối tác là bắt buộc'),

  contractId: yup.string().optional(),

  paymentAmount: yup.number().required('Số tiền là bắt buộc').min(0.01, 'Số tiền phải lớn hơn 0').typeError('Số tiền phải là số'),

  currency: yup.string().required('Tiền tệ là bắt buộc'),

  paymentMethod: yup.string().oneOf(['cash', 'transfer'], 'Phương thức không hợp lệ').required('Phương thức là bắt buộc'),

  paymentDate: yup.date().required('Ngày thanh toán là bắt buộc').typeError('Ngày thanh toán không hợp lệ'),

  description: yup.string().max(1000, 'Nội dung chi không được quá 1000 ký tự').optional(),

  attachment: yup.mixed<File | string>().optional(),

  status: yup.string().oneOf(['draft', 'pending', 'paid'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc')
});

/**
 * Default values for Payment Order form
 */
export const paymentOrderDefaultValues: PaymentOrderFormData = {
  code: '',
  type: 'payment',
  partnerType: 'customer',
  partnerId: '',
  contractId: undefined,
  paymentAmount: 0,
  currency: 'VND',
  paymentMethod: 'cash',
  paymentDate: new Date(),
  description: '',
  attachment: undefined,
  status: 'draft'
};

/**
 * Type inference from schema
 */
export type PaymentOrderSchemaType = yup.InferType<typeof paymentOrderSchema>;

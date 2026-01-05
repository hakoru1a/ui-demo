// ==============================|| CONTRACT VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { ContractFormData } from '../types/form';

/**
 * Validation schema for Contract form
 * Using Yup for schema validation
 */
export const contractSchema = yup.object<ContractFormData>().shape({
  code: yup.string().required('Mã hợp đồng là bắt buộc'),

  type: yup.string().oneOf(['buy', 'sell'], 'Loại hợp đồng không hợp lệ').required('Loại hợp đồng là bắt buộc'),

  partnerType: yup.string().oneOf(['supplier', 'customer'], 'Loại đối tác không hợp lệ').required('Đối tác là bắt buộc'),

  partnerId: yup.string().required('Đối tác là bắt buộc'),

  productId: yup.string().required('Sản phẩm/nguyên liệu là bắt buộc'),

  pricingMethod: yup.string().oneOf(['fixed', 'formula'], 'Phương thức giá không hợp lệ').required('Phương thức giá là bắt buộc'),

  unitPrice: yup.number().when('pricingMethod', {
    is: 'fixed',
    then: (schema) => schema.required('Đơn giá là bắt buộc khi phương thức giá là Cố định').min(0, 'Đơn giá phải lớn hơn hoặc bằng 0'),
    otherwise: (schema) => schema.optional()
  }),

  priceFormula: yup.string().when('pricingMethod', {
    is: 'formula',
    then: (schema) => schema.required('Công thức giá là bắt buộc khi phương thức giá là Theo công thức'),
    otherwise: (schema) => schema.optional()
  }),

  currency: yup.string().required('Tiền tệ là bắt buộc'),

  contractQuantity: yup.number().min(0, 'Sản lượng cam kết phải lớn hơn hoặc bằng 0').optional(),

  effectiveDate: yup.date().required('Ngày hiệu lực là bắt buộc').typeError('Ngày hiệu lực không hợp lệ'),

  expiryDate: yup
    .date()
    .required('Ngày hết hạn là bắt buộc')
    .typeError('Ngày hết hạn không hợp lệ')
    .when('effectiveDate', {
      is: (value: Date) => value && value instanceof Date,
      then: (schema) => schema.min(yup.ref('effectiveDate'), 'Ngày hết hạn phải sau ngày hiệu lực'),
      otherwise: (schema) => schema
    }),

  paymentTerms: yup.string().max(500, 'Điều khoản thanh toán không được quá 500 ký tự').optional(),

  attachment: yup.mixed<File | string>().optional(),

  status: yup.string().oneOf(['draft', 'active', 'expired', 'cancelled'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc'),

  notes: yup.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional()
});

/**
 * Default values for Contract form
 */
export const contractDefaultValues: ContractFormData = {
  code: '',
  type: 'buy',
  partnerType: 'supplier',
  partnerId: '',
  productId: '',
  pricingMethod: 'fixed',
  unitPrice: undefined,
  priceFormula: undefined,
  currency: 'VND',
  contractQuantity: undefined,
  effectiveDate: new Date(),
  expiryDate: new Date(),
  paymentTerms: undefined,
  attachment: undefined,
  status: 'draft',
  notes: ''
};

/**
 * Type inference from schema
 */
export type ContractSchemaType = yup.InferType<typeof contractSchema>;

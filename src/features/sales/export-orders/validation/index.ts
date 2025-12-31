// ==============================|| EXPORT ORDER VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { ExportOrderFormData } from '../types/form';

/**
 * Validation schema for Export Order form
 * Using Yup for schema validation
 */
export const exportOrderSchema = yup.object<ExportOrderFormData>().shape({
  orderNo: yup.string().required('Mã đơn hàng là bắt buộc'),

  orderDate: yup.date().required('Ngày đơn hàng là bắt buộc').nullable(),

  customerId: yup.string().required('Khách hàng là bắt buộc'),

  country: yup.string().required('Quốc gia là bắt buộc'),

  totalValue: yup
    .number()
    .required('Tổng giá trị là bắt buộc')
    .min(0, 'Tổng giá trị phải lớn hơn hoặc bằng 0')
    .typeError('Tổng giá trị phải là số'),

  currency: yup.string().required('Tiền tệ là bắt buộc'),

  incoterms: yup
    .string()
    .oneOf(['FOB', 'CIF', 'EXW', 'CFR', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'], 'Incoterms không hợp lệ')
    .required('Incoterms là bắt buộc'),

  status: yup
    .string()
    .oneOf(['draft', 'confirmed', 'delivering', 'completed'], 'Trạng thái không hợp lệ')
    .required('Trạng thái là bắt buộc')
});

/**
 * Default values for Export Order form
 */
export const exportOrderDefaultValues: ExportOrderFormData = {
  orderNo: '',
  orderDate: new Date(),
  customerId: '',
  country: '',
  totalValue: 0,
  currency: 'USD',
  incoterms: 'FOB',
  status: 'draft'
};

/**
 * Type inference from schema
 */
export type ExportOrderSchemaType = yup.InferType<typeof exportOrderSchema>;

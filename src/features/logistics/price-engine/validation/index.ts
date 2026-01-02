// ==============================|| PRICE ENGINE VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { PriceTableFormData } from '../types';

/**
 * Validation schema for Price Table form
 * Using Yup for schema validation
 */
export const priceTableSchema = yup.object<PriceTableFormData>().shape({
  code: yup.string().required('Mã bảng giá là bắt buộc'),

  name: yup
    .string()
    .required('Tên bảng giá là bắt buộc')
    .min(2, 'Tên bảng giá phải có ít nhất 2 ký tự')
    .max(200, 'Tên bảng giá không được quá 200 ký tự'),

  materialType: yup.string().oneOf(['keo', 'tram', 'other'], 'Loại nguyên liệu không hợp lệ').required('Loại nguyên liệu là bắt buộc'),

  basePrice: yup
    .number()
    .required('Đơn giá cơ bản là bắt buộc')
    .positive('Đơn giá cơ bản phải lớn hơn 0')
    .min(0, 'Đơn giá cơ bản phải lớn hơn hoặc bằng 0'),

  adjustmentFormula: yup.string().max(1000, 'Công thức điều chỉnh không được quá 1000 ký tự').optional(),

  effectiveFrom: yup
    .mixed<Date | string>()
    .required('Hiệu lực từ ngày là bắt buộc')
    .test('is-valid-date', 'Ngày không hợp lệ', (value) => {
      if (!value) return false;
      const date = typeof value === 'string' ? new Date(value) : value;
      return !isNaN(date.getTime());
    }),

  status: yup.string().oneOf(['active', 'inactive'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc')
});

/**
 * Default values for Price Table form
 */
export const priceTableDefaultValues: PriceTableFormData = {
  code: '',
  name: '',
  materialType: 'keo',
  basePrice: 0,
  adjustmentFormula: '',
  effectiveFrom: new Date(),
  status: 'active'
};

/**
 * Type inference from schema
 */
export type PriceTableSchemaType = yup.InferType<typeof priceTableSchema>;

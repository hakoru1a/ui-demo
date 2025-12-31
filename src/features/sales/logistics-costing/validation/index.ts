// ==============================|| LOGISTICS COSTING VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import dateHelper from 'utils/dateHelper';

import type { LogisticsCostFormData } from '../types';

/**
 * Validation schema for Logistics Cost form
 * Using Yup for schema validation
 */
export const logisticsCostSchema = yup.object<LogisticsCostFormData>().shape({
  costCode: yup.string().required('Mã chi phí là bắt buộc'),

  costType: yup.string().oneOf(['logistics', 'service'], 'Loại chi phí không hợp lệ').required('Loại chi phí là bắt buộc'),

  serviceCategory: yup.string().oneOf(['transport', 'loading', 'customs']).optional(),

  partnerId: yup.string().required('Đối tác là bắt buộc'),

  relatedShipmentId: yup.string().optional(),

  relatedOrderId: yup.string().optional(),

  costDate: yup
    .mixed<Date | string>()
    .required('Ngày phát sinh là bắt buộc')
    .test('is-valid-date', 'Ngày phát sinh không hợp lệ', (value) => {
      if (!value) return false;
      return dateHelper.isValidDate(value);
    }),

  amount: yup
    .number()
    .required('Số tiền là bắt buộc')
    .positive('Số tiền phải lớn hơn 0')
    .max(1000000000000, 'Số tiền không được vượt quá 1,000,000,000,000'),

  currency: yup.string().oneOf(['VND', 'USD', 'EUR'], 'Tiền tệ không hợp lệ').required('Tiền tệ là bắt buộc'),

  allocationMethod: yup.string().oneOf(['by-shipment', 'by-order']).optional(),

  attachment: yup.mixed<File | string>().optional(),

  status: yup.string().oneOf(['draft', 'recorded'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc'),

  notes: yup.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional()
});

/**
 * Default values for Logistics Cost form
 */
export const logisticsCostDefaultValues: LogisticsCostFormData = {
  costCode: '',
  costType: 'logistics',
  serviceCategory: undefined,
  partnerId: '',
  relatedShipmentId: undefined,
  relatedOrderId: undefined,
  costDate: dateHelper.getToday(),
  amount: 0,
  currency: 'VND',
  allocationMethod: undefined,
  attachment: undefined,
  status: 'draft',
  notes: ''
};

/**
 * Type inference from schema
 */
export type LogisticsCostSchemaType = yup.InferType<typeof logisticsCostSchema>;

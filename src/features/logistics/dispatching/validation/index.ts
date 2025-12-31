// ==============================|| DISPATCH ORDER VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { DispatchOrderFormData } from '../types';

/**
 * Validation schema for Dispatch Order form
 * Using Yup for schema validation
 */
export const dispatchOrderSchema = yup.object<DispatchOrderFormData>().shape({
  orderCode: yup.string().required('Mã lệnh là bắt buộc'),

  vehicleId: yup.string().required('Xe là bắt buộc'),

  driverName: yup
    .string()
    .required('Tên tài xế là bắt buộc')
    .min(2, 'Tên tài xế phải có ít nhất 2 ký tự')
    .max(100, 'Tên tài xế không được quá 100 ký tự'),

  origin: yup
    .string()
    .required('Điểm xuất phát là bắt buộc')
    .min(2, 'Điểm xuất phát phải có ít nhất 2 ký tự')
    .max(200, 'Điểm xuất phát không được quá 200 ký tự'),

  destination: yup
    .string()
    .required('Điểm đến là bắt buộc')
    .min(2, 'Điểm đến phải có ít nhất 2 ký tự')
    .max(200, 'Điểm đến không được quá 200 ký tự'),

  departureTime: yup
    .date()
    .required('Thời gian xuất phát là bắt buộc')
    .min(new Date(), 'Thời gian xuất phát phải là thời gian trong tương lai'),

  estimatedDuration: yup
    .number()
    .optional()
    .min(0.1, 'Thời gian dự kiến phải lớn hơn 0')
    .max(1000, 'Thời gian dự kiến không được vượt quá 1000 giờ'),

  status: yup.string().oneOf(['new', 'running', 'completed'], 'Trạng thái lệnh không hợp lệ').required('Trạng thái lệnh là bắt buộc'),

  notes: yup.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional()
});

/**
 * Default values for Dispatch Order form
 */
export const dispatchOrderDefaultValues: DispatchOrderFormData = {
  orderCode: '',
  vehicleId: '',
  driverName: '',
  origin: '',
  destination: '',
  departureTime: new Date(),
  estimatedDuration: undefined,
  status: 'new',
  notes: ''
};

/**
 * Type inference from schema
 */
export type DispatchOrderSchemaType = yup.InferType<typeof dispatchOrderSchema>;

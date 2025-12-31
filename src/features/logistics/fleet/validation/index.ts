// ==============================|| FLEET VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { VehicleFormData } from '../types';

/**
 * Validation schema for Vehicle form
 * Using Yup for schema validation
 */
export const vehicleSchema = yup.object<VehicleFormData>().shape({
  licensePlate: yup
    .string()
    .required('Biển số xe là bắt buộc')
    .min(4, 'Biển số xe phải có ít nhất 4 ký tự')
    .max(20, 'Biển số xe không được quá 20 ký tự'),

  vehicleType: yup.string().oneOf(['truck', 'container'], 'Loại xe không hợp lệ').required('Loại xe là bắt buộc'),

  maxLoad: yup
    .number()
    .required('Tải trọng tối đa là bắt buộc')
    .positive('Tải trọng tối đa phải lớn hơn 0')
    .max(100, 'Tải trọng tối đa không được vượt quá 100 tấn'),

  driverName: yup
    .string()
    .required('Tên tài xế là bắt buộc')
    .min(2, 'Tên tài xế phải có ít nhất 2 ký tự')
    .max(100, 'Tên tài xế không được quá 100 ký tự'),

  driverPhone: yup
    .string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ (10-11 chữ số)'),

  driverLicenseNumber: yup
    .string()
    .required('Số GPLX là bắt buộc')
    .min(5, 'Số GPLX phải có ít nhất 5 ký tự')
    .max(20, 'Số GPLX không được quá 20 ký tự'),

  driverLicenseExpiry: yup
    .date()
    .required('Ngày hết hạn GPLX là bắt buộc')
    .min(new Date(), 'Ngày hết hạn GPLX phải là ngày trong tương lai'),

  vehicleStatus: yup
    .string()
    .oneOf(['ready', 'running', 'maintenance'], 'Trạng thái xe không hợp lệ')
    .required('Trạng thái xe là bắt buộc'),

  driverStatus: yup.string().oneOf(['available', 'dispatched'], 'Trạng thái tài xế không hợp lệ').required('Trạng thái tài xế là bắt buộc'),

  notes: yup.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional()
});

/**
 * Default values for Vehicle form
 */
export const vehicleDefaultValues: VehicleFormData = {
  licensePlate: '',
  vehicleType: 'truck',
  maxLoad: 0,
  driverName: '',
  driverPhone: '',
  driverLicenseNumber: '',
  driverLicenseExpiry: new Date(),
  vehicleStatus: 'ready',
  driverStatus: 'available',
  notes: ''
};

/**
 * Type inference from schema
 */
export type VehicleSchemaType = yup.InferType<typeof vehicleSchema>;

// ==============================|| LEGAL CERTIFICATE VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { LegalCertificateFormData, CertificateRenewalFormData } from '../types';

/**
 * Validation schema for Legal Certificate form
 * Using Yup for schema validation
 */
export const legalCertificateSchema = yup.object<LegalCertificateFormData>().shape({
  certificateType: yup.string().oneOf(['FSC', 'PEFC'], 'Loại chứng chỉ không hợp lệ').required('Loại chứng chỉ là bắt buộc'),

  certificateNumber: yup
    .string()
    .required('Số chứng chỉ là bắt buộc')
    .min(2, 'Số chứng chỉ phải có ít nhất 2 ký tự')
    .max(100, 'Số chứng chỉ không được quá 100 ký tự'),

  issuingOrganization: yup
    .string()
    .required('Tổ chức cấp là bắt buộc')
    .min(2, 'Tổ chức cấp phải có ít nhất 2 ký tự')
    .max(200, 'Tổ chức cấp không được quá 200 ký tự'),

  issueDate: yup.date().required('Ngày cấp là bắt buộc').max(new Date(), 'Ngày cấp không được lớn hơn ngày hiện tại'),

  expiryDate: yup.date().required('Ngày hết hạn là bắt buộc').min(yup.ref('issueDate'), 'Ngày hết hạn phải sau ngày cấp'),

  certificateFile: yup
    .mixed<File | string>()
    .test('file-required', 'File chứng chỉ là bắt buộc', function (value) {
      // Allow string (existing file URL) or File object
      if (typeof value === 'string' && value.length > 0) return true;
      if (value instanceof File) return true;
      return false;
    })
    .test('file-type', 'File phải là PDF hoặc hình ảnh', function (value) {
      if (!value) return true; // Already handled by required test
      if (typeof value === 'string') return true; // Existing file
      if (value instanceof File) {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        return validTypes.includes(value.type);
      }
      return false;
    })
    .test('file-size', 'File không được vượt quá 10MB', function (value) {
      if (!value) return true;
      if (typeof value === 'string') return true; // Existing file
      if (value instanceof File) {
        return value.size <= 10 * 1024 * 1024; // 10MB
      }
      return false;
    }),

  legalNotes: yup.string().max(1000, 'Ghi chú pháp lý không được quá 1000 ký tự').optional()
});

/**
 * Validation schema for Certificate Renewal form
 */
export const certificateRenewalSchema = yup.object<CertificateRenewalFormData>().shape({
  newExpiryDate: yup.date().required('Ngày hết hạn mới là bắt buộc').min(new Date(), 'Ngày hết hạn mới phải sau ngày hiện tại'),

  certificateFile: yup
    .mixed<File | string>()
    .test('file-type', 'File phải là PDF hoặc hình ảnh', function (value) {
      if (!value) return true; // Optional
      if (typeof value === 'string') return true; // Existing file
      if (value instanceof File) {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        return validTypes.includes(value.type);
      }
      return false;
    })
    .test('file-size', 'File không được vượt quá 10MB', function (value) {
      if (!value) return true;
      if (typeof value === 'string') return true; // Existing file
      if (value instanceof File) {
        return value.size <= 10 * 1024 * 1024; // 10MB
      }
      return false;
    })
    .optional(),

  notes: yup.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional()
});

/**
 * Default values for Legal Certificate form
 */
export const legalCertificateDefaultValues: LegalCertificateFormData = {
  certificateType: 'FSC',
  certificateNumber: '',
  issuingOrganization: '',
  issueDate: new Date(),
  expiryDate: new Date(),
  certificateFile: undefined,
  legalNotes: ''
};

/**
 * Default values for Certificate Renewal form
 */
export const certificateRenewalDefaultValues: CertificateRenewalFormData = {
  newExpiryDate: new Date(),
  certificateFile: undefined,
  notes: ''
};

/**
 * Type inference from schema
 */
export type LegalCertificateSchemaType = yup.InferType<typeof legalCertificateSchema>;
export type CertificateRenewalSchemaType = yup.InferType<typeof certificateRenewalSchema>;

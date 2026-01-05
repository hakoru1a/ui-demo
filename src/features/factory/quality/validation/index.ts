// ==============================|| QUALITY INSPECTION VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import dateHelper from 'utils/dateHelper';

import type { QualityInspectionFormData } from '../types';

/**
 * Validation schema for Quality Inspection form
 * Using Yup for schema validation
 */
export const qualityInspectionSchema = yup.object<QualityInspectionFormData>().shape({
  code: yup.string().required('Mã phiếu QC là bắt buộc'),

  inspectionDate: yup
    .date()
    .required('Ngày kiểm định là bắt buộc')
    .typeError('Ngày kiểm định không hợp lệ')
    .max(new Date(), 'Ngày kiểm định không được lớn hơn ngày hiện tại'),

  productId: yup.string().required('Thành phẩm là bắt buộc'),

  batchId: yup.string().required('Lô sản xuất là bắt buộc'),

  moisture: yup
    .number()
    .required('Độ ẩm là bắt buộc')
    .min(0, 'Độ ẩm phải lớn hơn hoặc bằng 0')
    .max(100, 'Độ ẩm phải nhỏ hơn hoặc bằng 100')
    .typeError('Độ ẩm phải là số'),

  impurity: yup
    .number()
    .required('Tạp chất là bắt buộc')
    .min(0, 'Tạp chất phải lớn hơn hoặc bằng 0')
    .max(100, 'Tạp chất phải nhỏ hơn hoặc bằng 100')
    .typeError('Tạp chất phải là số'),

  result: yup.string().oneOf(['passed', 'failed'], 'Kết quả QC không hợp lệ').required('Kết quả QC là bắt buộc'),

  inspectorId: yup.string().required('Người kiểm tra là bắt buộc'),

  attachment: yup.mixed().optional(),

  notes: yup.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional()
});

/**
 * Default values for Quality Inspection form
 */
export const qualityInspectionDefaultValues: QualityInspectionFormData = {
  code: '',
  inspectionDate: dateHelper.getToday(),
  productId: '',
  batchId: '',
  moisture: 0,
  impurity: 0,
  result: 'passed',
  inspectorId: '',
  attachment: undefined,
  notes: ''
};

/**
 * Type inference from schema
 */
export type QualityInspectionSchemaType = yup.InferType<typeof qualityInspectionSchema>;

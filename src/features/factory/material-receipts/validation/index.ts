// ==============================|| MATERIAL RECEIPT VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import dateHelper from 'utils/dateHelper';

import type { MaterialReceiptFormData } from '../types';

/**
 * Validation schema for Material Receipt form
 * Using Yup for schema validation
 */
export const materialReceiptSchema = yup.object<MaterialReceiptFormData>().shape({
  code: yup.string().required('Mã phiếu nhập là bắt buộc'),

  receiptDate: yup
    .date()
    .required('Ngày nhập kho là bắt buộc')
    .typeError('Ngày nhập kho không hợp lệ')
    .max(new Date(), 'Ngày nhập kho không được lớn hơn ngày hiện tại'),

  supplierId: yup.string().required('Nhà cung cấp là bắt buộc'),

  warehouseId: yup.string().required('Kho nhập là bắt buộc'),

  materialType: yup
    .string()
    .oneOf(['keo', 'tram', 'bach-dan', 'thong', 'other'], 'Loại nguyên liệu không hợp lệ')
    .required('Loại nguyên liệu là bắt buộc'),

  quantity: yup
    .number()
    .required('Khối lượng là bắt buộc')
    .positive('Khối lượng phải lớn hơn 0')
    .max(1000000, 'Khối lượng không được vượt quá 1,000,000 kg'),

  unitPrice: yup.number().optional().min(0, 'Đơn giá phải lớn hơn hoặc bằng 0').max(1000000, 'Đơn giá không được vượt quá 1,000,000'),

  totalValue: yup
    .number()
    .optional()
    .min(0, 'Tổng giá trị phải lớn hơn hoặc bằng 0')
    .max(1000000000, 'Tổng giá trị không được vượt quá 1,000,000,000'),

  referenceDoc: yup.mixed<File | string>().optional(),

  status: yup.string().oneOf(['draft', 'received', 'cancelled'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc'),

  notes: yup.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional()
});

/**
 * Default values for Material Receipt form
 */
export const materialReceiptDefaultValues: MaterialReceiptFormData = {
  code: '',
  receiptDate: dateHelper.getToday(),
  supplierId: '',
  warehouseId: '',
  materialType: 'keo',
  quantity: 0,
  unitPrice: undefined,
  totalValue: undefined,
  referenceDoc: undefined,
  status: 'draft',
  notes: ''
};

/**
 * Type inference from schema
 */
export type MaterialReceiptSchemaType = yup.InferType<typeof materialReceiptSchema>;

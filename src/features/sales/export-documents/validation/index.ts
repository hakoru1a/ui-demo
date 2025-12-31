// ==============================|| EXPORT DOCUMENT VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import dateHelper from 'utils/dateHelper';

import type { ExportDocumentFormData } from '../types';

/**
 * Validation schema for Export Document form
 * Using Yup for schema validation
 */
export const exportDocumentSchema = yup.object<ExportDocumentFormData>().shape({
  documentNo: yup.string().required('Mã chứng từ là bắt buộc'),

  documentType: yup.string().oneOf(['invoice', 'packing-list'], 'Loại chứng từ không hợp lệ').required('Loại chứng từ là bắt buộc'),

  exportOrderId: yup.string().required('Đơn hàng XK là bắt buộc'),

  customerId: yup.string().required('Khách hàng là bắt buộc'),

  invoiceDate: yup.date().required('Ngày hóa đơn là bắt buộc').typeError('Ngày hóa đơn không hợp lệ'),

  currency: yup.string().required('Tiền tệ là bắt buộc'),

  totalAmount: yup.number().required('Tổng giá trị là bắt buộc').positive('Tổng giá trị phải lớn hơn 0'),

  packageCount: yup.number().when('documentType', {
    is: 'packing-list',
    then: (schema) => schema.required('Số kiện là bắt buộc với Packing List').positive('Số kiện phải lớn hơn 0'),
    otherwise: (schema) => schema.optional().positive('Số kiện phải lớn hơn 0')
  }),

  grossWeight: yup.number().optional().positive('Trọng lượng gross phải lớn hơn 0'),

  netWeight: yup.number().optional().positive('Trọng lượng net phải lớn hơn 0'),

  hsCode: yup.string().optional(),

  attachment: yup.mixed().optional(),

  status: yup.string().oneOf(['draft', 'issued'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc')
});

/**
 * Default values for Export Document form
 */
export const exportDocumentDefaultValues: ExportDocumentFormData = {
  documentNo: '',
  documentType: 'invoice',
  exportOrderId: '',
  customerId: '',
  customerName: '',
  invoiceDate: dateHelper.formatDate(new Date()),
  currency: 'USD',
  totalAmount: 0,
  packageCount: undefined,
  grossWeight: undefined,
  netWeight: undefined,
  hsCode: '',
  attachment: undefined,
  status: 'draft'
};

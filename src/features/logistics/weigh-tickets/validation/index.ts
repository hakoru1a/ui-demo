// ==============================|| WEIGH TICKET VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { WeighTicketFormData } from '../types';

/**
 * Validation schema for Weigh Ticket form
 * Using Yup for schema validation
 */
export const weighTicketSchema = yup.object<WeighTicketFormData>().shape({
  code: yup.string().required('Mã phiếu cân là bắt buộc'),

  vehiclePlate: yup
    .string()
    .required('Biển số xe là bắt buộc')
    .min(2, 'Biển số xe phải có ít nhất 2 ký tự')
    .max(20, 'Biển số xe không được quá 20 ký tự'),

  supplierId: yup.string().required('Nhà cung cấp là bắt buộc'),

  type: yup.string().oneOf(['inbound', 'outbound'], 'Loại phiếu không hợp lệ').required('Loại phiếu là bắt buộc'),

  weightIn: yup
    .number()
    .when('type', {
      is: 'inbound',
      then: (schema) => schema.required('Trọng lượng vào là bắt buộc cho phiếu Inbound').positive('Trọng lượng vào phải lớn hơn 0'),
      otherwise: (schema) => schema.optional()
    })
    .min(0, 'Trọng lượng vào phải lớn hơn hoặc bằng 0')
    .max(1000000, 'Trọng lượng vào không được vượt quá 1,000,000 kg'),

  weightOut: yup
    .number()
    .when('type', {
      is: 'outbound',
      then: (schema) => schema.required('Trọng lượng ra là bắt buộc cho phiếu Outbound').positive('Trọng lượng ra phải lớn hơn 0'),
      otherwise: (schema) => schema.optional()
    })
    .min(0, 'Trọng lượng ra phải lớn hơn hoặc bằng 0')
    .max(1000000, 'Trọng lượng ra không được vượt quá 1,000,000 kg'),

  weightDifference: yup.number().optional().min(0, 'Khối lượng chênh lệch phải lớn hơn hoặc bằng 0'),

  unitPrice: yup.number().optional().min(0, 'Đơn giá phải lớn hơn hoặc bằng 0'),

  estimatedAmount: yup.number().optional().min(0, 'Thành tiền phải lớn hơn hoặc bằng 0'),

  notes: yup.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional()
});

/**
 * Default values for Weigh Ticket form
 */
export const weighTicketDefaultValues: WeighTicketFormData = {
  code: '',
  vehiclePlate: '',
  supplierId: '',
  type: 'inbound',
  weightIn: undefined,
  weightOut: undefined,
  weightDifference: undefined,
  unitPrice: undefined,
  estimatedAmount: undefined,
  notes: ''
};

/**
 * Type inference from schema
 */
export type WeighTicketSchemaType = yup.InferType<typeof weighTicketSchema>;

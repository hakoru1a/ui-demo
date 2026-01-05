// ==============================|| WORKFORCE DISPATCH VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { DispatchPersonnelFormData, WorkforceDispatchOrderFormData } from '../types/form';

/**
 * Validation schema for Personnel detail
 */
export const personnelSchema = yup.object<DispatchPersonnelFormData>().shape({
  personnelId: yup.string().required('Nhân sự là bắt buộc'),
  role: yup.string().oneOf(['worker', 'supervisor'], 'Vai trò không hợp lệ').required('Vai trò là bắt buộc'),
  note: yup.string().max(500, 'Ghi chú không được quá 500 ký tự')
});

/**
 * Validation schema for Workforce Dispatch Order form
 * Using Yup for schema validation
 */
export const workforceDispatchOrderSchema = yup.object<WorkforceDispatchOrderFormData>().shape({
  code: yup.string().required('Mã lệnh điều phối là bắt buộc'),

  applicationDate: yup.date().required('Ngày áp dụng là bắt buộc').nullable(),

  factoryId: yup.string().required('Nhà máy là bắt buộc'),

  productionShiftId: yup.string().required('Ca sản xuất là bắt buộc'),

  departmentId: yup.string().required('Bộ phận là bắt buộc'),

  personnel: yup.array().of(personnelSchema).min(1, 'Phải có ít nhất một nhân sự').required('Danh sách nhân sự là bắt buộc'),

  status: yup.string().oneOf(['draft', 'approved', 'applied'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc')
});

/**
 * Default values for Workforce Dispatch Order form
 */
export const workforceDispatchOrderDefaultValues: WorkforceDispatchOrderFormData = {
  code: '',
  applicationDate: new Date(),
  factoryId: '',
  productionShiftId: '',
  departmentId: '',
  personnel: [],
  status: 'draft'
};

/**
 * Type inference from schema
 */
export type WorkforceDispatchOrderSchemaType = yup.InferType<typeof workforceDispatchOrderSchema>;

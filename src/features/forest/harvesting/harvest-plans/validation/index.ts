// ==============================|| HARVEST PLAN VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { HarvestPlanFormData } from '../types';

/**
 * Validation schema for Harvest Plan form
 * Using Yup for schema validation
 */
export const harvestPlanSchema = yup.object<HarvestPlanFormData>().shape({
  code: yup.string().required('Mã kế hoạch là bắt buộc'),

  name: yup
    .string()
    .required('Tên kế hoạch là bắt buộc')
    .min(2, 'Tên kế hoạch phải có ít nhất 2 ký tự')
    .max(200, 'Tên kế hoạch không được quá 200 ký tự'),

  forestAreaId: yup.string().required('Khu vực rừng là bắt buộc'),

  area: yup
    .number()
    .required('Diện tích là bắt buộc')
    .positive('Diện tích phải lớn hơn 0')
    .max(100000, 'Diện tích không được vượt quá 100,000 ha'),

  startDate: yup.date().required('Thời gian bắt đầu là bắt buộc').typeError('Ngày không hợp lệ'),

  endDate: yup
    .date()
    .required('Thời gian kết thúc là bắt buộc')
    .typeError('Ngày không hợp lệ')
    .min(yup.ref('startDate'), 'Thời gian kết thúc phải lớn hơn hoặc bằng thời gian bắt đầu'),

  expectedYield: yup
    .number()
    .required('Sản lượng dự kiến là bắt buộc')
    .positive('Sản lượng dự kiến phải lớn hơn 0')
    .max(1000000, 'Sản lượng dự kiến không được vượt quá 1,000,000 m³'),

  fscStandard: yup.boolean().required('Chuẩn FSC là bắt buộc'),

  description: yup.string().max(1000, 'Mô tả không được quá 1000 ký tự').optional(),

  status: yup.string().oneOf(['draft', 'active', 'completed'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc')
});

/**
 * Default values for Harvest Plan form
 */
export const harvestPlanDefaultValues: HarvestPlanFormData = {
  code: '',
  name: '',
  forestAreaId: '',
  area: 0,
  startDate: new Date(),
  endDate: new Date(),
  expectedYield: 0,
  fscStandard: true,
  description: '',
  status: 'draft'
};

/**
 * Type inference from schema
 */
export type HarvestPlanSchemaType = yup.InferType<typeof harvestPlanSchema>;

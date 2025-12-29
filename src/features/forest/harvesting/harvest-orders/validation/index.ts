// ==============================|| HARVEST ORDER VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { HarvestOrderFormData } from '../types';
import { HARVEST_ORDER_EXECUTOR_TYPE, HARVEST_ORDER_STATUS } from '../types/enums';

/**
 * Validation schema for Harvest Order form
 */
export const harvestOrderSchema = yup.object<HarvestOrderFormData>().shape({
  code: yup.string(), // Read-only but kept in schema

  planId: yup.string().required('Kế hoạch khai thác là bắt buộc'),

  forestAreaId: yup.string().required('Khu vực rừng là bắt buộc'),

  startDate: yup.date().required('Ngày thực hiện là bắt buộc').typeError('Ngày không hợp lệ'),

  actualYield: yup.number().required('Sản lượng thực tế là bắt buộc').min(0, 'Sản lượng phải lớn hơn hoặc bằng 0'),

  executorType: yup
    .string()
    .oneOf([HARVEST_ORDER_EXECUTOR_TYPE.CONTRACTOR, HARVEST_ORDER_EXECUTOR_TYPE.INTERNAL_TEAM, ''], 'Đơn vị thực hiện không hợp lệ')
    .optional(),

  note: yup.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional(),

  status: yup.string().oneOf(Object.values(HARVEST_ORDER_STATUS), 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc')
});

/**
 * Default values for Harvest Order form
 */
export const harvestOrderDefaultValues: HarvestOrderFormData = {
  code: '', // Will be auto-generated or populated
  planId: '',
  forestAreaId: '',
  startDate: null,
  actualYield: 0,
  executorType: '',
  note: '',
  status: 'new'
};

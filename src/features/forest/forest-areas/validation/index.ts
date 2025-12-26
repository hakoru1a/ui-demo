// ==============================|| FOREST AREA VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { ForestAreaFormData } from '../types';
import { CURRENT_YEAR, MIN_PLANTING_YEAR } from '../types/constants';

/**
 * Validation schema for Forest Area form
 * Using Yup for schema validation
 */
export const forestAreaSchema = yup.object<ForestAreaFormData>().shape({
  code: yup.string().required('Mã vùng trồng là bắt buộc'),

  name: yup
    .string()
    .required('Tên vùng trồng là bắt buộc')
    .min(2, 'Tên vùng trồng phải có ít nhất 2 ký tự')
    .max(200, 'Tên vùng trồng không được quá 200 ký tự'),

  ownershipType: yup.string().oneOf(['company', 'partner'], 'Loại sở hữu không hợp lệ').required('Loại sở hữu là bắt buộc'),

  ownerId: yup.string().when('ownershipType', {
    is: 'partner',
    then: (schema) => schema.required('Chủ sở hữu/Đối tác là bắt buộc khi loại sở hữu là Đối tác'),
    otherwise: (schema) => schema.optional()
  }),

  area: yup
    .number()
    .required('Diện tích là bắt buộc')
    .positive('Diện tích phải lớn hơn 0')
    .max(100000, 'Diện tích không được vượt quá 100,000 ha'),

  province: yup.string().required('Tỉnh/Khu vực là bắt buộc'),

  treeType: yup.string().oneOf(['keo', 'bach-dan', 'thong', 'other']).optional(),

  plantingYear: yup
    .number()
    .optional()
    .min(MIN_PLANTING_YEAR, `Năm trồng không được nhỏ hơn ${MIN_PLANTING_YEAR}`)
    .max(CURRENT_YEAR, `Năm trồng không được lớn hơn ${CURRENT_YEAR}`),

  status: yup.string().oneOf(['active', 'inactive'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc'),

  certificates: yup
    .array()
    .of(yup.string().oneOf(['FSC', 'PEFC']))
    .default([]),

  notes: yup.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional()
});

/**
 * Default values for Forest Area form
 */
export const forestAreaDefaultValues: ForestAreaFormData = {
  code: '',
  name: '',
  ownershipType: 'company',
  ownerId: undefined,
  area: 0,
  province: '',
  treeType: undefined,
  plantingYear: undefined,
  status: 'active',
  certificates: [],
  notes: ''
};

/**
 * Type inference from schema
 */
export type ForestAreaSchemaType = yup.InferType<typeof forestAreaSchema>;

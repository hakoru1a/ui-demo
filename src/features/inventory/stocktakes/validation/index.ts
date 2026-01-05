// ==============================|| STOCKTAKE VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { StocktakeFormData, StocktakeItemFormData } from '../types';

/**
 * Validation schema for Stocktake Item Form
 */
export const stocktakeItemSchema = yup.object<StocktakeItemFormData>().shape({
  skuId: yup.string().required('SKU là bắt buộc'),
  skuCode: yup.string().required('Mã SKU là bắt buộc'),
  skuName: yup.string().required('Tên hàng hóa là bắt buộc'),
  systemQty: yup
    .number()
    .required('Số lượng hệ thống là bắt buộc')
    .min(0, 'Số lượng hệ thống không được âm')
    .typeError('Số lượng hệ thống phải là số'),
  actualQty: yup
    .number()
    .required('Số lượng thực tế là bắt buộc')
    .min(0, 'Số lượng thực tế không được âm')
    .typeError('Số lượng thực tế phải là số'),
  difference: yup.number().required('Chênh lệch là bắt buộc').typeError('Chênh lệch phải là số'),
  reason: yup
    .string()
    .when('difference', {
      is: (val: number) => val !== 0,
      then: (schema) => schema.required('Lý do chênh lệch là bắt buộc khi có chênh lệch'),
      otherwise: (schema) => schema.optional()
    })
    .max(1000, 'Lý do chênh lệch không được quá 1000 ký tự')
});

/**
 * Validation schema for Stocktake form
 * Using Yup for schema validation
 */
export const stocktakeSchema = yup.object<StocktakeFormData>().shape({
  code: yup.string().required('Mã phiếu kiểm kê là bắt buộc'),
  inventoryDate: yup.date().required('Ngày kiểm kê là bắt buộc').typeError('Ngày kiểm kê không hợp lệ'),
  warehouseId: yup.string().required('Kho là bắt buộc'),
  items: yup.array().of(stocktakeItemSchema).required('Danh sách SKU là bắt buộc').min(1, 'Phải có ít nhất một SKU'),
  status: yup.string().oneOf(['draft', 'completed'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc'),
  notes: yup.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional()
});

/**
 * Default values for Stocktake Item form
 */
export const stocktakeItemDefaultValues: StocktakeItemFormData = {
  skuId: '',
  skuCode: '',
  skuName: '',
  systemQty: 0,
  actualQty: 0,
  difference: 0,
  reason: undefined
};

/**
 * Default values for Stocktake form
 */
export const stocktakeDefaultValues: StocktakeFormData = {
  code: '',
  inventoryDate: new Date(),
  warehouseId: '',
  items: [],
  status: 'draft',
  notes: undefined
};

/**
 * Type inference from schema
 */
export type StocktakeSchemaType = yup.InferType<typeof stocktakeSchema>;
export type StocktakeItemSchemaType = yup.InferType<typeof stocktakeItemSchema>;

// ==============================|| EXPORT DOCUMENTS CONSTANTS ||============================== //

import type { DocumentType, DocumentStatus } from './enums';

export const DOCUMENT_TYPE_OPTIONS: { value: DocumentType; label: string }[] = [
  { value: 'invoice', label: 'Invoice' },
  { value: 'packing-list', label: 'Packing List' }
]; // Option cho dropdown Loại chứng từ

export const DOCUMENT_STATUS_OPTIONS: { value: DocumentStatus; label: string }[] = [
  { value: 'draft', label: 'Nháp' },
  { value: 'issued', label: 'Phát hành' }
]; // Option cho dropdown Trạng thái

export const CURRENCY_OPTIONS: { value: string; label: string }[] = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'JPY', label: 'JPY' },
  { value: 'CNY', label: 'CNY' },
  { value: 'VND', label: 'VND' }
]; // Option cho dropdown Tiền tệ

// Route path segments (for route config)
export const EXPORT_DOCUMENT_PATHS = {
  ROOT: '/export-documents',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const EXPORT_DOCUMENT_URLS = {
  LIST: EXPORT_DOCUMENT_PATHS.ROOT,
  NEW: `${EXPORT_DOCUMENT_PATHS.ROOT}/${EXPORT_DOCUMENT_PATHS.NEW}`,
  DETAIL: (id: string) => `${EXPORT_DOCUMENT_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${EXPORT_DOCUMENT_PATHS.ROOT}/${id}/edit`
} as const;

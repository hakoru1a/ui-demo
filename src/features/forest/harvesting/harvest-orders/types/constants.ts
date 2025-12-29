import { HarvestOrderExecutorType, HarvestOrderStatus, HARVEST_ORDER_STATUS } from './enums';

export { HARVEST_ORDER_STATUS };

export const HARVEST_ORDER_STATUS_OPTIONS = [
  { value: 'new' as HarvestOrderStatus, label: 'Mới', color: 'info' },
  { value: 'in_progress' as HarvestOrderStatus, label: 'Đang khai thác', color: 'warning' },
  { value: 'completed' as HarvestOrderStatus, label: 'Hoàn thành', color: 'success' }
];

export const HARVEST_ORDER_EXECUTOR_OPTIONS = [
  { value: 'contractor' as HarvestOrderExecutorType, label: 'Nhà thầu' },
  { value: 'internal_team' as HarvestOrderExecutorType, label: 'Đội nội bộ' }
];

export const HARVEST_ORDER_PATHS = {
  LIST: '',
  CREATE: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
};

export const HARVEST_ORDER_URLS = {
  LIST: '/harvest-orders',
  CREATE: '/harvest-orders/new',
  DETAIL: (id: string) => `/harvest-orders/${id}`,
  EDIT: (id: string) => `/harvest-orders/${id}/edit`
};

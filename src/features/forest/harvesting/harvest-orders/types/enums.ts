export type HarvestOrderStatus = 'new' | 'in_progress' | 'completed';

export const HARVEST_ORDER_STATUS = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
} as const;

export type HarvestOrderExecutorType = 'contractor' | 'internal_team';

export const HARVEST_ORDER_EXECUTOR_TYPE = {
  CONTRACTOR: 'contractor',
  INTERNAL_TEAM: 'internal_team'
} as const;

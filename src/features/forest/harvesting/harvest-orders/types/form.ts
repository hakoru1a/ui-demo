import { HarvestOrderExecutorType, HarvestOrderStatus } from './enums';

export interface HarvestOrderFormData {
  code: string; // Read-only
  planId: string;
  forestAreaId: string; // Auto-fill from plan
  startDate: string | null;
  actualYield: number;
  executorType: HarvestOrderExecutorType | '';
  note: string;
  status: HarvestOrderStatus;
}

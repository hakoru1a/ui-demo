import { HarvestOrderStatus } from './enums';

export interface HarvestOrderDateRange {
  start: string | null;
  end: string | null;
}

export interface HarvestOrderFilters {
  search: string;
  status: HarvestOrderStatus[];
  range: HarvestOrderDateRange;
  planId?: string;
  forestAreaId?: string;
}

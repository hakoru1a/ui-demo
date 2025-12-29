/**
 * Entity definitions for Harvest Orders
 */
import { HarvestOrderStatus, HarvestOrderExecutorType } from './enums';

export interface HarvestOrder {
  id: string;
  code: string;
  planId: string; // Link to HarvestPlan
  planName: string; // Denormalized for display
  forestAreaId: string; // Link to ForestArea (via Plan)
  forestAreaName: string; // Denormalized for display
  startDate: string; // ISO Date
  endDate?: string; // ISO Date, optional until completed? Or maybe estimated end date?
  actualYield: number; // m3
  executorType?: HarvestOrderExecutorType;
  executorName?: string; // Name of contractor or team
  status: HarvestOrderStatus;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

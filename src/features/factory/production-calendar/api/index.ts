/**
 * Production Calendar Service
 *
 * API service for managing production calendar events (batches, shifts, production logs)
 */

import BaseService from 'services/http/base-service';
import type { ApiResult, QueryRequest } from 'services/http/types';

import type { ProductionShift, ShiftProduction } from '../types';

// ==================== TYPES ====================

export interface GetShiftsRequest extends QueryRequest {
  batchId?: string;
  productionLineId?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateShiftRequest {
  batchId: string;
  productionLineId: string;
  startTime: Date | string;
  endTime: Date | string;
  notes?: string;
}

export interface UpdateShiftRequest extends Partial<CreateShiftRequest> {}

// ==================== SERVICE CLASS ====================

/**
 * Production Calendar Service Class
 * Extends BaseService to inherit all HTTP methods
 */
class ProductionCalendarService extends BaseService {
  /**
   * Get production shifts for calendar
   *
   * @param params - Query parameters (batchId, productionLineId, startDate, endDate)
   * @returns List of shifts
   */
  async getShifts(params?: GetShiftsRequest): Promise<ApiResult<ProductionShift[]>> {
    return this.get<ProductionShift[]>('/api/production-calendar/shifts', params);
  }

  /**
   * Get shift production data for a specific day
   *
   * @param shiftId - Shift ID
   * @returns Shift production data
   */
  async getShiftProduction(shiftId: string): Promise<ApiResult<ShiftProduction>> {
    return this.get<ShiftProduction>(`/api/production-calendar/shifts/${shiftId}/production`);
  }

  /**
   * Create a new production shift
   *
   * @param payload - Shift data
   * @returns Created shift result
   */
  async createShift(payload: CreateShiftRequest): Promise<ApiResult<ProductionShift>> {
    return this.post<CreateShiftRequest, ProductionShift>('/api/production-calendar/shifts', payload);
  }

  /**
   * Update an existing shift
   *
   * @param id - Shift ID
   * @param payload - Updated data
   * @returns Updated shift result
   */
  async updateShift(id: string, payload: UpdateShiftRequest): Promise<ApiResult<ProductionShift>> {
    return this.put<UpdateShiftRequest, ProductionShift>(`/api/production-calendar/shifts/${id}`, payload);
  }

  /**
   * Delete a shift
   *
   * @param id - Shift ID
   * @returns Delete operation result
   */
  async deleteShift(id: string): Promise<ApiResult<void>> {
    return this.delete<void>(`/api/production-calendar/shifts/${id}`);
  }
}

// ==================== SINGLETON EXPORT ====================

/**
 * Export a singleton instance of the service
 * This ensures only one instance exists throughout the application
 */
export const productionCalendarService = new ProductionCalendarService();

/**
 * Shift Log Service
 *
 * API service for managing shift logs
 */

import BaseService from 'services/http/base-service';
import type { ApiResult, PaginationResult, QueryRequest } from 'services/http/types';

import type { ShiftLog, ShiftLogFormData } from '../types';

// ==================== TYPES ====================

export interface GetShiftLogsRequest extends QueryRequest {
  shiftId?: string;
  batchId?: string;
  workDate?: string;
  status?: string;
}

export interface CreateShiftLogRequest extends ShiftLogFormData {}

export interface UpdateShiftLogRequest extends Partial<ShiftLogFormData> {}

// ==================== SERVICE CLASS ====================

/**
 * Shift Log Service Class
 * Extends BaseService to inherit all HTTP methods
 */
class ShiftLogService extends BaseService {
  /**
   * Get paginated list of shift logs
   *
   * @param params - Query parameters (page, size, search, sort, shiftId, batchId, workDate, status)
   * @returns Paginated result
   */
  async getShiftLogs(params?: GetShiftLogsRequest): Promise<ApiResult<PaginationResult<ShiftLog>>> {
    return this.get<PaginationResult<ShiftLog>>('/api/shift-logs', params);
  }

  /**
   * Get all shift logs (without pagination)
   *
   * @param params - Query parameters (search, sort, shiftId, batchId, workDate, status)
   * @returns List of shift logs
   */
  async getAllShiftLogs(params?: Omit<GetShiftLogsRequest, 'page' | 'size'>): Promise<ApiResult<ShiftLog[]>> {
    return this.get<ShiftLog[]>('/api/shift-logs/all', params);
  }

  /**
   * Get a single shift log by ID
   *
   * @param id - Shift log ID
   * @returns Single shift log result
   */
  async getShiftLogById(id: string): Promise<ApiResult<ShiftLog>> {
    return this.get<ShiftLog>(`/api/shift-logs/${id}`);
  }

  /**
   * Create a new shift log
   *
   * @param payload - Shift log data
   * @returns Created shift log result
   */
  async createShiftLog(payload: CreateShiftLogRequest): Promise<ApiResult<ShiftLog>> {
    return this.post<CreateShiftLogRequest, ShiftLog>('/api/shift-logs', payload);
  }

  /**
   * Update an existing shift log
   *
   * @param id - Shift log ID
   * @param payload - Updated data
   * @returns Updated shift log result
   */
  async updateShiftLog(id: string, payload: UpdateShiftLogRequest): Promise<ApiResult<ShiftLog>> {
    return this.put<UpdateShiftLogRequest, ShiftLog>(`/api/shift-logs/${id}`, payload);
  }

  /**
   * Delete a shift log
   *
   * @param id - Shift log ID
   * @returns Delete operation result
   */
  async deleteShiftLog(id: string): Promise<ApiResult<void>> {
    return this.delete<void>(`/api/shift-logs/${id}`);
  }

  /**
   * Bulk delete shift logs
   *
   * @param ids - Array of shift log IDs
   * @returns Delete operation result
   */
  async bulkDeleteShiftLogs(ids: string[]): Promise<ApiResult<void>> {
    return this.delete<void>('/api/shift-logs/bulk', undefined, { ids });
  }
}

// ==================== SINGLETON EXPORT ====================

/**
 * Export a singleton instance of the service
 * This ensures only one instance exists throughout the application
 */
export const shiftLogService = new ShiftLogService();

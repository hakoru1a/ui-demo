/**
 * Logistics Costing Service
 *
 * API service for managing logistics costs
 */

import BaseService from 'services/http/base-service';
import type { ApiResult, PaginationResult, QueryRequest } from 'services/http/types';

import type { LogisticsCost, LogisticsCostFormData } from '../types';

// ==================== TYPES ====================

export interface CreateLogisticsCostRequest extends LogisticsCostFormData {}

export interface UpdateLogisticsCostRequest extends Partial<LogisticsCostFormData> {}

// ==================== SERVICE CLASS ====================

/**
 * Logistics Costing Service Class
 * Extends BaseService to inherit all HTTP methods
 */
class LogisticsCostingService extends BaseService {
  /**
   * Get paginated list of logistics costs
   *
   * @param params - Query parameters (page, size, search, sort)
   * @returns Paginated result
   */
  async getLogisticsCosts(params?: QueryRequest): Promise<ApiResult<PaginationResult<LogisticsCost>>> {
    return this.get<PaginationResult<LogisticsCost>>('/api/logistics-costing', params);
  }

  /**
   * Get all logistics costs (without pagination)
   *
   * @param params - Query parameters (search, sort)
   * @returns List of logistics costs
   */
  async getAllLogisticsCosts(params?: Omit<QueryRequest, 'page' | 'size'>): Promise<ApiResult<LogisticsCost[]>> {
    return this.get<LogisticsCost[]>('/api/logistics-costing/all', params);
  }

  /**
   * Get a single logistics cost by ID
   *
   * @param id - Logistics cost ID
   * @returns Single logistics cost result
   */
  async getLogisticsCostById(id: string): Promise<ApiResult<LogisticsCost>> {
    return this.get<LogisticsCost>(`/api/logistics-costing/${id}`);
  }

  /**
   * Create a new logistics cost
   *
   * @param payload - Logistics cost data
   * @returns Created logistics cost result
   */
  async createLogisticsCost(payload: CreateLogisticsCostRequest): Promise<ApiResult<LogisticsCost>> {
    return this.post<CreateLogisticsCostRequest, LogisticsCost>('/api/logistics-costing', payload);
  }

  /**
   * Update an existing logistics cost
   *
   * @param id - Logistics cost ID
   * @param payload - Updated data
   * @returns Updated logistics cost result
   */
  async updateLogisticsCost(id: string, payload: UpdateLogisticsCostRequest): Promise<ApiResult<LogisticsCost>> {
    return this.put<UpdateLogisticsCostRequest, LogisticsCost>(`/api/logistics-costing/${id}`, payload);
  }

  /**
   * Record a logistics cost (change status from draft to recorded)
   *
   * @param id - Logistics cost ID
   * @returns Updated logistics cost result
   */
  async recordLogisticsCost(id: string): Promise<ApiResult<LogisticsCost>> {
    return this.post<{ status: 'recorded' }, LogisticsCost>(`/api/logistics-costing/${id}/record`, { status: 'recorded' });
  }

  /**
   * Delete a logistics cost
   *
   * @param id - Logistics cost ID
   * @returns Delete operation result
   */
  async deleteLogisticsCost(id: string): Promise<ApiResult<void>> {
    return this.delete<void>(`/api/logistics-costing/${id}`);
  }

  /**
   * Bulk delete logistics costs
   *
   * @param ids - Array of logistics cost IDs
   * @returns Delete operation result
   */
  async bulkDeleteLogisticsCosts(ids: string[]): Promise<ApiResult<void>> {
    return this.delete<void>('/api/logistics-costing/bulk', undefined, { ids });
  }
}

// ==================== SINGLETON EXPORT ====================

/**
 * Export a singleton instance of the service
 * This ensures only one instance exists throughout the application
 */
export const logisticsCostingService = new LogisticsCostingService();

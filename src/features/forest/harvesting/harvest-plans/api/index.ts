/**
 * Harvest Plan Service
 *
 * API service for managing harvest plans
 */

import BaseService from 'services/http/base-service';
import type { ApiResult, PaginationResult, QueryRequest } from 'services/http/types';

import type { HarvestPlan, HarvestPlanFormData } from '../types';

// ==================== TYPES ====================

export interface CreateHarvestPlanRequest extends HarvestPlanFormData {}

export interface UpdateHarvestPlanRequest extends Partial<HarvestPlanFormData> {}

// ==================== SERVICE CLASS ====================

/**
 * Harvest Plan Service Class
 * Extends BaseService to inherit all HTTP methods
 */
class HarvestPlanService extends BaseService {
  /**
   * Get paginated list of harvest plans
   *
   * @param params - Query parameters (page, size, search, sort)
   * @returns Paginated result
   */
  async getHarvestPlans(params?: QueryRequest): Promise<ApiResult<PaginationResult<HarvestPlan>>> {
    return this.get<PaginationResult<HarvestPlan>>('/api/harvest-plans', params);
  }

  /**
   * Get all harvest plans (without pagination)
   *
   * @param params - Query parameters (search, sort)
   * @returns List of harvest plans
   */
  async getAllHarvestPlans(params?: Omit<QueryRequest, 'page' | 'size'>): Promise<ApiResult<HarvestPlan[]>> {
    return this.get<HarvestPlan[]>('/api/harvest-plans/all', params);
  }

  /**
   * Get a single harvest plan by ID
   *
   * @param id - Harvest plan ID
   * @returns Single harvest plan result
   */
  async getHarvestPlanById(id: string): Promise<ApiResult<HarvestPlan>> {
    return this.get<HarvestPlan>(`/api/harvest-plans/${id}`);
  }

  /**
   * Create a new harvest plan
   *
   * @param payload - Harvest plan data
   * @returns Created harvest plan result
   */
  async createHarvestPlan(payload: CreateHarvestPlanRequest): Promise<ApiResult<HarvestPlan>> {
    return this.post<CreateHarvestPlanRequest, HarvestPlan>('/api/harvest-plans', payload);
  }

  /**
   * Update an existing harvest plan
   *
   * @param id - Harvest plan ID
   * @param payload - Updated data
   * @returns Updated harvest plan result
   */
  async updateHarvestPlan(id: string, payload: UpdateHarvestPlanRequest): Promise<ApiResult<HarvestPlan>> {
    return this.put<UpdateHarvestPlanRequest, HarvestPlan>(`/api/harvest-plans/${id}`, payload);
  }

  /**
   * Delete a harvest plan
   *
   * @param id - Harvest plan ID
   * @returns Delete operation result
   */
  async deleteHarvestPlan(id: string): Promise<ApiResult<void>> {
    return this.delete<void>(`/api/harvest-plans/${id}`);
  }

  /**
   * Bulk delete harvest plans
   *
   * @param ids - Array of harvest plan IDs
   * @returns Delete operation result
   */
  async bulkDeleteHarvestPlans(ids: string[]): Promise<ApiResult<void>> {
    return this.delete<void>('/api/harvest-plans/bulk', undefined, { ids });
  }
}

// ==================== SINGLETON EXPORT ====================

/**
 * Export a singleton instance of the service
 * This ensures only one instance exists throughout the application
 */
export const harvestPlanService = new HarvestPlanService();

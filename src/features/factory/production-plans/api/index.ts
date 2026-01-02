/**
 * Production Plan Service
 *
 * API service for managing production plans/orders
 */

import BaseService from 'services/http/base-service';
import type { ApiResult, PaginationResult, QueryRequest } from 'services/http/types';

import type { ProductionPlan, ProductionPlanFormData } from '../types';

// ==================== TYPES ====================

export interface CreateProductionPlanRequest extends ProductionPlanFormData {}

export interface UpdateProductionPlanRequest extends Partial<ProductionPlanFormData> {}

// ==================== SERVICE CLASS ====================

/**
 * Production Plan Service Class
 * Extends BaseService to inherit all HTTP methods
 */
class ProductionPlanService extends BaseService {
  /**
   * Get paginated list of production plans
   *
   * @param params - Query parameters (page, size, search, sort)
   * @returns Paginated result
   */
  async getProductionPlans(params?: QueryRequest): Promise<ApiResult<PaginationResult<ProductionPlan>>> {
    return this.get<PaginationResult<ProductionPlan>>('/api/production-plans', params);
  }

  /**
   * Get all production plans (without pagination)
   *
   * @param params - Query parameters (search, sort)
   * @returns List of production plans
   */
  async getAllProductionPlans(params?: Omit<QueryRequest, 'page' | 'size'>): Promise<ApiResult<ProductionPlan[]>> {
    return this.get<ProductionPlan[]>('/api/production-plans/all', params);
  }

  /**
   * Get a single production plan by ID
   *
   * @param id - Production plan ID
   * @returns Single production plan result
   */
  async getProductionPlanById(id: string): Promise<ApiResult<ProductionPlan>> {
    return this.get<ProductionPlan>(`/api/production-plans/${id}`);
  }

  /**
   * Create a new production plan
   *
   * @param payload - Production plan data
   * @returns Created production plan result
   */
  async createProductionPlan(payload: CreateProductionPlanRequest): Promise<ApiResult<ProductionPlan>> {
    return this.post<CreateProductionPlanRequest, ProductionPlan>('/api/production-plans', payload);
  }

  /**
   * Update an existing production plan
   *
   * @param id - Production plan ID
   * @param payload - Updated data
   * @returns Updated production plan result
   */
  async updateProductionPlan(id: string, payload: UpdateProductionPlanRequest): Promise<ApiResult<ProductionPlan>> {
    return this.put<UpdateProductionPlanRequest, ProductionPlan>(`/api/production-plans/${id}`, payload);
  }

  /**
   * Delete a production plan
   *
   * @param id - Production plan ID
   * @returns Delete operation result
   */
  async deleteProductionPlan(id: string): Promise<ApiResult<void>> {
    return this.delete<void>(`/api/production-plans/${id}`);
  }

  /**
   * Bulk delete production plans
   *
   * @param ids - Array of production plan IDs
   * @returns Delete operation result
   */
  async bulkDeleteProductionPlans(ids: string[]): Promise<ApiResult<void>> {
    return this.delete<void>('/api/production-plans/bulk', undefined, { ids });
  }
}

// ==================== SINGLETON EXPORT ====================

/**
 * Export a singleton instance of the service
 * This ensures only one instance exists throughout the application
 */
export const productionPlanService = new ProductionPlanService();

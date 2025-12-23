/**
 * Forest Area Service
 *
 * API service for managing forest areas
 */

import BaseService from 'services/http/base-service';
import type { ApiResult, PaginationResult, QueryRequest } from 'services/http/types';

import type { ForestArea, ForestAreaFormData } from '../types';

// ==================== TYPES ====================

export interface CreateForestAreaRequest extends ForestAreaFormData {
  boundary?: ForestArea['boundary'];
}

export interface UpdateForestAreaRequest extends Partial<ForestAreaFormData> {
  boundary?: ForestArea['boundary'];
}

// ==================== SERVICE CLASS ====================

/**
 * Forest Area Service Class
 * Extends BaseService to inherit all HTTP methods
 */
class ForestAreaService extends BaseService {
  /**
   * Get paginated list of forest areas
   *
   * @param params - Query parameters (page, size, search, sort)
   * @returns Paginated result
   */
  async getForestAreas(params?: QueryRequest): Promise<ApiResult<PaginationResult<ForestArea>>> {
    return this.get<PaginationResult<ForestArea>>('/api/forest-areas', params);
  }

  /**
   * Get all forest areas (without pagination)
   *
   * @param params - Query parameters (search, sort)
   * @returns List of forest areas
   */
  async getAllForestAreas(params?: Omit<QueryRequest, 'page' | 'size'>): Promise<ApiResult<ForestArea[]>> {
    return this.get<ForestArea[]>('/api/forest-areas/all', params);
  }

  /**
   * Get a single forest area by ID
   *
   * @param id - Forest area ID
   * @returns Single forest area result
   */
  async getForestAreaById(id: string): Promise<ApiResult<ForestArea>> {
    return this.get<ForestArea>(`/api/forest-areas/${id}`);
  }

  /**
   * Create a new forest area
   *
   * @param payload - Forest area data
   * @returns Created forest area result
   */
  async createForestArea(payload: CreateForestAreaRequest): Promise<ApiResult<ForestArea>> {
    return this.post<CreateForestAreaRequest, ForestArea>('/api/forest-areas', payload);
  }

  /**
   * Update an existing forest area
   *
   * @param id - Forest area ID
   * @param payload - Updated data
   * @returns Updated forest area result
   */
  async updateForestArea(id: string, payload: UpdateForestAreaRequest): Promise<ApiResult<ForestArea>> {
    return this.put<UpdateForestAreaRequest, ForestArea>(`/api/forest-areas/${id}`, payload);
  }

  /**
   * Delete a forest area
   *
   * @param id - Forest area ID
   * @returns Delete operation result
   */
  async deleteForestArea(id: string): Promise<ApiResult<void>> {
    return this.delete<void>(`/api/forest-areas/${id}`);
  }

  /**
   * Bulk delete forest areas
   *
   * @param ids - Array of forest area IDs
   * @returns Delete operation result
   */
  async bulkDeleteForestAreas(ids: string[]): Promise<ApiResult<void>> {
    return this.delete<void>('/api/forest-areas/bulk', undefined, { ids });
  }
}

// ==================== SINGLETON EXPORT ====================

/**
 * Export a singleton instance of the service
 * This ensures only one instance exists throughout the application
 */
export const forestAreaService = new ForestAreaService();

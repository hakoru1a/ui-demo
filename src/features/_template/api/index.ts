/**
 * Feature Name Service
 *
 * TODO: Replace 'FeatureName' with your actual feature name
 * TODO: This service extends BaseService to handle API calls for this feature
 */

import { BaseService } from 'api/core';

// TODO: Import your types
// import { FeatureName, FeatureNameFormData } from '../types';

// ==================== TYPES ====================

// TODO: Define your request/response types here
// export interface CreateFeatureNameRequest {
//   // Add your fields
// }

// export interface UpdateFeatureNameRequest {
//   // Add your fields
// }

// ==================== SERVICE CLASS ====================

/**
 * Feature Name Service Class
 * Extends BaseService to inherit all HTTP methods
 */
class FeatureNameService extends BaseService {
  /**
   * Get paginated list of items
   *
   * @param params - Query parameters (page, size, search, sort)
   * @returns Paginated result
   */
  // TODO: Uncomment and customize
  // async getItems(params?: QueryRequest): Promise<ApiResult<PaginationResult<FeatureName>>> {
  //   return this.get<PaginationResult<FeatureName>>('/api/feature-name', params);
  // }
  /**
   * Get a single item by ID
   *
   * @param id - Item ID
   * @returns Single item result
   */
  // async getItemById(id: string): Promise<ApiResult<FeatureName>> {
  //   return this.get<FeatureName>(`/api/feature-name/${id}`);
  // }
  /**
   * Create a new item
   *
   * @param payload - Item data
   * @returns Created item result
   */
  // async createItem(payload: CreateFeatureNameRequest): Promise<ApiResult<FeatureName>> {
  //   return this.post<CreateFeatureNameRequest, FeatureName>('/api/feature-name', payload);
  // }
  /**
   * Update an existing item
   *
   * @param id - Item ID
   * @param payload - Updated data
   * @returns Updated item result
   */
  // async updateItem(id: string, payload: UpdateFeatureNameRequest): Promise<ApiResult<FeatureName>> {
  //   return this.put<UpdateFeatureNameRequest, FeatureName>(`/api/feature-name/${id}`, payload);
  // }
  /**
   * Delete an item
   *
   * @param id - Item ID
   * @returns Delete operation result
   */
  // async deleteItem(id: string): Promise<ApiResult<void>> {
  //   return this.delete<void>(`/api/feature-name/${id}`);
  // }
}

// ==================== SINGLETON EXPORT ====================

/**
 * Export a singleton instance of the service
 * This ensures only one instance exists throughout the application
 */
export const featureNameService = new FeatureNameService();

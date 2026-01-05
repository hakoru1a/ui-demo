/**
 * Inventory Issue Service
 *
 * API service for managing inventory issues
 */

import BaseService from 'services/http/base-service';
import type { ApiResult, PaginationResult, QueryRequest } from 'services/http/types';

import type { InventoryIssue, InventoryIssueFormData } from '../types';

// ==================== TYPES ====================

export interface CreateInventoryIssueRequest extends InventoryIssueFormData {}

export interface UpdateInventoryIssueRequest extends Partial<InventoryIssueFormData> {}

// ==================== SERVICE CLASS ====================

/**
 * Inventory Issue Service Class
 * Extends BaseService to inherit all HTTP methods
 */
class InventoryIssueService extends BaseService {
  /**
   * Get paginated list of inventory issues
   *
   * @param params - Query parameters (page, size, search, sort)
   * @returns Paginated result
   */
  async getInventoryIssues(params?: QueryRequest): Promise<ApiResult<PaginationResult<InventoryIssue>>> {
    return this.get<PaginationResult<InventoryIssue>>('/api/inventory-issues', params);
  }

  /**
   * Get all inventory issues (without pagination)
   *
   * @param params - Query parameters (search, sort)
   * @returns List of inventory issues
   */
  async getAllInventoryIssues(params?: Omit<QueryRequest, 'page' | 'size'>): Promise<ApiResult<InventoryIssue[]>> {
    return this.get<InventoryIssue[]>('/api/inventory-issues/all', params);
  }

  /**
   * Get a single inventory issue by ID
   *
   * @param id - Inventory issue ID
   * @returns Single inventory issue result
   */
  async getInventoryIssueById(id: string): Promise<ApiResult<InventoryIssue>> {
    return this.get<InventoryIssue>(`/api/inventory-issues/${id}`);
  }

  /**
   * Create a new inventory issue
   *
   * @param payload - Inventory issue data
   * @returns Created inventory issue result
   */
  async createInventoryIssue(payload: CreateInventoryIssueRequest): Promise<ApiResult<InventoryIssue>> {
    return this.post<CreateInventoryIssueRequest, InventoryIssue>('/api/inventory-issues', payload);
  }

  /**
   * Update an existing inventory issue
   *
   * @param id - Inventory issue ID
   * @param payload - Updated data
   * @returns Updated inventory issue result
   */
  async updateInventoryIssue(id: string, payload: UpdateInventoryIssueRequest): Promise<ApiResult<InventoryIssue>> {
    return this.put<UpdateInventoryIssueRequest, InventoryIssue>(`/api/inventory-issues/${id}`, payload);
  }

  /**
   * Delete an inventory issue
   *
   * @param id - Inventory issue ID
   * @returns Delete operation result
   */
  async deleteInventoryIssue(id: string): Promise<ApiResult<void>> {
    return this.delete<void>(`/api/inventory-issues/${id}`);
  }

  /**
   * Bulk delete inventory issues
   *
   * @param ids - Array of inventory issue IDs
   * @returns Delete operation result
   */
  async bulkDeleteInventoryIssues(ids: string[]): Promise<ApiResult<void>> {
    return this.delete<void>('/api/inventory-issues/bulk', undefined, { ids });
  }

  /**
   * Confirm issue (change status from draft to issued)
   *
   * @param id - Inventory issue ID
   * @returns Updated inventory issue result
   */
  async confirmIssue(id: string): Promise<ApiResult<InventoryIssue>> {
    return this.post<Record<string, never>, InventoryIssue>(`/api/inventory-issues/${id}/confirm`, {});
  }
}

// ==================== SINGLETON EXPORT ====================

/**
 * Export a singleton instance of the service
 * This ensures only one instance exists throughout the application
 */
export const inventoryIssueService = new InventoryIssueService();

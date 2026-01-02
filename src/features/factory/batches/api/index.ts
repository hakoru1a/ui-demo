/**
 * Batch Service
 *
 * API service for managing batches
 */

import BaseService from 'services/http/base-service';
import type { ApiResult, PaginationResult, QueryRequest } from 'services/http/types';

import type { Batch, BatchFormData } from '../types';

// ==================== TYPES ====================

export interface CreateBatchRequest extends BatchFormData {}

export interface UpdateBatchRequest extends Partial<BatchFormData> {}

// ==================== SERVICE CLASS ====================

/**
 * Batch Service Class
 * Extends BaseService to inherit all HTTP methods
 */
class BatchService extends BaseService {
  /**
   * Get paginated list of batches
   *
   * @param params - Query parameters (page, size, search, sort)
   * @returns Paginated result
   */
  async getBatches(params?: QueryRequest): Promise<ApiResult<PaginationResult<Batch>>> {
    return this.get<PaginationResult<Batch>>('/api/batches', params);
  }

  /**
   * Get all batches (without pagination)
   *
   * @param params - Query parameters (search, sort)
   * @returns List of batches
   */
  async getAllBatches(params?: Omit<QueryRequest, 'page' | 'size'>): Promise<ApiResult<Batch[]>> {
    return this.get<Batch[]>('/api/batches/all', params);
  }

  /**
   * Get a single batch by ID
   *
   * @param id - Batch ID
   * @returns Single batch result
   */
  async getBatchById(id: string): Promise<ApiResult<Batch>> {
    return this.get<Batch>(`/api/batches/${id}`);
  }

  /**
   * Create a new batch
   *
   * @param payload - Batch data
   * @returns Created batch result
   */
  async createBatch(payload: CreateBatchRequest): Promise<ApiResult<Batch>> {
    return this.post<CreateBatchRequest, Batch>('/api/batches', payload);
  }

  /**
   * Update an existing batch
   *
   * @param id - Batch ID
   * @param payload - Updated data
   * @returns Updated batch result
   */
  async updateBatch(id: string, payload: UpdateBatchRequest): Promise<ApiResult<Batch>> {
    return this.put<UpdateBatchRequest, Batch>(`/api/batches/${id}`, payload);
  }

  /**
   * Delete a batch
   *
   * @param id - Batch ID
   * @returns Delete operation result
   */
  async deleteBatch(id: string): Promise<ApiResult<void>> {
    return this.delete<void>(`/api/batches/${id}`);
  }

  /**
   * Bulk delete batches
   *
   * @param ids - Array of batch IDs
   * @returns Delete operation result
   */
  async bulkDeleteBatches(ids: string[]): Promise<ApiResult<void>> {
    return this.delete<void>('/api/batches/bulk', undefined, { ids });
  }

  /**
   * Close a batch (Đóng lô)
   *
   * @param id - Batch ID
   * @returns Updated batch result
   */
  async closeBatch(id: string): Promise<ApiResult<Batch>> {
    return this.post<Record<string, never>, Batch>(`/api/batches/${id}/close`, {});
  }
}

// ==================== SINGLETON EXPORT ====================

/**
 * Export a singleton instance of the service
 * This ensures only one instance exists throughout the application
 */
export const batchService = new BatchService();

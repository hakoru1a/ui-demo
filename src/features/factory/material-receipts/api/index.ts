/**
 * Material Receipt Service
 *
 * API service for managing material receipts
 */

import BaseService from 'services/http/base-service';
import type { ApiResult, PaginationResult, QueryRequest } from 'services/http/types';

import type { MaterialReceipt, MaterialReceiptFormData } from '../types';

// ==================== TYPES ====================

export interface CreateMaterialReceiptRequest extends MaterialReceiptFormData {}

export interface UpdateMaterialReceiptRequest extends Partial<MaterialReceiptFormData> {}

// ==================== SERVICE CLASS ====================

/**
 * Material Receipt Service Class
 * Extends BaseService to inherit all HTTP methods
 */
class MaterialReceiptService extends BaseService {
  /**
   * Get paginated list of material receipts
   *
   * @param params - Query parameters (page, size, search, sort)
   * @returns Paginated result
   */
  async getMaterialReceipts(params?: QueryRequest): Promise<ApiResult<PaginationResult<MaterialReceipt>>> {
    return this.get<PaginationResult<MaterialReceipt>>('/api/material-receipts', params);
  }

  /**
   * Get all material receipts (without pagination)
   *
   * @param params - Query parameters (search, sort)
   * @returns List of material receipts
   */
  async getAllMaterialReceipts(params?: Omit<QueryRequest, 'page' | 'size'>): Promise<ApiResult<MaterialReceipt[]>> {
    return this.get<MaterialReceipt[]>('/api/material-receipts/all', params);
  }

  /**
   * Get a single material receipt by ID
   *
   * @param id - Material receipt ID
   * @returns Single material receipt result
   */
  async getMaterialReceiptById(id: string): Promise<ApiResult<MaterialReceipt>> {
    return this.get<MaterialReceipt>(`/api/material-receipts/${id}`);
  }

  /**
   * Create a new material receipt
   *
   * @param payload - Material receipt data
   * @returns Created material receipt result
   */
  async createMaterialReceipt(payload: CreateMaterialReceiptRequest): Promise<ApiResult<MaterialReceipt>> {
    return this.post<CreateMaterialReceiptRequest, MaterialReceipt>('/api/material-receipts', payload);
  }

  /**
   * Update an existing material receipt
   *
   * @param id - Material receipt ID
   * @param payload - Updated data
   * @returns Updated material receipt result
   */
  async updateMaterialReceipt(id: string, payload: UpdateMaterialReceiptRequest): Promise<ApiResult<MaterialReceipt>> {
    return this.put<UpdateMaterialReceiptRequest, MaterialReceipt>(`/api/material-receipts/${id}`, payload);
  }

  /**
   * Delete a material receipt
   *
   * @param id - Material receipt ID
   * @returns Delete operation result
   */
  async deleteMaterialReceipt(id: string): Promise<ApiResult<void>> {
    return this.delete<void>(`/api/material-receipts/${id}`);
  }

  /**
   * Bulk delete material receipts
   *
   * @param ids - Array of material receipt IDs
   * @returns Delete operation result
   */
  async bulkDeleteMaterialReceipts(ids: string[]): Promise<ApiResult<void>> {
    return this.delete<void>('/api/material-receipts/bulk', undefined, { ids });
  }

  /**
   * Confirm receipt (change status from draft to received)
   *
   * @param id - Material receipt ID
   * @returns Updated material receipt result
   */
  async confirmReceipt(id: string): Promise<ApiResult<MaterialReceipt>> {
    return this.patch<{ status: 'received' }, MaterialReceipt>(`/api/material-receipts/${id}/confirm`, { status: 'received' });
  }
}

// ==================== SINGLETON EXPORT ====================

/**
 * Export a singleton instance of the service
 * This ensures only one instance exists throughout the application
 */
export const materialReceiptService = new MaterialReceiptService();

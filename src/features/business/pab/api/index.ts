/**
 * PAB Service
 *
 * API service for managing PAB (Phương án kinh doanh)
 */

import BaseService from 'services/http/base-service';
import type { ApiResult, PaginationResult, QueryRequest } from 'services/http/types';

import type { Pab, PabFormData, PabApprovalFormData, PabTransactionFormData } from '../types';

// ==================== TYPES ====================

export interface CreatePabRequest extends PabFormData {}

export interface UpdatePabRequest extends Partial<PabFormData> {}

export interface SubmitPabForApprovalRequest {
  pabId: string;
}

export interface ApprovePabRequest extends PabApprovalFormData {
  pabId: string;
}

export interface UpdateTransactionStatusRequest extends PabTransactionFormData {
  pabId: string;
}

// ==================== SERVICE CLASS ====================

/**
 * PAB Service Class
 * Extends BaseService to inherit all HTTP methods
 */
class PabService extends BaseService {
  /**
   * Get paginated list of PABs
   *
   * @param params - Query parameters (page, size, search, sort)
   * @returns Paginated result
   */
  async getPabs(params?: QueryRequest): Promise<ApiResult<PaginationResult<Pab>>> {
    return this.get<PaginationResult<Pab>>('/api/pabs', params);
  }

  /**
   * Get all PABs (without pagination)
   *
   * @param params - Query parameters (search, sort)
   * @returns List of PABs
   */
  async getAllPabs(params?: Omit<QueryRequest, 'page' | 'size'>): Promise<ApiResult<Pab[]>> {
    return this.get<Pab[]>('/api/pabs/all', params);
  }

  /**
   * Get a single PAB by ID
   *
   * @param id - PAB ID
   * @returns Single PAB result
   */
  async getPabById(id: string): Promise<ApiResult<Pab>> {
    return this.get<Pab>(`/api/pabs/${id}`);
  }

  /**
   * Create a new PAB
   *
   * @param payload - PAB data
   * @returns Created PAB result
   */
  async createPab(payload: CreatePabRequest): Promise<ApiResult<Pab>> {
    return this.post<CreatePabRequest, Pab>('/api/pabs', payload);
  }

  /**
   * Update an existing PAB
   *
   * @param id - PAB ID
   * @param payload - Updated data
   * @returns Updated PAB result
   */
  async updatePab(id: string, payload: UpdatePabRequest): Promise<ApiResult<Pab>> {
    return this.put<UpdatePabRequest, Pab>(`/api/pabs/${id}`, payload);
  }

  /**
   * Delete a PAB
   *
   * @param id - PAB ID
   * @returns Delete operation result
   */
  async deletePab(id: string): Promise<ApiResult<void>> {
    return this.delete<void>(`/api/pabs/${id}`);
  }

  /**
   * Bulk delete PABs
   *
   * @param ids - Array of PAB IDs
   * @returns Delete operation result
   */
  async bulkDeletePabs(ids: string[]): Promise<ApiResult<void>> {
    return this.delete<void>('/api/pabs/bulk', { ids });
  }

  /**
   * Submit PAB for approval
   *
   * @param payload - Submit request
   * @returns Updated PAB result
   */
  async submitForApproval(payload: SubmitPabForApprovalRequest): Promise<ApiResult<Pab>> {
    return this.post<SubmitPabForApprovalRequest, Pab>('/api/pabs/submit-for-approval', payload);
  }

  /**
   * Approve or reject PAB
   *
   * @param payload - Approval data
   * @returns Updated PAB result
   */
  async approvePab(payload: ApprovePabRequest): Promise<ApiResult<Pab>> {
    return this.post<ApprovePabRequest, Pab>('/api/pabs/approve', payload);
  }

  /**
   * Update transaction status
   *
   * @param payload - Transaction status data
   * @returns Updated PAB result
   */
  async updateTransactionStatus(payload: UpdateTransactionStatusRequest): Promise<ApiResult<Pab>> {
    return this.post<UpdateTransactionStatusRequest, Pab>('/api/pabs/update-transaction-status', payload);
  }
}

// ==================== SINGLETON EXPORT ====================

/**
 * Export a singleton instance of the service
 * This ensures only one instance exists throughout the application
 */
export const pabService = new PabService();

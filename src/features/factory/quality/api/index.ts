/**
 * Quality Inspection Service
 *
 * API service for managing quality inspections
 */

import BaseService from 'services/http/base-service';
import type { ApiResult, PaginationResult, QueryRequest } from 'services/http/types';

import type { QualityInspection, QualityInspectionFormData } from '../types';

// ==================== TYPES ====================

export interface CreateQualityInspectionRequest extends QualityInspectionFormData {}

export interface UpdateQualityInspectionRequest extends Partial<QualityInspectionFormData> {}

// ==================== SERVICE CLASS ====================

/**
 * Quality Inspection Service Class
 * Extends BaseService to inherit all HTTP methods
 */
class QualityInspectionService extends BaseService {
  /**
   * Get paginated list of quality inspections
   *
   * @param params - Query parameters (page, size, search, sort)
   * @returns Paginated result
   */
  async getQualityInspections(params?: QueryRequest): Promise<ApiResult<PaginationResult<QualityInspection>>> {
    return this.get<PaginationResult<QualityInspection>>('/api/quality-inspections', params);
  }

  /**
   * Get all quality inspections (without pagination)
   *
   * @param params - Query parameters (search, sort)
   * @returns List of quality inspections
   */
  async getAllQualityInspections(params?: Omit<QueryRequest, 'page' | 'size'>): Promise<ApiResult<QualityInspection[]>> {
    return this.get<QualityInspection[]>('/api/quality-inspections/all', params);
  }

  /**
   * Get a single quality inspection by ID
   *
   * @param id - Quality Inspection ID
   * @returns Single quality inspection result
   */
  async getQualityInspectionById(id: string): Promise<ApiResult<QualityInspection>> {
    return this.get<QualityInspection>(`/api/quality-inspections/${id}`);
  }

  /**
   * Create a new quality inspection
   *
   * @param payload - Quality Inspection data
   * @returns Created quality inspection result
   */
  async createQualityInspection(payload: CreateQualityInspectionRequest): Promise<ApiResult<QualityInspection>> {
    return this.post<CreateQualityInspectionRequest, QualityInspection>('/api/quality-inspections', payload);
  }

  /**
   * Update an existing quality inspection
   *
   * @param id - Quality Inspection ID
   * @param payload - Updated data
   * @returns Updated quality inspection result
   */
  async updateQualityInspection(id: string, payload: UpdateQualityInspectionRequest): Promise<ApiResult<QualityInspection>> {
    return this.put<UpdateQualityInspectionRequest, QualityInspection>(`/api/quality-inspections/${id}`, payload);
  }

  /**
   * Delete a quality inspection
   *
   * @param id - Quality Inspection ID
   * @returns Delete operation result
   */
  async deleteQualityInspection(id: string): Promise<ApiResult<void>> {
    return this.delete<void>(`/api/quality-inspections/${id}`);
  }

  /**
   * Bulk delete quality inspections
   *
   * @param ids - Array of quality inspection IDs
   * @returns Delete operation result
   */
  async bulkDeleteQualityInspections(ids: string[]): Promise<ApiResult<void>> {
    return this.delete<void>('/api/quality-inspections/bulk', undefined, { ids });
  }

  /**
   * Confirm QC (Xác nhận QC)
   *
   * @param id - Quality Inspection ID
   * @returns Updated quality inspection result
   */
  async confirmQC(id: string): Promise<ApiResult<QualityInspection>> {
    return this.post<Record<string, never>, QualityInspection>(`/api/quality-inspections/${id}/confirm`, {});
  }
}

// ==================== SINGLETON EXPORT ====================

/**
 * Export a singleton instance of the service
 * This ensures only one instance exists throughout the application
 */
export const qualityInspectionService = new QualityInspectionService();

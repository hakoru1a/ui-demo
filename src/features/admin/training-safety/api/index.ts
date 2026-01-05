// ==============================|| TRAINING & SAFETY API SERVICE ||============================== //

import BaseService from 'services/http/base-service';
import type { ApiResult, PaginationResult, QueryRequest } from 'services/http/types';

import type { Training, TrainingFormData } from '../types';

// ==================== REQUEST TYPES ====================

export interface CreateTrainingRequest extends TrainingFormData {}

export interface UpdateTrainingRequest extends TrainingFormData {}

// ==================== SERVICE CLASS ====================

/**
 * Training Service Class
 * Extends BaseService to inherit all HTTP methods
 */
class TrainingService extends BaseService {
  /**
   * Get paginated list of trainings
   *
   * @param params - Query parameters (page, size, search, sort)
   * @returns Paginated result
   */
  async getTrainings(params?: QueryRequest): Promise<ApiResult<PaginationResult<Training>>> {
    return this.get<PaginationResult<Training>>('/api/training/trainings', params);
  }

  /**
   * Get a single training by ID
   *
   * @param id - Training ID
   * @returns Single training result
   */
  async getTrainingById(id: string): Promise<ApiResult<Training>> {
    return this.get<Training>(`/api/training/trainings/${id}`);
  }

  /**
   * Create a new training
   *
   * @param payload - Training data
   * @returns Created training result
   */
  async createTraining(payload: CreateTrainingRequest): Promise<ApiResult<Training>> {
    return this.post<CreateTrainingRequest, Training>('/api/training/trainings', payload);
  }

  /**
   * Update an existing training
   *
   * @param id - Training ID
   * @param payload - Updated data
   * @returns Updated training result
   */
  async updateTraining(id: string, payload: UpdateTrainingRequest): Promise<ApiResult<Training>> {
    return this.put<UpdateTrainingRequest, Training>(`/api/training/trainings/${id}`, payload);
  }

  /**
   * Delete a training
   *
   * @param id - Training ID
   * @returns Delete operation result
   */
  async deleteTraining(id: string): Promise<ApiResult<void>> {
    return this.delete<void>(`/api/training/trainings/${id}`);
  }

  /**
   * Bulk delete trainings
   *
   * @param ids - Array of training IDs
   * @returns Delete operation result
   */
  async bulkDeleteTrainings(ids: string[]): Promise<ApiResult<void>> {
    return this.delete<void>('/api/training/trainings/bulk', undefined, { ids });
  }

  /**
   * Export trainings to Excel
   *
   * @param params - Query parameters for filtering
   * @returns Excel file blob
   */
  async exportExcel(params?: QueryRequest): Promise<ApiResult<Blob>> {
    return this.getDownload('/api/training/trainings/export/excel', params);
  }

  /**
   * Export trainings to PDF
   *
   * @param params - Query parameters for filtering
   * @returns PDF file blob
   */
  async exportPDF(params?: QueryRequest): Promise<ApiResult<Blob>> {
    return this.getDownload('/api/training/trainings/export/pdf', params);
  }
}

// ==================== EXPORT SINGLETON ====================

const trainingService = new TrainingService();
export default trainingService;

/**
 * Price Table Service
 *
 * API service for managing price tables
 */

import BaseService from 'services/http/base-service';
import type { ApiResult, PaginationResult, QueryRequest } from 'services/http/types';

import type { PriceTable, PriceTableFormData } from '../types';

// ==================== TYPES ====================

export interface CreatePriceTableRequest extends PriceTableFormData {}

export interface UpdatePriceTableRequest extends Partial<PriceTableFormData> {}

// ==================== SERVICE CLASS ====================

/**
 * Price Table Service Class
 * Extends BaseService to inherit all HTTP methods
 */
class PriceTableService extends BaseService {
  /**
   * Get paginated list of price tables
   *
   * @param params - Query parameters (page, size, search, sort)
   * @returns Paginated result
   */
  async getPriceTables(params?: QueryRequest): Promise<ApiResult<PaginationResult<PriceTable>>> {
    return this.get<PaginationResult<PriceTable>>('/api/price-tables', params);
  }

  /**
   * Get all price tables (without pagination)
   *
   * @param params - Query parameters (search, sort)
   * @returns List of price tables
   */
  async getAllPriceTables(params?: Omit<QueryRequest, 'page' | 'size'>): Promise<ApiResult<PriceTable[]>> {
    return this.get<PriceTable[]>('/api/price-tables/all', params);
  }

  /**
   * Get a single price table by ID
   *
   * @param id - Price table ID
   * @returns Single price table result
   */
  async getPriceTableById(id: string): Promise<ApiResult<PriceTable>> {
    return this.get<PriceTable>(`/api/price-tables/${id}`);
  }

  /**
   * Create a new price table
   *
   * @param payload - Price table data
   * @returns Created price table result
   */
  async createPriceTable(payload: CreatePriceTableRequest): Promise<ApiResult<PriceTable>> {
    return this.post<CreatePriceTableRequest, PriceTable>('/api/price-tables', payload);
  }

  /**
   * Update an existing price table
   *
   * @param id - Price table ID
   * @param payload - Updated data
   * @returns Updated price table result
   */
  async updatePriceTable(id: string, payload: UpdatePriceTableRequest): Promise<ApiResult<PriceTable>> {
    return this.put<UpdatePriceTableRequest, PriceTable>(`/api/price-tables/${id}`, payload);
  }

  /**
   * Delete a price table
   *
   * @param id - Price table ID
   * @returns Delete operation result
   */
  async deletePriceTable(id: string): Promise<ApiResult<void>> {
    return this.delete<void>(`/api/price-tables/${id}`);
  }

  /**
   * Bulk delete price tables
   *
   * @param ids - Array of price table IDs
   * @returns Delete operation result
   */
  async bulkDeletePriceTables(ids: string[]): Promise<ApiResult<void>> {
    return this.delete<void>('/api/price-tables/bulk', undefined, { ids });
  }
}

// ==================== SINGLETON EXPORT ====================

/**
 * Export a singleton instance of the service
 * This ensures only one instance exists throughout the application
 */
export const priceTableService = new PriceTableService();

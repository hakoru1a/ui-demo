/**
 * Dispatch Order Service
 *
 * API service for managing dispatch orders
 */

import BaseService from 'services/http/base-service';
import type { ApiResult, PaginationResult, QueryRequest } from 'services/http/types';

import type { DispatchOrder, DispatchOrderFormData } from '../types';

// ==================== TYPES ====================

export interface CreateDispatchOrderRequest extends DispatchOrderFormData {}

export interface UpdateDispatchOrderRequest extends Partial<DispatchOrderFormData> {}

// ==================== SERVICE CLASS ====================

/**
 * Dispatch Order Service Class
 * Extends BaseService to inherit all HTTP methods
 */
class DispatchOrderService extends BaseService {
  /**
   * Get paginated list of dispatch orders
   *
   * @param params - Query parameters (page, size, search, sort)
   * @returns Paginated result
   */
  async getDispatchOrders(params?: QueryRequest): Promise<ApiResult<PaginationResult<DispatchOrder>>> {
    return this.get<PaginationResult<DispatchOrder>>('/api/dispatching', params);
  }

  /**
   * Get all dispatch orders (without pagination)
   *
   * @param params - Query parameters (search, sort)
   * @returns List of dispatch orders
   */
  async getAllDispatchOrders(params?: Omit<QueryRequest, 'page' | 'size'>): Promise<ApiResult<DispatchOrder[]>> {
    return this.get<DispatchOrder[]>('/api/dispatching/all', params);
  }

  /**
   * Get a single dispatch order by ID
   *
   * @param id - Dispatch order ID
   * @returns Single dispatch order result
   */
  async getDispatchOrderById(id: string): Promise<ApiResult<DispatchOrder>> {
    return this.get<DispatchOrder>(`/api/dispatching/${id}`);
  }

  /**
   * Create a new dispatch order
   *
   * @param payload - Dispatch order data
   * @returns Created dispatch order result
   */
  async createDispatchOrder(payload: CreateDispatchOrderRequest): Promise<ApiResult<DispatchOrder>> {
    return this.post<CreateDispatchOrderRequest, DispatchOrder>('/api/dispatching', payload);
  }

  /**
   * Update an existing dispatch order
   *
   * @param id - Dispatch order ID
   * @param payload - Updated data
   * @returns Updated dispatch order result
   */
  async updateDispatchOrder(id: string, payload: UpdateDispatchOrderRequest): Promise<ApiResult<DispatchOrder>> {
    return this.put<UpdateDispatchOrderRequest, DispatchOrder>(`/api/dispatching/${id}`, payload);
  }

  /**
   * Delete a dispatch order
   *
   * @param id - Dispatch order ID
   * @returns Delete operation result
   */
  async deleteDispatchOrder(id: string): Promise<ApiResult<void>> {
    return this.delete<void>(`/api/dispatching/${id}`);
  }

  /**
   * Bulk delete dispatch orders
   *
   * @param ids - Array of dispatch order IDs
   * @returns Delete operation result
   */
  async bulkDeleteDispatchOrders(ids: string[]): Promise<ApiResult<void>> {
    return this.delete<void>('/api/dispatching/bulk', undefined, { ids });
  }
}

// ==================== SINGLETON EXPORT ====================

/**
 * Export a singleton instance of the service
 * This ensures only one instance exists throughout the application
 */
export const dispatchOrderService = new DispatchOrderService();

/**
 * Weigh Ticket Service
 *
 * API service for managing weigh tickets
 */

import BaseService from 'services/http/base-service';
import type { ApiResult, PaginationResult, QueryRequest } from 'services/http/types';

import type { WeighTicket, WeighTicketFormData } from '../types';

// ==================== TYPES ====================

export interface CreateWeighTicketRequest extends WeighTicketFormData {}

export interface UpdateWeighTicketRequest extends Partial<WeighTicketFormData> {}

// ==================== SERVICE CLASS ====================

/**
 * Weigh Ticket Service Class
 * Extends BaseService to inherit all HTTP methods
 */
class WeighTicketService extends BaseService {
  /**
   * Get paginated list of weigh tickets
   *
   * @param params - Query parameters (page, size, search, sort)
   * @returns Paginated result
   */
  async getWeighTickets(params?: QueryRequest): Promise<ApiResult<PaginationResult<WeighTicket>>> {
    return this.get<PaginationResult<WeighTicket>>('/api/weigh-tickets', params);
  }

  /**
   * Get all weigh tickets (without pagination)
   *
   * @param params - Query parameters (search, sort)
   * @returns List of weigh tickets
   */
  async getAllWeighTickets(params?: Omit<QueryRequest, 'page' | 'size'>): Promise<ApiResult<WeighTicket[]>> {
    return this.get<WeighTicket[]>('/api/weigh-tickets/all', params);
  }

  /**
   * Get a single weigh ticket by ID
   *
   * @param id - Weigh ticket ID
   * @returns Single weigh ticket result
   */
  async getWeighTicketById(id: string): Promise<ApiResult<WeighTicket>> {
    return this.get<WeighTicket>(`/api/weigh-tickets/${id}`);
  }

  /**
   * Create a new weigh ticket
   *
   * @param payload - Weigh ticket data
   * @returns Created weigh ticket result
   */
  async createWeighTicket(payload: CreateWeighTicketRequest): Promise<ApiResult<WeighTicket>> {
    return this.post<CreateWeighTicketRequest, WeighTicket>('/api/weigh-tickets', payload);
  }

  /**
   * Update an existing weigh ticket
   *
   * @param id - Weigh ticket ID
   * @param payload - Updated data
   * @returns Updated weigh ticket result
   */
  async updateWeighTicket(id: string, payload: UpdateWeighTicketRequest): Promise<ApiResult<WeighTicket>> {
    return this.put<UpdateWeighTicketRequest, WeighTicket>(`/api/weigh-tickets/${id}`, payload);
  }

  /**
   * Delete a weigh ticket
   *
   * @param id - Weigh ticket ID
   * @returns Delete operation result
   */
  async deleteWeighTicket(id: string): Promise<ApiResult<void>> {
    return this.delete<void>(`/api/weigh-tickets/${id}`);
  }

  /**
   * Bulk delete weigh tickets
   *
   * @param ids - Array of weigh ticket IDs
   * @returns Delete operation result
   */
  async bulkDeleteWeighTickets(ids: string[]): Promise<ApiResult<void>> {
    return this.delete<void>('/api/weigh-tickets/bulk', undefined, { ids });
  }
}

// ==================== SINGLETON EXPORT ====================

/**
 * Export a singleton instance of the service
 * This ensures only one instance exists throughout the application
 */
export const weighTicketService = new WeighTicketService();

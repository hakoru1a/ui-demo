/**
 * Shipment Service
 *
 * API service for managing shipments
 */

import BaseService from 'services/http/base-service';
import type { ApiResult, PaginationResult, QueryRequest } from 'services/http/types';

import type { Shipment, ShipmentFormData } from '../types';

// ==================== TYPES ====================

export interface CreateShipmentRequest extends ShipmentFormData {}

export interface UpdateShipmentRequest extends Partial<ShipmentFormData> {}

// ==================== SERVICE CLASS ====================

/**
 * Shipment Service Class
 * Extends BaseService to inherit all HTTP methods
 */
class ShipmentService extends BaseService {
  /**
   * Get paginated list of shipments
   *
   * @param params - Query parameters (page, size, search, sort)
   * @returns Paginated result
   */
  async getShipments(params?: QueryRequest): Promise<ApiResult<PaginationResult<Shipment>>> {
    return this.get<PaginationResult<Shipment>>('/api/shipments', params);
  }

  /**
   * Get all shipments (without pagination)
   *
   * @param params - Query parameters (search, sort)
   * @returns List of shipments
   */
  async getAllShipments(params?: Omit<QueryRequest, 'page' | 'size'>): Promise<ApiResult<Shipment[]>> {
    return this.get<Shipment[]>('/api/shipments/all', params);
  }

  /**
   * Get a single shipment by ID
   *
   * @param id - Shipment ID
   * @returns Single shipment result
   */
  async getShipmentById(id: string): Promise<ApiResult<Shipment>> {
    return this.get<Shipment>(`/api/shipments/${id}`);
  }

  /**
   * Create a new shipment
   *
   * @param payload - Shipment data
   * @returns Created shipment result
   */
  async createShipment(payload: CreateShipmentRequest): Promise<ApiResult<Shipment>> {
    return this.post<CreateShipmentRequest, Shipment>('/api/shipments', payload);
  }

  /**
   * Update an existing shipment
   *
   * @param id - Shipment ID
   * @param payload - Updated data
   * @returns Updated shipment result
   */
  async updateShipment(id: string, payload: UpdateShipmentRequest): Promise<ApiResult<Shipment>> {
    return this.put<UpdateShipmentRequest, Shipment>(`/api/shipments/${id}`, payload);
  }

  /**
   * Delete a shipment
   *
   * @param id - Shipment ID
   * @returns Delete operation result
   */
  async deleteShipment(id: string): Promise<ApiResult<void>> {
    return this.delete<void>(`/api/shipments/${id}`);
  }

  /**
   * Bulk delete shipments
   *
   * @param ids - Array of shipment IDs
   * @returns Delete operation result
   */
  async bulkDeleteShipments(ids: string[]): Promise<ApiResult<void>> {
    return this.delete<void>('/api/shipments/bulk', undefined, { ids });
  }

  /**
   * Confirm shipment (change status from draft to issued)
   *
   * @param id - Shipment ID
   * @returns Updated shipment result
   */
  async confirmShipment(id: string): Promise<ApiResult<Shipment>> {
    return this.post<Record<string, never>, Shipment>(`/api/shipments/${id}/confirm`, {});
  }
}

// ==================== SINGLETON EXPORT ====================

/**
 * Export a singleton instance of the service
 * This ensures only one instance exists throughout the application
 */
export const shipmentService = new ShipmentService();

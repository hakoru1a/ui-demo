/**
 * Fleet Service
 *
 * API service for managing vehicles and drivers
 */

import BaseService from 'services/http/base-service';
import type { ApiResult, PaginationResult, QueryRequest } from 'services/http/types';

import type { Vehicle, VehicleFormData } from '../types';

// ==================== TYPES ====================

export interface CreateVehicleRequest extends VehicleFormData {}

export interface UpdateVehicleRequest extends Partial<VehicleFormData> {}

// ==================== SERVICE CLASS ====================

/**
 * Fleet Service Class
 * Extends BaseService to inherit all HTTP methods
 */
class FleetService extends BaseService {
  /**
   * Get paginated list of vehicles
   *
   * @param params - Query parameters (page, size, search, sort)
   * @returns Paginated result
   */
  async getVehicles(params?: QueryRequest): Promise<ApiResult<PaginationResult<Vehicle>>> {
    return this.get<PaginationResult<Vehicle>>('/api/fleet', params);
  }

  /**
   * Get all vehicles (without pagination)
   *
   * @param params - Query parameters (search, sort)
   * @returns List of vehicles
   */
  async getAllVehicles(params?: Omit<QueryRequest, 'page' | 'size'>): Promise<ApiResult<Vehicle[]>> {
    return this.get<Vehicle[]>('/api/fleet/all', params);
  }

  /**
   * Get a single vehicle by ID
   *
   * @param id - Vehicle ID
   * @returns Single vehicle result
   */
  async getVehicleById(id: string): Promise<ApiResult<Vehicle>> {
    return this.get<Vehicle>(`/api/fleet/${id}`);
  }

  /**
   * Create a new vehicle
   *
   * @param payload - Vehicle data
   * @returns Created vehicle result
   */
  async createVehicle(payload: CreateVehicleRequest): Promise<ApiResult<Vehicle>> {
    return this.post<CreateVehicleRequest, Vehicle>('/api/fleet', payload);
  }

  /**
   * Update an existing vehicle
   *
   * @param id - Vehicle ID
   * @param payload - Updated data
   * @returns Updated vehicle result
   */
  async updateVehicle(id: string, payload: UpdateVehicleRequest): Promise<ApiResult<Vehicle>> {
    return this.put<UpdateVehicleRequest, Vehicle>(`/api/fleet/${id}`, payload);
  }

  /**
   * Delete a vehicle
   *
   * @param id - Vehicle ID
   * @returns Delete operation result
   */
  async deleteVehicle(id: string): Promise<ApiResult<void>> {
    return this.delete<void>(`/api/fleet/${id}`);
  }

  /**
   * Bulk delete vehicles
   *
   * @param ids - Array of vehicle IDs
   * @returns Delete operation result
   */
  async bulkDeleteVehicles(ids: string[]): Promise<ApiResult<void>> {
    return this.delete<void>('/api/fleet/bulk', undefined, { ids });
  }
}

// ==================== SINGLETON EXPORT ====================

/**
 * Export a singleton instance of the service
 * This ensures only one instance exists throughout the application
 */
export const fleetService = new FleetService();

// ==============================|| COMPLAINTS API SERVICE ||============================== //

import BaseService from 'services/http/base-service';
import type { ApiResult, PaginationResult, QueryRequest } from 'services/http/types';

import type { Complaint, ComplaintFormData } from '../types';

// ==================== REQUEST TYPES ====================

export interface CreateComplaintRequest extends ComplaintFormData {}

export interface UpdateComplaintRequest extends ComplaintFormData {}

// ==================== SERVICE CLASS ====================

/**
 * Complaint Service Class
 * Extends BaseService to inherit all HTTP methods
 */
class ComplaintService extends BaseService {
  /**
   * Get paginated list of complaints
   */
  async getComplaints(params?: QueryRequest): Promise<ApiResult<PaginationResult<Complaint>>> {
    return this.get<PaginationResult<Complaint>>('/api/complaints', params);
  }

  /**
   * Get a single complaint by ID
   */
  async getComplaintById(id: string): Promise<ApiResult<Complaint>> {
    return this.get<Complaint>(`/api/complaints/${id}`);
  }

  /**
   * Create a new complaint
   */
  async createComplaint(payload: CreateComplaintRequest): Promise<ApiResult<Complaint>> {
    return this.post<CreateComplaintRequest, Complaint>('/api/complaints', payload);
  }

  /**
   * Update an existing complaint
   */
  async updateComplaint(id: string, payload: UpdateComplaintRequest): Promise<ApiResult<Complaint>> {
    return this.put<UpdateComplaintRequest, Complaint>(`/api/complaints/${id}`, payload);
  }

  /**
   * Delete a complaint
   */
  async deleteComplaint(id: string): Promise<ApiResult<void>> {
    return this.delete<void>(`/api/complaints/${id}`);
  }

  /**
   * Bulk delete complaints
   */
  async bulkDeleteComplaints(ids: string[]): Promise<ApiResult<void>> {
    return this.delete<void>('/api/complaints/bulk', undefined, { ids });
  }

  /**
   * Update complaint status
   */
  async updateStatus(id: string, status: string): Promise<ApiResult<Complaint>> {
    return this.post<{ status: string }, Complaint>(`/api/complaints/${id}/status`, { status });
  }

  /**
   * Export complaints to Excel
   */
  async exportExcel(params?: QueryRequest): Promise<ApiResult<Blob>> {
    return this.getDownload('/api/complaints/export/excel', params);
  }

  /**
   * Export complaints to PDF
   */
  async exportPDF(params?: QueryRequest): Promise<ApiResult<Blob>> {
    return this.getDownload('/api/complaints/export/pdf', params);
  }
}

// ==================== EXPORT SINGLETON ====================

const complaintService = new ComplaintService();
export default complaintService;

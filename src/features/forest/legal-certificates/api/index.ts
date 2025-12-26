/**
 * Legal Certificate Service
 *
 * API service for managing legal certificates
 */

import BaseService from 'services/http/base-service';
import type { ApiResult, PaginationResult, QueryRequest } from 'services/http/types';

import { CertificateApprovalHistory, CertificateRenewal, LegalCertificate } from '../types/entity';
import { CertificateRenewalFormData, LegalCertificateFormData } from '../types/form';

// ==================== TYPES ====================

export interface CreateLegalCertificateRequest extends LegalCertificateFormData {
  certificateFile?: File; // File object for upload
}

export interface UpdateLegalCertificateRequest extends Partial<LegalCertificateFormData> {
  certificateFile?: File; // File object for upload
}

export interface CreateRenewalRequest extends CertificateRenewalFormData {
  certificateFile?: File; // File object for upload
}

// ==================== SERVICE CLASS ====================

/**
 * Legal Certificate Service Class
 * Extends BaseService to inherit all HTTP methods
 */
class LegalCertificateService extends BaseService {
  /**
   * Get paginated list of legal certificates
   *
   * @param params - Query parameters (page, size, search, sort)
   * @returns Paginated result
   */
  async getLegalCertificates(params?: QueryRequest): Promise<ApiResult<PaginationResult<LegalCertificate>>> {
    return this.get<PaginationResult<LegalCertificate>>('/api/legal-certificates', params);
  }

  /**
   * Get all legal certificates (without pagination)
   *
   * @param params - Query parameters (search, sort)
   * @returns List of legal certificates
   */
  async getAllLegalCertificates(params?: Omit<QueryRequest, 'page' | 'size'>): Promise<ApiResult<LegalCertificate[]>> {
    return this.get<LegalCertificate[]>('/api/legal-certificates/all', params);
  }

  /**
   * Get a single legal certificate by ID
   *
   * @param id - Certificate ID
   * @returns Single certificate result
   */
  async getLegalCertificateById(id: string): Promise<ApiResult<LegalCertificate>> {
    return this.get<LegalCertificate>(`/api/legal-certificates/${id}`);
  }

  /**
   * Create a new legal certificate
   *
   * @param payload - Certificate data
   * @returns Created certificate result
   */
  async createLegalCertificate(payload: CreateLegalCertificateRequest): Promise<ApiResult<LegalCertificate>> {
    // Handle file upload using FormData
    const formData = new FormData();
    formData.append('certificateType', payload.certificateType);
    formData.append('certificateNumber', payload.certificateNumber);
    formData.append('issuingOrganization', payload.issuingOrganization);
    formData.append('issueDate', payload.issueDate.toString());
    formData.append('expiryDate', payload.expiryDate.toString());
    if (payload.legalNotes) {
      formData.append('legalNotes', payload.legalNotes);
    }
    if (payload.certificateFile instanceof File) {
      formData.append('certificateFile', payload.certificateFile);
    }

    return this.post<FormData, LegalCertificate>('/api/legal-certificates', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  /**
   * Update an existing legal certificate
   *
   * @param id - Certificate ID
   * @param payload - Updated data
   * @returns Updated certificate result
   */
  async updateLegalCertificate(id: string, payload: UpdateLegalCertificateRequest): Promise<ApiResult<LegalCertificate>> {
    // Handle file upload using FormData
    const formData = new FormData();
    if (payload.certificateType) formData.append('certificateType', payload.certificateType);
    if (payload.certificateNumber) formData.append('certificateNumber', payload.certificateNumber);
    if (payload.issuingOrganization) formData.append('issuingOrganization', payload.issuingOrganization);
    if (payload.issueDate) formData.append('issueDate', payload.issueDate.toString());
    if (payload.expiryDate) formData.append('expiryDate', payload.expiryDate.toString());
    if (payload.legalNotes !== undefined) formData.append('legalNotes', payload.legalNotes || '');
    if (payload.certificateFile instanceof File) {
      formData.append('certificateFile', payload.certificateFile);
    }

    return this.put<FormData, LegalCertificate>(`/api/legal-certificates/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  /**
   * Delete a legal certificate
   *
   * @param id - Certificate ID
   * @returns Delete operation result
   */
  async deleteLegalCertificate(id: string): Promise<ApiResult<void>> {
    return this.delete<void>(`/api/legal-certificates/${id}`);
  }

  /**
   * Request certificate renewal
   *
   * @param certificateId - Certificate ID
   * @param payload - Renewal data
   * @returns Renewal request result
   */
  async requestRenewal(certificateId: string, payload: CreateRenewalRequest): Promise<ApiResult<CertificateRenewal>> {
    const formData = new FormData();
    formData.append('newExpiryDate', payload.newExpiryDate.toString());
    if (payload.notes) formData.append('notes', payload.notes);
    if (payload.certificateFile instanceof File) {
      formData.append('certificateFile', payload.certificateFile);
    }

    return this.post<FormData, CertificateRenewal>(`/api/legal-certificates/${certificateId}/renewals`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  /**
   * Get renewal requests for a certificate
   *
   * @param certificateId - Certificate ID
   * @returns List of renewal requests
   */
  async getRenewals(certificateId: string): Promise<ApiResult<CertificateRenewal[]>> {
    return this.get<CertificateRenewal[]>(`/api/legal-certificates/${certificateId}/renewals`);
  }

  /**
   * Get approval history for a certificate
   *
   * @param certificateId - Certificate ID
   * @returns List of approval history
   */
  async getApprovalHistory(certificateId: string): Promise<ApiResult<CertificateApprovalHistory[]>> {
    return this.get<CertificateApprovalHistory[]>(`/api/legal-certificates/${certificateId}/history`);
  }

  /**
   * Approve a renewal request
   *
   * @param certificateId - Certificate ID
   * @param renewalId - Renewal ID
   * @returns Approved renewal result
   */
  async approveRenewal(certificateId: string, renewalId: string): Promise<ApiResult<CertificateRenewal>> {
    return this.post<void, CertificateRenewal>(`/api/legal-certificates/${certificateId}/renewals/${renewalId}/approve`, undefined, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Reject a renewal request
   *
   * @param certificateId - Certificate ID
   * @param renewalId - Renewal ID
   * @param reason - Rejection reason
   * @returns Rejected renewal result
   */
  async rejectRenewal(certificateId: string, renewalId: string, reason?: string): Promise<ApiResult<CertificateRenewal>> {
    return this.post<{ reason?: string }, CertificateRenewal>(`/api/legal-certificates/${certificateId}/renewals/${renewalId}/reject`, {
      reason
    });
  }
}

// ==================== SINGLETON EXPORT ====================

/**
 * Export a singleton instance of the service
 * This ensures only one instance exists throughout the application
 */
export const legalCertificateService = new LegalCertificateService();

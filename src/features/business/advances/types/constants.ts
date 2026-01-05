// ==============================|| ADVANCES CONSTANTS ||============================== //

import type { AdvanceStatus, ApprovalDecision } from './enums';

export const STATUS_OPTIONS: { value: AdvanceStatus; label: string }[] = [
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'rejected', label: 'Từ chối' }
]; // Option cho dropdown Trạng thái

export const APPROVAL_DECISION_OPTIONS: { value: ApprovalDecision; label: string }[] = [
  { value: 'approve', label: 'Duyệt' },
  { value: 'reject', label: 'Từ chối' }
]; // Option cho dropdown Quyết định

// Mock data for requester dropdown (TODO: Replace with API call)
export const REQUESTER_OPTIONS: { value: string; label: string }[] = [
  { value: '1', label: 'Nguyễn Văn A' },
  { value: '2', label: 'Trần Thị B' },
  { value: '3', label: 'Lê Văn C' },
  { value: '4', label: 'Phạm Thị D' }
]; // Option cho dropdown Người đề nghị

// Route path segments (for route config)
export const ADVANCE_PATHS = {
  ROOT: '/advances',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit',
  APPROVAL: ':id/approval'
} as const;

// Full URLs (for navigation)
export const ADVANCE_URLS = {
  LIST: ADVANCE_PATHS.ROOT,
  NEW: `${ADVANCE_PATHS.ROOT}/${ADVANCE_PATHS.NEW}`,
  DETAIL: (id: string) => `${ADVANCE_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${ADVANCE_PATHS.ROOT}/${id}/edit`,
  APPROVAL: (id: string) => `${ADVANCE_PATHS.ROOT}/${id}/approval`
} as const;

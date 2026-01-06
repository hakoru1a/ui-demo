// ==============================|| PAB TYPES ||============================== //

// Import and re-export entity types
import type { Pab } from './types/entity';
import type { PabStatus, PabUnit, ApprovalLayer, TransactionStatus, ApprovalDecision } from './types/enums';

export type { Pab, PabStatus, PabUnit, ApprovalLayer, TransactionStatus, ApprovalDecision };

/**
 * PAB Form Data
 */
export interface PabFormData {
  code: string;
  customerId: string;
  productId: string;
  quantity: number;
  unit: PabUnit;
  expectedDeliveryDate: Date | string;
  estimatedCost: number;
  estimatedTime: number;
  margin?: number;
  notes?: string;
  status: PabStatus;
}

/**
 * PAB Approval Form Data
 */
export interface PabApprovalFormData {
  pabCode: string;
  approvalLayer: ApprovalLayer;
  approverId: string;
  decision: ApprovalDecision;
  comment?: string;
  approvalDate: Date;
}

/**
 * PAB Transaction Form Data
 */
export interface PabTransactionFormData {
  pabId: string;
  pabCode?: string;
  transactionType: 'execute' | 'cancel';
  executionDate?: Date | string;
  actualCost?: number;
  actualTime?: number;
  contractRef?: string;
  transactionStatus?: string;
  relatedOrderIds?: string[];
  notes?: string;
}

// Export additional types needed by the application
export type { PabStatusFilter } from './types/filters';

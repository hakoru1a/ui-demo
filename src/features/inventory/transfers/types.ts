// ==============================|| TRANSFER TYPES ||============================== //

/**
 * Transfer Status
 */
export type TransferStatus = 'draft' | 'transferred' | 'cancelled';

/**
 * Item Type
 */
export type ItemType = 'material' | 'finished';

/**
 * Transfer Item
 */
export interface TransferItem {
  id: string;
  skuId: string;
  skuCode: string;
  skuName: string;
  batchId?: string;
  batchCode?: string;
  quantity: number;
  unit: string;
  weight: number;
}

/**
 * Main Transfer Entity
 */
export interface Transfer {
  id: string;
  code: string;
  transferDate: Date | string;
  sourceWarehouseId: string;
  sourceWarehouseName: string;
  destinationWarehouseId: string;
  destinationWarehouseName: string;
  itemType: ItemType;
  items: TransferItem[];
  transportRef?: string;
  status: TransferStatus;
  notes?: string;
  skuCount: number;
  totalWeight: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Transfer Form Data
 */
export interface TransferFormData {
  code: string;
  transferDate: Date | string;
  sourceWarehouseId: string;
  destinationWarehouseId: string;
  itemType: ItemType;
  items: TransferItem[];
  transportRef?: string;
  status: TransferStatus;
  notes?: string;
}

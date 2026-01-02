// ==============================|| MATERIAL RECEIPTS MOCK DATA ||============================== //

import dateHelper from 'utils/dateHelper';

import type { MaterialReceipt } from '../types';

/**
 * Generate mock material receipts for testing
 */
export function getMockMaterialReceipts(): MaterialReceipt[] {
  const receipts: MaterialReceipt[] = [];

  for (let i = 1; i <= 50; i++) {
    const receiptDate = dateHelper.addDay(dateHelper.getToday(), -Math.floor(Math.random() * 30));
    const statuses: Array<'draft' | 'received' | 'cancelled'> = ['draft', 'received', 'cancelled'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const materialTypes: Array<'keo' | 'tram' | 'bach-dan' | 'thong' | 'other'> = ['keo', 'tram', 'bach-dan', 'thong', 'other'];
    const materialType = materialTypes[Math.floor(Math.random() * materialTypes.length)];

    const quantity = Math.floor(Math.random() * 10000) + 100; // 100-10100 kg
    const unitPrice = Math.floor(Math.random() * 50000) + 5000; // 5000-55000 VNĐ
    const totalValue = quantity * unitPrice;

    receipts.push({
      id: `receipt-${i}`,
      code: `PN-${String(i).padStart(4, '0')}`,
      receiptDate: receiptDate ? receiptDate.toDate() : dateHelper.getToday(),
      supplierId: `supplier-${String(Math.floor(Math.random() * 5) + 1).padStart(3, '0')}`,
      supplierName: `Nhà cung cấp ${String.fromCharCode(64 + (Math.floor(Math.random() * 5) + 1))}`,
      warehouseId: `warehouse-${String(Math.floor(Math.random() * 4) + 1).padStart(3, '0')}`,
      warehouseName: `Kho ${String.fromCharCode(64 + (Math.floor(Math.random() * 4) + 1))}`,
      materialType,
      quantity,
      unitPrice,
      totalValue,
      referenceDoc: Math.random() > 0.5 ? `https://example.com/doc-${i}.pdf` : undefined,
      status,
      notes: i % 3 === 0 ? `Ghi chú cho phiếu nhập ${i}` : undefined,
      createdAt: dateHelper.addDay(dateHelper.getToday(), -Math.floor(Math.random() * 60))?.toDate() || dateHelper.getToday(),
      updatedAt: dateHelper.addDay(dateHelper.getToday(), -Math.floor(Math.random() * 30))?.toDate() || dateHelper.getToday()
    });
  }

  return receipts;
}

// ==============================|| LOGISTICS COSTING MOCK DATA ||============================== //

import dateHelper from 'utils/dateHelper';

import type { LogisticsCost } from '../types';

/**
 * Generate mock logistics costs for testing
 */
export function getMockLogisticsCosts(): LogisticsCost[] {
  const today = dateHelper.getToday();
  const yesterday = dateHelper.subtractDays(today, 1).toDate();
  const lastWeek = dateHelper.subtractDays(today, 7).toDate();
  const lastMonth = dateHelper.subtractDays(today, 30).toDate();

  return [
    {
      id: 'cost-001',
      costCode: 'CP-LOG-001',
      costType: 'logistics',
      serviceCategory: 'transport',
      partnerId: 'partner-001',
      partnerName: 'Công ty Vận tải A',
      relatedShipmentId: 'shipment-001',
      relatedShipmentCode: 'Lô #SH001',
      costDate: today,
      amount: 5000000,
      currency: 'VND',
      allocationMethod: 'by-shipment',
      status: 'draft',
      notes: 'Chi phí vận chuyển lô hàng đầu tiên',
      createdAt: today,
      updatedAt: today
    },
    {
      id: 'cost-002',
      costCode: 'CP-LOG-002',
      costType: 'logistics',
      serviceCategory: 'loading',
      partnerId: 'partner-004',
      partnerName: 'Công ty Bốc xếp D',
      relatedOrderId: 'order-001',
      relatedOrderCode: 'Đơn #ORD001',
      costDate: yesterday,
      amount: 2000000,
      currency: 'VND',
      allocationMethod: 'by-order',
      status: 'recorded',
      notes: 'Chi phí bốc xếp đơn hàng xuất khẩu',
      createdAt: yesterday,
      updatedAt: yesterday
    },
    {
      id: 'cost-003',
      costCode: 'CP-SVC-001',
      costType: 'service',
      serviceCategory: 'customs',
      partnerId: 'partner-003',
      partnerName: 'Công ty Dịch vụ Hải quan C',
      relatedShipmentId: 'shipment-002',
      relatedShipmentCode: 'Lô #SH002',
      costDate: lastWeek,
      amount: 10000,
      currency: 'USD',
      allocationMethod: 'by-shipment',
      status: 'recorded',
      notes: 'Phí dịch vụ hải quan',
      createdAt: lastWeek,
      updatedAt: lastWeek
    },
    {
      id: 'cost-004',
      costCode: 'CP-LOG-003',
      costType: 'logistics',
      serviceCategory: 'transport',
      partnerId: 'partner-002',
      partnerName: 'Công ty Logistics B',
      relatedOrderId: 'order-002',
      relatedOrderCode: 'Đơn #ORD002',
      costDate: lastMonth,
      amount: 8000000,
      currency: 'VND',
      allocationMethod: 'by-order',
      status: 'draft',
      notes: '',
      createdAt: lastMonth,
      updatedAt: lastMonth
    },
    {
      id: 'cost-005',
      costCode: 'CP-SVC-002',
      costType: 'service',
      serviceCategory: 'loading',
      partnerId: 'partner-004',
      partnerName: 'Công ty Bốc xếp D',
      costDate: lastWeek,
      amount: 1500000,
      currency: 'VND',
      status: 'recorded',
      notes: 'Chi phí dịch vụ bốc xếp',
      createdAt: lastWeek,
      updatedAt: lastWeek
    }
  ];
}

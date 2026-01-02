// ==============================|| PRODUCTION PLANS MOCK DATA ||============================== //

import dateHelper from 'utils/dateHelper';

import type { ProductionPlan } from '../types';

export const mockProductionPlans: ProductionPlan[] = [
  {
    id: 'plan-001',
    code: 'KH-2024-001',
    type: 'plan',
    productId: 'product-001',
    productName: 'Sản phẩm A',
    plannedQuantity: 1000,
    startDate: dateHelper.addDay(new Date(), 7)?.toDate() || new Date(),
    endDate: dateHelper.addDay(new Date(), 37)?.toDate() || new Date(),
    estimatedCost: 50000000,
    productionLineId: 'line-001',
    productionLineName: 'Dây chuyền 1',
    status: 'draft',
    notes: 'Kế hoạch sản xuất tháng 1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'plan-002',
    code: 'KH-2024-002',
    type: 'plan',
    productId: 'product-002',
    productName: 'Sản phẩm B',
    plannedQuantity: 2000,
    startDate: dateHelper.addDay(new Date(), 10)?.toDate() || new Date(),
    endDate: dateHelper.addDay(new Date(), 40)?.toDate() || new Date(),
    estimatedCost: 100000000,
    productionLineId: 'line-002',
    productionLineName: 'Dây chuyền 2',
    status: 'in-progress',
    notes: 'Kế hoạch sản xuất tháng 2',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'order-001',
    code: 'LD-2024-001',
    type: 'order',
    productId: 'product-003',
    productName: 'Sản phẩm C',
    plannedQuantity: 500,
    startDate: dateHelper.addDay(new Date(), -10)?.toDate() || new Date(),
    endDate: dateHelper.addDay(new Date(), 5)?.toDate() || new Date(),
    estimatedCost: 25000000,
    productionLineId: 'line-001',
    productionLineName: 'Dây chuyền 1',
    status: 'completed',
    notes: 'Lệnh sản xuất đã hoàn thành',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'order-002',
    code: 'LD-2024-002',
    type: 'order',
    productId: 'product-001',
    productName: 'Sản phẩm A',
    plannedQuantity: 800,
    startDate: new Date(),
    endDate: dateHelper.addDay(new Date(), 15)?.toDate() || new Date(),
    estimatedCost: 40000000,
    productionLineId: 'line-003',
    productionLineName: 'Dây chuyền 3',
    status: 'in-progress',
    notes: 'Lệnh sản xuất đang thực hiện',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'plan-003',
    code: 'KH-2024-003',
    type: 'plan',
    productId: 'product-004',
    productName: 'Sản phẩm D',
    plannedQuantity: 1500,
    startDate: dateHelper.addDay(new Date(), 20)?.toDate() || new Date(),
    endDate: dateHelper.addDay(new Date(), 50)?.toDate() || new Date(),
    estimatedCost: 75000000,
    status: 'draft',
    notes: 'Kế hoạch sản xuất tháng 3',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const getMockProductionPlans = (): ProductionPlan[] => {
  return [...mockProductionPlans];
};

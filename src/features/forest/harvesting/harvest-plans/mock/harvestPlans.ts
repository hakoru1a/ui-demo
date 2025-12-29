// ==============================|| HARVEST PLANS MOCK DATA ||============================== //

import type { HarvestPlan } from '../types';
import { HARVEST_PLAN_STATUS } from '../types/constants';

export const mockHarvestPlans: HarvestPlan[] = [
  {
    id: 'hp-001',
    code: 'HP-001',
    name: 'Vùng trồng Keo Đắk Lắk',
    forestAreaId: 'fa -001',
    area: 150.5,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    expectedYield: 1000,
    fscStandard: true,
    status: HARVEST_PLAN_STATUS.ACTIVE,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'hp-002',
    code: 'HP-002',
    name: 'Vùng trồng Bạch đàn Gia Lai',
    forestAreaId: 'fa-002',
    area: 200.0,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-11-30'),
    expectedYield: 1500,
    fscStandard: true,
    status: HARVEST_PLAN_STATUS.ACTIVE,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-05')
  },
  {
    id: 'hp-003',
    code: 'HP-003',
    name: 'Vùng trồng Thông Kon Tum',
    forestAreaId: 'fa-003',
    area: 120.75,
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-10-31'),
    expectedYield: 1200,
    fscStandard: true,
    status: HARVEST_PLAN_STATUS.ACTIVE,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: 'hp-004',
    code: 'HP-004',
    name: 'Vùng trồng Keo Lâm Đồng',
    forestAreaId: 'fa-004',
    area: 180.25,
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-09-30'),
    expectedYield: 1800,
    fscStandard: true,
    status: HARVEST_PLAN_STATUS.DRAFT,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: 'hp-005',
    code: 'HP-005',
    name: 'Vùng trồng Bạch đàn Đắk Nông',
    forestAreaId: 'fa-005',
    area: 95.5,
    startDate: new Date('2024-05-01'),
    endDate: new Date('2024-08-31'),
    expectedYield: 950,
    fscStandard: true,
    status: HARVEST_PLAN_STATUS.DRAFT,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-05')
  }
];

export function getMockHarvestPlans(): HarvestPlan[] {
  return mockHarvestPlans;
}

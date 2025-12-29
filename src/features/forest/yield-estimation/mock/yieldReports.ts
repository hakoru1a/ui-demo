// ==============================|| YIELD ESTIMATION REPORT MOCK DATA ||============================== //

import { YieldOverTimeData, YieldBySupplierData, SupplyShareData } from '../types/report';

// Mock data for Yield Over Time Chart
export const mockYieldOverTime: YieldOverTimeData[] = [
  { time: '01/2024', totalYield: 2500 },
  { time: '02/2024', totalYield: 3200 },
  { time: '03/2024', totalYield: 2800 },
  { time: '04/2024', totalYield: 3500 },
  { time: '05/2024', totalYield: 4100 },
  { time: '06/2024', totalYield: 3800 },
  { time: '07/2024', totalYield: 4200 },
  { time: '08/2024', totalYield: 4500 },
  { time: '09/2024', totalYield: 4000 },
  { time: '10/2024', totalYield: 4800 },
  { time: '11/2024', totalYield: 5200 },
  { time: '12/2024', totalYield: 5500 }
];

// Mock data for Yield By Supplier Chart
export const mockYieldBySupplier: YieldBySupplierData[] = [
  { supplierName: 'Công ty Lâm sản ABC', totalYield: 18500 },
  { supplierName: 'Nguyễn Văn B', totalYield: 9600 },
  { supplierName: 'HTX Lâm nghiệp XYZ', totalYield: 7200 },
  { supplierName: 'Công ty Gỗ Việt', totalYield: 15000 },
  { supplierName: 'Hợp tác xã Đông Nam', totalYield: 11000 }
];

// Mock data for Supply Share Chart
export const mockSupplyShare: SupplyShareData[] = [
  { supplierName: 'Công ty Lâm sản ABC', percentage: 28.5, value: 18500, color: '#36A2EB' },
  { supplierName: 'Công ty Gỗ Việt', percentage: 23.1, value: 15000, color: '#FF6384' },
  { supplierName: 'Hợp tác xã Đông Nam', percentage: 17.0, value: 11000, color: '#FFCE56' },
  { supplierName: 'Nguyễn Văn B', percentage: 14.8, value: 9600, color: '#4BC0C0' },
  { supplierName: 'HTX Lâm nghiệp XYZ', percentage: 11.1, value: 7200, color: '#9966FF' },
  { supplierName: 'Khác', percentage: 5.5, value: 3600, color: '#FF9F40' }
];

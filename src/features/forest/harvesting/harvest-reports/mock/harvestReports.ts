import { CompletionRateData, YieldByAreaData, YieldOverTimeData } from '../types/index';

export const mockYieldOverTime: YieldOverTimeData[] = [
  { time: '2024-01-01', totalYield: 150, planYield: 200 },
  { time: '2024-01-02', totalYield: 220, planYield: 210 },
  { time: '2024-01-03', totalYield: 180, planYield: 220 },
  { time: '2024-01-04', totalYield: 260, planYield: 230 },
  { time: '2024-01-05', totalYield: 290, planYield: 240 },
  { time: '2024-01-06', totalYield: 240, planYield: 240 },
  { time: '2024-01-07', totalYield: 310, planYield: 250 },
  { time: '2024-01-08', totalYield: 330, planYield: 250 },
  { time: '2024-01-09', totalYield: 280, planYield: 260 },
  { time: '2024-01-10', totalYield: 350, planYield: 260 }
];

export const mockYieldByArea: YieldByAreaData[] = [
  { areaName: 'Khu A (Bạch đàn)', totalYield: 1250 },
  { areaName: 'Khu B (Keo lai)', totalYield: 1850 },
  { areaName: 'Khu C (Thông)', totalYield: 980 },
  { areaName: 'Khu D (Tràm)', totalYield: 1450 },
  { areaName: 'Khu E (Bạch đàn)', totalYield: 760 },
  { areaName: 'Khu F (Keo)', totalYield: 2100 }
];

export const mockCompletionRate: CompletionRateData[] = [
  { status: 'completed', value: 68, label: 'Hoàn thành', color: '#00C49F' },
  { status: 'ongoing', value: 22, label: 'Đang thực hiện', color: '#0088FE' },
  { status: 'pending', value: 10, label: 'Chưa thực hiện', color: '#FFBB28' }
];

// ==============================|| PAB REPORT DATA PROCESSOR ||============================== //

import dateHelper from 'utils/dateHelper';

import { getLabelFromOptions } from './index';
import { PAB_STATUS_OPTIONS } from '../types/constants';
import type { Pab } from '../types/index';
import type { PabReportFilter, PabStatusCountData, PabValueByTimeData, PabApprovalRatioData } from '../types/report';

/**
 * Filter PABs based on report filter
 */
export function filterPabs(pabs: Pab[], filter: PabReportFilter): Pab[] {
  return pabs.filter((pab) => {
    // Date range filter
    if (filter.startDate || filter.endDate) {
      const pabDate = pab.createdAt ? (typeof pab.createdAt === 'string' ? new Date(pab.createdAt) : pab.createdAt) : null;
      if (!pabDate) return false;

      if (filter.startDate && pabDate < filter.startDate) {
        return false;
      }
      if (filter.endDate) {
        const endDate = new Date(filter.endDate);
        endDate.setHours(23, 59, 59, 999); // Include the entire end date
        if (pabDate > endDate) {
          return false;
        }
      }
    }

    return true;
  });
}

/**
 * Process filtered PABs into status count data (Bar chart)
 */
export function processPabStatusCountData(pabs: Pab[]): PabStatusCountData[] {
  const statusMap = new Map<string, { count: number; label: string }>();

  pabs.forEach((pab) => {
    const current = statusMap.get(pab.status) || { count: 0, label: getLabelFromOptions(pab.status, PAB_STATUS_OPTIONS) };
    current.count += 1;
    statusMap.set(pab.status, current);
  });

  const colorMap: Record<string, string> = {
    draft: '#9E9E9E',
    'pending-approval': '#2196F3',
    approved: '#4CAF50',
    rejected: '#F44336',
    cancelled: '#FF9800'
  };

  return Array.from(statusMap.entries()).map(([status, { count, label }]) => ({
    status: status as Pab['status'],
    label,
    count,
    color: colorMap[status] || '#9E9E9E'
  }));
}

/**
 * Process filtered PABs into value by time data (Line chart)
 */
export function processPabValueByTimeData(pabs: Pab[]): PabValueByTimeData[] {
  const monthMap = new Map<string, number>();

  pabs.forEach((pab) => {
    const date = pab.createdAt ? (typeof pab.createdAt === 'string' ? new Date(pab.createdAt) : pab.createdAt) : new Date();
    const monthKey = dateHelper.formatDate(date, 'YYYY-MM');
    const current = monthMap.get(monthKey) || 0;
    monthMap.set(monthKey, current + pab.estimatedCost);
  });

  // Convert to array and sort by month
  return Array.from(monthMap.entries())
    .map(([month, totalValue]) => ({
      month: dateHelper.formatDate(month, 'MM/YYYY'),
      totalValue
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

/**
 * Process filtered PABs into approval ratio data (Pie chart)
 */
export function processPabApprovalRatioData(pabs: Pab[]): PabApprovalRatioData[] {
  const approved = pabs.filter((pab) => pab.status === 'approved').length;
  const rejected = pabs.filter((pab) => pab.status === 'rejected').length;
  const total = approved + rejected;

  if (total === 0) {
    return [
      { result: 'approved' as const, label: 'Duyệt', count: 0, percentage: 0, color: '#4CAF50' },
      { result: 'rejected' as const, label: 'Từ chối', count: 0, percentage: 0, color: '#F44336' }
    ];
  }

  return [
    {
      result: 'approved' as const,
      label: 'Duyệt',
      count: approved,
      percentage: Math.round((approved / total) * 100),
      color: '#4CAF50'
    },
    {
      result: 'rejected' as const,
      label: 'Từ chối',
      count: rejected,
      percentage: Math.round((rejected / total) * 100),
      color: '#F44336'
    }
  ];
}

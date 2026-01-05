// ==============================|| QUALITY REPORT DATA PROCESSOR ||============================== //

import type { QualityInspection } from '../types';
import type { ImpurityByBatchData, MoistureTrendData, QCResultDistributionData, QualityReportFilter } from '../types/report';

/**
 * Filter quality inspections based on report filter
 */
export function filterQualityInspections(inspections: QualityInspection[], filter: QualityReportFilter): QualityInspection[] {
  return inspections.filter((inspection) => {
    // Date range filter
    if (filter.startDate || filter.endDate) {
      const inspectionDate = new Date(inspection.inspectionDate);
      if (filter.startDate && inspectionDate < filter.startDate) {
        return false;
      }
      if (filter.endDate) {
        const endDate = new Date(filter.endDate);
        endDate.setHours(23, 59, 59, 999); // Include the entire end date
        if (inspectionDate > endDate) {
          return false;
        }
      }
    }

    // Product filter
    if (filter.productIds.length > 0 && !filter.productIds.includes(inspection.productId)) {
      return false;
    }

    // Batch filter
    if (filter.batchIds.length > 0 && !filter.batchIds.includes(inspection.batchId)) {
      return false;
    }

    return true;
  });
}

/**
 * Process filtered inspections into moisture trend data
 */
export function processMoistureTrendData(inspections: QualityInspection[]): MoistureTrendData[] {
  // Group by date and calculate average moisture per day
  const dateMap = new Map<string, { total: number; count: number }>();

  inspections.forEach((inspection) => {
    const date =
      typeof inspection.inspectionDate === 'string'
        ? inspection.inspectionDate
        : new Date(inspection.inspectionDate).toISOString().split('T')[0];

    if (!dateMap.has(date)) {
      dateMap.set(date, { total: 0, count: 0 });
    }
    const entry = dateMap.get(date)!;
    entry.total += inspection.moisture;
    entry.count += 1;
  });

  // Convert to array and sort by date
  return Array.from(dateMap.entries())
    .map(([date, { total, count }]) => ({
      date,
      moisture: total / count
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Process filtered inspections into impurity by batch data
 */
export function processImpurityByBatchData(inspections: QualityInspection[]): ImpurityByBatchData[] {
  // Group by batch and calculate average impurity per batch
  const batchMap = new Map<string, { total: number; count: number; batchCode: string }>();

  inspections.forEach((inspection) => {
    if (!batchMap.has(inspection.batchId)) {
      batchMap.set(inspection.batchId, { total: 0, count: 0, batchCode: inspection.batchCode });
    }
    const entry = batchMap.get(inspection.batchId)!;
    entry.total += inspection.impurity;
    entry.count += 1;
  });

  // Convert to array and sort by batch code
  return Array.from(batchMap.values())
    .map(({ total, count, batchCode }) => ({
      batchCode,
      impurity: total / count
    }))
    .sort((a, b) => a.batchCode.localeCompare(b.batchCode));
}

/**
 * Process filtered inspections into QC result distribution data
 */
export function processQCResultDistributionData(inspections: QualityInspection[]): QCResultDistributionData[] {
  const passedCount = inspections.filter((i) => i.result === 'passed').length;
  const failedCount = inspections.filter((i) => i.result === 'failed').length;

  return [
    {
      result: 'passed',
      count: passedCount,
      label: 'Đạt',
      color: '#4CAF50'
    },
    {
      result: 'failed',
      count: failedCount,
      label: 'Không đạt',
      color: '#F44336'
    }
  ];
}

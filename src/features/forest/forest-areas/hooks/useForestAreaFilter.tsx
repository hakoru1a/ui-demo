import type { ColumnFiltersState } from '@tanstack/react-table';
import { useState, useEffect } from 'react';

// ==============================|| FOREST AREA FILTER HOOK ||============================== //

interface UseForestAreaFilterProps {
  columnFilters: ColumnFiltersState;
  onFilterChange: (filters: ColumnFiltersState) => void;
  onClose: () => void;
  open: boolean;
}

export default function useForestAreaFilter({ columnFilters, onFilterChange, onClose, open }: UseForestAreaFilterProps) {
  // Local state for filter values
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Initialize filters from columnFilters
  useEffect(() => {
    const initialFilters: Record<string, any> = {};
    columnFilters.forEach((filter) => {
      initialFilters[filter.id] = filter.value;
    });
    setFilters(initialFilters);
  }, [columnFilters, open]);

  // Update filter value
  const handleFilterChange = (columnId: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [columnId]: value
    }));
  };

  // Apply filters - simplified logic
  const handleApply = () => {
    const newFilters: ColumnFiltersState = Object.entries(filters)
      .filter(([_, value]) => {
        if (value === '' || value === null || value === undefined) return false;
        if (Array.isArray(value)) return value.length > 0;
        return true;
      })
      .map(([id, value]) => ({ id, value }));

    onFilterChange(newFilters);
    onClose();
  };

  // Reset filters
  const handleReset = () => {
    setFilters({});
    onFilterChange([]);
    onClose();
  };

  // Handle certificate checkbox change
  const handleCertificateChange = (cert: 'FSC' | 'PEFC', checked: boolean) => {
    const currentCerts = (filters.certificates as ('FSC' | 'PEFC')[]) || [];
    if (checked) {
      handleFilterChange('certificates', [...currentCerts, cert]);
    } else {
      handleFilterChange(
        'certificates',
        currentCerts.filter((c) => c !== cert)
      );
    }
  };

  const activeFilterCount = columnFilters.length;

  return {
    filters,
    handleFilterChange,
    handleApply,
    handleReset,
    handleCertificateChange,
    activeFilterCount
  };
}

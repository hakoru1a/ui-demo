import { useState, useCallback } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';

import HarvestPlanTable from '../components/HarvestPlanTable';
import HarvestPlanTableHeader from '../components/HarvestPlanTableHeader';
import { useHarvestPlanDelete } from '../hooks/useHarvestPlanDelete';
import { useHarvestPlansTable } from '../hooks/useHarvestPlansTable';
import { getMockHarvestPlans } from '../mock/harvestPlans';
import type { HarvestPlan } from '../types';
import { HarvestPlanStatusFilter } from '../types/constants';

// ==============================|| HARVEST PLANS LIST PAGE ||============================== //

const HarvestPlansListPage = () => {
  const [harvestPlans, setHarvestPlans] = useState<HarvestPlan[]>(getMockHarvestPlans());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<HarvestPlanStatusFilter>(HarvestPlanStatusFilter.ALL);
  const [searchValue, setSearchValue] = useState('');

  // Single delete handler
  const handleDeleteSuccess = useCallback((deletedPlan: HarvestPlan) => {
    setHarvestPlans((prev) => prev.filter((plan) => plan.id !== deletedPlan.id));
  }, []);

  const { confirmDialog, selectedHarvestPlan, isDeleting, handleDelete, handleConfirmDelete, handleCancelDelete } =
    useHarvestPlanDelete(handleDeleteSuccess);

  // Bulk delete state
  const [bulkConfirmDialog, setBulkConfirmDialog] = useState<{ open: boolean; selectedPlans: HarvestPlan[] | null }>({
    open: false,
    selectedPlans: null
  });
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Handle bulk delete
  const handleBulkDelete = useCallback((selectedPlans: HarvestPlan[]) => {
    setBulkConfirmDialog({ open: true, selectedPlans });
  }, []);

  const handleConfirmBulkDelete = useCallback(async () => {
    if (!bulkConfirmDialog.selectedPlans || bulkConfirmDialog.selectedPlans.length === 0) {
      setBulkConfirmDialog({ open: false, selectedPlans: null });
      return;
    }

    setIsBulkDeleting(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Remove deleted plans from state
      const idsToDelete = bulkConfirmDialog.selectedPlans.map((p) => p.id);
      setHarvestPlans((prev) => prev.filter((plan) => !idsToDelete.includes(plan.id)));

      alert(`Đã xóa ${bulkConfirmDialog.selectedPlans.length} vùng trồng thành công! (Mock)`);
      setBulkConfirmDialog({ open: false, selectedPlans: null });
    } catch (error) {
      console.error('Error deleting harvest plans:', error);
      alert('Có lỗi xảy ra khi xóa vùng trồng');
    } finally {
      setIsBulkDeleting(false);
    }
  }, [bulkConfirmDialog.selectedPlans]);

  const handleCancelBulkDelete = useCallback(() => {
    setBulkConfirmDialog({ open: false, selectedPlans: null });
  }, []);

  // Handle view map - navigate to forest-areas map page
  const handleViewMap = useCallback(() => {
    // Navigate to forest-areas map page to view all areas
    // The handler is optional, default behavior is handled in HarvestPlanTableHeader
  }, []);

  // Table setup - all table logic consolidated
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData } = useHarvestPlansTable({
    data: harvestPlans,
    statusFilter,
    searchValue,
    onDelete: handleDelete,
    initialPageSize: 25
  });

  return (
    <MainCard>
      <HarvestPlanTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="harvest-plans-export"
        columnFilters={columnFilters}
        onFilterChange={setColumnFilters}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        enableRowSelection
        enableCSVExport
        enableColumnVisibility
        onBulkDelete={handleBulkDelete}
        onViewMap={handleViewMap}
      />
      <HarvestPlanTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Single Delete Dialog */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa vùng trồng"
        message="Bạn có chắc chắn muốn xóa vùng trồng này?"
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        loading={isDeleting}
        data={
          selectedHarvestPlan
            ? [
                { label: 'Mã kế hoạch', value: selectedHarvestPlan.code },
                { label: 'Tên kế hoạch', value: selectedHarvestPlan.name },
                { label: 'Khu vực rừng', value: selectedHarvestPlan.forestArea?.name || '-' },
                { label: 'Diện tích (ha)', value: selectedHarvestPlan.area.toLocaleString('vi-VN') }
              ]
            : []
        }
      />

      {/* Confirm Bulk Delete Dialog */}
      <ConfirmDialog
        open={bulkConfirmDialog.open}
        onClose={handleCancelBulkDelete}
        onConfirm={handleConfirmBulkDelete}
        title="Xác nhận xóa nhiều vùng trồng"
        message={`Bạn có chắc chắn muốn xóa ${bulkConfirmDialog.selectedPlans?.length || 0} vùng trồng đã chọn?`}
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        loading={isBulkDeleting}
        data={
          bulkConfirmDialog.selectedPlans && bulkConfirmDialog.selectedPlans.length > 0
            ? [
                {
                  label: 'Số lượng vùng trồng',
                  value: bulkConfirmDialog.selectedPlans.length.toString()
                },
                {
                  label: 'Danh sách mã',
                  value: bulkConfirmDialog.selectedPlans.map((p) => p.code).join(', ')
                }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default HarvestPlansListPage;

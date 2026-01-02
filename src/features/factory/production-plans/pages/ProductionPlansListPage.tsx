// ==============================|| PRODUCTION PLANS LIST PAGE ||============================== //

import { useState, useCallback } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';

import ProductionPlanTable from '../components/ProductionPlanTable';
import ProductionPlanTableHeader, { type PlanStatusFilter } from '../components/ProductionPlanTableHeader';
import { useProductionPlanDelete } from '../hooks/useProductionPlanDelete';
import { useProductionPlansTable } from '../hooks/useProductionPlansTable';
import { getMockProductionPlans } from '../mock/productionPlans';
import type { ProductionPlan } from '../types';

// ==============================|| PRODUCTION PLANS LIST PAGE ||============================== //

const ProductionPlansListPage = () => {
  const [productionPlans, setProductionPlans] = useState<ProductionPlan[]>(getMockProductionPlans());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<PlanStatusFilter>('all');
  const [searchValue, setSearchValue] = useState('');

  // Handle delete success - update local state after successful delete
  const handleDeleteSuccess = useCallback((deletedIds: string[]) => {
    setProductionPlans((prev) => prev.filter((plan) => !deletedIds.includes(plan.id)));
  }, []);

  const {
    confirmDialog,
    selectedItems,
    isDeleting,
    isBulkDelete,
    handleDelete,
    handleBulkDelete,
    handleConfirmDelete,
    handleCancelDelete
  } = useProductionPlanDelete(handleDeleteSuccess);

  // Table setup - all table logic consolidated
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData } = useProductionPlansTable({
    data: productionPlans,
    statusFilter,
    searchValue,
    onDelete: handleDelete,
    initialPageSize: 25
  });

  return (
    <MainCard>
      <ProductionPlanTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="production-plans-export"
        columnFilters={columnFilters}
        onFilterChange={setColumnFilters}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onBulkDelete={handleBulkDelete}
        enableRowSelection
        enableCSVExport
        enableColumnVisibility
      />
      <ProductionPlanTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? 'Xác nhận xóa nhiều kế hoạch/lệnh' : `Xác nhận xóa kế hoạch/lệnh "${selectedItems[0]?.code}"`}
        message={
          isBulkDelete
            ? `Bạn có chắc chắn muốn xóa ${selectedItems.length} kế hoạch/lệnh sản xuất đã chọn?`
            : 'Bạn có chắc chắn muốn xóa kế hoạch/lệnh sản xuất này?'
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        loading={isDeleting}
        data={
          selectedItems.length > 0
            ? isBulkDelete
              ? selectedItems.map((item) => ({ label: 'Mã', value: item.code }))
              : [
                  { label: 'Mã', value: selectedItems[0].code },
                  { label: 'Loại', value: selectedItems[0].type === 'plan' ? 'Kế hoạch' : 'Lệnh' },
                  { label: 'Sản phẩm', value: selectedItems[0].productName },
                  { label: 'Sản lượng dự kiến', value: selectedItems[0].plannedQuantity.toLocaleString('vi-VN') }
                ]
            : []
        }
      />
    </MainCard>
  );
};

export default ProductionPlansListPage;

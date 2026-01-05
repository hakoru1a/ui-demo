import { useCallback, useMemo, useState } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';
import { StatusFilter } from 'types/status';

import StocktakeTable from '../components/StocktakeTable';
import StocktakeTableHeader from '../components/StocktakeTableHeader';
import { useStocktakesDelete } from '../hooks/useStocktakesDelete';
import { useStocktakesTable } from '../hooks/useStocktakesTable';
import { getMockStocktakes } from '../mock/mock';
import type { Stocktake } from '../types';

// ==============================|| STOCKTAKES LIST PAGE ||============================== //

const StocktakesListPage = () => {
  const [stocktakes, setStocktakes] = useState<Stocktake[]>(getMockStocktakes());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter | string>(StatusFilter.ALL);
  const [searchValue, setSearchValue] = useState('');

  // Handle delete - Setup delete hook với onSuccess callback
  const { confirmDialog, selectedItems, isBulkDelete, handleDelete, handleBulkDelete, handleConfirmDelete, handleCancelDelete } =
    useStocktakesDelete({
      onSuccess: () => {
        // Update local state after delete thành công
        if (isBulkDelete) {
          // Bulk delete: Xóa nhiều phiếu kiểm kê
          const idsToDelete = selectedItems.map((stocktake) => stocktake.id);
          setStocktakes((prev) => prev.filter((stocktake) => !idsToDelete.includes(stocktake.id)));
        } else if (selectedItems.length > 0) {
          // Single delete: Xóa một phiếu kiểm kê
          const stocktakeId = selectedItems[0].id;
          setStocktakes((prev) => prev.filter((stocktake) => stocktake.id !== stocktakeId));
        }
      }
    });

  // Custom status filter function for Stocktakes - memoized
  const statusFilterFn = useCallback(
    (stocktake: Stocktake) => {
      if (statusFilter === StatusFilter.ALL) return true;
      if (statusFilter === 'draft') return stocktake.status === 'draft';
      if (statusFilter === 'completed') return stocktake.status === 'completed';
      return true;
    },
    [statusFilter]
  );

  // Filter Stocktakes by status - memoized
  const filteredStocktakes = useMemo(() => stocktakes.filter(statusFilterFn), [stocktakes, statusFilterFn]);

  // Memoize delete handler to prevent re-renders
  const handleDeleteMemo = useCallback(
    (stocktake: Stocktake) => {
      handleDelete(stocktake);
    },
    [handleDelete]
  );

  // Table setup
  const { table, columnFilters, setColumnFilters, filteredData, csvData } = useStocktakesTable({
    data: filteredStocktakes,
    statusFilter: StatusFilter.ALL, // We handle status filtering manually above
    searchValue,
    onDelete: handleDeleteMemo,
    initialPageSize: 25
  });

  // Handle export Excel
  const handleExportExcel = () => {
    // TODO: Implement Excel export
    console.warn('Export Excel - Not implemented yet');
  };

  // CSV headers for export
  const csvHeaders = useMemo(
    () => [
      { label: 'Mã phiếu', key: 'code' },
      { label: 'Ngày kiểm kê', key: 'inventoryDate' },
      { label: 'Kho', key: 'warehouseName' },
      { label: 'Số SKU', key: 'skuCount' },
      { label: 'Chênh lệch', key: 'totalDifference' },
      { label: 'Trạng thái', key: 'status' }
    ],
    []
  );

  return (
    <MainCard>
      <StocktakeTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeaders}
        csvFilename="stocktakes"
        columnFilters={columnFilters}
        onFilterChange={setColumnFilters}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        enableRowSelection={true}
        enableCSVExport={true}
        enableColumnVisibility={true}
        onBulkDelete={handleBulkDelete}
        onExportExcel={handleExportExcel}
      />
      <StocktakeTable table={table} data={filteredData} loading={isLoading} initialPageSize={25} />

      {/* Confirm Dialog for Delete */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? 'Xác nhận xóa nhiều phiếu kiểm kê' : 'Xác nhận xóa phiếu kiểm kê'}
        message={
          isBulkDelete
            ? `Bạn có chắc chắn muốn xóa ${selectedItems.length} phiếu kiểm kê đã chọn?`
            : selectedItems.length > 0
              ? `Bạn có chắc chắn muốn xóa phiếu kiểm kê ${selectedItems[0].code}?`
              : ''
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        data={
          selectedItems.length > 0 && !isBulkDelete
            ? [
                { label: 'Mã phiếu', value: selectedItems[0].code },
                {
                  label: 'Ngày kiểm kê',
                  value: selectedItems[0].inventoryDate ? new Date(selectedItems[0].inventoryDate).toLocaleDateString('vi-VN') : '-'
                },
                { label: 'Kho', value: selectedItems[0].warehouseName }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default StocktakesListPage;

import { useCallback, useMemo, useState } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';
import { StatusFilter } from 'types/status';

import SkuTable from '../components/SkuTable';
import SkuTableHeader from '../components/SkuTableHeader';
import { useSkuDelete } from '../hooks/useSkuDelete';
import { useSkuTable } from '../hooks/useSkuTable';
import { getMockSkus } from '../mock/skus';
import type { Sku } from '../types';

// ==============================|| SKU LIST PAGE ||============================== //

const SkuListPage = () => {
  const [skus, setSkus] = useState<Sku[]>(getMockSkus());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter | string>(StatusFilter.ALL);
  const [searchValue, setSearchValue] = useState('');

  // Handle delete - Setup delete hook với onSuccess callback
  const { confirmDialog, selectedItems, isBulkDelete, handleDelete, handleBulkDelete, handleConfirmDelete, handleCancelDelete } =
    useSkuDelete({
      onSuccess: () => {
        // Update local state after delete thành công
        if (isBulkDelete) {
          // Bulk delete: Xóa nhiều SKU
          const idsToDelete = selectedItems.map((sku) => sku.id);
          setSkus((prev) => prev.filter((sku) => !idsToDelete.includes(sku.id)));
        } else if (selectedItems.length > 0) {
          // Single delete: Xóa một SKU
          const skuId = selectedItems[0].id;
          setSkus((prev) => prev.filter((sku) => sku.id !== skuId));
        }
      }
    });

  // Custom status filter function for SKUs - memoized
  const statusFilterFn = useCallback(
    (sku: Sku) => {
      if (statusFilter === StatusFilter.ALL) return true;
      if (statusFilter === 'in_stock') return sku.stockStatus === 'in_stock';
      if (statusFilter === 'out_of_stock') return sku.stockStatus === 'out_of_stock';
      return true;
    },
    [statusFilter]
  );

  // Filter SKUs by status - memoized
  const filteredSkus = useMemo(() => skus.filter(statusFilterFn), [skus, statusFilterFn]);

  // Memoize delete handler to prevent re-renders
  const handleDeleteMemo = useCallback(
    (sku: Sku) => {
      handleDelete(sku);
    },
    [handleDelete]
  );

  // Table setup
  const { table, columnFilters, setColumnFilters, filteredData, csvData } = useSkuTable({
    data: filteredSkus,
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
      { label: 'SKU Code', key: 'code' },
      { label: 'Tên hàng hóa', key: 'name' },
      { label: 'Loại hàng', key: 'itemType' },
      { label: 'Kho', key: 'warehouseName' },
      { label: 'Tồn hệ thống', key: 'systemQuantity' },
      { label: 'Đơn vị', key: 'unit' },
      { label: 'Trạng thái', key: 'stockStatus' }
    ],
    []
  );

  return (
    <MainCard>
      <SkuTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeaders}
        csvFilename="skus"
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
      <SkuTable table={table} data={filteredData} loading={isLoading} initialPageSize={25} />

      {/* Confirm Dialog for Delete */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? 'Xác nhận xóa nhiều SKU' : 'Xác nhận xóa SKU'}
        message={
          isBulkDelete
            ? `Bạn có chắc chắn muốn xóa ${selectedItems.length} SKU đã chọn?`
            : selectedItems.length > 0
              ? `Bạn có chắc chắn muốn xóa SKU ${selectedItems[0].code}?`
              : ''
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        data={
          selectedItems.length > 0 && !isBulkDelete
            ? [
                { label: 'Mã SKU', value: selectedItems[0].code },
                { label: 'Tên hàng hóa', value: selectedItems[0].name },
                { label: 'Kho', value: selectedItems[0].warehouseName }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default SkuListPage;

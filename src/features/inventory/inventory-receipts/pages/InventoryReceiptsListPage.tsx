import { useState, useCallback, useMemo } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';
import { StatusFilter } from 'types/status';

import InventoryReceiptTable from '../components/InventoryReceiptTable';
import InventoryReceiptTableHeader from '../components/InventoryReceiptTableHeader';
import { useInventoryReceiptsDelete } from '../hooks/useInventoryReceiptsDelete';
import { useInventoryReceiptsTable } from '../hooks/useInventoryReceiptsTable';
import { getMockInventoryReceipts } from '../mock/mock';
import type { InventoryReceipt } from '../types';

// ==============================|| INVENTORY RECEIPTS LIST PAGE ||============================== //

const InventoryReceiptsListPage = () => {
  const [receipts, setReceipts] = useState<InventoryReceipt[]>(getMockInventoryReceipts());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter | string>(StatusFilter.ALL);
  const [searchValue, setSearchValue] = useState('');

  // Handle delete - Setup delete hook với onSuccess callback
  // Hook này quản lý cả single delete và bulk delete
  const { confirmDialog, selectedItems, isBulkDelete, handleDelete, handleBulkDelete, handleConfirmDelete, handleCancelDelete } =
    useInventoryReceiptsDelete({
      onSuccess: () => {
        // Update local state after delete thành công
        if (isBulkDelete) {
          // Bulk delete: Xóa nhiều phiếu nhập kho
          const idsToDelete = selectedItems.map((receipt) => receipt.id);
          setReceipts((prev) => prev.filter((receipt) => !idsToDelete.includes(receipt.id)));
        } else if (selectedItems.length > 0) {
          // Single delete: Xóa một phiếu nhập kho
          const receiptId = selectedItems[0].id;
          setReceipts((prev) => prev.filter((receipt) => receipt.id !== receiptId));
        }
      }
    });

  // Custom status filter function for receipts - memoized
  const statusFilterFn = useCallback(
    (receipt: InventoryReceipt) => {
      if (statusFilter === StatusFilter.ALL) return true;
      if (statusFilter === 'draft') return receipt.status === 'draft';
      if (statusFilter === 'received') return receipt.status === 'received';
      if (statusFilter === 'cancelled') return receipt.status === 'cancelled';
      return true;
    },
    [statusFilter]
  );

  // Filter receipts by status - memoized
  const filteredReceipts = useMemo(() => receipts.filter(statusFilterFn), [receipts, statusFilterFn]);

  // Memoize delete handler to prevent re-renders
  const handleDeleteMemo = useCallback(
    (receipt: InventoryReceipt) => {
      handleDelete(receipt);
    },
    [handleDelete]
  );

  // Table setup
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData } = useInventoryReceiptsTable({
    data: filteredReceipts,
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

  // Handle export PDF
  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.warn('Export PDF - Not implemented yet');
  };

  return (
    <MainCard>
      <InventoryReceiptTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="inventory-receipts-export"
        columnFilters={columnFilters}
        onFilterChange={setColumnFilters}
        statusFilter={statusFilter as StatusFilter}
        onStatusFilterChange={(status) => setStatusFilter(status)}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        enableRowSelection
        enableCSVExport
        enableColumnVisibility
        onBulkDelete={handleBulkDelete} // Pass bulk delete handler - chỉ hiển thị khi chọn ≥1 & status = draft
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
      />
      <InventoryReceiptTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog - Xử lý cả single và bulk delete */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? 'Xác nhận xóa nhiều phiếu nhập kho' : 'Xác nhận xóa phiếu nhập kho'}
        message={
          isBulkDelete
            ? `Bạn có chắc chắn muốn xóa ${selectedItems.length} phiếu nhập kho đã chọn?`
            : selectedItems.length > 0
              ? `Bạn có chắc chắn muốn xóa phiếu nhập kho ${selectedItems[0].code}?`
              : ''
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        data={
          selectedItems.length > 0 && !isBulkDelete
            ? [
                { label: 'Mã phiếu nhập', value: selectedItems[0].code },
                {
                  label: 'Ngày nhập',
                  value: selectedItems[0].receiptDate ? new Date(selectedItems[0].receiptDate).toLocaleDateString('vi-VN') : '-'
                },
                { label: 'Kho nhập', value: selectedItems[0].warehouseName },
                { label: 'Trạng thái', value: selectedItems[0].status }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default InventoryReceiptsListPage;

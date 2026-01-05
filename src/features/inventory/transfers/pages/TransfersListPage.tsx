// ==============================|| TRANSFERS LIST PAGE ||============================== //

import { useCallback, useMemo, useState } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';
import { StatusFilter } from 'types/status';

import TransferTable from '../components/TransferTable';
import TransferTableHeader from '../components/TransferTableHeader';
import { useTransfersDelete } from '../hooks/useTransfersDelete';
import { useTransfersTable } from '../hooks/useTransfersTable';
import { getMockTransfers } from '../mock/mock';
import type { Transfer } from '../types/index';

// ==============================|| TRANSFERS LIST PAGE ||============================== //

const TransfersListPage = () => {
  const [transfers, setTransfers] = useState<Transfer[]>(getMockTransfers());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter | string>(StatusFilter.ALL);
  const [searchValue, setSearchValue] = useState('');

  // Handle delete - Setup delete hook với onSuccess callback
  // Hook này quản lý cả single delete và bulk delete
  const { confirmDialog, selectedItems, isBulkDelete, handleDelete, handleBulkDelete, handleConfirmDelete, handleCancelDelete } =
    useTransfersDelete({
      onSuccess: () => {
        // Update local state after delete thành công
        if (isBulkDelete) {
          // Bulk delete: Xóa nhiều phiếu chuyển kho
          const idsToDelete = selectedItems.map((transfer) => transfer.id);
          setTransfers((prev) => prev.filter((transfer) => !idsToDelete.includes(transfer.id)));
        } else if (selectedItems.length > 0) {
          // Single delete: Xóa một phiếu chuyển kho
          const transferId = selectedItems[0].id;
          setTransfers((prev) => prev.filter((transfer) => transfer.id !== transferId));
        }
      }
    });

  // Custom status filter function for transfers - memoized
  const statusFilterFn = useCallback(
    (transfer: Transfer) => {
      if (statusFilter === StatusFilter.ALL) return true;
      if (statusFilter === 'draft') return transfer.status === 'draft';
      if (statusFilter === 'transferred') return transfer.status === 'transferred';
      if (statusFilter === 'cancelled') return transfer.status === 'cancelled';
      return true;
    },
    [statusFilter]
  );

  // Filter transfers by status - memoized
  const filteredTransfers = useMemo(() => transfers.filter(statusFilterFn), [transfers, statusFilterFn]);

  // Memoize delete handler to prevent re-renders
  const handleDeleteMemo = useCallback(
    (transfer: Transfer) => {
      handleDelete(transfer);
    },
    [handleDelete]
  );

  // Table setup
  const { table, columnFilters, setColumnFilters, filteredData, csvData } = useTransfersTable({
    data: filteredTransfers,
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

  // CSV headers for export
  const csvHeaders = useMemo(
    () => [
      { label: 'Mã phiếu', key: 'code' },
      { label: 'Ngày chuyển', key: 'transferDate' },
      { label: 'Kho nguồn', key: 'sourceWarehouseName' },
      { label: 'Kho đích', key: 'destinationWarehouseName' },
      { label: 'Số SKU', key: 'skuCount' },
      { label: 'Tổng khối lượng', key: 'totalWeight' },
      { label: 'Trạng thái', key: 'status' }
    ],
    []
  );

  return (
    <MainCard>
      <TransferTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeaders}
        csvFilename="transfers-export"
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
      <TransferTable table={table} data={filteredData} loading={isLoading} initialPageSize={25} />

      {/* Confirm Delete Dialog - Xử lý cả single và bulk delete */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? 'Xác nhận xóa nhiều phiếu chuyển kho' : 'Xác nhận xóa phiếu chuyển kho'}
        message={
          isBulkDelete
            ? `Bạn có chắc chắn muốn xóa ${selectedItems.length} phiếu chuyển kho đã chọn?`
            : selectedItems.length > 0
              ? `Bạn có chắc chắn muốn xóa phiếu chuyển kho ${selectedItems[0].code}?`
              : ''
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        data={
          selectedItems.length > 0 && !isBulkDelete
            ? [
                { label: 'Mã phiếu chuyển', value: selectedItems[0].code },
                {
                  label: 'Ngày chuyển',
                  value: selectedItems[0].transferDate ? new Date(selectedItems[0].transferDate).toLocaleDateString('vi-VN') : '-'
                },
                { label: 'Kho nguồn', value: selectedItems[0].sourceWarehouseName },
                { label: 'Kho đích', value: selectedItems[0].destinationWarehouseName },
                { label: 'Trạng thái', value: selectedItems[0].status }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default TransfersListPage;

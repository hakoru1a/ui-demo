import { useState, useCallback, useMemo } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';
import { StatusFilter } from 'types/status';

import AdvanceTable from '../components/AdvanceTable';
import AdvanceTableHeader from '../components/AdvanceTableHeader';
import { useAdvancesDelete } from '../hooks/useAdvancesDelete';
import { useAdvancesTable } from '../hooks/useAdvancesTable';
import { getMockAdvances } from '../mock/mock';
import type { Advance } from '../types';

// ==============================|| ADVANCES LIST PAGE ||============================== //

const AdvancesListPage = () => {
  const [advances, setAdvances] = useState<Advance[]>(getMockAdvances());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter | string>(StatusFilter.ALL);
  const [searchValue, setSearchValue] = useState('');

  // Handle delete - Setup delete hook với onSuccess callback
  // Hook này quản lý cả single delete và bulk delete
  const { confirmDialog, selectedItems, isBulkDelete, handleDelete, handleBulkDelete, handleConfirmDelete, handleCancelDelete } =
    useAdvancesDelete({
      onSuccess: () => {
        // Update local state after delete thành công
        if (isBulkDelete) {
          // Bulk delete: Xóa nhiều phiếu tạm ứng
          const idsToDelete = selectedItems.map((advance) => advance.id);
          setAdvances((prev) => prev.filter((advance) => !idsToDelete.includes(advance.id)));
        } else if (selectedItems.length > 0) {
          // Single delete: Xóa một phiếu tạm ứng
          const advanceId = selectedItems[0].id;
          setAdvances((prev) => prev.filter((advance) => advance.id !== advanceId));
        }
      }
    });

  // Custom status filter function for advances - memoized
  const statusFilterFn = useCallback(
    (advance: Advance) => {
      if (statusFilter === StatusFilter.ALL) return true;
      if (statusFilter === 'pending') return advance.status === 'pending';
      if (statusFilter === 'approved') return advance.status === 'approved';
      if (statusFilter === 'rejected') return advance.status === 'rejected';
      return true;
    },
    [statusFilter]
  );

  // Filter advances by status - memoized
  const filteredAdvances = useMemo(() => advances.filter(statusFilterFn), [advances, statusFilterFn]);

  // Memoize delete handler to prevent re-renders
  const handleDeleteMemo = useCallback(
    (advance: Advance) => {
      handleDelete(advance);
    },
    [handleDelete]
  );

  // Table setup
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData } = useAdvancesTable({
    data: filteredAdvances,
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

  return (
    <MainCard>
      <AdvanceTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="advances-export"
        columnFilters={columnFilters}
        onFilterChange={setColumnFilters}
        statusFilter={statusFilter as StatusFilter}
        onStatusFilterChange={(status) => setStatusFilter(status)}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        enableRowSelection
        enableCSVExport
        enableColumnVisibility
        onBulkDelete={handleBulkDelete} // Pass bulk delete handler - chỉ hiển thị khi chọn ≥1 & status = pending
        onExportExcel={handleExportExcel}
      />
      <AdvanceTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog - Xử lý cả single và bulk delete */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? 'Xác nhận xóa nhiều phiếu tạm ứng' : 'Xác nhận xóa phiếu tạm ứng'}
        message={
          isBulkDelete
            ? `Bạn có chắc chắn muốn xóa ${selectedItems.length} phiếu tạm ứng đã chọn?`
            : selectedItems.length > 0
              ? `Bạn có chắc chắn muốn xóa phiếu tạm ứng ${selectedItems[0].code}?`
              : ''
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        data={
          selectedItems.length > 0 && !isBulkDelete
            ? [
                { label: 'Mã tạm ứng', value: selectedItems[0].code },
                { label: 'Người đề nghị', value: selectedItems[0].requesterName },
                { label: 'Số tiền', value: `${selectedItems[0].requestedAmount.toLocaleString('vi-VN')} VND` },
                { label: 'Trạng thái', value: selectedItems[0].status }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default AdvancesListPage;

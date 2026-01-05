import { useState, useCallback, useMemo } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';
import { StatusFilter } from 'types/status';

import InventoryIssueTable from '../components/InventoryIssueTable';
import InventoryIssueTableHeader from '../components/InventoryIssueTableHeader';
import { useInventoryIssuesDelete } from '../hooks/useInventoryIssueDelete';
import { useInventoryIssuesTable } from '../hooks/useInventoryIssuesTable';
import { getMockInventoryIssues } from '../mock/inventoryIssues';
import type { InventoryIssue } from '../types';

// ==============================|| INVENTORY ISSUES LIST PAGE ||============================== //

const InventoryIssuesListPage = () => {
  const [issues, setIssues] = useState<InventoryIssue[]>(getMockInventoryIssues());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter | string>(StatusFilter.ALL);
  const [searchValue, setSearchValue] = useState('');

  // Handle delete - Setup delete hook với onSuccess callback
  // Hook này quản lý cả single delete và bulk delete
  const { confirmDialog, selectedItems, isBulkDelete, handleDelete, handleBulkDelete, handleConfirmDelete, handleCancelDelete } =
    useInventoryIssuesDelete({
      onSuccess: () => {
        // Update local state after delete thành công
        if (isBulkDelete) {
          // Bulk delete: Xóa nhiều phiếu xuất kho
          const idsToDelete = selectedItems.map((issue) => issue.id);
          setIssues((prev) => prev.filter((issue) => !idsToDelete.includes(issue.id)));
        } else if (selectedItems.length > 0) {
          // Single delete: Xóa một phiếu xuất kho
          const issueId = selectedItems[0].id;
          setIssues((prev) => prev.filter((issue) => issue.id !== issueId));
        }
      }
    });

  // Custom status filter function for issues - memoized
  const statusFilterFn = useCallback(
    (issue: InventoryIssue) => {
      if (statusFilter === StatusFilter.ALL) return true;
      if (statusFilter === 'draft') return issue.status === 'draft';
      if (statusFilter === 'issued') return issue.status === 'issued';
      if (statusFilter === 'cancelled') return issue.status === 'cancelled';
      return true;
    },
    [statusFilter]
  );

  // Filter issues by status - memoized
  const filteredIssues = useMemo(() => issues.filter(statusFilterFn), [issues, statusFilterFn]);

  // Memoize delete handler to prevent re-renders
  const handleDeleteMemo = useCallback(
    (issue: InventoryIssue) => {
      handleDelete(issue);
    },
    [handleDelete]
  );

  // Table setup
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData } = useInventoryIssuesTable({
    data: filteredIssues,
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
      <InventoryIssueTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="inventory-issues-export"
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
      <InventoryIssueTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog - Xử lý cả single và bulk delete */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? 'Xác nhận xóa nhiều phiếu xuất kho' : 'Xác nhận xóa phiếu xuất kho'}
        message={
          isBulkDelete
            ? `Bạn có chắc chắn muốn xóa ${selectedItems.length} phiếu xuất kho đã chọn?`
            : selectedItems.length > 0
              ? `Bạn có chắc chắn muốn xóa phiếu xuất kho ${selectedItems[0].code}?`
              : ''
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        data={
          selectedItems.length > 0 && !isBulkDelete
            ? [
                { label: 'Mã phiếu xuất', value: selectedItems[0].code },
                {
                  label: 'Ngày xuất',
                  value: selectedItems[0].issueDate ? new Date(selectedItems[0].issueDate).toLocaleDateString('vi-VN') : '-'
                },
                { label: 'Kho xuất', value: selectedItems[0].warehouseName },
                { label: 'Trạng thái', value: selectedItems[0].status }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default InventoryIssuesListPage;

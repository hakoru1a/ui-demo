import { useState, useCallback } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';
import dateHelper from 'utils/dateHelper';

import InventoryIssueTable from '../components/InventoryIssueTable';
import InventoryIssueTableHeader, { IssueStatusFilter } from '../components/InventoryIssueTableHeader';
import { useInventoryIssueDelete } from '../hooks/useInventoryIssueDelete';
import { useInventoryIssuesTable } from '../hooks/useInventoryIssuesTable';
import { getMockInventoryIssues } from '../mock/inventoryIssues';
import type { InventoryIssue } from '../types/index';

// ==============================|| INVENTORY ISSUES LIST PAGE ||============================== //

const InventoryIssuesListPage = () => {
  const [inventoryIssues, setInventoryIssues] = useState<InventoryIssue[]>(getMockInventoryIssues());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<IssueStatusFilter>(IssueStatusFilter.ALL);
  const [searchValue, setSearchValue] = useState('');

  // Convert status filter to string for table hook
  const statusFilterString = statusFilter === IssueStatusFilter.ALL ? undefined : statusFilter;

  // Handle delete success - update local state after successful delete
  const handleDeleteSuccess = useCallback((deletedIds: string[]) => {
    setInventoryIssues((prev) => prev.filter((issue) => !deletedIds.includes(issue.id)));
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
  } = useInventoryIssueDelete(handleDeleteSuccess);

  // Table setup - all table logic consolidated
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData, selectedRows } = useInventoryIssuesTable({
    data: inventoryIssues,
    statusFilter: statusFilterString,
    searchValue,
    onDelete: handleDelete,
    initialPageSize: 25
  });

  return (
    <MainCard>
      <InventoryIssueTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="inventory-issues-export"
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
        selectedRows={selectedRows}
      />
      <InventoryIssueTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? 'Xác nhận xóa nhiều phiếu xuất' : 'Xác nhận xóa phiếu xuất'}
        message={
          isBulkDelete
            ? `Bạn có chắc chắn muốn xóa ${selectedItems.length} phiếu xuất đã chọn?`
            : `Bạn có chắc chắn muốn xóa phiếu xuất "${selectedItems[0]?.code}"?`
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        loading={isDeleting}
        data={
          selectedItems.length > 0
            ? isBulkDelete
              ? [
                  { label: 'Số lượng phiếu', value: selectedItems.length.toString() },
                  { label: 'Danh sách mã phiếu', value: selectedItems.map((item) => item.code).join(', ') }
                ]
              : [
                  { label: 'Mã phiếu xuất', value: selectedItems[0].code },
                  { label: 'Ngày xuất', value: dateHelper.formatDate(selectedItems[0].issueDate, 'DD/MM/YYYY') },
                  { label: 'Kho xuất', value: selectedItems[0].warehouseName },
                  { label: 'Khối lượng (kg)', value: selectedItems[0].quantity.toLocaleString('vi-VN') }
                ]
            : []
        }
      />
    </MainCard>
  );
};

export default InventoryIssuesListPage;

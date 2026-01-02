import { useState, useCallback } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';
import { StatusFilter } from 'types/status';

import ShiftLogTable from '../components/ShiftLogTable';
import ShiftLogTableHeader from '../components/ShiftLogTableHeader';
import { useShiftLogDelete } from '../hooks/useShiftLogDelete';
import { useShiftLogsTable } from '../hooks/useShiftLogsTable';
import { getMockShiftLogs } from '../mock/shiftLogs';
import type { ShiftLog } from '../types';

// ==============================|| SHIFT LOGS LIST PAGE ||============================== //

const ShiftLogsListPage = () => {
  const [shiftLogs, setShiftLogs] = useState<ShiftLog[]>(getMockShiftLogs());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter | 'running' | 'completed'>(StatusFilter.ALL);
  const [searchValue, setSearchValue] = useState('');

  // Handle delete action - update local state after successful delete
  const handleDeleteSuccess = useCallback((deletedLog: ShiftLog) => {
    setShiftLogs((prev) => prev.filter((log) => log.id !== deletedLog.id));
  }, []);

  const {
    confirmDialog,
    selectedShiftLog,
    selectedItems,
    isDeleting,
    isBulkDelete,
    handleDelete,
    handleBulkDelete,
    handleConfirmDelete,
    handleCancelDelete
  } = useShiftLogDelete(handleDeleteSuccess);

  // Table setup - all table logic consolidated
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData } = useShiftLogsTable({
    data: shiftLogs,
    statusFilter,
    searchValue,
    onDelete: handleDelete,
    initialPageSize: 25
  });

  return (
    <MainCard>
      <ShiftLogTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="shift-logs-export"
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
      />
      <ShiftLogTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? 'Xác nhận xóa nhiều nhật ký ca' : `Xác nhận xóa nhật ký ca "${selectedShiftLog?.code || ''}"`}
        message={
          isBulkDelete
            ? `Bạn có chắc chắn muốn xóa ${selectedItems.length} nhật ký ca đã chọn?`
            : 'Bạn có chắc chắn muốn xóa nhật ký ca này?'
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        loading={isDeleting}
        data={
          isBulkDelete
            ? selectedItems.map((item) => ({
                label: 'Mã ca',
                value: item.code
              }))
            : selectedShiftLog
              ? [
                  { label: 'Mã ca', value: selectedShiftLog.code },
                  { label: 'Lô sản xuất', value: selectedShiftLog.batchCode },
                  { label: 'Thời gian ca', value: selectedShiftLog.shiftTime },
                  { label: 'Sản lượng ca', value: selectedShiftLog.outputQuantity.toLocaleString('vi-VN') }
                ]
              : []
        }
      />
    </MainCard>
  );
};

export default ShiftLogsListPage;

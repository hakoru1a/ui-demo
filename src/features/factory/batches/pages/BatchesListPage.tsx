// ==============================|| BATCHES LIST PAGE ||============================== //

import { useState, useCallback } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';

import BatchTable from '../components/BatchTable';
import BatchTableHeader, { type BatchStatusFilter } from '../components/BatchTableHeader';
import { useBatchDelete } from '../hooks/useBatchDelete';
import { useBatchesTable } from '../hooks/useBatchesTable';
import { getMockBatches } from '../mock/batches';
import type { Batch } from '../types';

// ==============================|| BATCHES LIST PAGE ||============================== //

const BatchesListPage = () => {
  const [batches, setBatches] = useState<Batch[]>(getMockBatches());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<BatchStatusFilter>('all');
  const [searchValue, setSearchValue] = useState('');

  // Handle delete success - update local state after successful delete
  const handleDeleteSuccess = useCallback((deletedIds: string[]) => {
    setBatches((prev) => prev.filter((batch) => !deletedIds.includes(batch.id)));
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
  } = useBatchDelete(handleDeleteSuccess);

  // Table setup - all table logic consolidated
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData } = useBatchesTable({
    data: batches,
    statusFilter,
    searchValue,
    onDelete: handleDelete,
    initialPageSize: 25
  });

  return (
    <MainCard>
      <BatchTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="batches-export"
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
      <BatchTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? 'Xác nhận xóa nhiều lô sản xuất' : `Xác nhận xóa lô sản xuất "${selectedItems[0]?.code}"`}
        message={
          isBulkDelete
            ? `Bạn có chắc chắn muốn xóa ${selectedItems.length} lô sản xuất đã chọn?`
            : 'Bạn có chắc chắn muốn xóa lô sản xuất này?'
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
                  { label: 'Lệnh SX', value: selectedItems[0].productionOrderCode },
                  { label: 'Sản phẩm', value: selectedItems[0].productName },
                  { label: 'Sản lượng kế hoạch', value: selectedItems[0].plannedQuantity.toLocaleString('vi-VN') },
                  { label: 'Sản lượng thực tế', value: selectedItems[0].actualQuantity.toLocaleString('vi-VN') }
                ]
            : []
        }
      />
    </MainCard>
  );
};

export default BatchesListPage;

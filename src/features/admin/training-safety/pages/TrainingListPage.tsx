import { useState, useCallback, useMemo } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';

import TrainingTable from '../components/TrainingTable';
import TrainingTableHeader, { type TrainingStatusFilter } from '../components/TrainingTableHeader';
import { useTrainingsDelete } from '../hooks/useTrainingsDelete';
import { useTrainingsTable } from '../hooks/useTrainingsTable';
import { getMockTrainings } from '../mock/trainings';
import type { Training } from '../types';

// ==============================|| TRAINING LIST PAGE ||============================== //

const TrainingListPage = () => {
  const [trainings, setTrainings] = useState<Training[]>(getMockTrainings());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TrainingStatusFilter>('all');
  const [searchValue, setSearchValue] = useState('');

  // Setup delete hook with onSuccess callback
  const { confirmDialog, selectedItems, isBulkDelete, handleDelete, handleBulkDelete, handleConfirmDelete, handleCancelDelete } =
    useTrainingsDelete({
      onSuccess: () => {
        // Update local state after delete
        if (isBulkDelete) {
          const idsToDelete = selectedItems.map((item) => item.id);
          setTrainings((prev) => prev.filter((item) => !idsToDelete.includes(item.id)));
        } else if (selectedItems.length > 0) {
          const itemId = selectedItems[0].id;
          setTrainings((prev) => prev.filter((item) => item.id !== itemId));
        }
      }
    });

  // Memoize delete handler to avoid re-render
  const handleDeleteMemo = useCallback(
    (item: Training) => {
      handleDelete(item);
    },
    [handleDelete]
  );

  // Memoize filter function
  const statusFilterFn = useCallback(
    (item: Training) => {
      if (statusFilter === 'all') return true;
      return item.status === statusFilter;
    },
    [statusFilter]
  );

  // Memoize filtered data
  const filteredData = useMemo(() => trainings.filter(statusFilterFn), [trainings, statusFilterFn]);

  // Table setup
  const { table, columnFilters, setColumnFilters, csvData, csvHeadersData } = useTrainingsTable({
    data: filteredData,
    statusFilter: statusFilter === 'all' ? undefined : statusFilter,
    searchValue,
    onDelete: handleDeleteMemo,
    initialPageSize: 25
  });

  return (
    <MainCard>
      <TrainingTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="trainings-export"
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
      <TrainingTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? 'Xác nhận xóa nhiều khóa đào tạo' : 'Xác nhận xóa khóa đào tạo'}
        message={
          isBulkDelete
            ? `Bạn có chắc chắn muốn xóa ${selectedItems.length} khóa đào tạo đã chọn?`
            : selectedItems.length > 0
              ? `Bạn có chắc chắn muốn xóa khóa đào tạo ${selectedItems[0].name}?`
              : ''
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        data={
          selectedItems.length > 0 && !isBulkDelete
            ? [
                { label: 'Tên khóa', value: selectedItems[0].name },
                { label: 'Loại đào tạo', value: selectedItems[0].type === 'skill' ? 'Kỹ năng' : 'An toàn' },
                { label: 'Bộ phận', value: selectedItems[0].department },
                { label: 'Trạng thái', value: selectedItems[0].status }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default TrainingListPage;

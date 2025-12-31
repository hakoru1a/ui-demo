import { useState, useCallback } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';

import LogisticsCostTable from '../components/LogisticsCostTable';
import LogisticsCostTableHeader from '../components/LogisticsCostTableHeader';
import { useLogisticsCostingDelete } from '../hooks/useLogisticsCostingDelete';
import { useLogisticsCostingTable } from '../hooks/useLogisticsCostingTable';
import { getMockLogisticsCosts } from '../mock/logisticsCosts';
import type { LogisticsCost } from '../types';
import type { LogisticsCostStatusFilter } from '../types/filters';

// ==============================|| LOGISTICS COSTING LIST PAGE ||============================== //

const LogisticsCostingListPage = () => {
  const [costs, setCosts] = useState<LogisticsCost[]>(getMockLogisticsCosts());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<LogisticsCostStatusFilter>('all');
  const [searchValue, setSearchValue] = useState('');

  // Handle delete success - update local state after successful delete
  const handleDeleteSuccess = useCallback((deletedIds: string[]) => {
    setCosts((prev) => prev.filter((cost) => !deletedIds.includes(cost.id)));
  }, []);

  const {
    confirmDialog,
    selectedCosts,
    isDeleting,
    isBulkDelete,
    handleDelete,
    handleBulkDelete,
    handleConfirmDelete,
    handleCancelDelete
  } = useLogisticsCostingDelete(handleDeleteSuccess);

  // Table setup - all table logic consolidated
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData } = useLogisticsCostingTable({
    data: costs,
    statusFilter,
    searchValue,
    onDelete: handleDelete,
    initialPageSize: 25
  });

  return (
    <MainCard>
      <LogisticsCostTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="logistics-costs-export"
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
      <LogisticsCostTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? 'Xác nhận xóa nhiều chi phí' : 'Xác nhận xóa chi phí'}
        message={
          isBulkDelete
            ? `Bạn có chắc chắn muốn xóa ${selectedCosts.length} chi phí đã chọn?`
            : selectedCosts.length > 0
              ? `Bạn có chắc chắn muốn xóa chi phí "${selectedCosts[0].costCode}"?`
              : ''
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        loading={isDeleting}
        data={
          selectedCosts.length > 0
            ? [
                { label: 'Mã chi phí', value: selectedCosts[0].costCode },
                { label: 'Loại chi phí', value: selectedCosts[0].costType === 'logistics' ? 'Logistics' : 'Dịch vụ' },
                { label: 'Đối tác', value: selectedCosts[0].partnerName || '-' },
                {
                  label: 'Số tiền',
                  value: `${selectedCosts[0].amount.toLocaleString('vi-VN')} ${selectedCosts[0].currency}`
                }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default LogisticsCostingListPage;

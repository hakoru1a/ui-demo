import { useState, useCallback, useMemo } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';

import WorkforceDispatchOrderTable from '../components/WorkforceDispatchOrderTable';
import WorkforceDispatchOrderTableHeader from '../components/WorkforceDispatchOrderTableHeader';
import type { StatusFilter } from '../components/WorkforceDispatchOrderTableHeader';
import { useWorkforceDispatchOrdersDelete } from '../hooks/useWorkforceDispatchOrdersDelete';
import { useWorkforceDispatchOrdersTable } from '../hooks/useWorkforceDispatchOrdersTable';
import { getMockWorkforceDispatchOrders } from '../mock/orders';
import type { WorkforceDispatchOrder } from '../types';

// ==============================|| WORKFORCE DISPATCH ORDER LIST PAGE ||============================== //

const WorkforceDispatchOrderListPage = () => {
  const [orders, setOrders] = useState<WorkforceDispatchOrder[]>(getMockWorkforceDispatchOrders());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchValue, setSearchValue] = useState('');

  // Setup delete hook with onSuccess callback
  const { confirmDialog, selectedItems, isBulkDelete, handleDelete, handleBulkDelete, handleConfirmDelete, handleCancelDelete } =
    useWorkforceDispatchOrdersDelete({
      onSuccess: () => {
        // Update local state after delete
        if (isBulkDelete) {
          const idsToDelete = selectedItems.map((item) => item.id);
          setOrders((prev) => prev.filter((item) => !idsToDelete.includes(item.id)));
        } else if (selectedItems.length > 0) {
          const itemId = selectedItems[0].id;
          setOrders((prev) => prev.filter((item) => item.id !== itemId));
        }
      }
    });

  // Memoize delete handler to avoid re-render
  const handleDeleteMemo = useCallback(
    (item: WorkforceDispatchOrder) => {
      handleDelete(item);
    },
    [handleDelete]
  );

  // Memoize filter function
  const statusFilterFn = useCallback(
    (item: WorkforceDispatchOrder) => {
      if (statusFilter === 'all') return true;
      return item.status === statusFilter;
    },
    [statusFilter]
  );

  // Memoize filtered data
  const filteredData = useMemo(() => orders.filter(statusFilterFn), [orders, statusFilterFn]);

  // Table setup
  const { table, columnFilters, setColumnFilters, csvData, csvHeadersData } = useWorkforceDispatchOrdersTable({
    data: filteredData,
    statusFilter,
    searchValue,
    onDelete: handleDeleteMemo,
    initialPageSize: 25
  });

  return (
    <MainCard>
      <WorkforceDispatchOrderTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="workforce-dispatch-orders-export"
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
      <WorkforceDispatchOrderTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? 'Xác nhận xóa nhiều lệnh điều phối' : 'Xác nhận xóa lệnh điều phối'}
        message={
          isBulkDelete
            ? `Bạn có chắc chắn muốn xóa ${selectedItems.length} lệnh điều phối đã chọn?`
            : selectedItems.length > 0
              ? `Bạn có chắc chắn muốn xóa lệnh điều phối ${selectedItems[0].code}?`
              : ''
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        data={
          selectedItems.length > 0 && !isBulkDelete
            ? [
                { label: 'Mã lệnh điều phối', value: selectedItems[0].code },
                {
                  label: 'Ngày áp dụng',
                  value: selectedItems[0].applicationDate ? new Date(selectedItems[0].applicationDate).toLocaleDateString('vi-VN') : '-'
                },
                { label: 'Nhà máy', value: selectedItems[0].factoryName },
                { label: 'Bộ phận', value: selectedItems[0].departmentName },
                { label: 'Trạng thái', value: selectedItems[0].status }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default WorkforceDispatchOrderListPage;

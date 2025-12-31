import { useState, useCallback } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';

import DispatchOrderTable from '../components/DispatchOrderTable';
import DispatchOrderTableHeader, { type DispatchOrderStatusFilter } from '../components/DispatchOrderTableHeader';
import { useDispatchOrderDelete } from '../hooks/useDispatchOrderDelete';
import { useDispatchOrdersTable } from '../hooks/useDispatchOrdersTable';
import { getMockDispatchOrders } from '../mock/dispatchOrders';

// ==============================|| DISPATCH ORDERS LIST PAGE ||============================== //

const DispatchOrdersListPage = () => {
  const [dispatchOrders, setDispatchOrders] = useState(getMockDispatchOrders());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<DispatchOrderStatusFilter>('all');
  const [searchValue, setSearchValue] = useState('');

  // Handle delete action - update local state after successful delete
  const handleDeleteSuccess = useCallback((deletedIds: string[]) => {
    setDispatchOrders((prev) => prev.filter((o) => !deletedIds.includes(o.id)));
  }, []);

  const {
    confirmDialog: deleteDialog,
    selectedOrders,
    isDeleting,
    isBulkDelete,
    handleDelete,
    handleBulkDelete,
    handleConfirmDelete,
    handleCancelDelete
  } = useDispatchOrderDelete(handleDeleteSuccess);

  // Table setup - all table logic consolidated
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData, selectedRows } = useDispatchOrdersTable({
    data: dispatchOrders,
    statusFilter,
    searchValue,
    onDelete: handleDelete,
    initialPageSize: 25
  });

  return (
    <MainCard>
      <DispatchOrderTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="dispatch-orders-export"
        columnFilters={columnFilters}
        onFilterChange={setColumnFilters}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        selectedRows={selectedRows}
        onBulkDelete={handleBulkDelete}
        enableRowSelection
        enableCSVExport
        enableColumnVisibility
      />
      <DispatchOrderTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteDialog.value}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? 'Xác nhận xóa nhiều lệnh điều động' : 'Xác nhận xóa lệnh điều động'}
        message={
          isBulkDelete
            ? `Bạn có chắc chắn muốn xóa ${selectedOrders.length} lệnh điều động đã chọn?`
            : 'Bạn có chắc chắn muốn xóa lệnh điều động này?'
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        loading={isDeleting}
        data={
          selectedOrders.length > 0
            ? isBulkDelete
              ? [
                  { label: 'Số lượng lệnh', value: `${selectedOrders.length} lệnh` },
                  {
                    label: 'Danh sách mã lệnh',
                    value: selectedOrders.map((o) => o.orderCode).join(', ')
                  }
                ]
              : [
                  { label: 'Mã lệnh', value: selectedOrders[0].orderCode },
                  { label: 'Xe', value: selectedOrders[0].vehicleLicensePlate },
                  { label: 'Tài xế', value: selectedOrders[0].driverName },
                  { label: 'Trạng thái', value: selectedOrders[0].status }
                ]
            : []
        }
      />
    </MainCard>
  );
};

export default DispatchOrdersListPage;

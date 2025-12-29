import { useState, useCallback } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';

import HarvestOrderTable from '../components/HarvestOrderTable';
import HarvestOrderTableHeader from '../components/HarvestOrderTableHeader';
import { useHarvestOrderDelete } from '../hooks/useHarvestOrderDelete';
import { useHarvestOrdersTable } from '../hooks/useHarvestOrdersTable';
import { mockHarvestOrders } from '../mock/harvestOrders';
import type { HarvestOrder } from '../types/index';

// ==============================|| HARVEST ORDERS LIST PAGE ||============================== //

const HarvestOrdersListPage = () => {
  const [harvestOrders, setHarvestOrders] = useState<HarvestOrder[]>(mockHarvestOrders);
  const [isLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [tabValue, setTabValue] = useState('all');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  // Single delete handler
  const handleDeleteSuccess = useCallback((deletedOrder: HarvestOrder) => {
    setHarvestOrders((prev) => prev.filter((order) => order.id !== deletedOrder.id));
  }, []);

  const { confirmDialog, selectedOrder, isDeleting, handleDelete, handleConfirmDelete, handleCancelDelete } =
    useHarvestOrderDelete(handleDeleteSuccess);

  // Bulk delete state
  const [bulkConfirmDialog, setBulkConfirmDialog] = useState<{ open: boolean; selectedOrders: HarvestOrder[] | null }>({
    open: false,
    selectedOrders: null
  });
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Handle bulk delete
  const handleBulkDelete = useCallback((selectedOrders: HarvestOrder[]) => {
    // Only allow deleting 'new' orders (business rule)
    const validOrders = selectedOrders.filter((order) => order.status === 'new');
    if (validOrders.length !== selectedOrders.length) {
      alert('Một số lệnh khai thác đã được thực hiện và không thể xóa. Chỉ xóa các lệnh ở trạng thái "Mới".');
    }

    if (validOrders.length > 0) {
      setBulkConfirmDialog({ open: true, selectedOrders: validOrders });
    }
  }, []);

  const handleConfirmBulkDelete = useCallback(async () => {
    if (!bulkConfirmDialog.selectedOrders || bulkConfirmDialog.selectedOrders.length === 0) {
      setBulkConfirmDialog({ open: false, selectedOrders: null });
      return;
    }

    setIsBulkDeleting(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Remove deleted orders from state
      const idsToDelete = bulkConfirmDialog.selectedOrders.map((p) => p.id);
      setHarvestOrders((prev) => prev.filter((order) => !idsToDelete.includes(order.id)));

      alert(`Đã xóa ${bulkConfirmDialog.selectedOrders.length} lệnh khai thác thành công! (Mock)`);
      setBulkConfirmDialog({ open: false, selectedOrders: null });
    } catch (error) {
      console.error('Error deleting harvest orders:', error);
      alert('Có lỗi xảy ra khi xóa lệnh khai thác');
    } finally {
      setIsBulkDeleting(false);
    }
  }, [bulkConfirmDialog.selectedOrders]);

  const handleCancelBulkDelete = useCallback(() => {
    setBulkConfirmDialog({ open: false, selectedOrders: null });
  }, []);

  // Table setup
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData } = useHarvestOrdersTable({
    data: harvestOrders,
    searchValue,
    statusFilter: tabValue,
    onDelete: handleDelete,
    initialPageSize: 25
  });

  return (
    <MainCard title="Danh sách lệnh khai thác" content={false}>
      <HarvestOrderTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="harvest-orders-export"
        columnFilters={columnFilters}
        onFilterChange={setColumnFilters}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        statusFilter={tabValue}
        onStatusFilterChange={handleTabChange}
        enableRowSelection
        enableCSVExport
        enableColumnVisibility
        onBulkDelete={handleBulkDelete}
      />
      <HarvestOrderTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Single Delete Dialog */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa lệnh khai thác"
        message="Bạn có chắc chắn muốn xóa lệnh khai thác này?"
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        loading={isDeleting}
        data={
          selectedOrder
            ? [
                { label: 'Mã lệnh', value: selectedOrder.code },
                { label: 'Kế hoạch', value: selectedOrder.planName },
                { label: 'Khu vực', value: selectedOrder.forestAreaName }
              ]
            : []
        }
      />

      {/* Confirm Bulk Delete Dialog */}
      <ConfirmDialog
        open={bulkConfirmDialog.open}
        onClose={handleCancelBulkDelete}
        onConfirm={handleConfirmBulkDelete}
        title="Xác nhận xóa nhiều lệnh khai thác"
        message={`Bạn có chắc chắn muốn xóa ${bulkConfirmDialog.selectedOrders?.length || 0} lệnh khai thác đã chọn?`}
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        loading={isBulkDeleting}
        data={
          bulkConfirmDialog.selectedOrders && bulkConfirmDialog.selectedOrders.length > 0
            ? [
                {
                  label: 'Số lượng lệnh',
                  value: bulkConfirmDialog.selectedOrders.length.toString()
                },
                {
                  label: 'Danh sách mã',
                  value: bulkConfirmDialog.selectedOrders.map((p) => p.code).join(', ')
                }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default HarvestOrdersListPage;

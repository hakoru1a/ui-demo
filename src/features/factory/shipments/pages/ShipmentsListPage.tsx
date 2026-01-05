import { useState, useCallback } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';
import dateHelper from 'utils/dateHelper';

import ShipmentTable from '../components/ShipmentTable';
import ShipmentTableHeader, { ShipmentStatusFilter } from '../components/ShipmentTableHeader';
import { useShipmentDelete } from '../hooks/useShipmentDelete';
import { useShipmentsTable } from '../hooks/useShipmentsTable';
import { getMockShipments } from '../mock/shipments';
import type { Shipment } from '../types/index';

// ==============================|| SHIPMENTS LIST PAGE ||============================== //

const ShipmentsListPage = () => {
  const [shipments, setShipments] = useState<Shipment[]>(getMockShipments());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ShipmentStatusFilter>(ShipmentStatusFilter.ALL);
  const [searchValue, setSearchValue] = useState('');

  // Convert status filter to string for table hook
  const statusFilterString = statusFilter === ShipmentStatusFilter.ALL ? undefined : statusFilter;

  // Handle delete success - update local state after successful delete
  const handleDeleteSuccess = useCallback((deletedIds: string[]) => {
    setShipments((prev) => prev.filter((shipment) => !deletedIds.includes(shipment.id)));
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
  } = useShipmentDelete(handleDeleteSuccess);

  // Table setup - all table logic consolidated
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData, selectedRows } = useShipmentsTable({
    data: shipments,
    statusFilter: statusFilterString,
    searchValue,
    onDelete: handleDelete,
    initialPageSize: 25
  });

  return (
    <MainCard>
      <ShipmentTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="shipments-export"
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
      <ShipmentTable table={table} data={filteredData} loading={isLoading} />

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

export default ShipmentsListPage;

import { useState, useCallback } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';

import VehicleTable from '../components/VehicleTable';
import VehicleTableHeader, { type VehicleStatusFilter } from '../components/VehicleTableHeader';
import { useFleetDelete } from '../hooks/useFleetDelete';
import { useFleetDisable } from '../hooks/useFleetDisable';
import { useFleetTable } from '../hooks/useFleetTable';
import { getMockVehicles } from '../mock/vehicles';
import type { Vehicle } from '../types';

// ==============================|| FLEET LIST PAGE ||============================== //

const FleetListPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(getMockVehicles());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<VehicleStatusFilter>('all');
  const [searchValue, setSearchValue] = useState('');

  // Handle disable action - update local state after successful disable
  const handleDisableSuccess = useCallback((disabledVehicle: Vehicle) => {
    setVehicles((prev) => prev.map((v) => (v.id === disabledVehicle.id ? disabledVehicle : v)));
  }, []);

  // Handle delete action - update local state after successful delete
  const handleDeleteSuccess = useCallback((deletedIds: string[]) => {
    setVehicles((prev) => prev.filter((v) => !deletedIds.includes(v.id)));
  }, []);

  const { confirmDialog, selectedVehicle, isDisabling, handleDisable, handleConfirmDisable, handleCancelDisable } =
    useFleetDisable(handleDisableSuccess);

  const {
    confirmDialog: deleteDialog,
    selectedVehicles,
    isDeleting,
    isBulkDelete,
    handleDelete,
    handleBulkDelete,
    handleConfirmDelete,
    handleCancelDelete
  } = useFleetDelete(handleDeleteSuccess);

  // Table setup - all table logic consolidated
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData, selectedRows } = useFleetTable({
    data: vehicles,
    statusFilter,
    searchValue,
    onDisable: handleDisable,
    onDelete: handleDelete,
    initialPageSize: 25
  });

  return (
    <MainCard>
      <VehicleTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="fleet-export"
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
      <VehicleTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Disable Dialog */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={handleCancelDisable}
        onConfirm={handleConfirmDisable}
        title="Xác nhận ngưng sử dụng"
        message="Bạn có chắc chắn muốn ngưng sử dụng xe này?"
        confirmText="Ngưng sử dụng"
        cancelText="Hủy"
        confirmColor="error"
        loading={isDisabling}
        data={
          selectedVehicle
            ? [
                { label: 'Biển số xe', value: selectedVehicle.licensePlate },
                { label: 'Tên tài xế', value: selectedVehicle.driverName },
                { label: 'Loại xe', value: selectedVehicle.vehicleType === 'truck' ? 'Xe tải' : 'Container' },
                { label: 'Trạng thái xe', value: selectedVehicle.vehicleStatus }
              ]
            : []
        }
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteDialog.value}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? 'Xác nhận xóa nhiều xe' : 'Xác nhận xóa xe'}
        message={isBulkDelete ? `Bạn có chắc chắn muốn xóa ${selectedVehicles.length} xe đã chọn?` : 'Bạn có chắc chắn muốn xóa xe này?'}
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        loading={isDeleting}
        data={
          selectedVehicles.length > 0
            ? isBulkDelete
              ? [
                  { label: 'Số lượng xe', value: `${selectedVehicles.length} xe` },
                  {
                    label: 'Danh sách biển số',
                    value: selectedVehicles.map((v) => v.licensePlate).join(', ')
                  }
                ]
              : [
                  { label: 'Biển số xe', value: selectedVehicles[0].licensePlate },
                  { label: 'Tên tài xế', value: selectedVehicles[0].driverName },
                  { label: 'Loại xe', value: selectedVehicles[0].vehicleType === 'truck' ? 'Xe tải' : 'Container' }
                ]
            : []
        }
      />
    </MainCard>
  );
};

export default FleetListPage;

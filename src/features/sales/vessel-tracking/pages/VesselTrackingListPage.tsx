import { useState, useCallback } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';

import VesselTrackingTable from '../components/VesselTrackingTable';
import VesselTrackingTableHeader from '../components/VesselTrackingTableHeader';
import { useVesselTrackingTable } from '../hooks/useVesselTrackingTable';
import type { VesselTracking } from '../types';
import type { VesselTrackingStatusFilter } from '../types/filters';

// Mock data - TODO: Replace with API call
const getMockVesselTrackings = (): VesselTracking[] => [
  {
    id: '1',
    shipmentNo: 'SHIP-001',
    exportOrderId: '1',
    exportOrderNo: 'XK001',
    vesselName: 'MV Evergreen',
    voyageNo: 'V001',
    portOfLoading: 'HCM',
    portOfDischarge: 'SINGAPORE',
    etd: new Date('2024-01-15'),
    eta: new Date('2024-01-22'),
    currentStatus: 'running',
    trackingMap: '16.0544,108.2022'
  },
  {
    id: '2',
    shipmentNo: 'SHIP-002',
    exportOrderId: '2',
    exportOrderNo: 'XK002',
    vesselName: 'MV Maersk Line',
    voyageNo: 'V002',
    portOfLoading: 'HP',
    portOfDischarge: 'ROTTERDAM',
    etd: new Date('2024-01-10'),
    eta: new Date('2024-02-15'),
    currentStatus: 'arrived',
    trackingMap: '51.9225,4.4792'
  }
];

// ==============================|| VESSEL TRACKING LIST PAGE ||============================== //

const VesselTrackingListPage = () => {
  const [trackings, setTrackings] = useState<VesselTracking[]>(getMockVesselTrackings());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<VesselTrackingStatusFilter>('all');
  const [searchValue, setSearchValue] = useState('');

  // Handle bulk delete
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState<{ open: boolean; trackings: VesselTracking[] }>({
    open: false,
    trackings: []
  });

  const handleBulkDelete = useCallback((selectedTrackings: VesselTracking[]) => {
    setConfirmDeleteDialog({ open: true, trackings: selectedTrackings });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (confirmDeleteDialog.trackings.length > 0) {
      const idsToDelete = confirmDeleteDialog.trackings.map((t) => t.id);
      setTrackings((prev) => prev.filter((t) => !idsToDelete.includes(t.id)));
      setConfirmDeleteDialog({ open: false, trackings: [] });
    }
  }, [confirmDeleteDialog.trackings]);

  const handleCancelDelete = useCallback(() => {
    setConfirmDeleteDialog({ open: false, trackings: [] });
  }, []);

  // Handle single delete
  const [confirmSingleDeleteDialog, setConfirmSingleDeleteDialog] = useState<{ open: boolean; tracking: VesselTracking | null }>({
    open: false,
    tracking: null
  });

  const handleDeleteClick = useCallback((tracking: VesselTracking) => {
    setConfirmSingleDeleteDialog({ open: true, tracking });
  }, []);

  const handleConfirmSingleDelete = useCallback(() => {
    if (confirmSingleDeleteDialog.tracking) {
      const trackingId = confirmSingleDeleteDialog.tracking.id;
      setTrackings((prev) => prev.filter((t) => t.id !== trackingId));
      setConfirmSingleDeleteDialog({ open: false, tracking: null });
    }
  }, [confirmSingleDeleteDialog.tracking]);

  const handleCancelSingleDelete = useCallback(() => {
    setConfirmSingleDeleteDialog({ open: false, tracking: null });
  }, []);

  // Table setup
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData } = useVesselTrackingTable({
    data: trackings,
    statusFilter,
    searchValue,
    onDelete: handleDeleteClick,
    initialPageSize: 25
  });

  return (
    <MainCard>
      <VesselTrackingTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="vessel-tracking-export"
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
      <VesselTrackingTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDeleteDialog.open}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa ${confirmDeleteDialog.trackings.length} chuyến tàu đã chọn?`}
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
      />

      {/* Confirm Single Delete Dialog */}
      <ConfirmDialog
        open={confirmSingleDeleteDialog.open}
        onClose={handleCancelSingleDelete}
        onConfirm={handleConfirmSingleDelete}
        title="Xác nhận xóa"
        message={
          confirmSingleDeleteDialog.tracking ? `Bạn có chắc chắn muốn xóa chuyến tàu ${confirmSingleDeleteDialog.tracking.shipmentNo}?` : ''
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        data={
          confirmSingleDeleteDialog.tracking
            ? [
                { label: 'Mã chuyến', value: confirmSingleDeleteDialog.tracking.shipmentNo },
                { label: 'Tên tàu', value: confirmSingleDeleteDialog.tracking.vesselName },
                { label: 'Cảng đi', value: confirmSingleDeleteDialog.tracking.portOfLoading },
                { label: 'Cảng đến', value: confirmSingleDeleteDialog.tracking.portOfDischarge }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default VesselTrackingListPage;

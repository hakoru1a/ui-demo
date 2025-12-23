import { useState, useCallback, useRef } from 'react';

// third-party
// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';
import useBoolean from 'hooks/useBoolean';
import { StatusFilter } from 'types/status';

import { forestAreaService } from '../api';
import { useForestAreaColumns } from '../components/ForestAreaColumns';
import ForestAreaTable from '../components/ForestAreaTable';
import ForestAreaTableHeader from '../components/ForestAreaTableHeader';

// types
import useForestAreaTable from '../hooks/useForestAreaTable';
import { getMockForestAreas } from '../mock/forestAreas';
import type { ForestArea } from '../types';

// hooks

// api

// mock data

// ==============================|| FOREST AREAS LIST PAGE ||============================== //

const ForestAreasListPage = () => {
  const [forestAreas, setForestAreas] = useState<ForestArea[]>(getMockForestAreas());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(StatusFilter.ALL);
  const [searchValue, setSearchValue] = useState('');

  // Confirm dialog state
  const confirmDialog = useBoolean(false);
  const [selectedForestArea, setSelectedForestArea] = useState<ForestArea | null>(null);
  const [isDisabling, setIsDisabling] = useState(false);

  // Filter dialog state using useBoolean hook
  const filterDialog = useBoolean(false);
  const filterAnchorRef = useRef<HTMLButtonElement>(null);

  // Handle disable action
  const handleDisable = useCallback(
    (forestArea: ForestArea) => {
      setSelectedForestArea(forestArea);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Confirm disable action
  const handleConfirmDisable = useCallback(async () => {
    if (!selectedForestArea) return;

    setIsDisabling(true);
    try {
      // Call API to disable (update status to inactive)
      const response = await forestAreaService.updateForestArea(selectedForestArea.id, {
        status: 'inactive'
      });

      if (response.success && response.data) {
        // Update local state
        setForestAreas((prev) => prev.map((area) => (area.id === selectedForestArea.id ? { ...area, status: 'inactive' } : area)));
        confirmDialog.onFalse();
        setSelectedForestArea(null);
        // TODO: Show success notification
      } else {
        // TODO: Show error notification
        console.error('Failed to disable forest area:', response.error);
      }
    } catch (error) {
      // TODO: Show error notification
      console.error('Error disabling forest area:', error);
    } finally {
      setIsDisabling(false);
    }
  }, [selectedForestArea, confirmDialog]);

  // Get columns using hook (memoized) with disable handler
  const columns = useForestAreaColumns({ onDisable: handleDisable });

  // Handle row selection - memoized to prevent unnecessary re-renders
  const handleRowSelectionChange = useCallback((selected: ForestArea[]) => {
    // TODO: Implement selection logic (e.g., bulk actions, delete, etc.)
    // Example: handleBulkActions(selected);
    console.log('Selected rows:', selected);
  }, []);

  // Use table hook
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData } = useForestAreaTable({
    data: forestAreas,
    columns,
    enableRowSelection: true,
    enableCSVExport: true,
    onRowSelectionChange: handleRowSelectionChange,
    initialPageSize: 25,
    statusFilter,
    searchValue
  });

  return (
    <MainCard>
      <ForestAreaTableHeader
        table={table}
        enableRowSelection={true}
        enableCSVExport={true}
        enableColumnVisibility={true}
        csvFilename="forest-areas-export"
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        columnFilters={columnFilters}
        filterDialogOpen={filterDialog.value}
        setFilterDialogOpen={filterDialog.setValue}
        filterAnchorRef={filterAnchorRef}
        onFilterChange={setColumnFilters}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />
      <ForestAreaTable table={table} data={filteredData} loading={isLoading} initialPageSize={25} />

      {/* Confirm Disable Dialog */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        onConfirm={handleConfirmDisable}
        title="Xác nhận vô hiệu hóa"
        message="Bạn có chắc chắn muốn vô hiệu hóa vùng trồng này? Vùng trồng sẽ không còn hoạt động sau khi vô hiệu hóa."
        confirmText="Vô hiệu hóa"
        cancelText="Hủy"
        confirmColor="error"
        loading={isDisabling}
        data={
          selectedForestArea
            ? [
                { label: 'Mã vùng trồng', value: selectedForestArea.code },
                { label: 'Tên vùng trồng', value: selectedForestArea.name },
                { label: 'Tỉnh / Khu vực', value: selectedForestArea.province },
                { label: 'Diện tích (ha)', value: selectedForestArea.area.toLocaleString('vi-VN') },
                { label: 'Chủ sở hữu', value: selectedForestArea.ownerName || '-' }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default ForestAreasListPage;

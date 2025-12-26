import { useState, useCallback } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';
import { StatusFilter } from 'types/status';

import ForestAreaTable from '../components/ForestAreaTable';
import ForestAreaTableHeader from '../components/ForestAreaTableHeader';
import { useForestAreaDisable } from '../hooks/useForestAreaDisable';
import { useForestAreasTable } from '../hooks/useForestAreasTable';
import { getMockForestAreas } from '../mock/forestAreas';
import type { ForestArea } from '../types';

// ==============================|| FOREST AREAS LIST PAGE ||============================== //

const ForestAreasListPage = () => {
  const [forestAreas, setForestAreas] = useState<ForestArea[]>(getMockForestAreas());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(StatusFilter.ALL);
  const [searchValue, setSearchValue] = useState('');

  // Handle disable action - update local state after successful disable
  const handleDisableSuccess = useCallback((disabledArea: ForestArea) => {
    setForestAreas((prev) => prev.map((area) => (area.id === disabledArea.id ? disabledArea : area)));
  }, []);

  const { confirmDialog, selectedForestArea, isDisabling, handleDisable, handleConfirmDisable } =
    useForestAreaDisable(handleDisableSuccess);

  // Table setup - all table logic consolidated
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData } = useForestAreasTable({
    data: forestAreas,
    statusFilter,
    searchValue,
    onDisable: handleDisable,
    initialPageSize: 25
  });

  return (
    <MainCard>
      <ForestAreaTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="forest-areas-export"
        columnFilters={columnFilters}
        onFilterChange={setColumnFilters}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        enableRowSelection
        enableCSVExport
        enableColumnVisibility
      />
      <ForestAreaTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Disable Dialog */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        onConfirm={handleConfirmDisable}
        title="Xác nhận vô hiệu hóa"
        message="Bạn có chắc chắn muốn vô hiệu hóa vùng trồng này?"
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
                { label: 'Diện tích (ha)', value: selectedForestArea.area.toLocaleString('vi-VN') }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default ForestAreasListPage;

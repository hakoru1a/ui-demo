import { useState, useCallback } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';
import { StatusFilter } from 'types/status';

import PriceTableTable from '../components/PriceTableTable';
import PriceTableTableHeader from '../components/PriceTableTableHeader';
import { usePriceTableDelete } from '../hooks/usePriceTableDelete';
import { usePriceTablesTable } from '../hooks/usePriceTablesTable';
import { getMockPriceTables } from '../mock/priceTables';
import type { PriceTable } from '../types/entity';

// ==============================|| PRICE ENGINE LIST PAGE ||============================== //

const PriceEngineListPage = () => {
  const [priceTables, setPriceTables] = useState<PriceTable[]>(getMockPriceTables());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(StatusFilter.ALL);
  const [searchValue, setSearchValue] = useState('');

  // Handle delete success - update local state after successful delete
  const handleDeleteSuccess = useCallback((deletedIds: string[]) => {
    setPriceTables((prev) => prev.filter((pt) => !deletedIds.includes(pt.id)));
  }, []);

  const {
    confirmDialog,
    selectedPriceTables,
    isDeleting,
    isBulkDelete,
    handleDelete,
    handleBulkDelete,
    handleConfirmDelete,
    handleCancelDelete
  } = usePriceTableDelete(handleDeleteSuccess);

  // Table setup - all table logic consolidated
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData } = usePriceTablesTable({
    data: priceTables,
    statusFilter,
    searchValue,
    onDelete: handleDelete,
    onSelectionChange: (selected) => {
      // Handle bulk delete when rows are selected
      if (selected.length > 0) {
        // This will be handled by the delete hook when user clicks delete button
      }
    },
    initialPageSize: 25
  });

  return (
    <MainCard>
      <PriceTableTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="price-tables-export"
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
      <PriceTableTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? 'Xác nhận xóa nhiều bảng giá' : `Xác nhận xóa bảng giá "${selectedPriceTables[0]?.name || ''}"`}
        message={
          isBulkDelete
            ? `Bạn có chắc chắn muốn xóa ${selectedPriceTables.length} bảng giá đã chọn?`
            : 'Bạn có chắc chắn muốn xóa bảng giá này?'
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        loading={isDeleting}
        data={
          selectedPriceTables.length > 0
            ? selectedPriceTables.flatMap((pt) => [
                { label: 'Mã bảng giá', value: pt.code },
                { label: 'Tên bảng giá', value: pt.name },
                { label: 'Loại nguyên liệu', value: pt.materialType },
                { label: 'Đơn giá cơ bản', value: `${pt.basePrice.toLocaleString('vi-VN')} VNĐ/kg` }
              ])
            : []
        }
      />
    </MainCard>
  );
};

export default PriceEngineListPage;

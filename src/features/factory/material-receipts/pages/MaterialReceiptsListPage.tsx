import { useState, useCallback } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';

import MaterialReceiptTable from '../components/MaterialReceiptTable';
import MaterialReceiptTableHeader from '../components/MaterialReceiptTableHeader';
import { useMaterialReceiptDelete } from '../hooks/useMaterialReceiptDelete';
import { useMaterialReceiptsTable } from '../hooks/useMaterialReceiptsTable';
import { getMockMaterialReceipts } from '../mock/materialReceipts';
import type { MaterialReceipt, ReceiptStatusFilter } from '../types';

// ==============================|| MATERIAL RECEIPTS LIST PAGE ||============================== //

const MaterialReceiptsListPage = () => {
  const [materialReceipts, setMaterialReceipts] = useState<MaterialReceipt[]>(getMockMaterialReceipts());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ReceiptStatusFilter>('all');
  const [searchValue, setSearchValue] = useState('');

  // Handle delete success - update local state after successful delete
  const handleDeleteSuccess = useCallback((deletedIds: string[]) => {
    setMaterialReceipts((prev) => prev.filter((receipt) => !deletedIds.includes(receipt.id)));
  }, []);

  const {
    confirmDialog,
    selectedReceipts,
    isDeleting,
    isBulkDelete,
    handleDelete,
    handleBulkDelete,
    handleConfirmDelete,
    handleCancelDelete
  } = useMaterialReceiptDelete(handleDeleteSuccess);

  // Table setup - all table logic consolidated
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData } = useMaterialReceiptsTable({
    data: materialReceipts,
    statusFilter,
    searchValue,
    onDelete: handleDelete,
    initialPageSize: 25
  });

  return (
    <MainCard>
      <MaterialReceiptTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="material-receipts-export"
        columnFilters={columnFilters}
        onFilterChange={setColumnFilters}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onBulkDelete={handleBulkDelete}
        enableRowSelection
        enableCSVExport
        enableColumnVisibility
      />
      <MaterialReceiptTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? 'Xác nhận xóa nhiều phiếu nhập' : 'Xác nhận xóa phiếu nhập'}
        message={
          isBulkDelete
            ? `Bạn có chắc chắn muốn xóa ${selectedReceipts.length} phiếu nhập đã chọn?`
            : 'Bạn có chắc chắn muốn xóa phiếu nhập này?'
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        loading={isDeleting}
        data={
          selectedReceipts.length > 0
            ? isBulkDelete
              ? [
                  { label: 'Số lượng phiếu', value: selectedReceipts.length.toString() },
                  {
                    label: 'Danh sách mã phiếu',
                    value: selectedReceipts.map((r) => r.code).join(', ')
                  }
                ]
              : [
                  { label: 'Mã phiếu nhập', value: selectedReceipts[0].code },
                  { label: 'Ngày nhập', value: selectedReceipts[0].receiptDate.toString() },
                  { label: 'Nhà cung cấp', value: selectedReceipts[0].supplierName || '-' },
                  { label: 'Kho nhập', value: selectedReceipts[0].warehouseName || '-' }
                ]
            : []
        }
      />
    </MainCard>
  );
};

export default MaterialReceiptsListPage;

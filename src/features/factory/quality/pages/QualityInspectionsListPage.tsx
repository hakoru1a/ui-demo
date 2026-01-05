// ==============================|| QUALITY INSPECTIONS LIST PAGE ||============================== //

import { useState, useCallback } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';

import QualityInspectionTable from '../components/QualityInspectionTable';
import QualityInspectionTableHeader, { type QCResultFilter } from '../components/QualityInspectionTableHeader';
import { useQualityInspectionDelete } from '../hooks/useQualityInspectionDelete';
import { useQualityInspectionsTable } from '../hooks/useQualityInspectionsTable';
import { getMockQualityInspections } from '../mock/qualityInspections';
import type { QualityInspection } from '../types';

// ==============================|| QUALITY INSPECTIONS LIST PAGE ||============================== //

const QualityInspectionsListPage = () => {
  const [inspections, setInspections] = useState<QualityInspection[]>(getMockQualityInspections());
  const [isLoading] = useState(false);
  const [resultFilter, setResultFilter] = useState<QCResultFilter>('all');
  const [searchValue, setSearchValue] = useState('');

  // Handle delete success - update local state after successful delete
  const handleDeleteSuccess = useCallback((deletedIds: string[]) => {
    setInspections((prev) => prev.filter((inspection) => !deletedIds.includes(inspection.id)));
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
  } = useQualityInspectionDelete(handleDeleteSuccess);

  // Table setup - all table logic consolidated
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData } = useQualityInspectionsTable({
    data: inspections,
    resultFilter,
    searchValue,
    onDelete: handleDelete,
    initialPageSize: 25
  });

  return (
    <MainCard>
      <QualityInspectionTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="quality-inspections-export"
        columnFilters={columnFilters}
        onFilterChange={setColumnFilters}
        resultFilter={resultFilter}
        onResultFilterChange={setResultFilter}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onBulkDelete={handleBulkDelete}
        enableRowSelection
        enableCSVExport
        enableColumnVisibility
      />
      <QualityInspectionTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? 'Xác nhận xóa nhiều phiếu kiểm định' : `Xác nhận xóa phiếu kiểm định "${selectedItems[0]?.code}"`}
        message={
          isBulkDelete
            ? `Bạn có chắc chắn muốn xóa ${selectedItems.length} phiếu kiểm định đã chọn?`
            : 'Bạn có chắc chắn muốn xóa phiếu kiểm định này?'
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        loading={isDeleting}
        data={
          selectedItems.length > 0
            ? isBulkDelete
              ? selectedItems.map((item) => ({ label: 'Mã', value: item.code }))
              : [
                  { label: 'Mã', value: selectedItems[0].code },
                  { label: 'Ngày kiểm định', value: selectedItems[0].inspectionDate.toString() },
                  { label: 'Sản phẩm', value: selectedItems[0].productName },
                  { label: 'Lô sản xuất', value: selectedItems[0].batchCode },
                  { label: 'Kết quả', value: selectedItems[0].result === 'passed' ? 'Đạt' : 'Không đạt' }
                ]
            : []
        }
      />
    </MainCard>
  );
};

export default QualityInspectionsListPage;

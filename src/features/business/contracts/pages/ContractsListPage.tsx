import { useState, useCallback, useMemo } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';
import { StatusFilter } from 'types/status';

import ContractTable from '../components/ContractTable';
import ContractTableHeader from '../components/ContractTableHeader';
import { useContractsDelete } from '../hooks/useContractsDelete';
import { useContractsTable } from '../hooks/useContractsTable';
import type { Contract } from '../types';

// Mock data - TODO: Replace with API call
const getMockContracts = (): Contract[] => [
  {
    id: '1',
    code: 'HD001',
    type: 'buy',
    partnerType: 'supplier',
    partnerId: '1',
    partnerName: 'Nhà cung cấp A',
    productId: '1',
    productName: 'Gỗ keo',
    pricingMethod: 'fixed',
    unitPrice: 1000000,
    currency: 'VND',
    contractQuantity: 1000,
    effectiveDate: new Date('2024-01-01'),
    expiryDate: new Date('2024-12-31'),
    paymentTerms: '30days',
    status: 'draft',
    contractValue: 1000000000,
    notes: 'Hợp đồng mua gỗ keo'
  },
  {
    id: '2',
    code: 'HD002',
    type: 'sell',
    partnerType: 'customer',
    partnerId: '3',
    partnerName: 'Khách hàng C',
    productId: '2',
    productName: 'Gỗ cao su',
    pricingMethod: 'formula',
    priceFormula: 'basePrice * (1 + moistureRate)',
    currency: 'VND',
    contractQuantity: 500,
    effectiveDate: new Date('2024-02-01'),
    expiryDate: new Date('2024-12-31'),
    paymentTerms: '60days',
    status: 'active',
    contractValue: 500000000,
    notes: 'Hợp đồng bán gỗ cao su'
  },
  {
    id: '3',
    code: 'HD003',
    type: 'buy',
    partnerType: 'supplier',
    partnerId: '2',
    partnerName: 'Nhà cung cấp B',
    productId: '3',
    productName: 'Nguyên liệu A',
    pricingMethod: 'fixed',
    unitPrice: 500000,
    currency: 'VND',
    contractQuantity: 2000,
    effectiveDate: new Date('2023-01-01'),
    expiryDate: new Date('2023-12-31'),
    paymentTerms: 'cash',
    status: 'expired',
    contractValue: 1000000000,
    notes: 'Hợp đồng đã hết hạn'
  }
];

// ==============================|| CONTRACTS LIST PAGE ||============================== //

const ContractsListPage = () => {
  const [contracts, setContracts] = useState<Contract[]>(getMockContracts());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter | string>(StatusFilter.ALL);
  const [searchValue, setSearchValue] = useState('');

  // Handle delete - Setup delete hook với onSuccess callback
  // Hook này quản lý cả single delete và bulk delete
  const { confirmDialog, selectedItems, isBulkDelete, handleDelete, handleBulkDelete, handleConfirmDelete, handleCancelDelete } =
    useContractsDelete({
      onSuccess: () => {
        // Update local state after delete thành công
        if (isBulkDelete) {
          // Bulk delete: Xóa nhiều hợp đồng
          const idsToDelete = selectedItems.map((c) => c.id);
          setContracts((prev) => prev.filter((c) => !idsToDelete.includes(c.id)));
        } else if (selectedItems.length > 0) {
          // Single delete: Xóa một hợp đồng
          const contractId = selectedItems[0].id;
          setContracts((prev) => prev.filter((c) => c.id !== contractId));
        }
      }
    });

  // Custom status filter function for contracts - memoized
  const statusFilterFn = useCallback(
    (contract: Contract) => {
      if (statusFilter === StatusFilter.ALL) return true;
      if (statusFilter === StatusFilter.ACTIVE) return contract.status === 'active';
      if (statusFilter === 'draft') return contract.status === 'draft';
      if (statusFilter === 'expired') return contract.status === 'expired';
      if (statusFilter === 'cancelled') return contract.status === 'cancelled';
      return true;
    },
    [statusFilter]
  );

  // Filter contracts by status - memoized
  const filteredContracts = useMemo(() => contracts.filter(statusFilterFn), [contracts, statusFilterFn]);

  // Memoize delete handler to prevent re-renders
  const handleDeleteMemo = useCallback(
    (contract: Contract) => {
      handleDelete(contract);
    },
    [handleDelete]
  );

  // Table setup
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData } = useContractsTable({
    data: filteredContracts,
    statusFilter: StatusFilter.ALL, // We handle status filtering manually above
    searchValue,
    onDelete: handleDeleteMemo,
    initialPageSize: 25
  });

  // Handle export Excel
  const handleExportExcel = () => {
    // TODO: Implement Excel export

    console.warn('Export Excel - Not implemented yet');
  };

  // Handle export PDF
  const handleExportPDF = () => {
    // TODO: Implement PDF export

    console.warn('Export PDF - Not implemented yet');
  };

  return (
    <MainCard>
      <ContractTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="contracts-export"
        columnFilters={columnFilters}
        onFilterChange={setColumnFilters}
        statusFilter={statusFilter as StatusFilter}
        onStatusFilterChange={(status) => setStatusFilter(status)}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        enableRowSelection
        enableCSVExport
        enableColumnVisibility
        onBulkDelete={handleBulkDelete} // Pass bulk delete handler - chỉ hiển thị khi chọn ≥1 & status = draft
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
      />
      <ContractTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog - Xử lý cả single và bulk delete */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? 'Xác nhận xóa nhiều hợp đồng' : 'Xác nhận xóa hợp đồng'}
        message={
          isBulkDelete
            ? `Bạn có chắc chắn muốn xóa ${selectedItems.length} hợp đồng đã chọn?`
            : selectedItems.length > 0
              ? `Bạn có chắc chắn muốn xóa hợp đồng ${selectedItems[0].code}?`
              : ''
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        data={
          selectedItems.length > 0 && !isBulkDelete
            ? [
                { label: 'Mã hợp đồng', value: selectedItems[0].code },
                { label: 'Đối tác', value: selectedItems[0].partnerName },
                { label: 'Loại', value: selectedItems[0].type === 'buy' ? 'Mua' : 'Bán' },
                { label: 'Trạng thái', value: selectedItems[0].status }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default ContractsListPage;

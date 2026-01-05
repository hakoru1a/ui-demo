import { useState, useCallback, useMemo } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';
import { StatusFilter } from 'types/status';

import PaymentOrderTable from '../components/PaymentOrderTable';
import PaymentOrderTableHeader from '../components/PaymentOrderTableHeader';
import { usePaymentOrdersDelete } from '../hooks/usePaymentOrdersDelete';
import { usePaymentOrdersTable } from '../hooks/usePaymentOrdersTable';
import { getMockPaymentOrders } from '../mock/mock';
import type { PaymentOrder } from '../types';

// ==============================|| PAYMENTS LIST PAGE ||============================== //

const PaymentsListPage = () => {
  const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>(getMockPaymentOrders());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter | string>(StatusFilter.ALL);
  const [searchValue, setSearchValue] = useState('');

  // Handle delete - Setup delete hook với onSuccess callback
  // Hook này quản lý cả single delete và bulk delete
  const { confirmDialog, selectedItems, isBulkDelete, handleDelete, handleBulkDelete, handleConfirmDelete, handleCancelDelete } =
    usePaymentOrdersDelete({
      onSuccess: () => {
        // Update local state after delete thành công
        if (isBulkDelete) {
          // Bulk delete: Xóa nhiều phiếu chi
          const idsToDelete = selectedItems.map((po) => po.id);
          setPaymentOrders((prev) => prev.filter((po) => !idsToDelete.includes(po.id)));
        } else if (selectedItems.length > 0) {
          // Single delete: Xóa một phiếu chi
          const paymentOrderId = selectedItems[0].id;
          setPaymentOrders((prev) => prev.filter((po) => po.id !== paymentOrderId));
        }
      }
    });

  // Custom status filter function for payment orders - memoized
  const statusFilterFn = useCallback(
    (paymentOrder: PaymentOrder) => {
      if (statusFilter === StatusFilter.ALL) return true;
      if (statusFilter === 'draft') return paymentOrder.status === 'draft';
      if (statusFilter === 'pending') return paymentOrder.status === 'pending';
      if (statusFilter === 'paid') return paymentOrder.status === 'paid';
      return true;
    },
    [statusFilter]
  );

  // Filter payment orders by status - memoized
  const filteredPaymentOrders = useMemo(() => paymentOrders.filter(statusFilterFn), [paymentOrders, statusFilterFn]);

  // Memoize delete handler to prevent re-renders
  const handleDeleteMemo = useCallback(
    (paymentOrder: PaymentOrder) => {
      handleDelete(paymentOrder);
    },
    [handleDelete]
  );

  // Table setup
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData } = usePaymentOrdersTable({
    data: filteredPaymentOrders,
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
      <PaymentOrderTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="payment-orders-export"
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
      <PaymentOrderTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog - Xử lý cả single và bulk delete */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? 'Xác nhận xóa nhiều phiếu chi' : 'Xác nhận xóa phiếu chi'}
        message={
          isBulkDelete
            ? `Bạn có chắc chắn muốn xóa ${selectedItems.length} phiếu chi đã chọn?`
            : selectedItems.length > 0
              ? `Bạn có chắc chắn muốn xóa phiếu chi ${selectedItems[0].code}?`
              : ''
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        data={
          selectedItems.length > 0 && !isBulkDelete
            ? [
                { label: 'Mã PO', value: selectedItems[0].code },
                { label: 'Đối tác', value: selectedItems[0].partnerName },
                { label: 'Loại', value: selectedItems[0].type === 'payment' ? 'Thanh toán' : 'Chi' },
                { label: 'Số tiền', value: `${selectedItems[0].paymentAmount.toLocaleString('vi-VN')} ${selectedItems[0].currency}` },
                { label: 'Trạng thái', value: selectedItems[0].status }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default PaymentsListPage;

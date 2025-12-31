import { useState, useCallback } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';

import ExportOrderTable from '../components/ExportOrderTable';
import ExportOrderTableHeader from '../components/ExportOrderTableHeader';
import { useExportOrdersTable } from '../hooks/useExportOrdersTable';
import type { ExportOrder } from '../types';
import type { ExportOrderStatusFilter } from '../types/filters';

// Mock data - TODO: Replace with API call
const getMockExportOrders = (): ExportOrder[] => [
  {
    id: '1',
    orderNo: 'XK001',
    orderDate: new Date('2024-01-15'),
    customerId: 'customer-001',
    customerName: 'Công ty ABC International',
    country: 'US',
    totalValue: 50000,
    currency: 'USD',
    incoterms: 'FOB',
    status: 'confirmed'
  },
  {
    id: '2',
    orderNo: 'XK002',
    orderDate: new Date('2024-01-20'),
    customerId: 'customer-002',
    customerName: 'XYZ Trading Co., Ltd.',
    country: 'GB',
    totalValue: 75000,
    currency: 'EUR',
    incoterms: 'CIF',
    status: 'delivering'
  },
  {
    id: '3',
    orderNo: 'XK003',
    orderDate: new Date('2024-02-01'),
    customerId: 'customer-003',
    customerName: 'Global Export Import Inc.',
    country: 'JP',
    totalValue: 30000,
    currency: 'JPY',
    incoterms: 'EXW',
    status: 'draft'
  },
  {
    id: '4',
    orderNo: 'XK004',
    orderDate: new Date('2024-01-10'),
    customerId: 'customer-004',
    customerName: 'Pacific Trading Company',
    country: 'AU',
    totalValue: 100000,
    currency: 'USD',
    incoterms: 'DDP',
    status: 'completed'
  }
];

// ==============================|| EXPORT ORDERS LIST PAGE ||============================== //

const ExportOrdersListPage = () => {
  const [orders, setOrders] = useState<ExportOrder[]>(getMockExportOrders());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ExportOrderStatusFilter>('all');
  const [searchValue, setSearchValue] = useState('');

  // Handle bulk delete
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState<{ open: boolean; orders: ExportOrder[] }>({
    open: false,
    orders: []
  });

  const handleBulkDelete = useCallback((selectedOrders: ExportOrder[]) => {
    setConfirmDeleteDialog({ open: true, orders: selectedOrders });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (confirmDeleteDialog.orders.length > 0) {
      const idsToDelete = confirmDeleteDialog.orders.map((o) => o.id);
      setOrders((prev) => prev.filter((o) => !idsToDelete.includes(o.id)));
      setConfirmDeleteDialog({ open: false, orders: [] });
    }
  }, [confirmDeleteDialog.orders]);

  const handleCancelDelete = useCallback(() => {
    setConfirmDeleteDialog({ open: false, orders: [] });
  }, []);

  // Handle single delete
  const [confirmSingleDeleteDialog, setConfirmSingleDeleteDialog] = useState<{ open: boolean; order: ExportOrder | null }>({
    open: false,
    order: null
  });

  const handleDeleteClick = useCallback((order: ExportOrder) => {
    setConfirmSingleDeleteDialog({ open: true, order });
  }, []);

  const handleConfirmSingleDelete = useCallback(() => {
    if (confirmSingleDeleteDialog.order) {
      const orderId = confirmSingleDeleteDialog.order.id;
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setConfirmSingleDeleteDialog({ open: false, order: null });
    }
  }, [confirmSingleDeleteDialog.order]);

  const handleCancelSingleDelete = useCallback(() => {
    setConfirmSingleDeleteDialog({ open: false, order: null });
  }, []);

  // Table setup
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData } = useExportOrdersTable({
    data: orders,
    statusFilter,
    searchValue,
    onDelete: handleDeleteClick,
    initialPageSize: 25
  });

  return (
    <MainCard>
      <ExportOrderTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="export-orders-export"
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
      <ExportOrderTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDeleteDialog.open}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa ${confirmDeleteDialog.orders.length} đơn hàng xuất khẩu đã chọn?`}
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
          confirmSingleDeleteDialog.order ? `Bạn có chắc chắn muốn xóa đơn hàng xuất khẩu ${confirmSingleDeleteDialog.order.orderNo}?` : ''
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        data={
          confirmSingleDeleteDialog.order
            ? [
                { label: 'Mã đơn hàng', value: confirmSingleDeleteDialog.order.orderNo },
                { label: 'Khách hàng', value: confirmSingleDeleteDialog.order.customerName || '-' },
                { label: 'Quốc gia', value: confirmSingleDeleteDialog.order.country },
                {
                  label: 'Tổng giá trị',
                  value: `${confirmSingleDeleteDialog.order.totalValue.toLocaleString('vi-VN')} ${confirmSingleDeleteDialog.order.currency}`
                }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default ExportOrdersListPage;

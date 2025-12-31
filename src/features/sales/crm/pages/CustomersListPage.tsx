import { useState, useCallback } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';
import { StatusFilter } from 'types/status';

import CustomerTable from '../components/CustomerTable';
import CustomerTableHeader from '../components/CustomerTableHeader';
import { useCustomersTable } from '../hooks/useCustomersTable';
import type { Customer } from '../types';

// Mock data - TODO: Replace with API call
const getMockCustomers = (): Customer[] => [
  {
    id: '1',
    code: 'KH001',
    companyName: 'Công ty ABC International',
    country: 'US',
    address: '123 Main Street, New York, NY 10001',
    taxCode: 'US123456789',
    contactPerson: 'John Doe',
    email: 'john.doe@abc.com',
    phone: '+1-212-555-1234',
    currency: 'USD',
    paymentTerms: 'TT',
    creditLimit: 100000,
    status: 'active'
  },
  {
    id: '2',
    code: 'KH002',
    companyName: 'XYZ Trading Co., Ltd.',
    country: 'GB',
    address: '456 High Street, London, UK',
    taxCode: 'GB987654321',
    contactPerson: 'Jane Smith',
    email: 'jane.smith@xyz.com',
    phone: '+44-20-7946-0958',
    currency: 'GBP',
    paymentTerms: 'LC',
    creditLimit: 50000,
    status: 'active'
  },
  {
    id: '3',
    code: 'KH003',
    companyName: 'Global Export Import Inc.',
    country: 'JP',
    address: '789 Business District, Tokyo, Japan',
    taxCode: 'JP456789012',
    contactPerson: 'Taro Yamada',
    email: 'taro.yamada@global.com',
    phone: '+81-3-1234-5678',
    currency: 'JPY',
    paymentTerms: 'DP',
    creditLimit: 75000,
    status: 'inactive'
  }
];

// ==============================|| CUSTOMERS LIST PAGE ||============================== //

const CustomersListPage = () => {
  const [customers, setCustomers] = useState<Customer[]>(getMockCustomers());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(StatusFilter.ALL);
  const [searchValue, setSearchValue] = useState('');

  // Handle bulk delete
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState<{ open: boolean; customers: Customer[] }>({
    open: false,
    customers: []
  });

  const handleBulkDelete = useCallback((selectedCustomers: Customer[]) => {
    setConfirmDeleteDialog({ open: true, customers: selectedCustomers });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (confirmDeleteDialog.customers.length > 0) {
      const idsToDelete = confirmDeleteDialog.customers.map((c) => c.id);
      setCustomers((prev) => prev.filter((c) => !idsToDelete.includes(c.id)));
      setConfirmDeleteDialog({ open: false, customers: [] });
    }
  }, [confirmDeleteDialog.customers]);

  const handleCancelDelete = useCallback(() => {
    setConfirmDeleteDialog({ open: false, customers: [] });
  }, []);

  // Handle single delete
  const [confirmSingleDeleteDialog, setConfirmSingleDeleteDialog] = useState<{ open: boolean; customer: Customer | null }>({
    open: false,
    customer: null
  });

  const handleDeleteClick = useCallback((customer: Customer) => {
    setConfirmSingleDeleteDialog({ open: true, customer });
  }, []);

  const handleConfirmSingleDelete = useCallback(() => {
    if (confirmSingleDeleteDialog.customer) {
      const customerId = confirmSingleDeleteDialog.customer.id;
      setCustomers((prev) => prev.filter((c) => c.id !== customerId));
      setConfirmSingleDeleteDialog({ open: false, customer: null });
    }
  }, [confirmSingleDeleteDialog.customer]);

  const handleCancelSingleDelete = useCallback(() => {
    setConfirmSingleDeleteDialog({ open: false, customer: null });
  }, []);

  // Table setup
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData } = useCustomersTable({
    data: customers,
    statusFilter,
    searchValue,
    onDelete: handleDeleteClick,
    initialPageSize: 25
  });

  return (
    <MainCard>
      <CustomerTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="customers-export"
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
      <CustomerTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDeleteDialog.open}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa ${confirmDeleteDialog.customers.length} khách hàng đã chọn?`}
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
          confirmSingleDeleteDialog.customer
            ? `Bạn có chắc chắn muốn xóa khách hàng ${confirmSingleDeleteDialog.customer.companyName}?`
            : ''
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        data={
          confirmSingleDeleteDialog.customer
            ? [
                { label: 'Mã KH', value: confirmSingleDeleteDialog.customer.code },
                { label: 'Tên công ty', value: confirmSingleDeleteDialog.customer.companyName },
                { label: 'Quốc gia', value: confirmSingleDeleteDialog.customer.country },
                { label: 'Email', value: confirmSingleDeleteDialog.customer.email }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default CustomersListPage;

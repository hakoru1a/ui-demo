import { useState } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';
import { StatusFilter } from 'types/status';

import PartnerTable from '../components/PartnerTable';
import PartnerTableHeader from '../components/PartnerTableHeader';
import { usePartnersDelete } from '../hooks/usePartnersDelete';
import { usePartnersTable } from '../hooks/usePartnersTable';
import type { Partner } from '../types';

// Mock data - TODO: Replace with API call
const getMockPartners = (): Partner[] => [
  {
    id: '1',
    code: 'KH001',
    name: 'Công ty ABC',
    type: 'business',
    representative: 'Nguyễn Văn A',
    phone: '0912345678',
    address: '123 Đường XYZ, Quận 1, TP.HCM',
    status: 'active',
    notes: 'Khách hàng VIP'
  },
  {
    id: '2',
    code: 'KH002',
    name: 'Nguyễn Văn B',
    type: 'individual',
    phone: '0987654321',
    address: '456 Đường ABC, Quận 2, TP.HCM',
    status: 'active',
    notes: ''
  },
  {
    id: '3',
    code: 'KH003',
    name: 'Công ty XYZ',
    type: 'business',
    representative: 'Trần Thị C',
    phone: '0901234567',
    address: '789 Đường DEF, Quận 3, TP.HCM',
    status: 'inactive',
    notes: 'Tạm ngưng hợp tác'
  }
];

// ==============================|| PARTNERS LIST PAGE ||============================== //

const PartnersListPage = () => {
  const [partners, setPartners] = useState<Partner[]>(getMockPartners());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(StatusFilter.ALL);
  const [searchValue, setSearchValue] = useState('');

  // Handle delete
  const { confirmDialog, selectedItems, isBulkDelete, handleDelete, handleBulkDelete, handleConfirmDelete, handleCancelDelete } =
    usePartnersDelete({
      onSuccess: () => {
        // Update local state after delete
        if (isBulkDelete) {
          const idsToDelete = selectedItems.map((p) => p.id);
          setPartners((prev) => prev.filter((p) => !idsToDelete.includes(p.id)));
        } else if (selectedItems.length > 0) {
          const partnerId = selectedItems[0].id;
          setPartners((prev) => prev.filter((p) => p.id !== partnerId));
        }
      }
    });

  // Table setup
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData } = usePartnersTable({
    data: partners,
    statusFilter,
    searchValue,
    onDelete: handleDelete,
    initialPageSize: 25
  });

  return (
    <MainCard>
      <PartnerTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="partners-export"
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
      <PartnerTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? 'Xác nhận xóa nhiều khách hàng' : 'Xác nhận xóa khách hàng'}
        message={
          isBulkDelete
            ? `Bạn có chắc chắn muốn xóa ${selectedItems.length} khách hàng đã chọn?`
            : selectedItems.length > 0
              ? `Bạn có chắc chắn muốn xóa khách hàng ${selectedItems[0].name}?`
              : ''
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        data={
          selectedItems.length > 0 && !isBulkDelete
            ? [
                { label: 'Mã KH', value: selectedItems[0].code },
                { label: 'Tên khách hàng', value: selectedItems[0].name },
                { label: 'SĐT', value: selectedItems[0].phone },
                { label: 'Trạng thái', value: selectedItems[0].status === 'active' ? 'Hoạt động' : 'Ngưng' }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default PartnersListPage;

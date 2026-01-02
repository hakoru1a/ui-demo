import { useState, useCallback } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';
import { StatusFilter } from 'types/status';

import WeighTicketTable from '../components/WeighTicketTable';
import WeighTicketTableHeader from '../components/WeighTicketTableHeader';
import { useWeighTicketDelete } from '../hooks/useWeighTicketDelete';
import { useWeighTicketsTable } from '../hooks/useWeighTicketsTable';
import { getMockWeighTickets } from '../mock/weighTickets';
import type { WeighTicket } from '../types';

// ==============================|| WEIGH TICKETS LIST PAGE ||============================== //

const WeighTicketsListPage = () => {
  const [weighTickets, setWeighTickets] = useState<WeighTicket[]>(getMockWeighTickets());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(StatusFilter.ALL);
  const [searchValue, setSearchValue] = useState('');

  // Handle delete action - update local state after successful delete
  const handleDeleteSuccess = useCallback((deletedIds: string[]) => {
    setWeighTickets((prev) => prev.filter((ticket) => !deletedIds.includes(ticket.id)));
  }, []);

  const {
    confirmDialog: deleteDialog,
    selectedWeighTickets,
    isDeleting,
    isBulkDelete,
    handleDelete,
    handleBulkDelete,
    handleConfirmDelete,
    handleCancelDelete
  } = useWeighTicketDelete(handleDeleteSuccess);

  // Table setup - all table logic consolidated
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData, selectedRows } = useWeighTicketsTable({
    data: weighTickets,
    statusFilter,
    searchValue,
    onDelete: handleDelete,
    initialPageSize: 25
  });

  return (
    <MainCard>
      <WeighTicketTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="weigh-tickets-export"
        columnFilters={columnFilters}
        onFilterChange={setColumnFilters}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        selectedRows={selectedRows}
        onBulkDelete={handleBulkDelete}
        enableRowSelection
        enableCSVExport
        enableColumnVisibility
      />
      <WeighTicketTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteDialog.value}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? 'Xác nhận xóa nhiều phiếu cân' : 'Xác nhận xóa phiếu cân'}
        message={
          isBulkDelete
            ? `Bạn có chắc chắn muốn xóa ${selectedWeighTickets.length} phiếu cân đã chọn?`
            : 'Bạn có chắc chắn muốn xóa phiếu cân này?'
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        loading={isDeleting}
        data={
          selectedWeighTickets.length > 0
            ? isBulkDelete
              ? [
                  { label: 'Số lượng phiếu cân', value: `${selectedWeighTickets.length} phiếu` },
                  {
                    label: 'Danh sách mã phiếu',
                    value: selectedWeighTickets.map((t) => t.code).join(', ')
                  }
                ]
              : [
                  { label: 'Mã phiếu cân', value: selectedWeighTickets[0].code },
                  { label: 'Biển số xe', value: selectedWeighTickets[0].vehiclePlate },
                  { label: 'Nhà cung cấp', value: selectedWeighTickets[0].supplierName || '-' },
                  {
                    label: 'Loại phiếu',
                    value: selectedWeighTickets[0].type === 'inbound' ? 'Inbound' : 'Outbound'
                  }
                ]
            : []
        }
      />
    </MainCard>
  );
};

export default WeighTicketsListPage;

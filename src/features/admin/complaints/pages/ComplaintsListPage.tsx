import { useState, useCallback, useMemo } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';

import ComplaintTable from '../components/ComplaintTable';
import ComplaintTableHeader, { type ComplaintStatusFilter } from '../components/ComplaintTableHeader';
import { useComplaintsDelete } from '../hooks/useComplaintsDelete';
import { useComplaintsTable } from '../hooks/useComplaintsTable';
import { getMockComplaints } from '../mock/complaints';
import type { Complaint } from '../types/index';

// ==============================|| COMPLAINTS LIST PAGE ||============================== //

const ComplaintsListPage = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(getMockComplaints());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ComplaintStatusFilter>('all');
  const [searchValue, setSearchValue] = useState('');

  const { confirmDialog, selectedItems, isBulkDelete, handleDelete, handleBulkDelete, handleConfirmDelete, handleCancelDelete } =
    useComplaintsDelete({
      onSuccess: () => {
        if (isBulkDelete) {
          const idsToDelete = selectedItems.map((item) => item.id);
          setComplaints((prev) => prev.filter((item) => !idsToDelete.includes(item.id)));
        } else if (selectedItems.length > 0) {
          const itemId = selectedItems[0].id;
          setComplaints((prev) => prev.filter((item) => item.id !== itemId));
        }
      }
    });

  const handleDeleteMemo = useCallback(
    (item: Complaint) => {
      handleDelete(item);
    },
    [handleDelete]
  );

  const statusFilterFn = useCallback(
    (item: Complaint) => {
      if (statusFilter === 'all') return true;
      return item.status === statusFilter;
    },
    [statusFilter]
  );

  const filteredData = useMemo(() => complaints.filter(statusFilterFn), [complaints, statusFilterFn]);

  const { table, columnFilters, setColumnFilters, csvData, csvHeadersData } = useComplaintsTable({
    data: filteredData,
    statusFilter: statusFilter === 'all' ? undefined : statusFilter,
    searchValue,
    onDelete: handleDeleteMemo,
    initialPageSize: 25
  });

  const handleUpdateStatus = useCallback((selectedComplaints: Complaint[]) => {
    // TODO: Implement update status logic
    // await complaintService.updateStatus(selectedComplaints[0].id, 'resolved');
  }, []);

  return (
    <MainCard>
      <ComplaintTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="complaints-export"
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
        onUpdateStatus={handleUpdateStatus}
      />
      <ComplaintTable table={table} data={filteredData} loading={isLoading} />

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? 'Xác nhận xóa nhiều khiếu nại' : 'Xác nhận xóa khiếu nại'}
        message={
          isBulkDelete
            ? `Bạn có chắc chắn muốn xóa ${selectedItems.length} khiếu nại đã chọn?`
            : selectedItems.length > 0
              ? `Bạn có chắc chắn muốn xóa khiếu nại ${selectedItems[0].code}?`
              : ''
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        data={
          selectedItems.length > 0 && !isBulkDelete
            ? [
                { label: 'Mã khiếu nại', value: selectedItems[0].code },
                { label: 'Người gửi', value: selectedItems[0].sender },
                { label: 'Loại khiếu nại', value: selectedItems[0].type },
                { label: 'Trạng thái', value: selectedItems[0].status }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default ComplaintsListPage;

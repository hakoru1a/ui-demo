import { useState, useCallback, useMemo } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';
import { StatusFilter } from 'types/status';

import EmployeeTable from '../components/EmployeeTable';
import EmployeeTableHeader from '../components/EmployeeTableHeader';
import { useEmployeesDelete } from '../hooks/useEmployeesDelete';
import { useEmployeesTable } from '../hooks/useEmployeesTable';
import { getMockEmployees } from '../mock/employees';
import type { Employee } from '../types';

// ==============================|| EMPLOYEES LIST PAGE ||============================== //

const EmployeesListPage = () => {
  const [employees, setEmployees] = useState<Employee[]>(getMockEmployees());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(StatusFilter.ALL);
  const [searchValue, setSearchValue] = useState('');

  // Setup delete hook with onSuccess callback
  const { confirmDialog, selectedItems, isBulkDelete, handleDelete, handleBulkDelete, handleConfirmDelete, handleCancelDelete } =
    useEmployeesDelete({
      onSuccess: () => {
        // Update local state after delete
        if (isBulkDelete) {
          const idsToDelete = selectedItems.map((item) => item.id);
          setEmployees((prev) => prev.filter((item) => !idsToDelete.includes(item.id)));
        } else if (selectedItems.length > 0) {
          const itemId = selectedItems[0].id;
          setEmployees((prev) => prev.filter((item) => item.id !== itemId));
        }
      }
    });

  // Memoize delete handler to avoid re-render
  const handleDeleteMemo = useCallback(
    (item: Employee) => {
      handleDelete(item);
    },
    [handleDelete]
  );

  // Memoize filter function
  const statusFilterFn = useCallback(
    (item: Employee) => {
      if (statusFilter === StatusFilter.ALL) return true;
      return item.status === statusFilter;
    },
    [statusFilter]
  );

  // Memoize filtered data
  const filteredData = useMemo(() => employees.filter(statusFilterFn), [employees, statusFilterFn]);

  // Table setup
  const { table, columnFilters, setColumnFilters, csvData, csvHeadersData } = useEmployeesTable({
    data: filteredData,
    statusFilter,
    searchValue,
    onDelete: handleDeleteMemo,
    initialPageSize: 25
  });

  // Handle extend contract
  const handleExtendContract = useCallback((selectedEmployees: Employee[]) => {
    // TODO: Implement extend contract logic
    // eslint-disable-next-line no-console
    console.log('Extend contract for:', selectedEmployees);
  }, []);

  return (
    <MainCard>
      <EmployeeTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="employees-export"
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
        onExtendContract={handleExtendContract}
      />
      <EmployeeTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? 'Xác nhận xóa nhiều nhân sự' : 'Xác nhận xóa nhân sự'}
        message={
          isBulkDelete
            ? `Bạn có chắc chắn muốn xóa ${selectedItems.length} nhân sự đã chọn?`
            : selectedItems.length > 0
              ? `Bạn có chắc chắn muốn xóa nhân sự ${selectedItems[0].fullName}?`
              : ''
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        data={
          selectedItems.length > 0 && !isBulkDelete
            ? [
                { label: 'Mã nhân sự', value: selectedItems[0].code },
                { label: 'Họ & Tên', value: selectedItems[0].fullName },
                { label: 'Bộ phận', value: selectedItems[0].department },
                { label: 'Chức danh', value: selectedItems[0].position },
                { label: 'Trạng thái', value: selectedItems[0].status === 'active' ? 'Đang làm' : 'Nghỉ việc' }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default EmployeesListPage;

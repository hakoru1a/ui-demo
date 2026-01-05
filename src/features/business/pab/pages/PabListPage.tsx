// ==============================|| PAB LIST PAGE ||============================== //

import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import FilterOutlined from '@ant-design/icons/FilterOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import { InputAdornment, Stack, Button, Toolbar, IconButton, Tooltip, Box } from '@mui/material';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import TextField from 'components/fields/TextField';
import MainCard from 'components/MainCard';
import RowSelection from 'components/third-party/react-table/RowSelection';

import PabTable from '../components/PabTable';
import { usePabDelete } from '../hooks/usePabDelete';
import { usePabsTable } from '../hooks/usePabsTable';
import { getMockPabs } from '../mock/pabs';
import { PAB_URLS } from '../types/constants';
import type { Pab, PabStatusFilter } from '../types/index';

// ==============================|| PAB LIST PAGE ||============================== //

const PabListPage = () => {
  const navigate = useNavigate();
  const [pabs] = useState<Pab[]>(getMockPabs());
  const [isLoading] = useState(false);
  const [statusFilter] = useState<PabStatusFilter>('all');
  const [searchValue, setSearchValue] = useState('');

  // Handle delete success - update local state after successful delete
  const handleDeleteSuccess = useCallback(() => {
    // In real app, refetch data from API
    // For now, just remove from local state
    // This will be handled by the delete hook
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
  } = usePabDelete(handleDeleteSuccess);

  // Table setup - all table logic consolidated
  const { table, columnFilters, filteredData, selectedRows } = usePabsTable({
    data: pabs,
    statusFilter,
    searchValue,
    onDelete: handleDelete,
    initialPageSize: 25
  });

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const hasSelection = selectedCount > 0;

  const handleBulkDeleteClick = useCallback(() => {
    if (selectedRows.length > 0) {
      handleBulkDelete(selectedRows);
    }
  }, [selectedRows, handleBulkDelete]);

  const handleCreateNew = () => {
    navigate(PAB_URLS.NEW);
  };

  return (
    <MainCard>
      {/* Toolbar */}
      <Toolbar sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
          <TextField
            placeholder="Tìm kiếm theo mã PAB, khách hàng, sản phẩm..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            size="medium"
            sx={{ minWidth: 300 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined />
                  </InputAdornment>
                )
              }
            }}
          />

          <Box sx={{ minWidth: 120 }}>
            <RowSelection selected={selectedCount} />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Bulk Delete Button - Only show when rows are selected */}
          {hasSelection && (
            <Tooltip title="Xóa các mục đã chọn">
              <IconButton
                color="error"
                onClick={handleBulkDeleteClick}
                size="medium"
                disabled={!selectedRows.every((row) => row.status === 'draft')}
              >
                <DeleteOutlined />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Bộ lọc">
            <IconButton size="medium" color={columnFilters.length > 0 ? 'primary' : 'default'}>
              <FilterOutlined />
            </IconButton>
          </Tooltip>

          <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={handleCreateNew}>
            Tạo mới
          </Button>
        </Stack>
      </Toolbar>

      <PabTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? 'Xác nhận xóa nhiều PAB' : 'Xác nhận xóa PAB'}
        message={
          isBulkDelete
            ? `Bạn có chắc chắn muốn xóa ${selectedItems.length} PAB đã chọn?`
            : `Bạn có chắc chắn muốn xóa PAB "${selectedItems[0]?.code}"?`
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        loading={isDeleting}
        data={
          selectedItems.length > 0
            ? [
                { label: 'Mã PAB', value: selectedItems[0].code },
                { label: 'Khách hàng', value: selectedItems[0].customerName },
                { label: 'Sản phẩm', value: selectedItems[0].productName },
                { label: 'Số lượng', value: `${selectedItems[0].quantity} ${selectedItems[0].unit}` }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default PabListPage;

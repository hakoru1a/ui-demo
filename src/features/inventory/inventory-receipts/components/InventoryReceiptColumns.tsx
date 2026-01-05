// ==============================|| INVENTORY RECEIPT TABLE COLUMNS ||============================== //

import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import { IconButton, Stack, Tooltip } from '@mui/material';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { type ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// types
import { StatusFilter } from 'types/status';
import dateHelper from 'utils/dateHelper';
import { getStatusColorMap } from 'utils/getStatusColor';

import type { InventoryReceipt } from '../types';
import { INVENTORY_RECEIPT_URLS, STATUS_OPTIONS } from '../types/constants';
import { getLabelFromOptions } from '../utils';

/**
 * Inventory Receipt Table Columns Definition
 */
interface UseInventoryReceiptColumnsProps {
  onEdit?: (receipt: InventoryReceipt) => void;
  onDelete?: (receipt: InventoryReceipt) => void;
}

export function useInventoryReceiptColumns({ onEdit, onDelete }: UseInventoryReceiptColumnsProps = {}): ColumnDef<InventoryReceipt>[] {
  const theme = useTheme();
  const navigate = useNavigate();
  const statusColorMap = getStatusColorMap(theme);

  const handleView = useCallback(
    (id: string) => {
      navigate(INVENTORY_RECEIPT_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (receipt: InventoryReceipt) => {
      if (onEdit) {
        onEdit(receipt);
      } else {
        navigate(INVENTORY_RECEIPT_URLS.EDIT(receipt.id));
      }
    },
    [navigate, onEdit]
  );

  const handleDelete = useCallback(
    (receipt: InventoryReceipt) => {
      if (onDelete) {
        onDelete(receipt);
      }
    },
    [onDelete]
  );

  return useMemo<ColumnDef<InventoryReceipt>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã phiếu',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue, row }) => (
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
            onClick={(e) => {
              e.stopPropagation();
              handleView(row.original.id);
            }}
          >
            {getValue<string>()}
          </Typography>
        )
      },
      {
        accessorKey: 'receiptDate',
        header: 'Ngày nhập',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const date = getValue<Date | string>();
          return <Typography variant="body2">{date ? dateHelper.formatDate(date, 'DD/MM/YYYY') : '-'}</Typography>;
        }
      },
      {
        accessorKey: 'receiptType',
        header: 'Loại nhập',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'material' | 'finished'>();
          const displayLabel = value === 'material' ? 'NL' : 'TP';
          return (
            <Chip
              label={displayLabel}
              size="small"
              color={value === 'material' ? 'primary' : 'success'}
              variant="light"
              sx={{ minWidth: 50 }}
            />
          );
        }
      },
      {
        accessorKey: 'warehouseName',
        header: 'Kho nhập',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => <Typography variant="body2">{getValue<string>()}</Typography>
      },
      {
        accessorKey: 'totalWeight',
        header: 'Tổng khối lượng',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue, row }) => {
          const value = getValue<number>();
          const unit = row.original.unit;
          return (
            <Typography align="right" variant="body2">
              {value ? `${value.toLocaleString('vi-VN')} ${unit}` : '-'}
            </Typography>
          );
        },
        meta: {
          align: 'right' as const
        }
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'draft' | 'received' | 'cancelled'>();
          const label = getLabelFromOptions(value, STATUS_OPTIONS);
          let chipColor: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default';
          let statusFilter = StatusFilter.INACTIVE;

          if (value === 'received') {
            chipColor = 'success';
            statusFilter = StatusFilter.ACTIVE;
          } else if (value === 'draft') {
            chipColor = 'warning';
            statusFilter = StatusFilter.INACTIVE;
          } else if (value === 'cancelled') {
            chipColor = 'error';
            statusFilter = StatusFilter.INACTIVE;
          }

          return (
            <Chip
              label={label}
              size="small"
              color={chipColor}
              variant="light"
              sx={{
                minWidth: 100,
                color: statusColorMap[statusFilter],
                borderColor: statusColorMap[statusFilter]
              }}
            />
          );
        }
      },
      {
        id: 'actions',
        header: 'Hành động',
        enableSorting: false,
        enableColumnFilter: false,
        meta: {
          align: 'center' as const
        },
        cell: ({ row }) => {
          const receipt = row.original;
          const canDelete = receipt.status === 'draft'; // Only draft receipts can be deleted
          return (
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(receipt.id);
                  }}
                  sx={{
                    '&:hover': {
                      bgcolor: 'info.lighter'
                    }
                  }}
                >
                  <EyeOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="Chỉnh sửa">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(receipt);
                  }}
                  sx={{
                    '&:hover': {
                      bgcolor: 'primary.lighter'
                    }
                  }}
                >
                  <EditOutlined />
                </IconButton>
              </Tooltip>
              {onDelete && (
                <Tooltip title={canDelete ? 'Xóa' : 'Chỉ có thể xóa phiếu ở trạng thái Nháp'}>
                  <span>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (canDelete) {
                          handleDelete(receipt);
                        }
                      }}
                      disabled={!canDelete}
                      sx={{
                        '&:hover': {
                          bgcolor: 'error.lighter'
                        }
                      }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
            </Stack>
          );
        }
      }
    ],
    [statusColorMap, onDelete, handleEdit, handleView, handleDelete]
  );
}

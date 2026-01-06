// ==============================|| MATERIAL RECEIPT TABLE COLUMNS ||============================== //

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

import dateHelper from 'utils/dateHelper';

import type { MaterialReceipt } from '../types';
import { MATERIAL_RECEIPT_URLS, RECEIPT_STATUS_OPTIONS } from '../types/constants';
import { getLabelFromOptions } from '../utils';

/**
 * Material Receipt Table Columns Definition
 */
interface UseMaterialReceiptColumnsProps {
  onDelete?: (receipt: MaterialReceipt) => void;
}

export function useMaterialReceiptColumns({ onDelete }: UseMaterialReceiptColumnsProps = {}): ColumnDef<MaterialReceipt>[] {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleView = useCallback(
    (id: string) => {
      navigate(MATERIAL_RECEIPT_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (id: string) => {
      navigate(MATERIAL_RECEIPT_URLS.EDIT(id));
    },
    [navigate]
  );

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return theme.palette.warning.main;
      case 'received':
        return theme.palette.success.main;
      case 'cancelled':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[600];
    }
  };

  return useMemo<ColumnDef<MaterialReceipt>[]>(
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
          return <Typography variant="body2">{dateHelper.formatDate(date)}</Typography>;
        }
      },
      {
        accessorKey: 'supplierName',
        header: 'Nhà cung cấp',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<string | undefined>();
          return <Typography variant="body2">{value || '-'}</Typography>;
        }
      },
      {
        accessorKey: 'warehouseName',
        header: 'Kho nhập',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<string | undefined>();
          return <Typography variant="body2">{value || '-'}</Typography>;
        }
      },
      {
        accessorKey: 'quantity',
        header: 'Tổng khối lượng (kg)',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<number>();
          return (
            <Typography align="right" variant="body2">
              {value.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
          const label = getLabelFromOptions(value, RECEIPT_STATUS_OPTIONS);
          const statusColor = getStatusColor(value);
          const chipColor = value === 'received' ? 'success' : value === 'draft' ? 'warning' : 'error';

          return (
            <Chip
              label={label}
              size="small"
              color={chipColor}
              variant="light"
              sx={{
                minWidth: 100,
                color: statusColor,
                borderColor: statusColor
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
                    handleEdit(receipt.id);
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
                <Tooltip title="Xóa">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(receipt);
                    }}
                    sx={{
                      '&:hover': {
                        bgcolor: 'error.lighter'
                      }
                    }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          );
        }
      }
    ],
    [onDelete, handleEdit, handleView, getStatusColor]
  );
}

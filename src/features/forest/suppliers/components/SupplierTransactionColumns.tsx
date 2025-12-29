// ==============================|| SUPPLIER TRANSACTION TABLE COLUMNS ||============================== //

import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import { IconButton, Stack, Tooltip } from '@mui/material';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { type ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';

// types
import dateHelper from 'utils/dateHelper';

import type { SupplierTransaction } from '../types';
import { TRANSACTION_TYPE_OPTIONS, TRANSACTION_STATUS_OPTIONS } from '../types/constants';
import { getLabelFromOptions } from '../utils';

/**
 * Supplier Transaction Table Columns Definition
 */
interface UseSupplierTransactionColumnsProps {
  onView?: (transaction: SupplierTransaction) => void;
  onDelete?: (transaction: SupplierTransaction) => void;
}

export function useSupplierTransactionColumns({
  onView,
  onDelete
}: UseSupplierTransactionColumnsProps = {}): ColumnDef<SupplierTransaction>[] {
  const handleView = useCallback(
    (transaction: SupplierTransaction) => {
      if (onView) {
        onView(transaction);
      } else {
        // TODO: Navigate to transaction detail page if exists
        alert(`Xem chi tiết giao dịch: ${transaction.code}`);
      }
    },
    [onView]
  );

  const handleDelete = useCallback(
    (transaction: SupplierTransaction) => {
      if (onDelete) {
        onDelete(transaction);
      }
    },
    [onDelete]
  );

  return useMemo<ColumnDef<SupplierTransaction>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã giao dịch',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue, row }) => (
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
            onClick={(e) => {
              e.stopPropagation();
              handleView(row.original);
            }}
          >
            {getValue<string>()}
          </Typography>
        )
      },
      {
        accessorKey: 'transactionDate',
        header: 'Ngày giao dịch',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const date = getValue<Date | string>();
          return <Typography variant="body2">{dateHelper.formatDate(date)}</Typography>;
        }
      },
      {
        accessorKey: 'type',
        header: 'Loại giao dịch',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'import' | 'adjustment'>();
          const label = getLabelFromOptions(value, TRANSACTION_TYPE_OPTIONS);
          const chipColor = value === 'import' ? 'primary' : 'warning';
          return <Chip label={label} size="small" color={chipColor} variant="light" sx={{ minWidth: 100 }} />;
        }
      },
      {
        accessorKey: 'quantity',
        header: 'Sản lượng (m³)',
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
        accessorKey: 'estimatedUnitPrice',
        header: 'Đơn giá ước tính',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<number | undefined>();
          return (
            <Typography align="right" variant="body2">
              {value ? value.toLocaleString('vi-VN') : '-'}
            </Typography>
          );
        },
        meta: {
          align: 'right' as const
        }
      },
      {
        accessorKey: 'estimatedTotal',
        header: 'Tổng ước tính',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<number | undefined>();
          return (
            <Typography align="right" variant="body2">
              {value ? value.toLocaleString('vi-VN') : '-'}
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
          const value = getValue<'completed' | 'cancelled'>();
          const label = getLabelFromOptions(value, TRANSACTION_STATUS_OPTIONS);
          const chipColor = value === 'completed' ? 'success' : 'error';

          return (
            <Chip
              label={label}
              size="small"
              color={chipColor}
              variant="light"
              sx={{
                minWidth: 100
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
          const transaction = row.original;
          return (
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(transaction);
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
              {onDelete && (
                <Tooltip title="Xóa">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(transaction);
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
    [onDelete, handleView, handleDelete]
  );
}

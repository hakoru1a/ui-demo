// ==============================|| STOCKTAKE TABLE COLUMNS ||============================== //

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

import type { Stocktake } from '../types';
import { getLabelFromOptions, STOCKTAKE_STATUS_OPTIONS, STOCKTAKE_URLS } from '../types/constants';

/**
 * Stocktake Table Columns Definition
 */
interface UseStocktakeColumnsProps {
  onEdit?: (stocktake: Stocktake) => void;
  onDelete?: (stocktake: Stocktake) => void;
  onView?: (stocktake: Stocktake) => void;
}

export function useStocktakeColumns({ onEdit, onDelete, onView }: UseStocktakeColumnsProps = {}): ColumnDef<Stocktake>[] {
  const theme = useTheme();
  const navigate = useNavigate();
  const statusColorMap = getStatusColorMap(theme);

  const handleView = useCallback(
    (id: string) => {
      if (onView) {
        const stocktake = { id } as Stocktake;
        onView(stocktake);
      } else {
        navigate(STOCKTAKE_URLS.DETAIL(id));
      }
    },
    [navigate, onView]
  );

  const handleEdit = useCallback(
    (stocktake: Stocktake) => {
      if (onEdit) {
        onEdit(stocktake);
      } else {
        navigate(STOCKTAKE_URLS.EDIT(stocktake.id));
      }
    },
    [navigate, onEdit]
  );

  const handleDelete = useCallback(
    (stocktake: Stocktake) => {
      if (onDelete) {
        onDelete(stocktake);
      }
    },
    [onDelete]
  );

  return useMemo<ColumnDef<Stocktake>[]>(
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
        accessorKey: 'inventoryDate',
        header: 'Ngày kiểm kê',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<Date | string>();
          return <Typography variant="body2">{value ? dateHelper.formatDate(value, 'DD/MM/YYYY') : '-'}</Typography>;
        }
      },
      {
        accessorKey: 'warehouseName',
        header: 'Kho',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => <Typography variant="body2">{getValue<string>()}</Typography>
      },
      {
        accessorKey: 'skuCount',
        header: 'Số SKU',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<number>();
          return (
            <Typography align="right" variant="body2">
              {value ? value.toLocaleString('vi-VN') : '0'}
            </Typography>
          );
        },
        meta: {
          align: 'right' as const
        }
      },
      {
        accessorKey: 'totalDifference',
        header: 'Chênh lệch',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<number>();
          const isNegative = value < 0;
          const isPositive = value > 0;
          return (
            <Typography
              align="right"
              variant="body2"
              sx={{
                color: isNegative ? 'error.main' : isPositive ? 'success.main' : 'text.primary',
                fontWeight: value !== 0 ? 600 : 400
              }}
            >
              {value > 0 ? '+' : ''}
              {value ? value.toLocaleString('vi-VN') : '0'}
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
          const value = getValue<'draft' | 'completed'>();
          const label = getLabelFromOptions(value, STOCKTAKE_STATUS_OPTIONS);
          let chipColor: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default';
          let statusFilter = StatusFilter.INACTIVE;

          if (value === 'completed') {
            chipColor = 'success';
            statusFilter = StatusFilter.ACTIVE;
          } else if (value === 'draft') {
            chipColor = 'warning';
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
          const stocktake = row.original;
          return (
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(stocktake.id);
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
                    handleEdit(stocktake);
                  }}
                  disabled={stocktake.status === 'completed'}
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
                      handleDelete(stocktake);
                    }}
                    disabled={stocktake.status === 'completed'}
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
    [statusColorMap, onDelete, handleEdit, handleView, handleDelete]
  );
}

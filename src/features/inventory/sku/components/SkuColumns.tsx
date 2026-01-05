// ==============================|| SKU TABLE COLUMNS ||============================== //

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
import { getStatusColorMap } from 'utils/getStatusColor';

import type { Sku } from '../types';
import { getLabelFromOptions, SKU_URLS, STOCK_STATUS_OPTIONS } from '../types/constants';

/**
 * SKU Table Columns Definition
 */
interface UseSkuColumnsProps {
  onEdit?: (sku: Sku) => void;
  onDelete?: (sku: Sku) => void;
}

export function useSkuColumns({ onEdit, onDelete }: UseSkuColumnsProps = {}): ColumnDef<Sku>[] {
  const theme = useTheme();
  const navigate = useNavigate();
  const statusColorMap = getStatusColorMap(theme);

  const handleView = useCallback(
    (id: string) => {
      navigate(SKU_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (sku: Sku) => {
      if (onEdit) {
        onEdit(sku);
      } else {
        navigate(SKU_URLS.EDIT(sku.id));
      }
    },
    [navigate, onEdit]
  );

  const handleDelete = useCallback(
    (sku: Sku) => {
      if (onDelete) {
        onDelete(sku);
      }
    },
    [onDelete]
  );

  return useMemo<ColumnDef<Sku>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'SKU Code',
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
        accessorKey: 'name',
        header: 'Tên hàng hóa',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue, row }) => (
          <Typography
            variant="subtitle2"
            sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
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
        accessorKey: 'itemType',
        header: 'Loại hàng',
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
        header: 'Kho',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => <Typography variant="body2">{getValue<string>()}</Typography>
      },
      {
        accessorKey: 'systemQuantity',
        header: 'Tồn hệ thống',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue, row }) => {
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
        accessorKey: 'unit',
        header: 'Đơn vị',
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ getValue }) => <Typography variant="body2">{getValue<string>()}</Typography>
      },
      {
        accessorKey: 'stockStatus',
        header: 'Trạng thái',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'in_stock' | 'out_of_stock'>();
          const label = getLabelFromOptions(value, STOCK_STATUS_OPTIONS);
          let chipColor: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default';
          let statusFilter = StatusFilter.INACTIVE;

          if (value === 'in_stock') {
            chipColor = 'success';
            statusFilter = StatusFilter.ACTIVE;
          } else if (value === 'out_of_stock') {
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
          const sku = row.original;
          return (
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(sku.id);
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
                    handleEdit(sku);
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
                      handleDelete(sku);
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
    [statusColorMap, onDelete, handleEdit, handleView, handleDelete]
  );
}

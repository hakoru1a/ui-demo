// ==============================|| BATCH TABLE COLUMNS ||============================== //

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

import type { Batch } from '../types';
import { BATCH_STATUS_OPTIONS, BATCH_URLS } from '../types/constants';

/**
 * Batch Table Columns Definition
 */
interface UseBatchColumnsProps {
  onDelete?: (batch: Batch) => void;
}

const getLabelFromOptions = <T extends string>(value: T, options: { value: T; label: string }[]): string => {
  return options.find((opt) => opt.value === value)?.label || value;
};

export function useBatchColumns({ onDelete }: UseBatchColumnsProps = {}): ColumnDef<Batch>[] {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleView = useCallback(
    (id: string) => {
      navigate(BATCH_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (id: string) => {
      navigate(BATCH_URLS.EDIT(id));
    },
    [navigate]
  );

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress':
        return theme.palette.info.main;
      case 'completed':
        return theme.palette.success.main;
      case 'cancelled':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[600];
    }
  };

  return useMemo<ColumnDef<Batch>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã lô',
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
        accessorKey: 'productionOrderCode',
        header: 'Kế hoạch / Lệnh',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue, row }) => (
          <Typography
            variant="body2"
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
        accessorKey: 'productName',
        header: 'Sản phẩm',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => <Typography variant="body2">{getValue<string>()}</Typography>
      },
      {
        accessorKey: 'plannedQuantity',
        header: 'Sản lượng kế hoạch',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<number>();
          return (
            <Typography align="right" variant="body2">
              {value.toLocaleString('vi-VN')}
            </Typography>
          );
        },
        meta: {
          align: 'right' as const
        }
      },
      {
        accessorKey: 'actualQuantity',
        header: 'Sản lượng thực tế',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<number>();
          return (
            <Typography align="right" variant="body2">
              {value.toLocaleString('vi-VN')}
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
          const value = getValue<'in-progress' | 'completed' | 'cancelled'>();
          const label = getLabelFromOptions(value, BATCH_STATUS_OPTIONS);
          const statusColor = getStatusColor(value);
          const chipColor = value === 'completed' ? 'success' : value === 'in-progress' ? 'info' : 'error';

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
          const batch = row.original;
          const canDelete = batch.status === 'in-progress' || batch.status === 'cancelled';
          return (
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(batch.id);
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
                    handleEdit(batch.id);
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
                <Tooltip title={canDelete ? 'Xóa' : 'Chỉ có thể xóa khi trạng thái là Đang SX hoặc Hủy'}>
                  <span>
                    <IconButton
                      size="small"
                      color="error"
                      disabled={!canDelete}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (canDelete) {
                          onDelete(batch);
                        }
                      }}
                      sx={{
                        '&:hover': {
                          bgcolor: 'error.lighter'
                        },
                        '&.Mui-disabled': {
                          opacity: 0.5
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
    [onDelete, handleEdit, handleView, theme, getStatusColor]
  );
}

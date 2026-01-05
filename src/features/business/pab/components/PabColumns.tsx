// ==============================|| PAB TABLE COLUMNS ||============================== //

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

import { PAB_URLS, PAB_STATUS_OPTIONS, PAB_UNIT_OPTIONS } from '../types/constants';
import type { Pab } from '../types/index';
import { getLabelFromOptions, formatCurrency } from '../utils';

/**
 * PAB Table Columns Definition
 */
interface UsePabColumnsProps {
  onDelete?: (pab: Pab) => void;
}

export function usePabColumns({ onDelete }: UsePabColumnsProps = {}): ColumnDef<Pab>[] {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleView = useCallback(
    (id: string) => {
      navigate(PAB_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (id: string) => {
      navigate(PAB_URLS.EDIT(id));
    },
    [navigate]
  );

  return useMemo<ColumnDef<Pab>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã PAB',
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
        accessorKey: 'customerName',
        header: 'Khách hàng',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => <Typography variant="body2">{getValue<string>()}</Typography>
      },
      {
        accessorKey: 'productName',
        header: 'Sản phẩm/Nguyên liệu',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => <Typography variant="body2">{getValue<string>()}</Typography>
      },
      {
        accessorKey: 'quantity',
        header: 'Số lượng',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ row }) => {
          const quantity = row.original.quantity;
          const unit = getLabelFromOptions(row.original.unit, PAB_UNIT_OPTIONS);
          return (
            <Typography align="right" variant="body2">
              {quantity.toLocaleString('vi-VN')} {unit}
            </Typography>
          );
        },
        meta: {
          align: 'right' as const
        }
      },
      {
        accessorKey: 'expectedDeliveryDate',
        header: 'Ngày giao dự kiến',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<Date | string>();
          if (!value) return <Typography variant="body2">-</Typography>;
          const date = typeof value === 'string' ? new Date(value) : value;
          return <Typography variant="body2">{date.toLocaleDateString('vi-VN')}</Typography>;
        }
      },
      {
        accessorKey: 'estimatedCost',
        header: 'Chi phí ước tính',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<number>();
          return (
            <Typography align="right" variant="body2">
              {formatCurrency(value)}
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
          const value = getValue<'draft' | 'pending-approval' | 'approved' | 'rejected' | 'cancelled'>();
          const label = getLabelFromOptions(value, PAB_STATUS_OPTIONS);
          let chipColor: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
          let statusColor = theme.palette.text.secondary;

          switch (value) {
            case 'draft':
              chipColor = 'default';
              statusColor = theme.palette.grey[600];
              break;
            case 'pending-approval':
              chipColor = 'info';
              statusColor = theme.palette.info.main;
              break;
            case 'approved':
              chipColor = 'success';
              statusColor = theme.palette.success.main;
              break;
            case 'rejected':
              chipColor = 'error';
              statusColor = theme.palette.error.main;
              break;
            case 'cancelled':
              chipColor = 'error';
              statusColor = theme.palette.error.main;
              break;
          }

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
          const pab = row.original;
          return (
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(pab.id);
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
                    handleEdit(pab.id);
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
                      onDelete(pab);
                    }}
                    disabled={pab.status !== 'draft'}
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
    [theme, onDelete, handleEdit, handleView]
  );
}

// ==============================|| PAYMENT ORDER TABLE COLUMNS ||============================== //

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

import type { PaymentOrder } from '../types';
import { PAYMENT_ORDER_URLS, PAYMENT_ORDER_TYPE_OPTIONS, PAYMENT_METHOD_OPTIONS, STATUS_OPTIONS } from '../types/constants';
import { getLabelFromOptions } from '../utils';

/**
 * Payment Order Table Columns Definition
 */
interface UsePaymentOrderColumnsProps {
  onEdit?: (paymentOrder: PaymentOrder) => void;
  onDelete?: (paymentOrder: PaymentOrder) => void;
}

export function usePaymentOrderColumns({ onEdit, onDelete }: UsePaymentOrderColumnsProps = {}): ColumnDef<PaymentOrder>[] {
  const theme = useTheme();
  const navigate = useNavigate();
  const statusColorMap = getStatusColorMap(theme);

  const handleView = useCallback(
    (id: string) => {
      navigate(PAYMENT_ORDER_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (paymentOrder: PaymentOrder) => {
      if (onEdit) {
        onEdit(paymentOrder);
      } else {
        navigate(PAYMENT_ORDER_URLS.EDIT(paymentOrder.id));
      }
    },
    [navigate, onEdit]
  );

  const handleDelete = useCallback(
    (paymentOrder: PaymentOrder) => {
      if (onDelete) {
        onDelete(paymentOrder);
      }
    },
    [onDelete]
  );

  return useMemo<ColumnDef<PaymentOrder>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã PO',
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
        accessorKey: 'createdAt',
        header: 'Ngày lập',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const date = getValue<Date | string>();
          return <Typography variant="body2">{date ? dateHelper.formatDate(date, 'DD/MM/YYYY') : '-'}</Typography>;
        }
      },
      {
        accessorKey: 'partnerName',
        header: 'Đối tác',
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
        accessorKey: 'type',
        header: 'Loại phiếu',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'payment' | 'expense'>();
          const label = getLabelFromOptions(value, PAYMENT_ORDER_TYPE_OPTIONS);
          const chipColor = value === 'payment' ? 'primary' : 'warning';
          return <Chip label={label} size="small" color={chipColor} variant="light" sx={{ minWidth: 100 }} />;
        }
      },
      {
        accessorKey: 'paymentAmount',
        header: 'Số tiền',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue, row }) => {
          const value = getValue<number>();
          const currency = row.original.currency || 'VND';
          return (
            <Typography align="right" variant="body2">
              {value ? `${value.toLocaleString('vi-VN')} ${currency}` : '-'}
            </Typography>
          );
        },
        meta: {
          align: 'right' as const
        }
      },
      {
        accessorKey: 'paymentMethod',
        header: 'Phương thức',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'cash' | 'transfer'>();
          const label = getLabelFromOptions(value, PAYMENT_METHOD_OPTIONS);
          return <Typography variant="body2">{label}</Typography>;
        }
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'draft' | 'pending' | 'paid'>();
          const label = getLabelFromOptions(value, STATUS_OPTIONS);
          let chipColor: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default';
          let statusFilter = StatusFilter.INACTIVE;

          if (value === 'paid') {
            chipColor = 'success';
            statusFilter = StatusFilter.ACTIVE;
          } else if (value === 'draft') {
            chipColor = 'default';
            statusFilter = StatusFilter.ALL;
          } else if (value === 'pending') {
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
          const paymentOrder = row.original;
          const canDelete = paymentOrder.status === 'draft'; // Only draft payment orders can be deleted
          return (
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(paymentOrder.id);
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
                    handleEdit(paymentOrder);
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
                          handleDelete(paymentOrder);
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

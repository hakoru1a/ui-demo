// ==============================|| WEIGH TICKET TABLE COLUMNS ||============================== //

import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import { IconButton, Stack, Tooltip } from '@mui/material';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { type ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import dateHelper from 'utils/dateHelper';

import type { WeighTicket } from '../types';
import { SUPPLIER_OPTIONS, WEIGH_TICKET_URLS } from '../types/constants';

/**
 * Helper function to get label from options
 */
function getLabelFromOptions<T extends string>(value: T | undefined, options: Array<{ value: T; label: string }>): string {
  if (!value) return '-';
  const option = options.find((opt) => opt.value === value);
  return option?.label || value;
}

/**
 * Weigh Ticket Table Columns Definition
 */
interface UseWeighTicketColumnsProps {
  onDelete?: (weighTicket: WeighTicket) => void;
}

export function useWeighTicketColumns({ onDelete }: UseWeighTicketColumnsProps = {}): ColumnDef<WeighTicket>[] {
  const navigate = useNavigate();

  const handleView = useCallback(
    (id: string) => {
      navigate(WEIGH_TICKET_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (id: string) => {
      navigate(WEIGH_TICKET_URLS.EDIT(id));
    },
    [navigate]
  );

  return useMemo<ColumnDef<WeighTicket>[]>(
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
        accessorKey: 'vehiclePlate',
        header: 'Biển số xe',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => <Typography variant="body2">{getValue<string>()}</Typography>
      },
      {
        accessorKey: 'supplierName',
        header: 'Nhà cung cấp',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue, row }) => {
          const value = getValue<string | undefined>();
          const supplierId = row.original.supplierId;
          const supplierName = value || getLabelFromOptions(supplierId, SUPPLIER_OPTIONS);
          return (
            <Typography
              variant="body2"
              sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
              onClick={(e) => {
                e.stopPropagation();
                handleView(row.original.id);
              }}
            >
              {supplierName}
            </Typography>
          );
        }
      },
      {
        accessorKey: 'type',
        header: 'Loại phiếu',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'inbound' | 'outbound'>();
          const chipColor = value === 'inbound' ? 'info' : 'warning';
          const displayLabel = value === 'inbound' ? 'In' : 'Out';

          return (
            <Chip
              label={displayLabel}
              size="small"
              color={chipColor}
              variant="light"
              sx={{
                minWidth: 60,
                fontWeight: 600
              }}
            />
          );
        }
      },
      {
        accessorKey: 'weightDifference',
        header: 'Trọng lượng (kg)',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue, row }) => {
          const value = getValue<number | undefined>();
          // For display, show weightIn for inbound, weightOut for outbound, or weightDifference
          let displayWeight: number | undefined;
          if (row.original.type === 'inbound') {
            displayWeight = row.original.weightIn;
          } else if (row.original.type === 'outbound') {
            displayWeight = row.original.weightOut;
          } else {
            displayWeight = value;
          }
          return (
            <Typography align="right" variant="body2">
              {displayWeight ? displayWeight.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
            </Typography>
          );
        },
        meta: {
          align: 'right' as const
        }
      },
      {
        accessorKey: 'weighedAt',
        header: 'Thời gian',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<Date | string | undefined>();
          if (!value) return <Typography variant="body2">-</Typography>;
          return <Typography variant="body2">{dateHelper.formatDateTime(value)}</Typography>;
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
          const weighTicket = row.original;
          return (
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(weighTicket.id);
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
                    handleEdit(weighTicket.id);
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
                      onDelete(weighTicket);
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
    [onDelete, handleEdit, handleView]
  );
}

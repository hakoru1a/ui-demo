// ==============================|| SHIPMENT TABLE COLUMNS ||============================== //

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

import { SHIPMENT_URLS, SHIPMENT_STATUS_OPTIONS, SHIPMENT_TYPE_OPTIONS } from '../types/constants';
import type { Shipment } from '../types/index';

/**
 * Shipment Table Columns Definition
 */
interface UseShipmentColumnsProps {
  onDelete?: (shipment: Shipment) => void;
}

export function useShipmentColumns({ onDelete }: UseShipmentColumnsProps = {}): ColumnDef<Shipment>[] {
  const navigate = useNavigate();

  const handleView = useCallback(
    (id: string) => {
      navigate(SHIPMENT_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (id: string) => {
      navigate(SHIPMENT_URLS.EDIT(id));
    },
    [navigate]
  );

  const getLabelFromOptions = (value: string, options: Array<{ value: string; label: string }>): string => {
    return options.find((opt) => opt.value === value)?.label || value;
  };

  return useMemo<ColumnDef<Shipment>[]>(
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
        accessorKey: 'issueDate',
        header: 'Ngày xuất',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<Date | string>();
          return <Typography variant="body2">{dateHelper.formatDate(value, 'DD/MM/YYYY')}</Typography>;
        }
      },
      {
        accessorKey: 'issueType',
        header: 'Loại xuất',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'warehouse' | 'port'>();
          const label = getLabelFromOptions(value, SHIPMENT_TYPE_OPTIONS);
          const chipColor = value === 'warehouse' ? 'primary' : 'info';
          return <Chip label={label} size="small" color={chipColor} variant="light" sx={{ minWidth: 80 }} />;
        }
      },
      {
        accessorKey: 'warehouseName',
        header: 'Kho xuất',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => <Typography variant="body2">{getValue<string>()}</Typography>
      },
      {
        accessorKey: 'destinationName',
        header: 'Điểm nhận',
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
          const value = getValue<'draft' | 'issued' | 'cancelled'>();
          const label = getLabelFromOptions(value, SHIPMENT_STATUS_OPTIONS);
          let chipColor: 'default' | 'primary' | 'success' | 'error' | 'warning' | 'info' = 'default';
          if (value === 'issued') chipColor = 'success';
          else if (value === 'cancelled') chipColor = 'error';
          else if (value === 'draft') chipColor = 'warning';

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
          const shipment = row.original;
          const canDelete = shipment.status === 'draft';
          return (
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(shipment.id);
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
                    handleEdit(shipment.id);
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
                <Tooltip title={canDelete ? 'Xóa' : 'Không thể xóa phiếu đã xuất hoặc đã hủy'}>
                  <span>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(shipment);
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
    [onDelete, handleEdit, handleView]
  );
}

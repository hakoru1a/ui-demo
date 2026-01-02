// ==============================|| PRICE TABLE COLUMNS ||============================== //

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
import { STATUS_OPTIONS, StatusFilter } from 'types/status';
import dateHelper from 'utils/dateHelper';
import { getStatusColorMap } from 'utils/getStatusColor';

import type { PriceTable } from '../types';
import { PRICE_TABLE_URLS, MATERIAL_TYPE_OPTIONS } from '../types/constants';

/**
 * Price Table Columns Definition
 */
interface UsePriceTableColumnsProps {
  onDelete?: (priceTable: PriceTable) => void;
}

export function usePriceTableColumns({ onDelete }: UsePriceTableColumnsProps = {}): ColumnDef<PriceTable>[] {
  const theme = useTheme();
  const navigate = useNavigate();
  const statusColorMap = getStatusColorMap(theme);

  const handleView = useCallback(
    (id: string) => {
      navigate(PRICE_TABLE_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (id: string) => {
      navigate(PRICE_TABLE_URLS.EDIT(id));
    },
    [navigate]
  );

  const getLabelFromOptions = (value: string, options: Array<{ value: string; label: string }>): string => {
    return options.find((opt) => opt.value === value)?.label || value;
  };

  return useMemo<ColumnDef<PriceTable>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã bảng giá',
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
        header: 'Tên bảng giá',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => <Typography variant="body2">{getValue<string>()}</Typography>
      },
      {
        accessorKey: 'materialType',
        header: 'Loại nguyên liệu',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'keo' | 'tram' | 'other'>();
          const label = getLabelFromOptions(value, MATERIAL_TYPE_OPTIONS);
          return <Typography variant="body2">{label}</Typography>;
        }
      },
      {
        accessorKey: 'basePrice',
        header: 'Đơn giá cơ bản (VNĐ/kg)',
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
        accessorKey: 'effectiveFrom',
        header: 'Hiệu lực từ ngày',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<Date | string>();
          return <Typography variant="body2">{dateHelper.formatDate(value)}</Typography>;
        }
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'active' | 'inactive'>();
          const label = getLabelFromOptions(value, STATUS_OPTIONS);
          const statusFilter = value === 'active' ? StatusFilter.ACTIVE : StatusFilter.INACTIVE;
          const chipColor = value === 'active' ? 'success' : 'error';

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
          const priceTable = row.original;
          return (
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(priceTable.id);
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
                    handleEdit(priceTable.id);
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
                      onDelete(priceTable);
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
    [statusColorMap, onDelete, handleEdit, handleView]
  );
}

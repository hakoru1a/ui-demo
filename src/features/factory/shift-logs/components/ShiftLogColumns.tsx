// ==============================|| SHIFT LOG TABLE COLUMNS ||============================== //

import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import { IconButton, Stack, Tooltip } from '@mui/material';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { type ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// types
import type { ShiftLog } from '../types';
import { SHIFT_LOG_URLS, SHIFT_LOG_STATUS_OPTIONS } from '../types/constants';

/**
 * Shift Log Table Columns Definition
 */
interface UseShiftLogColumnsProps {
  onDelete?: (shiftLog: ShiftLog) => void;
}

export function useShiftLogColumns({ onDelete }: UseShiftLogColumnsProps = {}): ColumnDef<ShiftLog>[] {
  const navigate = useNavigate();

  const handleView = useCallback(
    (id: string) => {
      navigate(SHIFT_LOG_URLS.DETAIL(id));
    },
    [navigate]
  );

  const getLabelFromOptions = useCallback((value: string, options: { value: string; label: string }[]) => {
    return options.find((opt) => opt.value === value)?.label || value;
  }, []);

  return useMemo<ColumnDef<ShiftLog>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã ca',
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
        accessorKey: 'batchCode',
        header: 'Lô sản xuất',
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
        accessorKey: 'shiftTime',
        header: 'Thời gian ca',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => <Typography variant="body2">{getValue<string>()}</Typography>
      },
      {
        accessorKey: 'outputQuantity',
        header: 'Sản lượng ca',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<number>();
          return (
            <Typography align="right" variant="body2">
              {value.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </Typography>
          );
        },
        meta: {
          align: 'right' as const
        }
      },
      {
        accessorKey: 'hasIncident',
        header: 'Sự cố',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<boolean>();
          return (
            <Chip
              label={value ? 'Có' : 'Không'}
              size="small"
              color={value ? 'error' : 'success'}
              variant="light"
              sx={{
                minWidth: 80
              }}
            />
          );
        }
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'running' | 'completed'>();
          const label = getLabelFromOptions(value, SHIFT_LOG_STATUS_OPTIONS);
          const chipColor = value === 'running' ? 'info' : 'success';

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
          const shiftLog = row.original;
          return (
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(shiftLog.id);
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
                      onDelete(shiftLog);
                    }}
                    disabled={shiftLog.status === 'running'}
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
    [onDelete, handleView, getLabelFromOptions]
  );
}

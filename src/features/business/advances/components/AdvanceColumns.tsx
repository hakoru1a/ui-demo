// ==============================|| ADVANCE TABLE COLUMNS ||============================== //

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

import type { Advance } from '../types';
import { ADVANCE_URLS, STATUS_OPTIONS } from '../types/constants';
import { getLabelFromOptions } from '../utils';

/**
 * Advance Table Columns Definition
 */
interface UseAdvanceColumnsProps {
  onEdit?: (advance: Advance) => void;
  onDelete?: (advance: Advance) => void;
}

export function useAdvanceColumns({ onEdit, onDelete }: UseAdvanceColumnsProps = {}): ColumnDef<Advance>[] {
  const theme = useTheme();
  const navigate = useNavigate();
  const statusColorMap = getStatusColorMap(theme);

  const handleView = useCallback(
    (id: string) => {
      navigate(ADVANCE_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (advance: Advance) => {
      if (onEdit) {
        onEdit(advance);
      } else {
        navigate(ADVANCE_URLS.EDIT(advance.id));
      }
    },
    [navigate, onEdit]
  );

  const handleDelete = useCallback(
    (advance: Advance) => {
      if (onDelete) {
        onDelete(advance);
      }
    },
    [onDelete]
  );

  return useMemo<ColumnDef<Advance>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã tạm ứng',
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
        accessorKey: 'requesterName',
        header: 'Người đề nghị',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => <Typography variant="body2">{getValue<string>()}</Typography>
      },
      {
        accessorKey: 'requestedDate',
        header: 'Ngày đề nghị',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const date = getValue<Date | string>();
          return <Typography variant="body2">{date ? dateHelper.formatDate(date, 'DD/MM/YYYY') : '-'}</Typography>;
        }
      },
      {
        accessorKey: 'requestedAmount',
        header: 'Số tiền',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<number>();
          return (
            <Typography align="right" variant="body2">
              {value ? `${value.toLocaleString('vi-VN')} VND` : '-'}
            </Typography>
          );
        },
        meta: {
          align: 'right' as const
        }
      },
      {
        accessorKey: 'purpose',
        header: 'Mục đích',
        enableSorting: false,
        enableColumnFilter: true,
        cell: ({ getValue }) => <Typography variant="body2">{getValue<string>()}</Typography>
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'pending' | 'approved' | 'rejected'>();
          const label = getLabelFromOptions(value, STATUS_OPTIONS);
          let chipColor: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default';
          let statusFilter = StatusFilter.INACTIVE;

          if (value === 'approved') {
            chipColor = 'success';
            statusFilter = StatusFilter.ACTIVE;
          } else if (value === 'pending') {
            chipColor = 'warning';
            statusFilter = StatusFilter.INACTIVE;
          } else if (value === 'rejected') {
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
          const advance = row.original;
          const canDelete = advance.status === 'pending'; // Only pending advances can be deleted
          return (
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(advance.id);
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
                    handleEdit(advance);
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
                <Tooltip title={canDelete ? 'Xóa' : 'Chỉ có thể xóa phiếu ở trạng thái Chờ duyệt'}>
                  <span>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (canDelete) {
                          handleDelete(advance);
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

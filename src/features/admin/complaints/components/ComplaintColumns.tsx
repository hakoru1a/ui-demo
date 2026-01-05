// ==============================|| COMPLAINT TABLE COLUMNS ||============================== //

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
import dateHelper from 'utils/dateHelper';
import { getStatusColorMap } from 'utils/getStatusColor';

import type { Complaint } from '../types';
import { COMPLAINT_URLS, COMPLAINT_TYPE_OPTIONS, COMPLAINT_STATUS_OPTIONS } from '../types/constants';

/**
 * Helper function to get label from options
 */
function getLabelFromOptions<T extends string>(value: T, options: { value: T; label: string }[]): string {
  return options.find((opt) => opt.value === value)?.label || value;
}

/**
 * Complaint Table Columns Definition
 */
interface UseComplaintColumnsProps {
  onEdit?: (complaint: Complaint) => void;
  onDelete?: (complaint: Complaint) => void;
}

export function useComplaintColumns({ onEdit, onDelete }: UseComplaintColumnsProps = {}): ColumnDef<Complaint>[] {
  const theme = useTheme();
  const navigate = useNavigate();
  const statusColorMap = getStatusColorMap(theme);

  const handleView = useCallback(
    (id: string) => {
      navigate(COMPLAINT_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (complaint: Complaint) => {
      if (onEdit) {
        onEdit(complaint);
      } else {
        navigate(COMPLAINT_URLS.EDIT(complaint.id));
      }
    },
    [navigate, onEdit]
  );

  const handleDelete = useCallback(
    (complaint: Complaint) => {
      if (onDelete) {
        onDelete(complaint);
      }
    },
    [onDelete]
  );

  return useMemo<ColumnDef<Complaint>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã khiếu nại',
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
        accessorKey: 'sender',
        header: 'Người gửi',
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
        header: 'Loại khiếu nại',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'labor' | 'production' | 'safety'>();
          const label = getLabelFromOptions(value, COMPLAINT_TYPE_OPTIONS);
          let chipColor: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default';

          // Màu theo loại khiếu nại
          if (value === 'safety') {
            chipColor = 'error';
          } else if (value === 'labor') {
            chipColor = 'warning';
          } else if (value === 'production') {
            chipColor = 'primary';
          }

          return <Chip label={label} size="small" color={chipColor} variant="light" sx={{ minWidth: 80 }} />;
        }
      },
      {
        accessorKey: 'receivedDate',
        header: 'Ngày tiếp nhận',
        enableSorting: true,
        enableColumnFilter: false,
        cell: ({ getValue }) => {
          const value = getValue<Date | string>();
          return <Typography variant="body2">{value ? dateHelper.formatDate(value, 'DD/MM/YYYY') : '-'}</Typography>;
        }
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'new' | 'processing' | 'resolved'>();
          const label = getLabelFromOptions(value, COMPLAINT_STATUS_OPTIONS);
          let chipColor: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default';

          // Màu khác nhau theo trạng thái
          if (value === 'new') {
            chipColor = 'default';
          } else if (value === 'processing') {
            chipColor = 'warning';
          } else if (value === 'resolved') {
            chipColor = 'success';
          }

          return (
            <Chip
              label={label}
              size="small"
              color={chipColor}
              variant="light"
              sx={{
                minWidth: 100,
                color:
                  chipColor === 'default'
                    ? statusColorMap.default
                    : chipColor === 'warning'
                      ? statusColorMap.warning
                      : statusColorMap.success,
                borderColor:
                  chipColor === 'default'
                    ? statusColorMap.default
                    : chipColor === 'warning'
                      ? statusColorMap.warning
                      : statusColorMap.success
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
          const complaint = row.original;
          return (
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(complaint.id);
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
                    handleEdit(complaint);
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
                      handleDelete(complaint);
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

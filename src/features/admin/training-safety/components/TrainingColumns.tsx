// ==============================|| TRAINING TABLE COLUMNS ||============================== //

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

import type { Training } from '../types';
import { TRAINING_URLS, TRAINING_TYPE_OPTIONS, TRAINING_STATUS_OPTIONS, DEPARTMENT_OPTIONS } from '../types/constants';

/**
 * Helper function to get label from options
 */
function getLabelFromOptions<T extends string>(value: T, options: { value: T; label: string }[]): string {
  return options.find((opt) => opt.value === value)?.label || value;
}

/**
 * Training Table Columns Definition
 */
interface UseTrainingColumnsProps {
  onEdit?: (training: Training) => void;
  onDelete?: (training: Training) => void;
}

export function useTrainingColumns({ onEdit, onDelete }: UseTrainingColumnsProps = {}): ColumnDef<Training>[] {
  const theme = useTheme();
  const navigate = useNavigate();
  const statusColorMap = getStatusColorMap(theme);

  const handleView = useCallback(
    (id: string) => {
      navigate(TRAINING_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (training: Training) => {
      if (onEdit) {
        onEdit(training);
      } else {
        navigate(TRAINING_URLS.EDIT(training.id));
      }
    },
    [navigate, onEdit]
  );

  const handleDelete = useCallback(
    (training: Training) => {
      if (onDelete) {
        onDelete(training);
      }
    },
    [onDelete]
  );

  return useMemo<ColumnDef<Training>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Tên khóa',
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
        header: 'Loại đào tạo',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'skill' | 'safety'>();
          const label = getLabelFromOptions(value, TRAINING_TYPE_OPTIONS);
          let chipColor: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default';

          // Màu theo loại đào tạo
          if (value === 'safety') {
            chipColor = 'error';
          } else if (value === 'skill') {
            chipColor = 'primary';
          }

          return <Chip label={label} size="small" color={chipColor} variant="light" sx={{ minWidth: 80 }} />;
        }
      },
      {
        accessorKey: 'department',
        header: 'Bộ phận tham gia',
        enableSorting: false,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'production' | 'warehouse' | 'qc' | 'hr' | 'admin'>();
          const label = getLabelFromOptions(value, DEPARTMENT_OPTIONS);
          return <Typography variant="body2">{label}</Typography>;
        }
      },
      {
        accessorKey: 'startDate',
        header: 'Ngày bắt đầu',
        enableSorting: true,
        enableColumnFilter: false,
        cell: ({ getValue }) => {
          const value = getValue<Date | string>();
          return <Typography variant="body2">{value ? dateHelper.formatDate(value, 'DD/MM/YYYY') : '-'}</Typography>;
        }
      },
      {
        accessorKey: 'endDate',
        header: 'Ngày kết thúc',
        enableSorting: true,
        enableColumnFilter: false,
        cell: ({ getValue }) => {
          const value = getValue<Date | string>();
          return <Typography variant="body2">{value ? dateHelper.formatDate(value, 'DD/MM/YYYY') : '-'}</Typography>;
        }
      },
      {
        accessorKey: 'participantCount',
        header: 'Số người tham gia',
        enableSorting: true,
        enableColumnFilter: false,
        cell: ({ getValue }) => {
          const value = getValue<number>();
          return <Typography variant="body2">{value ?? 0}</Typography>;
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
          const value = getValue<'open' | 'completed' | 'cancelled'>();
          const label = getLabelFromOptions(value, TRAINING_STATUS_OPTIONS);
          let chipColor: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default';

          // Màu khác nhau theo trạng thái
          if (value === 'open') {
            chipColor = 'primary';
          } else if (value === 'completed') {
            chipColor = 'success';
          } else if (value === 'cancelled') {
            chipColor = 'error';
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
                  chipColor === 'primary'
                    ? statusColorMap.primary
                    : chipColor === 'success'
                      ? statusColorMap.success
                      : statusColorMap.error,
                borderColor:
                  chipColor === 'primary' ? statusColorMap.primary : chipColor === 'success' ? statusColorMap.success : statusColorMap.error
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
          const training = row.original;
          return (
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(training.id);
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
                    handleEdit(training);
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
                      handleDelete(training);
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

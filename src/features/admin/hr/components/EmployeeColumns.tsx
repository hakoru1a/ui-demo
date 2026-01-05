// ==============================|| EMPLOYEE TABLE COLUMNS ||============================== //

import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import { IconButton, Stack, Tooltip } from '@mui/material';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { type ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// types
import { StatusFilter } from 'types/status';
import dateHelper from 'utils/dateHelper';
import { getStatusColorMap } from 'utils/getStatusColor';

import type { Employee } from '../types';
import { EMPLOYEE_URLS, DEPARTMENT_OPTIONS, CONTRACT_TYPE_OPTIONS, STATUS_OPTIONS, CONTRACT_EXPIRY_WARNING_DAYS } from '../types/constants';

/**
 * Helper function to get label from options
 */
function getLabelFromOptions<T extends string>(value: T, options: { value: T; label: string }[]): string {
  return options.find((opt) => opt.value === value)?.label || value;
}

/**
 * Check if contract is expiring soon
 */
function isContractExpiringSoon(expiryDate: Date | string): boolean {
  const expiry = dayjs(expiryDate);
  const now = dayjs();
  const daysUntilExpiry = expiry.diff(now, 'day');
  return daysUntilExpiry >= 0 && daysUntilExpiry <= CONTRACT_EXPIRY_WARNING_DAYS;
}

/**
 * Employee Table Columns Definition
 */
interface UseEmployeeColumnsProps {
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
}

export function useEmployeeColumns({ onEdit, onDelete }: UseEmployeeColumnsProps = {}): ColumnDef<Employee>[] {
  const theme = useTheme();
  const navigate = useNavigate();
  const statusColorMap = getStatusColorMap(theme);

  const handleView = useCallback(
    (id: string) => {
      navigate(EMPLOYEE_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (employee: Employee) => {
      if (onEdit) {
        onEdit(employee);
      } else {
        navigate(EMPLOYEE_URLS.EDIT(employee.id));
      }
    },
    [navigate, onEdit]
  );

  const handleDelete = useCallback(
    (employee: Employee) => {
      if (onDelete) {
        onDelete(employee);
      }
    },
    [onDelete]
  );

  return useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã nhân sự',
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
        accessorKey: 'fullName',
        header: 'Họ & Tên',
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
        accessorKey: 'department',
        header: 'Bộ phận',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'production' | 'warehouse' | 'qc'>();
          const label = getLabelFromOptions(value, DEPARTMENT_OPTIONS);
          let chipColor: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default';

          // Màu theo bộ phận
          if (value === 'production') {
            chipColor = 'primary';
          } else if (value === 'warehouse') {
            chipColor = 'success';
          } else if (value === 'qc') {
            chipColor = 'warning';
          }

          return <Chip label={label} size="small" color={chipColor} variant="light" sx={{ minWidth: 80 }} />;
        }
      },
      {
        accessorKey: 'position',
        header: 'Chức danh',
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ getValue }) => <Typography variant="body2">{getValue<string>()}</Typography>
      },
      {
        accessorKey: 'contractType',
        header: 'Loại hợp đồng',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'probation' | 'temporary' | 'permanent'>();
          const label = getLabelFromOptions(value, CONTRACT_TYPE_OPTIONS);
          let chipColor: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default';

          if (value === 'permanent') {
            chipColor = 'success';
          } else if (value === 'temporary') {
            chipColor = 'warning';
          } else {
            chipColor = 'default';
          }

          return <Chip label={label} size="small" color={chipColor} variant="light" sx={{ minWidth: 80 }} />;
        }
      },
      {
        accessorKey: 'effectiveDate',
        header: 'Ngày hiệu lực',
        enableSorting: true,
        enableColumnFilter: false,
        cell: ({ getValue }) => {
          const value = getValue<Date | string>();
          return <Typography variant="body2">{value ? dateHelper.formatDate(value, 'DD/MM/YYYY') : '-'}</Typography>;
        }
      },
      {
        accessorKey: 'expiryDate',
        header: 'Ngày hết hạn',
        enableSorting: true,
        enableColumnFilter: false,
        cell: ({ getValue }) => {
          const value = getValue<Date | string>();
          const isExpiringSoon = value ? isContractExpiringSoon(value) : false;
          return (
            <Typography
              variant="body2"
              sx={{
                color: isExpiringSoon ? 'error.main' : 'text.primary',
                fontWeight: isExpiringSoon ? 600 : 'normal'
              }}
            >
              {value ? dateHelper.formatDate(value, 'DD/MM/YYYY') : '-'}
            </Typography>
          );
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
          let chipColor: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default';
          let statusFilter = StatusFilter.INACTIVE;

          if (value === 'active') {
            chipColor = 'success';
            statusFilter = StatusFilter.ACTIVE;
          } else {
            chipColor = 'default';
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
          const employee = row.original;
          return (
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(employee.id);
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
                    handleEdit(employee);
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
                      handleDelete(employee);
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

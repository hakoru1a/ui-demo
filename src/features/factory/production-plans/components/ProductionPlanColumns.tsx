// ==============================|| PRODUCTION PLAN TABLE COLUMNS ||============================== //

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

import dateHelper from 'utils/dateHelper';

import type { ProductionPlan } from '../types';
import { PLAN_TYPE_OPTIONS, PLAN_STATUS_OPTIONS, PRODUCTION_PLAN_URLS } from '../types/constants';

/**
 * Production Plan Table Columns Definition
 */
interface UseProductionPlanColumnsProps {
  onDelete?: (plan: ProductionPlan) => void;
}

const getLabelFromOptions = <T extends string>(value: T, options: { value: T; label: string }[]): string => {
  return options.find((opt) => opt.value === value)?.label || value;
};

export function useProductionPlanColumns({ onDelete }: UseProductionPlanColumnsProps = {}): ColumnDef<ProductionPlan>[] {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleView = useCallback(
    (id: string) => {
      navigate(PRODUCTION_PLAN_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (id: string) => {
      navigate(PRODUCTION_PLAN_URLS.EDIT(id));
    },
    [navigate]
  );

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return theme.palette.warning.main;
      case 'in-progress':
        return theme.palette.info.main;
      case 'completed':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[600];
    }
  };

  return useMemo<ColumnDef<ProductionPlan>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã',
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
        header: 'Loại',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'plan' | 'order'>();
          const label = getLabelFromOptions(value, PLAN_TYPE_OPTIONS);
          const color = value === 'plan' ? 'primary' : 'secondary';
          return <Chip label={label} size="small" color={color} variant="light" sx={{ minWidth: 100 }} />;
        }
      },
      {
        accessorKey: 'productName',
        header: 'Sản phẩm',
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
        accessorKey: 'plannedQuantity',
        header: 'Sản lượng dự kiến',
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
        id: 'timeRange',
        header: 'Thời gian',
        enableSorting: true,
        enableColumnFilter: false,
        accessorFn: (row) => `${row.startDate}-${row.endDate}`,
        cell: ({ row }) => {
          const startDate = dateHelper.formatDate(row.original.startDate);
          const endDate = dateHelper.formatDate(row.original.endDate);
          return <Typography variant="body2">{`${startDate} - ${endDate}`}</Typography>;
        }
      },
      {
        accessorKey: 'estimatedCost',
        header: 'Chi phí ước tính',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<number | undefined>();
          return (
            <Typography align="right" variant="body2">
              {value ? value.toLocaleString('vi-VN') + ' đ' : '-'}
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
          const value = getValue<'draft' | 'in-progress' | 'completed'>();
          const label = getLabelFromOptions(value, PLAN_STATUS_OPTIONS);
          const statusColor = getStatusColor(value);
          const chipColor = value === 'completed' ? 'success' : value === 'in-progress' ? 'info' : 'warning';

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
          const plan = row.original;
          const canDelete = plan.status === 'draft';
          return (
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(plan.id);
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
                    handleEdit(plan.id);
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
                <Tooltip title={canDelete ? 'Xóa' : 'Chỉ có thể xóa khi trạng thái là Nháp'}>
                  <span>
                    <IconButton
                      size="small"
                      color="error"
                      disabled={!canDelete}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (canDelete) {
                          onDelete(plan);
                        }
                      }}
                      sx={{
                        '&:hover': {
                          bgcolor: 'error.lighter'
                        },
                        '&.Mui-disabled': {
                          opacity: 0.5
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
    [onDelete, handleEdit, handleView, getStatusColor]
  );
}

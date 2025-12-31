// ==============================|| LOGISTICS COST TABLE COLUMNS ||============================== //

import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import { IconButton, Stack, Tooltip, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { type ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// types
import dateHelper from 'utils/dateHelper';

import type { LogisticsCost } from '../types';
import { LOGISTICS_COSTING_URLS, COST_TYPE_OPTIONS, SERVICE_CATEGORY_OPTIONS, STATUS_OPTIONS } from '../types/constants';

/**
 * Logistics Cost Table Columns Definition
 */
interface UseLogisticsCostColumnsProps {
  onEdit?: (cost: LogisticsCost) => void;
  onDelete?: (cost: LogisticsCost) => void;
}

export function useLogisticsCostColumns({ onEdit, onDelete }: UseLogisticsCostColumnsProps = {}): ColumnDef<LogisticsCost>[] {
  const theme = useTheme();
  const navigate = useNavigate();

  const getStatusColor = useCallback(
    (status: string) => {
      switch (status) {
        case 'draft':
          return theme.palette.grey[600];
        case 'recorded':
          return theme.palette.success.main;
        default:
          return theme.palette.primary.main;
      }
    },
    [theme]
  );

  const getCostTypeColor = useCallback(
    (costType: string) => {
      switch (costType) {
        case 'logistics':
          return theme.palette.info.main;
        case 'service':
          return theme.palette.warning.main;
        default:
          return theme.palette.primary.main;
      }
    },
    [theme]
  );

  const handleView = useCallback(
    (id: string) => {
      navigate(LOGISTICS_COSTING_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (cost: LogisticsCost) => {
      if (onEdit) {
        onEdit(cost);
      } else {
        navigate(LOGISTICS_COSTING_URLS.EDIT(cost.id));
      }
    },
    [navigate, onEdit]
  );

  const handleDelete = useCallback(
    (cost: LogisticsCost) => {
      if (onDelete) {
        onDelete(cost);
      }
    },
    [onDelete]
  );

  const getStatusLabel = (status: string) => {
    return STATUS_OPTIONS.find((opt) => opt.value === status)?.label || status;
  };

  const getCostTypeLabel = (costType: string) => {
    return COST_TYPE_OPTIONS.find((opt) => opt.value === costType)?.label || costType;
  };

  const getServiceCategoryLabel = (category: string | undefined) => {
    if (!category) return '-';
    return SERVICE_CATEGORY_OPTIONS.find((opt) => opt.value === category)?.label || category;
  };

  return useMemo<ColumnDef<LogisticsCost>[]>(
    () => [
      {
        accessorKey: 'costCode',
        header: 'Mã chi phí',
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
        accessorKey: 'costType',
        header: 'Loại chi phí',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const costType = getValue<string>();
          const color = getCostTypeColor(costType);
          return (
            <Chip
              label={getCostTypeLabel(costType)}
              size="small"
              sx={{
                bgcolor: color + '20',
                color: color,
                fontWeight: 600
              }}
            />
          );
        }
      },
      {
        accessorKey: 'serviceCategory',
        header: 'Nhóm dịch vụ',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const category = getValue<string | undefined>();
          return <Typography variant="body2">{getServiceCategoryLabel(category)}</Typography>;
        }
      },
      {
        accessorKey: 'partnerName',
        header: 'Đối tác',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => <Typography variant="body2">{getValue<string>() || '-'}</Typography>
      },
      {
        accessorKey: 'costDate',
        header: 'Ngày phát sinh',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const date = getValue<Date | string>();
          return date ? dateHelper.formatDate(date, 'DD/MM/YYYY') : '-';
        }
      },
      {
        accessorKey: 'amount',
        header: 'Số tiền',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue, row }) => {
          const value = getValue<number>();
          const currency = row.original.currency || 'VND';
          return `${value.toLocaleString('vi-VN')} ${currency}`;
        },
        meta: {
          align: 'right'
        }
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const status = getValue<string>();
          const color = getStatusColor(status);
          return (
            <Chip
              label={getStatusLabel(status)}
              size="small"
              sx={{
                bgcolor: color + '20',
                color: color,
                fontWeight: 600
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
        cell: ({ row }) => {
          const cost = row.original;
          return (
            <Stack direction="row" spacing={0.5} justifyContent="center">
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(cost.id);
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
                    handleEdit(cost);
                  }}
                >
                  <EditOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="Xóa">
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(cost);
                  }}
                >
                  <DeleteOutlined />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        },
        meta: {
          align: 'center'
        }
      }
    ],
    [handleView, handleEdit, handleDelete, getStatusColor, getCostTypeColor]
  );
}

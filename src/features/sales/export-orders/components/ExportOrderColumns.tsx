// ==============================|| EXPORT ORDER TABLE COLUMNS ||============================== //

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

import type { ExportOrder } from '../types';
import { EXPORT_ORDER_URLS, EXPORT_ORDER_STATUS_OPTIONS, INCOTERMS_OPTIONS } from '../types/constants';

/**
 * Export Order Table Columns Definition
 */
interface UseExportOrderColumnsProps {
  onEdit?: (order: ExportOrder) => void;
  onDelete?: (order: ExportOrder) => void;
}

export function useExportOrderColumns({ onEdit, onDelete }: UseExportOrderColumnsProps = {}): ColumnDef<ExportOrder>[] {
  const theme = useTheme();
  const navigate = useNavigate();

  const getStatusColor = useCallback(
    (status: string) => {
      switch (status) {
        case 'draft':
          return theme.palette.grey[600];
        case 'confirmed':
          return theme.palette.info.main;
        case 'delivering':
          return theme.palette.warning.main;
        case 'completed':
          return theme.palette.success.main;
        default:
          return theme.palette.primary.main;
      }
    },
    [theme]
  );

  const handleView = useCallback(
    (id: string) => {
      navigate(EXPORT_ORDER_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (order: ExportOrder) => {
      if (onEdit) {
        onEdit(order);
      } else {
        navigate(EXPORT_ORDER_URLS.EDIT(order.id));
      }
    },
    [navigate, onEdit]
  );

  const handleDelete = useCallback(
    (order: ExportOrder) => {
      if (onDelete) {
        onDelete(order);
      }
    },
    [onDelete]
  );

  const getStatusLabel = (status: string) => {
    return EXPORT_ORDER_STATUS_OPTIONS.find((opt) => opt.value === status)?.label || status;
  };

  const getIncotermsLabel = (incoterms: string) => {
    return INCOTERMS_OPTIONS.find((opt) => opt.value === incoterms)?.label || incoterms;
  };

  return useMemo<ColumnDef<ExportOrder>[]>(
    () => [
      {
        accessorKey: 'orderNo',
        header: 'Mã đơn hàng',
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
        accessorKey: 'orderDate',
        header: 'Ngày đơn',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const date = getValue<Date | string>();
          return date ? dateHelper.formatDate(date, 'DD/MM/YYYY') : '-';
        }
      },
      {
        accessorKey: 'customerName',
        header: 'Khách hàng',
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
            {getValue<string>() || '-'}
          </Typography>
        )
      },
      {
        accessorKey: 'country',
        header: 'Quốc gia',
        enableSorting: true,
        enableColumnFilter: true
      },
      {
        accessorKey: 'totalValue',
        header: 'Tổng giá trị',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue, row }) => {
          const value = getValue<number>();
          const currency = row.original.currency || 'USD';
          return `${value.toLocaleString('vi-VN')} ${currency}`;
        },
        meta: {
          align: 'right'
        }
      },
      {
        accessorKey: 'incoterms',
        header: 'Incoterms',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const incoterms = getValue<string>();
          return (
            <Chip
              label={getIncotermsLabel(incoterms)}
              size="small"
              sx={{
                bgcolor: theme.palette.primary.light,
                color: theme.palette.primary.dark,
                fontWeight: 600
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
          const order = row.original;
          return (
            <Stack direction="row" spacing={0.5} justifyContent="center">
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(order.id);
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
                    handleEdit(order);
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
                    handleDelete(order);
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
    [handleView, handleEdit, handleDelete, theme, getStatusColor]
  );
}

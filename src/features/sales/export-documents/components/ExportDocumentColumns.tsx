// ==============================|| EXPORT DOCUMENT TABLE COLUMNS ||============================== //

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

import type { ExportDocument } from '../types';
import { EXPORT_DOCUMENT_URLS, DOCUMENT_TYPE_OPTIONS, DOCUMENT_STATUS_OPTIONS } from '../types/constants';

/**
 * Export Document Table Columns Definition
 */
interface UseExportDocumentColumnsProps {
  onEdit?: (document: ExportDocument) => void;
  onDelete?: (document: ExportDocument) => void;
}

export function useExportDocumentColumns({ onEdit, onDelete }: UseExportDocumentColumnsProps = {}): ColumnDef<ExportDocument>[] {
  const theme = useTheme();
  const navigate = useNavigate();

  const getStatusColor = useCallback(
    (status: string) => {
      switch (status) {
        case 'draft':
          return theme.palette.grey[600];
        case 'issued':
          return theme.palette.success.main;
        default:
          return theme.palette.primary.main;
      }
    },
    [theme]
  );

  const getTypeColor = useCallback(
    (type: string) => {
      switch (type) {
        case 'invoice':
          return theme.palette.info.main;
        case 'packing-list':
          return theme.palette.warning.main;
        default:
          return theme.palette.primary.main;
      }
    },
    [theme]
  );

  const handleView = useCallback(
    (id: string) => {
      navigate(EXPORT_DOCUMENT_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (document: ExportDocument) => {
      if (onEdit) {
        onEdit(document);
      } else {
        navigate(EXPORT_DOCUMENT_URLS.EDIT(document.id));
      }
    },
    [navigate, onEdit]
  );

  const handleDelete = useCallback(
    (document: ExportDocument) => {
      if (onDelete) {
        onDelete(document);
      }
    },
    [onDelete]
  );

  const getStatusLabel = (status: string) => {
    return DOCUMENT_STATUS_OPTIONS.find((opt) => opt.value === status)?.label || status;
  };

  const getTypeLabel = (type: string) => {
    return DOCUMENT_TYPE_OPTIONS.find((opt) => opt.value === type)?.label || type;
  };

  return useMemo<ColumnDef<ExportDocument>[]>(
    () => [
      {
        accessorKey: 'documentNo',
        header: 'Mã chứng từ',
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
        accessorKey: 'documentType',
        header: 'Loại chứng từ',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const type = getValue<string>();
          const color = getTypeColor(type);
          return (
            <Chip
              label={getTypeLabel(type)}
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
        accessorKey: 'exportOrderNo',
        header: 'Đơn hàng XK',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => getValue<string>() || '-'
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
        accessorKey: 'invoiceDate',
        header: 'Ngày hóa đơn',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const date = getValue<Date | string>();
          return date ? dateHelper.formatDate(date, 'DD/MM/YYYY') : '-';
        }
      },
      {
        accessorKey: 'totalAmount',
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
        accessorKey: 'packageCount',
        header: 'Số kiện',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const count = getValue<number | undefined>();
          return count ? count.toString() : '-';
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
          const document = row.original;
          return (
            <Stack direction="row" spacing={0.5} justifyContent="center">
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(document.id);
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
                    handleEdit(document);
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
                    handleDelete(document);
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
    [handleView, handleEdit, handleDelete, getStatusColor, getTypeColor]
  );
}

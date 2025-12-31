// ==============================|| CUSTOMER TABLE COLUMNS ||============================== //

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
import type { Customer } from '../types';
import { CUSTOMER_URLS, CUSTOMER_STATUS_OPTIONS } from '../types/constants';

/**
 * Customer Table Columns Definition
 */
interface UseCustomerColumnsProps {
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
}

export function useCustomerColumns({ onEdit, onDelete }: UseCustomerColumnsProps = {}): ColumnDef<Customer>[] {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleView = useCallback(
    (id: string) => {
      navigate(CUSTOMER_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (customer: Customer) => {
      if (onEdit) {
        onEdit(customer);
      } else {
        navigate(CUSTOMER_URLS.EDIT(customer.id));
      }
    },
    [navigate, onEdit]
  );

  const handleDelete = useCallback(
    (customer: Customer) => {
      if (onDelete) {
        onDelete(customer);
      }
    },
    [onDelete]
  );

  const getStatusLabel = (status: string) => {
    return CUSTOMER_STATUS_OPTIONS.find((opt) => opt.value === status)?.label || status;
  };

  return useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã KH',
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
        accessorKey: 'companyName',
        header: 'Tên công ty',
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
        accessorKey: 'country',
        header: 'Quốc gia',
        enableSorting: true,
        enableColumnFilter: true
      },
      {
        accessorKey: 'contactPerson',
        header: 'Người liên hệ',
        enableSorting: true,
        enableColumnFilter: true
      },
      {
        accessorKey: 'email',
        header: 'Email',
        enableSorting: true,
        enableColumnFilter: true
      },
      {
        accessorKey: 'currency',
        header: 'Tiền tệ',
        enableSorting: true,
        enableColumnFilter: true
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const status = getValue<string>();
          const isActive = status === 'active';
          const color = isActive ? theme.palette.success.main : theme.palette.error.main;
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
          const customer = row.original;
          return (
            <Stack direction="row" spacing={0.5} justifyContent="center">
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(customer.id);
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
                    handleEdit(customer);
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
                    handleDelete(customer);
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
    [handleView, handleEdit, handleDelete, theme]
  );
}

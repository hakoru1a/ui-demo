// ==============================|| WORKFORCE DISPATCH ORDER TABLE COLUMNS ||============================== //

import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import { IconButton, Stack, Tooltip } from '@mui/material';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { type ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// types
import dateHelper from 'utils/dateHelper';

import type { DispatchOrderStatus, WorkforceDispatchOrder } from '../types';
import { WORKFORCE_DISPATCH_URLS, STATUS_OPTIONS } from '../types/constants';

/**
 * Helper function to get label from options
 */
function getLabelFromOptions<T extends string>(value: T, options: { value: T; label: string }[]): string {
  return options.find((opt) => opt.value === value)?.label || value;
}

/**
 * Get chip color for dispatch order status (matches tab colors)
 */
function getStatusChipColor(status: DispatchOrderStatus): 'default' | 'warning' | 'success' {
  switch (status) {
    case 'draft':
      return 'default'; // Matches grey[600] tab color
    case 'approved':
      return 'warning'; // Matches warning.main tab color
    case 'applied':
      return 'success'; // Matches success.main tab color
    default:
      return 'default';
  }
}

/**
 * Workforce Dispatch Order Table Columns Definition
 */
interface UseWorkforceDispatchOrderColumnsProps {
  onEdit?: (order: WorkforceDispatchOrder) => void;
  onDelete?: (order: WorkforceDispatchOrder) => void;
}

export function useWorkforceDispatchOrderColumns({
  onEdit,
  onDelete
}: UseWorkforceDispatchOrderColumnsProps = {}): ColumnDef<WorkforceDispatchOrder>[] {
  const navigate = useNavigate();

  const handleView = useCallback(
    (id: string) => {
      navigate(WORKFORCE_DISPATCH_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (order: WorkforceDispatchOrder) => {
      if (onEdit) {
        onEdit(order);
      } else {
        navigate(WORKFORCE_DISPATCH_URLS.EDIT(order.id));
      }
    },
    [navigate, onEdit]
  );

  const handleDelete = useCallback(
    (order: WorkforceDispatchOrder) => {
      if (onDelete) {
        onDelete(order);
      }
    },
    [onDelete]
  );

  return useMemo<ColumnDef<WorkforceDispatchOrder>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã lệnh điều phối',
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
        accessorKey: 'applicationDate',
        header: 'Ngày áp dụng',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const date = getValue<Date | string>();
          return date ? dateHelper.formatDate(date) : '-';
        }
      },
      {
        accessorKey: 'factoryName',
        header: 'Nhà máy',
        enableSorting: true,
        enableColumnFilter: true
      },
      {
        accessorKey: 'productionShiftName',
        header: 'Ca sản xuất',
        enableSorting: true,
        enableColumnFilter: true
      },
      {
        accessorKey: 'departmentName',
        header: 'Bộ phận',
        enableSorting: true,
        enableColumnFilter: true
      },
      {
        accessorKey: 'personnel',
        header: 'Số lượng nhân sự',
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ getValue }) => {
          const personnel = getValue<WorkforceDispatchOrder['personnel']>();
          return personnel ? personnel.length : 0;
        }
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const status = getValue<WorkforceDispatchOrder['status']>();
          const label = getLabelFromOptions(status, STATUS_OPTIONS);
          const color = getStatusChipColor(status);
          return <Chip label={label} color={color} size="small" />;
        }
      },
      {
        id: 'actions',
        header: 'Thao tác',
        enableSorting: false,
        enableColumnFilter: false,
        meta: {
          align: 'center'
        },
        cell: ({ row }) => {
          const order = row.original;
          const canDelete = order.status === 'draft'; // Chỉ có thể xóa khi status là draft

          return (
            <Stack direction="row" spacing={0.5} justifyContent="center">
              <Tooltip title="Xem chi tiết">
                <IconButton
                  color="primary"
                  size="small"
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
                  color="primary"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(order);
                  }}
                >
                  <EditOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title={canDelete ? 'Xóa' : 'Không thể xóa lệnh đã duyệt/áp dụng'}>
                <span>
                  <IconButton
                    color="error"
                    size="small"
                    disabled={!canDelete}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(order);
                    }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    [handleView, handleEdit, handleDelete]
  );
}

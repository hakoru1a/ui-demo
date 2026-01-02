// ==============================|| PARTNER TABLE COLUMNS ||============================== //

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
import { getStatusColorMap } from 'utils/getStatusColor';

import type { Partner } from '../types';
import { PARTNER_URLS, PARTNER_TYPE_OPTIONS, STATUS_OPTIONS } from '../types/constants';
import { getLabelFromOptions } from '../utils';

/**
 * Partner Table Columns Definition
 */
interface UsePartnerColumnsProps {
  onEdit?: (partner: Partner) => void;
  onDelete?: (partner: Partner) => void;
}

export function usePartnerColumns({ onEdit, onDelete }: UsePartnerColumnsProps = {}): ColumnDef<Partner>[] {
  const theme = useTheme();
  const navigate = useNavigate();
  const statusColorMap = getStatusColorMap(theme);

  const handleView = useCallback(
    (id: string) => {
      navigate(PARTNER_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (partner: Partner) => {
      if (onEdit) {
        onEdit(partner);
      } else {
        navigate(PARTNER_URLS.EDIT(partner.id));
      }
    },
    [navigate, onEdit]
  );

  const handleDelete = useCallback(
    (partner: Partner) => {
      if (onDelete) {
        onDelete(partner);
      }
    },
    [onDelete]
  );

  return useMemo<ColumnDef<Partner>[]>(
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
        accessorKey: 'name',
        header: 'Tên khách hàng',
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
          const value = getValue<'individual' | 'business'>();
          const label = getLabelFromOptions(value, PARTNER_TYPE_OPTIONS);
          const chipColor = value === 'business' ? 'primary' : 'default';
          return <Chip label={label} size="small" color={chipColor} variant="light" sx={{ minWidth: 80 }} />;
        }
      },
      {
        accessorKey: 'phone',
        header: 'SĐT',
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
          const partner = row.original;
          return (
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(partner.id);
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
                    handleEdit(partner);
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
                      handleDelete(partner);
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

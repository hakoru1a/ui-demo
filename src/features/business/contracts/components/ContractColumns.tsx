// ==============================|| CONTRACT TABLE COLUMNS ||============================== //

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
import dateHelper from 'utils/dateHelper';
import { getStatusColorMap } from 'utils/getStatusColor';

import type { Contract } from '../types';
import { CONTRACT_URLS, CONTRACT_TYPE_OPTIONS, STATUS_OPTIONS } from '../types/constants';
import { getLabelFromOptions } from '../utils';

/**
 * Contract Table Columns Definition
 */
interface UseContractColumnsProps {
  onEdit?: (contract: Contract) => void;
  onDelete?: (contract: Contract) => void;
}

export function useContractColumns({ onEdit, onDelete }: UseContractColumnsProps = {}): ColumnDef<Contract>[] {
  const theme = useTheme();
  const navigate = useNavigate();
  const statusColorMap = getStatusColorMap(theme);

  const handleView = useCallback(
    (id: string) => {
      navigate(CONTRACT_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (contract: Contract) => {
      if (onEdit) {
        onEdit(contract);
      } else {
        navigate(CONTRACT_URLS.EDIT(contract.id));
      }
    },
    [navigate, onEdit]
  );

  const handleDelete = useCallback(
    (contract: Contract) => {
      if (onDelete) {
        onDelete(contract);
      }
    },
    [onDelete]
  );

  return useMemo<ColumnDef<Contract>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã hợp đồng',
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
        header: 'Loại hợp đồng',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'buy' | 'sell'>();
          const label = getLabelFromOptions(value, CONTRACT_TYPE_OPTIONS);
          const chipColor = value === 'buy' ? 'primary' : 'success';
          return <Chip label={label} size="small" color={chipColor} variant="light" sx={{ minWidth: 80 }} />;
        }
      },
      {
        accessorKey: 'partnerName',
        header: 'Đối tác',
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
        accessorKey: 'effectiveDate',
        header: 'Ngày hiệu lực',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const date = getValue<Date | string>();
          return <Typography variant="body2">{date ? dateHelper.formatDate(date, 'DD/MM/YYYY') : '-'}</Typography>;
        }
      },
      {
        accessorKey: 'expiryDate',
        header: 'Ngày hết hạn',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const date = getValue<Date | string>();
          return <Typography variant="body2">{date ? dateHelper.formatDate(date, 'DD/MM/YYYY') : '-'}</Typography>;
        }
      },
      {
        accessorKey: 'contractValue',
        header: 'Giá trị hợp đồng',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue, row }) => {
          const value = getValue<number | undefined>();
          const currency = row.original.currency || 'VND';
          return (
            <Typography align="right" variant="body2">
              {value ? `${value.toLocaleString('vi-VN')} ${currency}` : '-'}
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
          const value = getValue<'draft' | 'active' | 'expired' | 'cancelled'>();
          const label = getLabelFromOptions(value, STATUS_OPTIONS);
          let chipColor: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default';
          let statusFilter = StatusFilter.INACTIVE;

          if (value === 'active') {
            chipColor = 'success';
            statusFilter = StatusFilter.ACTIVE;
          } else if (value === 'draft') {
            chipColor = 'default';
            statusFilter = StatusFilter.ALL;
          } else if (value === 'expired') {
            chipColor = 'warning';
            statusFilter = StatusFilter.INACTIVE;
          } else if (value === 'cancelled') {
            chipColor = 'error';
            statusFilter = StatusFilter.INACTIVE;
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
          const contract = row.original;
          const canDelete = contract.status === 'draft'; // Only draft contracts can be deleted
          return (
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(contract.id);
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
                    handleEdit(contract);
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
                <Tooltip title={canDelete ? 'Xóa' : 'Chỉ có thể xóa hợp đồng ở trạng thái Nháp'}>
                  <span>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (canDelete) {
                          handleDelete(contract);
                        }
                      }}
                      disabled={!canDelete}
                      sx={{
                        '&:hover': {
                          bgcolor: 'error.lighter'
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
    [statusColorMap, onDelete, handleEdit, handleView, handleDelete]
  );
}

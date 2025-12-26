// ==============================|| FOREST AREA TABLE COLUMNS ||============================== //

import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import { IconButton, Stack, Tooltip } from '@mui/material';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

// assets

// types
import { STATUS_OPTIONS, StatusFilter } from 'types/status';
import { getStatusColorMap } from 'utils/getStatusColor';

import type { ForestArea } from '../types';
import { OWNERSHIP_TYPE_OPTIONS } from '../types/constants';
import { getLabelFromOptions } from '../utils';

/**
 * Forest Area Table Columns Definition
 */
interface UseForestAreaColumnsProps {
  onDisable?: (forestArea: ForestArea) => void;
}

export function useForestAreaColumns({ onDisable }: UseForestAreaColumnsProps = {}): ColumnDef<ForestArea>[] {
  const theme = useTheme();
  const statusColorMap = getStatusColorMap(theme);

  return useMemo<ColumnDef<ForestArea>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã vùng trồng',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => (
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {getValue<string>()}
          </Typography>
        )
      },
      {
        accessorKey: 'name',
        header: 'Tên vùng trồng',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => <Typography variant="body2">{getValue<string>()}</Typography>
      },
      {
        accessorKey: 'ownershipType',
        header: 'Loại sở hữu',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'company' | 'partner'>();
          const label = getLabelFromOptions(value, OWNERSHIP_TYPE_OPTIONS);
          return <Typography variant="body2">{label}</Typography>;
        }
      },
      {
        accessorKey: 'ownerName',
        header: 'Chủ sở hữu / Đối tác',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<string | undefined>();
          return <Typography variant="body2">{value || '-'}</Typography>;
        }
      },
      {
        accessorKey: 'area',
        header: 'Diện tích (ha)',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<number>();
          return (
            <Typography variant="body2">{value.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</Typography>
          );
        }
      },
      {
        accessorKey: 'province',
        header: 'Tỉnh / Khu vực',
        enableSorting: true,
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
          const statusFilter = value === 'active' ? StatusFilter.ACTIVE : StatusFilter.INACTIVE;
          const chipColor = value === 'active' ? 'success' : 'error';

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
        cell: ({ row }) => {
          const forestArea = row.original;

          return (
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              {onDisable && (
                <Tooltip title="Vô hiệu hóa">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDisable(forestArea);
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
    [statusColorMap, onDisable]
  );
}

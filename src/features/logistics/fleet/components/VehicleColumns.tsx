// ==============================|| VEHICLE TABLE COLUMNS ||============================== //

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
import { getStatusColorMap } from 'utils/getStatusColor';

import type { Vehicle } from '../types';
import { FLEET_URLS, VEHICLE_TYPE_OPTIONS, VEHICLE_STATUS_OPTIONS, DRIVER_STATUS_OPTIONS } from '../types/constants';

// Helper function to get label from options
const getLabelFromOptions = (value: string, options: Array<{ value: string; label: string }>): string => {
  return options.find((opt) => opt.value === value)?.label || value;
};

/**
 * Vehicle Table Columns Definition
 */
interface UseVehicleColumnsProps {
  onDisable?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
}

export function useVehicleColumns({ onDisable, onDelete }: UseVehicleColumnsProps = {}): ColumnDef<Vehicle>[] {
  const theme = useTheme();
  const navigate = useNavigate();
  const statusColorMap = getStatusColorMap(theme);

  const handleView = useCallback(
    (id: string) => {
      navigate(FLEET_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (id: string) => {
      navigate(FLEET_URLS.EDIT(id));
    },
    [navigate]
  );

  return useMemo<ColumnDef<Vehicle>[]>(
    () => [
      {
        accessorKey: 'licensePlate',
        header: 'Biển số xe',
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
        accessorKey: 'vehicleType',
        header: 'Loại xe',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'truck' | 'container'>();
          const label = getLabelFromOptions(value, VEHICLE_TYPE_OPTIONS);
          return <Chip label={label} size="small" color={value === 'truck' ? 'primary' : 'info'} variant="light" sx={{ minWidth: 80 }} />;
        }
      },
      {
        accessorKey: 'driverName',
        header: 'Tên tài xế',
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
        accessorKey: 'driverPhone',
        header: 'SĐT tài xế',
        enableSorting: false,
        enableColumnFilter: true,
        cell: ({ getValue }) => <Typography variant="body2">{getValue<string>()}</Typography>
      },
      {
        accessorKey: 'vehicleStatus',
        header: 'Trạng thái xe',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'ready' | 'running' | 'maintenance'>();
          const label = getLabelFromOptions(value, VEHICLE_STATUS_OPTIONS);
          const chipColor = value === 'ready' ? 'success' : value === 'running' ? 'info' : 'warning';

          return (
            <Chip
              label={label}
              size="small"
              color={chipColor}
              variant="light"
              sx={{
                minWidth: 100,
                color: statusColorMap[value === 'ready' ? 'active' : value === 'running' ? 'active' : 'inactive'],
                borderColor: statusColorMap[value === 'ready' ? 'active' : value === 'running' ? 'active' : 'inactive']
              }}
            />
          );
        }
      },
      {
        accessorKey: 'driverStatus',
        header: 'Trạng thái tài xế',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'available' | 'dispatched'>();
          const label = getLabelFromOptions(value, DRIVER_STATUS_OPTIONS);
          const chipColor = value === 'available' ? 'success' : 'info';

          return (
            <Chip
              label={label}
              size="small"
              color={chipColor}
              variant="light"
              sx={{
                minWidth: 100,
                color: statusColorMap[value === 'available' ? 'active' : 'active'],
                borderColor: statusColorMap[value === 'available' ? 'active' : 'active']
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
          const vehicle = row.original;
          return (
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(vehicle.id);
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
                    handleEdit(vehicle.id);
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
                      onDelete(vehicle);
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
    [statusColorMap, onDelete, handleEdit, handleView]
  );
}

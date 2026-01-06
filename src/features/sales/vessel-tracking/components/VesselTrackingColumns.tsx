// ==============================|| VESSEL TRACKING TABLE COLUMNS ||============================== //

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

import type { VesselTracking } from '../types';
import { VESSEL_TRACKING_URLS, VESSEL_STATUS_OPTIONS } from '../types/constants';

/**
 * Vessel Tracking Table Columns Definition
 */
interface UseVesselTrackingColumnsProps {
  onEdit?: (tracking: VesselTracking) => void;
  onDelete?: (tracking: VesselTracking) => void;
}

export function useVesselTrackingColumns({ onEdit, onDelete }: UseVesselTrackingColumnsProps = {}): ColumnDef<VesselTracking>[] {
  const theme = useTheme();
  const navigate = useNavigate();

  const getStatusColor = useCallback(
    (status: string) => {
      switch (status) {
        case 'running':
          return theme.palette.info.main;
        case 'arrived':
          return theme.palette.success.main;
        default:
          return theme.palette.primary.main;
      }
    },
    [theme]
  );

  const handleView = useCallback(
    (id: string) => {
      navigate(VESSEL_TRACKING_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (tracking: VesselTracking) => {
      if (onEdit) {
        onEdit(tracking);
      } else {
        navigate(VESSEL_TRACKING_URLS.EDIT(tracking.id));
      }
    },
    [navigate, onEdit]
  );

  const handleDelete = useCallback(
    (tracking: VesselTracking) => {
      if (onDelete) {
        onDelete(tracking);
      }
    },
    [onDelete]
  );

  const getStatusLabel = (status: string) => {
    return VESSEL_STATUS_OPTIONS.find((opt) => opt.value === status)?.label || status;
  };

  return useMemo<ColumnDef<VesselTracking>[]>(
    () => [
      {
        accessorKey: 'shipmentNo',
        header: 'Mã chuyến',
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
        accessorKey: 'exportOrderNo',
        header: 'Đơn hàng XK',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => getValue<string>() || '-'
      },
      {
        accessorKey: 'vesselName',
        header: 'Tên tàu',
        enableSorting: true,
        enableColumnFilter: true
      },
      {
        accessorKey: 'voyageNo',
        header: 'Số chuyến',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => getValue<string>() || '-'
      },
      {
        accessorKey: 'portOfLoading',
        header: 'Cảng đi',
        enableSorting: true,
        enableColumnFilter: true
      },
      {
        accessorKey: 'portOfDischarge',
        header: 'Cảng đến',
        enableSorting: true,
        enableColumnFilter: true
      },
      {
        accessorKey: 'etd',
        header: 'ETD',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const date = getValue<Date | string>();
          return date ? dateHelper.formatDate(date, 'DD/MM/YYYY') : '-';
        }
      },
      {
        accessorKey: 'eta',
        header: 'ETA',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const date = getValue<Date | string>();
          return date ? dateHelper.formatDate(date, 'DD/MM/YYYY') : '-';
        }
      },
      {
        accessorKey: 'currentStatus',
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
          const tracking = row.original;
          return (
            <Stack direction="row" spacing={0.5} justifyContent="center">
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(tracking.id);
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
                    handleEdit(tracking);
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
                    handleDelete(tracking);
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
    [handleView, handleEdit, handleDelete, getStatusColor]
  );
}

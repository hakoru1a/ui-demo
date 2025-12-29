// ==============================|| HARVEST PLAN TABLE COLUMNS ||============================== //

import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import EnvironmentOutlined from '@ant-design/icons/EnvironmentOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import { IconButton, Stack, Tooltip } from '@mui/material';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { type ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// types
import { FOREST_AREA_URLS } from 'features/forest/forest-areas/types/constants';

import type { HarvestPlan } from '../types';
import { HARVEST_PLAN_URLS, HARVEST_PLAN_STATUS_OPTIONS, HARVEST_PLAN_STATUS } from '../types/constants';
import { getLabelFromOptions } from '../utils';

/**
 * Harvest Plan Table Columns Definition
 */
interface UseHarvestPlanColumnsProps {
  onDelete?: (harvestPlan: HarvestPlan) => void;
}

export function useHarvestPlanColumns({ onDelete }: UseHarvestPlanColumnsProps = {}): ColumnDef<HarvestPlan>[] {
  const navigate = useNavigate();

  const handleView = useCallback(
    (id: string) => {
      navigate(HARVEST_PLAN_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (id: string) => {
      navigate(HARVEST_PLAN_URLS.EDIT(id));
    },
    [navigate]
  );

  const handleViewMap = useCallback(
    (id: string) => {
      // Navigate to forest-areas map page with areaId query param to highlight the area
      navigate(`${FOREST_AREA_URLS.MAP}?areaId=${id}`);
    },
    [navigate]
  );

  return useMemo<ColumnDef<HarvestPlan>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã vùng',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue, row }) => (
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
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
        header: 'Tên kế hoạch',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => <Typography variant="body2">{getValue<string>()}</Typography>
      },
      {
        accessorKey: 'forestArea',
        header: 'Khu vực rừng',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const forestArea = getValue<HarvestPlan['forestArea']>();
          return <Typography variant="body2">{forestArea?.name || '-'}</Typography>;
        }
      },
      {
        accessorKey: 'area',
        header: 'Diện tích (ha)',
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
          align: 'right' as const
        },
        cell: ({ getValue }) => {
          const value = getValue<number>();
          return (
            <Typography align="right" variant="body2">
              {value.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </Typography>
          );
        }
      },
      {
        accessorKey: 'fscStandard',
        header: 'Chuẩn FSC',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<boolean>();
          return <Chip label={value ? 'Có' : 'Không'} size="small" color={value ? 'success' : 'default'} variant="light" />;
        }
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<HarvestPlan['status']>();
          const label = getLabelFromOptions(value, HARVEST_PLAN_STATUS_OPTIONS);
          const chipColor = value === HARVEST_PLAN_STATUS.ACTIVE ? 'success' : value === HARVEST_PLAN_STATUS.COMPLETED ? 'info' : 'default';

          return (
            <Chip
              label={label}
              size="small"
              color={chipColor}
              variant="light"
              sx={{
                minWidth: 100
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
          const harvestPlan = row.original;
          return (
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(harvestPlan.id);
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
                    handleEdit(harvestPlan.id);
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
              <Tooltip title="Xem bản đồ">
                <IconButton
                  size="small"
                  color="success"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewMap(harvestPlan.id);
                  }}
                  sx={{
                    '&:hover': {
                      bgcolor: 'success.lighter'
                    }
                  }}
                >
                  <EnvironmentOutlined />
                </IconButton>
              </Tooltip>
              {onDelete && (
                <Tooltip title="Xóa">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(harvestPlan);
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
    [onDelete, handleEdit, handleView, handleViewMap]
  );
}

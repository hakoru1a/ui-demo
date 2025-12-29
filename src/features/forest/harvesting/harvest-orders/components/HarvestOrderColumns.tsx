import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Chip, Stack, Tooltip, Typography } from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import IconButton from 'components/@extended/IconButton';
import dateHelper from 'utils/dateHelper';

import { HARVEST_ORDER_STATUS_OPTIONS, HARVEST_ORDER_URLS } from '../types/constants';
import type { HarvestOrder } from '../types/index';

const columnHelper = createColumnHelper<HarvestOrder>();

interface UseHarvestOrderColumnsProps {
  onDelete?: (order: HarvestOrder) => void;
}

// ... existing imports ...

export function useHarvestOrderColumns({ onDelete }: UseHarvestOrderColumnsProps) {
  const navigate = useNavigate();

  const columns = useMemo(
    () =>
      [
        columnHelper.accessor('code', {
          header: 'Mã lệnh',
          cell: (info) => (
            <Stack>
              <Typography
                component={Link}
                to={HARVEST_ORDER_URLS.DETAIL(info.row.original.id)}
                variant="subtitle1"
                color="text.primary"
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                {info.getValue()}
              </Typography>
            </Stack>
          )
        }),
        columnHelper.accessor('planName', {
          header: 'Kế hoạch',
          cell: (info) => info.getValue()
        }),
        columnHelper.accessor('forestAreaName', {
          header: 'Khu vực',
          cell: (info) => info.getValue()
        }),
        columnHelper.accessor('startDate', {
          header: 'Ngày thực hiện',
          cell: (info) => dateHelper.formatDate(info.getValue())
        }),
        columnHelper.accessor('actualYield', {
          header: 'Sản lượng (m³)',
          cell: (info) => info.getValue().toLocaleString('vi-VN')
        }),
        columnHelper.accessor('status', {
          header: 'Trạng thái',
          cell: (info) => {
            const status = info.getValue();
            const option = HARVEST_ORDER_STATUS_OPTIONS.find((opt) => opt.value === status);
            return (
              <Chip
                label={option?.label || status}
                color={(option?.color as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning') || 'default'}
                size="small"
                variant="light"
              />
            );
          }
        }),
        columnHelper.display({
          id: 'actions',
          header: 'Hành động',
          cell: (info) => (
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title="Xem chi tiết">
                <IconButton color="secondary" size="small" onClick={() => navigate(HARVEST_ORDER_URLS.DETAIL(info.row.original.id))}>
                  <EyeOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="Chỉnh sửa">
                <IconButton color="primary" size="small" onClick={() => navigate(HARVEST_ORDER_URLS.EDIT(info.row.original.id))}>
                  <EditOutlined />
                </IconButton>
              </Tooltip>
              {onDelete && (
                <Tooltip title="Xóa">
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => onDelete(info.row.original)}
                    disabled={info.row.original.status !== 'new'}
                  >
                    <DeleteOutlined />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          )
        })
      ] as ColumnDef<HarvestOrder>[],
    [onDelete, navigate]
  );

  return columns;
}

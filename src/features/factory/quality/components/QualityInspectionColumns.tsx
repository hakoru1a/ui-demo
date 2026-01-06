// ==============================|| QUALITY INSPECTION TABLE COLUMNS ||============================== //

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

import dateHelper from 'utils/dateHelper';

import type { QualityInspection } from '../types';
import { QC_RESULT_OPTIONS, QUALITY_URLS } from '../types/constants';

/**
 * Quality Inspection Table Columns Definition
 */
interface UseQualityInspectionColumnsProps {
  onDelete?: (inspection: QualityInspection) => void;
}

const getLabelFromOptions = <T extends string>(value: T, options: { value: T; label: string }[]): string => {
  return options.find((opt) => opt.value === value)?.label || value;
};

export function useQualityInspectionColumns({ onDelete }: UseQualityInspectionColumnsProps = {}): ColumnDef<QualityInspection>[] {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleView = useCallback(
    (id: string) => {
      navigate(QUALITY_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (id: string) => {
      navigate(QUALITY_URLS.EDIT(id));
    },
    [navigate]
  );

  // Get result color
  const getResultColor = (result: string) => {
    switch (result) {
      case 'passed':
        return theme.palette.success.main;
      case 'failed':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[600];
    }
  };

  return useMemo<ColumnDef<QualityInspection>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã phiếu QC',
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
        accessorKey: 'inspectionDate',
        header: 'Ngày kiểm định',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const date = getValue<Date | string>();
          return <Typography variant="body2">{dateHelper.formatDate(date, 'DD/MM/YYYY')}</Typography>;
        }
      },
      {
        accessorKey: 'productName',
        header: 'Sản phẩm',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => <Typography variant="body2">{getValue<string>()}</Typography>
      },
      {
        accessorKey: 'batchCode',
        header: 'Lô sản xuất',
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
        accessorKey: 'moisture',
        header: 'Độ ẩm (%)',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<number>();
          return (
            <Typography align="right" variant="body2">
              {value.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          );
        },
        meta: {
          align: 'right' as const
        }
      },
      {
        accessorKey: 'impurity',
        header: 'Tạp chất (%)',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<number>();
          return (
            <Typography align="right" variant="body2">
              {value.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          );
        },
        meta: {
          align: 'right' as const
        }
      },
      {
        accessorKey: 'result',
        header: 'Kết quả',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<'passed' | 'failed'>();
          const label = getLabelFromOptions(value, QC_RESULT_OPTIONS);
          const resultColor = getResultColor(value);
          const chipColor = value === 'passed' ? 'success' : 'error';

          return (
            <Chip
              label={label}
              size="small"
              color={chipColor}
              variant="light"
              sx={{
                minWidth: 100,
                color: resultColor,
                borderColor: resultColor
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
          const inspection = row.original;
          return (
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(inspection.id);
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
                    handleEdit(inspection.id);
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
                      onDelete(inspection);
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
    [onDelete, handleEdit, handleView, getResultColor]
  );
}

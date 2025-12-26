// ==============================|| LEGAL CERTIFICATE TABLE COLUMNS ||============================== //

import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import { IconButton, Stack, Tooltip, Alert, Box } from '@mui/material';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { type ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// types
import type { LegalCertificate } from '../types';
import { LEGAL_CERTIFICATE_URLS, CERTIFICATE_TYPE_OPTIONS, CERTIFICATE_STATUS_OPTIONS } from '../types';
import { getLabelFromOptions, formatDate, isExpiringSoon, isExpired, getDaysUntilExpiry } from '../utils';

/**
 * Legal Certificate Table Columns Definition
 */
interface UseLegalCertificateColumnsProps {
  onDelete?: (certificate: LegalCertificate) => void;
}

export function useLegalCertificateColumns({ onDelete }: UseLegalCertificateColumnsProps = {}): ColumnDef<LegalCertificate>[] {
  const navigate = useNavigate();

  const handleView = useCallback(
    (id: string) => {
      navigate(LEGAL_CERTIFICATE_URLS.DETAIL(id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (id: string) => {
      navigate(LEGAL_CERTIFICATE_URLS.EDIT(id));
    },
    [navigate]
  );

  return useMemo<ColumnDef<LegalCertificate>[]>(
    () => [
      {
        accessorKey: 'certificateType',
        header: 'Loại chứng chỉ',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<LegalCertificate['certificateType']>();
          const label = getLabelFromOptions(value, CERTIFICATE_TYPE_OPTIONS);
          return <Chip label={label} size="small" color={value === 'FSC' ? 'success' : 'info'} variant="light" />;
        }
      },
      {
        accessorKey: 'certificateNumber',
        header: 'Số chứng chỉ',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => (
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {getValue<string>()}
          </Typography>
        )
      },
      {
        accessorKey: 'issuingOrganization',
        header: 'Tổ chức cấp',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => <Typography variant="body2">{getValue<string>()}</Typography>
      },
      {
        accessorKey: 'issueDate',
        header: 'Ngày cấp',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const date = getValue<Date | string>();
          return <Typography variant="body2">{formatDate(date)}</Typography>;
        }
      },
      {
        accessorKey: 'expiryDate',
        header: 'Ngày hết hạn',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ row }) => {
          const expiryDate = row.original.expiryDate;
          const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
          const expiringSoon = isExpiringSoon(expiryDate);
          const expired = isExpired(expiryDate);

          return (
            <Box>
              <Typography variant="body2">{formatDate(expiryDate)}</Typography>
              {expiringSoon && !expired && (
                <Alert severity="warning" icon={<ExclamationCircleOutlined />} sx={{ mt: 0.5, py: 0, fontSize: '0.75rem' }}>
                  Còn {daysUntilExpiry} ngày - Hãy gia hạn!
                </Alert>
              )}
              {expired && (
                <Alert severity="error" sx={{ mt: 0.5, py: 0, fontSize: '0.75rem' }}>
                  Đã hết hạn
                </Alert>
              )}
            </Box>
          );
        }
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => {
          const value = getValue<LegalCertificate['status']>();
          const label = getLabelFromOptions(value, CERTIFICATE_STATUS_OPTIONS);
          let chipColor: 'success' | 'warning' | 'error' | 'default' = 'default';

          if (value === 'active') chipColor = 'success';
          else if (value === 'expiring_soon') chipColor = 'warning';
          else if (value === 'expired') chipColor = 'error';

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
          const certificate = row.original;
          return (
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  color="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(certificate.id);
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
                    handleEdit(certificate.id);
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
                <Tooltip title="Xóa chứng chỉ">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(certificate);
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
    [onDelete, handleEdit, handleView]
  );
}

// ==============================|| CERTIFICATE HISTORY DIALOG ||============================== //

import { HistoryOutlined, CloseOutlined } from '@ant-design/icons';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Stack,
  Typography,
  Chip,
  Divider,
  IconButton,
  Tabs,
  Tab
} from '@mui/material';
import { useState } from 'react';

import type { CertificateRenewal, CertificateApprovalHistory } from '../types';
import { RENEWAL_STATUS_OPTIONS } from '../types';
import { formatDate, getLabelFromOptions } from '../utils';

// ==============================|| TYPES ||============================== //

interface CertificateHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  renewals: CertificateRenewal[];
  approvalHistory: CertificateApprovalHistory[];
}

// ==============================|| CERTIFICATE HISTORY DIALOG ||============================== //

const CertificateHistoryDialog = ({ open, onClose, renewals, approvalHistory }: CertificateHistoryDialogProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <HistoryOutlined style={{ fontSize: 24 }} />
            <Typography variant="h4">Lịch sử chứng chỉ</Typography>
          </Stack>
          <IconButton size="small" onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label={`Lịch sử gia hạn (${renewals.length})`} />
          <Tab label={`Lịch sử phê duyệt (${approvalHistory.length})`} />
        </Tabs>

        {/* Renewals Tab */}
        {activeTab === 0 && (
          <Box>
            {renewals.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Chưa có lịch sử gia hạn
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {renewals.map((renewal, index) => (
                  <Box key={renewal.id}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                        <Chip
                          label={getLabelFromOptions(renewal.status, RENEWAL_STATUS_OPTIONS)}
                          size="small"
                          color={
                            renewal.status === 'approved'
                              ? 'success'
                              : renewal.status === 'rejected'
                                ? 'error'
                                : renewal.status === 'under_review'
                                  ? 'warning'
                                  : 'default'
                          }
                        />
                        <Typography variant="body2" color="text.secondary">
                          Ngày yêu cầu: {formatDate(renewal.requestedDate)}
                        </Typography>
                      </Stack>

                      {renewal.requestedBy && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                          Người yêu cầu: {renewal.requestedBy}
                        </Typography>
                      )}

                      {renewal.reviewDate && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                          Ngày duyệt: {formatDate(renewal.reviewDate)}
                          {renewal.reviewedBy && ` bởi ${renewal.reviewedBy}`}
                        </Typography>
                      )}

                      {renewal.approvedDate && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                          Ngày phê duyệt: {formatDate(renewal.approvedDate)}
                          {renewal.approvedBy && ` bởi ${renewal.approvedBy}`}
                        </Typography>
                      )}

                      {renewal.newExpiryDate && (
                        <Box sx={{ mt: 1, p: 1, bgcolor: 'success.lighter', borderRadius: 0.5 }}>
                          <Typography variant="caption" color="success.dark" sx={{ fontWeight: 600 }}>
                            Ngày hết hạn mới: {formatDate(renewal.newExpiryDate)}
                          </Typography>
                        </Box>
                      )}

                      {renewal.notes && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Ghi chú:</strong> {renewal.notes}
                        </Typography>
                      )}

                      {renewal.certificateFile && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            File: {renewal.certificateFile.split('/').pop()}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    {index < renewals.length - 1 && <Divider sx={{ my: 1 }} />}
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        )}

        {/* Approval History Tab */}
        {activeTab === 1 && (
          <Box>
            {approvalHistory.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Chưa có lịch sử phê duyệt
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {approvalHistory.map((history, index) => (
                  <Box key={history.id}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                        <Chip
                          label={
                            history.action === 'created'
                              ? 'Tạo mới'
                              : history.action === 'renewed'
                                ? 'Gia hạn'
                                : history.action === 'approved'
                                  ? 'Phê duyệt'
                                  : 'Cập nhật'
                          }
                          size="small"
                          color={history.action === 'approved' || history.action === 'renewed' ? 'success' : 'default'}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(history.actionDate)}
                        </Typography>
                        {history.performedBy && (
                          <Typography variant="body2" color="text.secondary">
                            bởi {history.performedBy}
                          </Typography>
                        )}
                      </Stack>

                      {history.notes && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {history.notes}
                        </Typography>
                      )}

                      {history.previousExpiryDate && history.newExpiryDate && (
                        <Box sx={{ mt: 1, p: 1, bgcolor: 'info.lighter', borderRadius: 0.5 }}>
                          <Typography variant="caption" color="info.dark">
                            Từ {formatDate(history.previousExpiryDate)} đến {formatDate(history.newExpiryDate)}
                          </Typography>
                        </Box>
                      )}

                      {history.renewalId && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          ID yêu cầu gia hạn: {history.renewalId}
                        </Typography>
                      )}
                    </Box>
                    {index < approvalHistory.length - 1 && <Divider sx={{ my: 1 }} />}
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CertificateHistoryDialog;

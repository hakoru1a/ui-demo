// material-ui
import WarningOutlined from '@ant-design/icons/WarningOutlined';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

// project imports
import Field from 'components/fields';

// ==============================|| CONFIRM WITH REASON DIALOG ||============================== //

interface ConfirmWithReasonDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning';
  reasonLabel?: string;
  reasonPlaceholder?: string;
  reasonRequired?: boolean;
  loading?: boolean;
}

export default function ConfirmWithReasonDialog({
  open,
  onClose,
  onConfirm,
  title = 'Xác nhận',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  confirmColor = 'primary',
  reasonLabel = 'Lý do',
  reasonPlaceholder = 'Nhập lý do...',
  reasonRequired = true,
  loading = false
}: ConfirmWithReasonDialogProps) {
  const [reason, setReason] = useState('');

  // Reset reason when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setReason('');
    }
  }, [open]);

  const handleConfirm = () => {
    if (reasonRequired && !reason.trim()) {
      return;
    }
    onConfirm(reason.trim());
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="confirm-dialog-title" sx={{ pb: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <WarningOutlined style={{ fontSize: 24, color: 'var(--mui-palette-warning-main)' }} />
          <Typography variant="h4">{title}</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="confirm-dialog-description" sx={{ mb: 2 }}>
          {message}
        </DialogContentText>

        <Field.Text
          label={reasonLabel}
          placeholder={reasonPlaceholder}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          fullWidth
          required={reasonRequired}
          multiline
          rows={3}
          error={reasonRequired && !reason.trim() && open}
          helperText={reasonRequired && !reason.trim() && open ? 'Vui lòng nhập lý do' : undefined}
          slotProps={{
            input: {
              autoFocus: true
            }
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={handleClose} color="inherit" disabled={loading}>
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={confirmColor}
          disabled={loading || (reasonRequired && !reason.trim())}
          sx={{
            minWidth: 100
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// material-ui
import WarningOutlined from '@ant-design/icons/WarningOutlined';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Typography } from '@mui/material';

// assets

// ==============================|| CONFIRM DIALOG ||============================== //

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning';
  data?: {
    label: string;
    value: string | number | undefined;
  }[];
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Xác nhận',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  confirmColor = 'error',
  data = [],
  loading = false
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="confirm-dialog-title" sx={{ pb: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <WarningOutlined style={{ fontSize: 24, color: 'var(--mui-palette-error-main)' }} />
          <Typography variant="h4">{title}</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="confirm-dialog-description" sx={{ mb: data.length > 0 ? 2 : 0 }}>
          {message}
        </DialogContentText>

        {data.length > 0 && (
          <Stack spacing={1.5} sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            {data.map((item, index) => (
              <Stack key={index} direction="row" spacing={1} justifyContent="space-between">
                <Typography variant="subtitle2" color="text.secondary">
                  {item.label}:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {item.value ?? '-'}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmColor}
          disabled={loading}
          sx={{
            minWidth: 100,
            ...(confirmColor === 'error' && {
              '&:hover': {
                bgcolor: 'error.dark'
              }
            })
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

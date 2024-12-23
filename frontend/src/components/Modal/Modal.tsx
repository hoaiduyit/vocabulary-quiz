import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { ReactNode, useState } from 'react';

interface ModalProps {
  open: boolean;
  title?: ReactNode;
  submitButtonText?: string;
  hasLoadingState?: boolean;
  children?: ReactNode;
  size?: DialogProps['maxWidth'];
  disabledSubmitButton?: boolean;
  preventEscapeCloser?: boolean;
  preventBackdropClickClose?: boolean;
  showAction?: boolean;
  onClose: () => void;
  onSubmit?: () => Promise<void>;
}

export const Modal = ({
  open,
  onClose,
  title,
  submitButtonText,
  hasLoadingState,
  size = 'sm',
  disabledSubmitButton = false,
  preventEscapeCloser = false,
  preventBackdropClickClose = false,
  showAction = true,
  children,
  onSubmit,
}: ModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleClose = (_: unknown, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (preventEscapeCloser && reason === 'escapeKeyDown') {
      return;
    }
    if (preventBackdropClickClose && reason === 'backdropClick') {
      return;
    }
    onClose();
  };

  const handleSubmit = async () => {
    if (disabledSubmitButton) return;
    if (hasLoadingState) {
      setLoading(true);
      await onSubmit?.();
      setLoading(false);
    } else {
      await onSubmit?.();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={size}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      {showAction && (
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton
            loading={loading}
            disabled={disabledSubmitButton}
            variant="contained"
            onClick={handleSubmit}
          >
            {submitButtonText}
          </LoadingButton>
        </DialogActions>
      )}
    </Dialog>
  );
};

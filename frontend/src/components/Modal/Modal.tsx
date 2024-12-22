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
  children,
  onSubmit,
}: ModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (hasLoadingState) {
      setLoading(true);
      await onSubmit?.();
      setLoading(false);
    } else {
      await onSubmit?.();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={size}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton loading={loading} variant="contained" onClick={handleSubmit}>
          {submitButtonText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React, { ReactElement } from 'react'

type CustomDialogProps = {
  open: boolean
  title: string
  children: string | ReactElement
  id: string
  onConfirmAction?: ReactElement
  onCancelAction?: ReactElement
  fullWidth?: boolean
  onClose?: () => void
}

const CustomDialog = ({
  open,
  id,
  title,
  children,
  onCancelAction,
  onConfirmAction,
  onClose,
  fullWidth,
}: CustomDialogProps): ReactElement => (
  <Dialog open={open} aria-describedby={id} fullWidth={fullWidth} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent id={id}>{children}</DialogContent>
    <DialogActions sx={{ paddingLeft: 3, paddingRight: 3, paddingBottom: 3 }}>
      {onCancelAction}
      {onConfirmAction}
    </DialogActions>
  </Dialog>
)

export default CustomDialog

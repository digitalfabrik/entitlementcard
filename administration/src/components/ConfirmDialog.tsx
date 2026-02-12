import { CheckCircleOutline, Close } from '@mui/icons-material'
import {
  Breakpoint,
  Button,
  ButtonPropsColorOverrides,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { OverridableStringUnion } from '@mui/types'
import React, { ReactElement, ReactNode, useId } from 'react'
import { useTranslation } from 'react-i18next'

const ConfirmDialog = ({
  actionDisabled = false,
  loading = false,
  open,
  title,
  children,
  onConfirm,
  onClose,
  confirmButtonText,
  cancelButtonText,
  confirmButtonColor = 'primary',
  confirmButtonIcon,
  maxWidth = 'sm',
  showCancelButton = true,
  closeOnConfirm = true,
}: {
  actionDisabled?: boolean
  loading?: boolean
  open: boolean
  title: string
  children: ReactNode
  onConfirm: () => void
  onClose: () => void
  cancelButtonText?: string
  confirmButtonIcon?: ReactNode
  confirmButtonText?: string
  confirmButtonColor?: OverridableStringUnion<
    'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
    ButtonPropsColorOverrides
  >
  showCancelButton?: boolean
  closeOnConfirm?: boolean
  maxWidth?: Breakpoint
}): ReactElement => {
  const { t } = useTranslation('misc')
  // MUI <Dialog> automatically sets aria-labelledby, but not aria-describedby.
  const contentId = useId()

  return (
    <Dialog
      open={open}
      fullWidth
      onClose={onClose}
      maxWidth={maxWidth}
      aria-describedby={contentId}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent id={contentId}>{children}</DialogContent>
      <DialogActions sx={{ paddingLeft: 3, paddingRight: 3, paddingBottom: 3 }}>
        {showCancelButton && (
          <Button onClick={onClose} variant='outlined' startIcon={<Close />}>
            {cancelButtonText ?? t('cancel')}
          </Button>
        )}
        <Button
          variant='contained'
          color={confirmButtonColor}
          loading={loading}
          disabled={actionDisabled}
          startIcon={confirmButtonIcon ?? <CheckCircleOutline />}
          onClick={() => {
            onConfirm()
            if (closeOnConfirm) {
              onClose()
            }
          }}
        >
          {confirmButtonText ?? t('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog

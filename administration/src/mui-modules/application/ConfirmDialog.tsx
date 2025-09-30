import { CheckCircleOutline, Close } from '@mui/icons-material'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, SxProps } from '@mui/material'
import { ButtonPropsColorOverrides } from '@mui/material/Button/Button'
import { Theme } from '@mui/system'
import { OverridableStringUnion } from '@mui/types'
import React, { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

const ConfirmDialog = ({
  actionDisabled = false,
  loading = false,
  open,
  title,
  children,
  id,
  onConfirm,
  onClose,
  confirmButtonText,
  cancelButtonText,
  color = 'primary',
  confirmButtonIcon,
  showCancelButton = true,
  buttonSx,
}: {
  actionDisabled?: boolean
  loading?: boolean
  open: boolean
  title: string
  children: ReactElement | string
  id: string
  onConfirm: () => void
  onClose: () => void
  // TODO #2362 Set up MUI colors - remove this property
  buttonSx?: SxProps<Theme>
  cancelButtonText?: string
  confirmButtonIcon?: ReactNode
  confirmButtonText?: string
  showCancelButton?: boolean
  color?: OverridableStringUnion<
    'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
    ButtonPropsColorOverrides
  >
}): ReactElement => {
  const { t } = useTranslation('misc')

  return (
    <Dialog open={open} aria-describedby={id} fullWidth onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent id={id}>{children}</DialogContent>
      <DialogActions sx={{ paddingLeft: 3, paddingRight: 3, paddingBottom: 3 }}>
        {showCancelButton && (
          <Button onClick={onClose} variant='outlined' startIcon={<Close />}>
            {cancelButtonText ?? t('cancel')}
          </Button>
        )}
        <Button
          sx={buttonSx}
          variant='contained'
          color={color}
          loading={loading}
          disabled={actionDisabled}
          startIcon={confirmButtonIcon ?? <CheckCircleOutline />}
          onClick={() => {
            onConfirm()
            onClose()
          }}>
          {confirmButtonText ?? t('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog

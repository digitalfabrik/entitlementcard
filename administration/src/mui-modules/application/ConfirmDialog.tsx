import { CheckCircleOutline, Close } from '@mui/icons-material'
import { Button } from '@mui/material'
import { ButtonPropsColorOverrides } from '@mui/material/Button/Button'
import { OverridableStringUnion } from '@mui/types'
import React, { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import CustomDialog from '../../bp-modules/components/CustomDialog'

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
  color = 'primary',
  confirmButtonIcon,
}: {
  actionDisabled?: boolean
  loading?: boolean
  open: boolean
  title: string
  children: ReactElement | string
  id: string
  onConfirm: () => void
  onClose: () => void
  confirmButtonIcon?: ReactNode
  confirmButtonText?: string
  color?: OverridableStringUnion<
    'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
    ButtonPropsColorOverrides
  >
}): ReactElement => {
  const { t } = useTranslation('misc')

  return (
    <CustomDialog
      id={id}
      open={open}
      title={title}
      onClose={onClose}
      onCancelAction={
        <Button onClick={onClose} variant='outlined' startIcon={<Close />}>
          {t('cancel')}
        </Button>
      }
      onConfirmAction={
        <Button
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
      }>
      {children}
    </CustomDialog>
  )
}

export default ConfirmDialog

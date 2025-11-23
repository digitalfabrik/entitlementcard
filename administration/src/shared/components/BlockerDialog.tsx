/* eslint-disable react/destructuring-assignment */
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import type { Blocker } from 'react-router'

export const BlockerDialog = (p: { title: string; message: string; blocker: Blocker }): ReactElement => {
  const { t } = useTranslation('misc')

  return (
    <Dialog
      open={p.blocker.state === 'blocked'}
      onClose={p.blocker.reset}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'>
      <DialogTitle id='alert-dialog-title'>{p.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description' variant='body2'>
          {p.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={p.blocker.reset}>{t('cancel')}</Button>
        <Button onClick={p.blocker.proceed} color='primary' variant='contained' autoFocus>
          {t('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

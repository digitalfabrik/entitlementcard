/* eslint-disable react/destructuring-assignment */
import { Close, InfoOutlined } from '@mui/icons-material'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

type StatisticsNoDataDialogProps = {
  isOpen: boolean
  onClose: () => void
}

const StatisticsNoDataDialog = (props: StatisticsNoDataDialogProps): ReactElement => {
  const { t } = useTranslation('statistics')
  return (
    <Dialog open={props.isOpen} aria-describedby='alert-dialog-description' sx={{ '.MuiPaper-root': { padding: 1.5 } }}>
      <DialogTitle sx={{ padding: 1.5 }}>
        <Stack direction='row' sx={{ gap: 1, alignItems: 'center' }}>
          <InfoOutlined />
          <Typography variant='subtitle2' component='span'>
            {t('notDataDialogHeadline')}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ padding: 1.5 }}>
        <Typography variant='body2'>{t('noDataDialogText')}</Typography>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<Close />} variant='outlined' onClick={props.onClose} color='inherit' sx={{ margin: 1 }}>
          <Typography variant='button'>{t('misc:close')}</Typography>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default StatisticsNoDataDialog

import { Delete } from '@mui/icons-material'
import { Button, Typography } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import ConfirmDialog from '../../../components/ConfirmDialog'

const DiscardAllInputsButton = ({ discardAll }: { discardAll: () => void }): ReactElement => {
  const { t } = useTranslation('applicationForms')
  const [dialogOpen, setDialogOpen] = useState(false)
  return (
    <>
      <Button variant='outlined' endIcon={<Delete />} onClick={() => setDialogOpen(true)}>
        {t('discardInputsButton')}
      </Button>
      <ConfirmDialog
        open={dialogOpen}
        maxWidth='xs'
        onClose={() => setDialogOpen(false)}
        title={t('discardInputsTitle')}
        color='error'
        onConfirm={discardAll}
      >
        <Typography>{t('discardInputsContent')}</Typography>
      </ConfirmDialog>
    </>
  )
}

export default DiscardAllInputsButton

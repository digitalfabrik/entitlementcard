import { Delete } from '@mui/icons-material'
import { Button } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import ConfirmDialog from './ConfirmDialog'

const DiscardAllInputsButton = ({ discardAll }: { discardAll: () => void }): ReactElement => {
  const { t } = useTranslation('applicationForms')
  const [dialogOpen, setDialogOpen] = useState(false)
  return (
    <>
      <Button variant='outlined' endIcon={<Delete />} onClick={() => setDialogOpen(true)}>
        {t('discardInputsButton')}
      </Button>
      <ConfirmDialog
        id='discard-inputs-dialog'
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={t('discardInputsTitle')}
        color='error'
        onConfirm={discardAll}>
        {t('discardInputsContent')}
      </ConfirmDialog>
    </>
  )
}

export default DiscardAllInputsButton

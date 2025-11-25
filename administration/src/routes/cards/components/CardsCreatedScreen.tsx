import { CheckCircle } from '@mui/icons-material'
import { Button, Stack, Typography } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

export const CardsCreatedScreen = ({ onProceed }: { onProceed: () => void }): ReactElement => {
  const { t } = useTranslation('cards')

  return (
    <Stack justifyContent='center' alignItems='center' spacing={2} sx={{ height: '100%' }}>
      <CheckCircle color='success' sx={{ fontSize: 100 }} />
      <Typography component='p'>{t('addCardSuccessMessage')}</Typography>
      <Button onClick={onProceed}>{t('createMoreCards')}</Button>
    </Stack>
  )
}

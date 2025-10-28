import { Stack, Typography } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { useGetHashingPepperQuery } from '../../generated/graphql'
import AlertBox from '../../mui-modules/base/AlertBox'
import getQueryResult from '../../mui-modules/util/getQueryResult'
import PasswordInput from '../PasswordInput'

const PepperSettings = (): ReactElement => {
  const { t } = useTranslation('projectSettings')
  const errorComponent = <AlertBox sx={{ my: 2 }} severity='error' description={t('noPepper')} />
  const pepperQuery = useGetHashingPepperQuery()
  const result = getQueryResult(pepperQuery, errorComponent)

  return result.successful ? (
    <Stack sx={{ marginBottom: 2, gap: 1 }}>
      <Typography component='p'>{t('pepperExplanation')}:</Typography>
      <PasswordInput disabled value={result.data.pepper} />
    </Stack>
  ) : (
    result.component
  )
}

export default PepperSettings

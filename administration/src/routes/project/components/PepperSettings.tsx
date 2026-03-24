import { Stack, Typography } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'urql'

import AlertBox from '../../../components/AlertBox'
import PasswordInput from '../../../components/PasswordInput'
import { GetHashingPepperDocument } from '../../../graphql'
import getQueryResult from '../../../util/getQueryResult'

const PepperSettings = (): ReactElement => {
  const { t } = useTranslation('projectSettings')
  const errorComponent = <AlertBox sx={{ my: 2 }} severity='error' description={t('noPepper')} />
  const [pepperState, pepperStateQuery] = useQuery({ query: GetHashingPepperDocument })
  const result = getQueryResult(pepperState, pepperStateQuery, errorComponent)

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

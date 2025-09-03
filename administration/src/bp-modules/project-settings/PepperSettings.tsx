import { Callout } from '@blueprintjs/core'
import { Stack } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useGetHashingPepperQuery } from '../../generated/graphql'
import getQueryResult from '../../mui-modules/util/getQueryResult'
import PasswordInput from '../PasswordInput'

const Container = styled.div`
  padding: 8px 0;
`

const PepperSettings = (): ReactElement => {
  const { t } = useTranslation('projectSettings')
  const errorComponent = (
    <Container>
      <Callout intent='danger'> {t('noPepper')}</Callout>
    </Container>
  )
  const pepperQuery = useGetHashingPepperQuery()
  const result = getQueryResult(pepperQuery, errorComponent)

  return result.successful ? (
    <Stack sx={{ marginBottom: 2 }}>
      <p>{t('pepperExplanation')}:</p>
      <PasswordInput value={result.data.pepper} />
    </Stack>
  ) : (
    result.component
  )
}

export default PepperSettings

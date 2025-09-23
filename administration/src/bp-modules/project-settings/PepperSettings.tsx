
import { TFunction } from 'i18next'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useGetHashingPepperQuery } from '../../generated/graphql'
import getQueryResult from '../../mui-modules/util/getQueryResult'
import PasswordInput from '../PasswordInput'
import { Callout } from '../../shared/components/Callout'

const Container = styled.div`
  padding: 8px 0;
`

const PepperSettingsView = ({ pepper, t }: { pepper: string; t: TFunction }) => (
  <Container>
    <p>{t('pepperExplanation')}:</p>
    <PasswordInput label='' value={pepper} setValue={null} />
  </Container>
)

const PepperSettings = (): ReactElement => {
  const { t } = useTranslation('projectSettings')
  const errorComponent = (
    <Container>
      <Callout color='error'>{t('noPepper')}</Callout>
    </Container>
  )
  const pepperQuery = useGetHashingPepperQuery()
  const result = getQueryResult(pepperQuery, errorComponent)
  if (!result.successful) {
    return result.component
  }
  return <PepperSettingsView pepper={result.data.pepper} t={t} />
}

export default PepperSettings

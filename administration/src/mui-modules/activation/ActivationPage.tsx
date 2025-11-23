import { Card } from '@mui/material'
import { styled } from '@mui/system'
import { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import AlertBox from '../base/AlertBox'
import ActivationPageContent from './components/ActivationPageContent'

const CardContainer = styled(Card)`
  margin: 20px;
  padding: 20px;
  max-width: 500px;
`

const StandaloneHorizontalCenter = styled('div')`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  margin-top: 10%;
`

const ActivationPage = (): ReactElement | null => {
  const { t } = useTranslation('activation')
  const config = useContext(ProjectConfigContext)
  const { hash } = useLocation()

  if (!hash) {
    return <AlertBox severity='error' description={t('invalidLink')} />
  }

  return (
    <StandaloneHorizontalCenter>
      <CardContainer>
        <ActivationPageContent config={config} activationCode={hash} />
      </CardContainer>
    </StandaloneHorizontalCenter>
  )
}

export default ActivationPage

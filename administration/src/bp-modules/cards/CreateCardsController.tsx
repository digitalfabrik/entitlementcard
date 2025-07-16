import { ButtonGroup } from '@blueprintjs/core'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import styled from 'styled-components'

import { useWhoAmI } from '../../WhoAmIProvider'
import RenderGuard from '../../mui-modules/components/RenderGuard'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import StandaloneCenter from '../StandaloneCenter'
import { FREINET_PARAM } from '../constants'
import CardFormButton from './CardFormButton'

const Buttons = styled(ButtonGroup)`
  width: 400px;
`

const CreateCardsController = (): ReactElement => {
  const { region } = useWhoAmI().me
  const { freinetCSVImportEnabled } = useContext(ProjectConfigContext)
  const { t } = useTranslation('cards')

  const navigate = useNavigate()

  return (
    <RenderGuard condition={region !== undefined} error={{ description: t('errors:notAuthorizedToCreateCards') }}>
      <StandaloneCenter>
        <Buttons vertical>
          <CardFormButton text={t('createSingleCards')} icon='add' onClick={() => navigate('./add')} />
          <CardFormButton text={t('importMultipleCards')} icon='upload' onClick={() => navigate('./import')} />
          {freinetCSVImportEnabled && (
            <CardFormButton
              text={t('importCardsFromFreinet')}
              icon='upload'
              onClick={() => navigate(`./import?${FREINET_PARAM}=true`)}
            />
          )}
        </Buttons>
      </StandaloneCenter>
    </RenderGuard>
  )
}

export default CreateCardsController

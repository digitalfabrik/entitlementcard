import { ButtonGroup, NonIdealState } from '@blueprintjs/core'
import React, { ReactElement, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { FREINET_PARAM } from '../../Router'
import { WhoAmIContext } from '../../WhoAmIProvider'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import StandaloneCenter from '../StandaloneCenter'
import CardFormButton from './CardFormButton'

const Buttons = styled(ButtonGroup)`
  width: 400px;
`

const CreateCardsController = (): ReactElement => {
  const { region } = useContext(WhoAmIContext).me!
  const { freinetCSVImportEnabled } = useContext(ProjectConfigContext)

  const navigate = useNavigate()
  if (!region) {
    return (
      <NonIdealState
        icon='cross'
        title='Fehlende Berechtigung'
        description='Sie sind nicht berechtigt, Karten auszustellen.'
      />
    )
  }

  return (
    <StandaloneCenter>
      <Buttons vertical>
        <CardFormButton text='Einzelne Karten erstellen' icon='add' onClick={() => navigate('./add')} />
        <CardFormButton text='Mehrere Karten importieren' icon='upload' onClick={() => navigate('./import')} />
        {freinetCSVImportEnabled && (
          <CardFormButton
            text='Karten aus Freinet Export importieren'
            icon='upload'
            onClick={() => navigate(`./import?${FREINET_PARAM}=true`)}
          />
        )}
      </Buttons>
    </StandaloneCenter>
  )
}

export default CreateCardsController

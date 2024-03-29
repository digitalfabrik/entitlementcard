import { ButtonGroup, NonIdealState } from '@blueprintjs/core'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { WhoAmIContext } from '../../WhoAmIProvider'
import StandaloneCenter from '../StandaloneCenter'
import CardFormButton from './CardFormButton'

const Buttons = styled(ButtonGroup)`
  width: 400px;
`

const CreateCardsController = () => {
  const { region } = useContext(WhoAmIContext).me!
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
      </Buttons>
    </StandaloneCenter>
  )
}

export default CreateCardsController

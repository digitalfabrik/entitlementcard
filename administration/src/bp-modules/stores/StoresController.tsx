import { ButtonGroup } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import StandaloneCenter from '../StandaloneCenter'
import CardFormButton from '../cards/CardFormButton'

const Buttons = styled(ButtonGroup)`
  width: 400px;
`

const StoresController = (): ReactElement => {
  const navigate = useNavigate()
  return (
    <StandaloneCenter>
      <Buttons vertical>
        <CardFormButton text='Akzeptanzpartner CSV Import' icon='upload' onClick={() => navigate('./import')} />
        <CardFormButton text='Akzeptanzpartner ansehen und bearbeiten' icon='add' onClick={() => navigate('./add')} />
      </Buttons>
    </StandaloneCenter>
  )
}

export default StoresController

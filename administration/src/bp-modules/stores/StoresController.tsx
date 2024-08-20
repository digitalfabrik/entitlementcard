import { ButtonGroup, NonIdealState } from '@blueprintjs/core'
import React, { ReactElement, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { WhoAmIContext } from '../../WhoAmIProvider'
import { Role } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import StandaloneCenter from '../StandaloneCenter'
import CardFormButton from '../cards/CardFormButton'

const Buttons = styled(ButtonGroup)`
  width: 400px;
`

const StoresController = (): ReactElement => {
  const navigate = useNavigate()
  const { role } = useContext(WhoAmIContext).me!
  const storeManagement = useContext(ProjectConfigContext).storeManagement
  if (role !== Role.ProjectStoreManager || !storeManagement.enabled) {
    return (
      <NonIdealState
        icon='cross'
        title='Fehlende Berechtigung'
        description='Sie sind nicht berechtigt, Akzeptanzpartner zu verwalten.'
      />
    )
  }
  return (
    <StandaloneCenter>
      <Buttons vertical>
        <CardFormButton text='Akzeptanzpartner CSV Import' icon='upload' onClick={() => navigate('./import')} />
      </Buttons>
    </StandaloneCenter>
  )
}

export default StoresController

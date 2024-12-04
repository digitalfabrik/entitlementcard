import { Button, H3 } from '@blueprintjs/core'
import React, { ReactElement, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { WhoAmIContext } from '../../WhoAmIProvider'
import { Role } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'

const StyledButton = styled(Button)`
  margin: 10px;
`

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

const HomeController = (): ReactElement => {
  const { applicationFeature, cardStatistics, cardCreation, userImportApiEnabled } = useContext(ProjectConfigContext)
  const { role } = useContext(WhoAmIContext).me!

  return (
    <Container>
      <H3>Wählen Sie eine Aktion aus:</H3>
      {role === Role.RegionAdmin || role === Role.RegionManager ? (
        <>
          {applicationFeature ? (
            <NavLink to='/applications'>
              <StyledButton icon='form' text='Eingehende Anträge' />
            </NavLink>
          ) : null}
          {cardCreation ? (
            <NavLink to='/cards'>
              <StyledButton icon='id-number' text='Karten erstellen' />
            </NavLink>
          ) : null}
        </>
      ) : null}
      {role === Role.ProjectAdmin || role === Role.RegionAdmin ? (
        <>
          <NavLink to='/users'>
            <StyledButton icon='people' text='Benutzer verwalten' />
          </NavLink>
          {cardStatistics.enabled ? (
            <NavLink to='/statistics'>
              <StyledButton icon='stacked-chart' text='Statistiken' />
            </NavLink>
          ) : null}
        </>
      ) : null}
      {role === Role.RegionAdmin && applicationFeature ? (
        <NavLink to='/region'>
          <StyledButton icon='path-search' text='Region verwalten' />
        </NavLink>
      ) : null}
      {(role === Role.ProjectAdmin && userImportApiEnabled) || role === Role.ExternalVerifiedApiUser ? (
        <NavLink to='/project'>
          <StyledButton icon='projects' text='Projekt verwalten' />
        </NavLink>
      ) : null}
      {role === Role.ProjectStoreManager ? (
        <NavLink to='/stores'>
          <StyledButton icon='shop' text='Akzeptanzpartner verwalten' />
        </NavLink>
      ) : null}
    </Container>
  )
}

export default HomeController

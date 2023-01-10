import React, { useContext } from 'react'
import { Button, H3 } from '@blueprintjs/core'
import { Role } from '../../generated/graphql'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { WhoAmIContext } from '../../WhoAmIProvider'

const StyledButton = styled(Button)`
  margin: 10px;
`

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

const HomeController = () => {
  const { role } = useContext(WhoAmIContext).me!

  return (
    <Container>
      <H3>Wählen Sie eine Aktion aus:</H3>
      {role === Role.RegionAdmin || role === Role.RegionManager ? (
        <>
          <NavLink to={'/applications'}>
            <StyledButton icon='form' text='Eingehende Anträge' />
          </NavLink>
          <NavLink to={'/create-cards'}>
            <StyledButton icon='id-number' text='Karten erstellen' />
          </NavLink>
        </>
      ) : null}
      {role === Role.ProjectAdmin || role === Role.RegionAdmin ? (
        <>
          <NavLink to={'/users'}>
            <StyledButton icon='people' text='Benutzer verwalten' />
          </NavLink>
        </>
      ) : null}
      {role === Role.RegionAdmin ? (
        <NavLink to={'/region'}>
          <StyledButton icon='path-search' text='Region verwalten' />
        </NavLink>
      ) : null}
    </Container>
  )
}

export default HomeController

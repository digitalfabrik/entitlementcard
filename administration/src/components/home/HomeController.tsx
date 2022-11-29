import React, { useContext } from 'react'
import { Button, H3 } from '@blueprintjs/core'
import { Role } from '../../generated/graphql'
import { AuthContext } from '../../AuthProvider'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const StyledButton = styled(Button)`
  margin: 10px;
`

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

const HomeController = () => {
  const role = useContext(AuthContext).data?.administrator.role

  return (
    <Container>
      <H3>Wählen Sie eine Aktion aus:</H3>
      {role === Role.RegionAdmin || role === Role.RegionManager ? (
        <>
          <NavLink to={'/applications'}>
            <StyledButton icon='form' text='Eingehende Anträge' />
          </NavLink>
          <NavLink to={'/eak-generation'}>
            <StyledButton icon='id-number' text='Karten erstellen' />
          </NavLink>
        </>
      ) : null}
      {role === Role.ProjectAdmin || role === Role.RegionAdmin ? (
        <>
          <NavLink to={'/users'}>
            <StyledButton icon='people' text='Benutzer verwalten' />
          </NavLink>
          <NavLink to={'/region'} reloadDocument>
            <StyledButton icon='path-search' text='Region verwalten' />
          </NavLink>
        </>
      ) : null}
    </Container>
  )
}

export default HomeController

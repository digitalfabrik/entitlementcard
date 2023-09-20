import { Alignment, Button, Navbar } from '@blueprintjs/core'
import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { WhoAmIContext } from '../WhoAmIProvider'
import { Role } from '../generated/graphql'
import { ProjectConfigContext } from '../project-configs/ProjectConfigContext'
import UserMenu from './UserMenu'

const PrintAwareNavbar = styled(Navbar)`
  @media print {
    display: none;
  }
`

interface Props {
  onSignOut: () => void
}

const Navigation = (props: Props) => {
  const config = useContext(ProjectConfigContext)
  const { region, role } = useContext(WhoAmIContext).me!

  return (
    <PrintAwareNavbar style={{ height: 'auto' }}>
      <Navbar.Group>
        <Navbar.Heading>
          <NavLink to={'/'} style={{ color: 'black', textDecoration: 'none', display: 'block' }}>
            <div style={{ flexDirection: 'column' }}>{config.name} Verwaltung</div>
            {!region ? null : (
              <span>
                {region.prefix} {region.name} {`(${process.env.REACT_APP_VERSION})`}
              </span>
            )}
          </NavLink>
        </Navbar.Heading>
        <Navbar.Divider />
        {role === Role.RegionAdmin || role === Role.RegionManager ? (
          <>
            {config.applicationFeatureEnabled ? (
              <NavLink to={'/applications'}>
                <Button minimal icon='form' text='Eingehende Anträge' />
              </NavLink>
            ) : null}
            <NavLink to={'/cards'}>
              <Button minimal icon='id-number' text='Karten erstellen' />
            </NavLink>
          </>
        ) : null}
        {role === Role.ProjectAdmin || role === Role.RegionAdmin ? (
          <NavLink to={'/users'}>
            <Button minimal icon='people' text='Benutzer verwalten' />
          </NavLink>
        ) : null}
        {role === Role.RegionAdmin && config.applicationFeatureEnabled ? (
          <NavLink to={'/region'}>
            <Button minimal icon='path-search' text='Region verwalten' />
          </NavLink>
        ) : null}
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
        <UserMenu onSignOut={props.onSignOut} />
      </Navbar.Group>
    </PrintAwareNavbar>
  )
}

export default Navigation
